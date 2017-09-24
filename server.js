
const accountSid = process.env.TW_API || 'foo';
const authToken = process.env.TW_KEY || 'foo';

const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
//const client = new twilio(accountSid, authToken);
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const compression = require('compression');
const Vision = require('@google-cloud/vision');
const app = express();
const port = process.env.PORT || 3000;

// File I/O 
const path = require('path');


// Image Metadata

const db = require(__dirname + '/src/db')
const User = db.User;
const Report = db.Report;

app.use(compression());
app.use(serveStatic(`${__dirname}/dist/client`, { index: ['index.html', 'index.htm'] }));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// var images = []
// var count = 0


/* Google Cloud Vision */
function detectLabels(fileName) {
    // Imports the Google Cloud client library

    // Instantiates a client
    const vision = Vision({
        projectId: 'animalrangers-180900',
        //keyFilename: process.env.KEYFILENAME
        keyFilename: __dirname + '/AnimalRangers-ed33a9654382.json'
    });

    // Prepare the request object
    const request = {
        source: {
            imageUri: fileName
        }
    };

    // Performs label detection on the image file
    return vision.labelDetection(request)
        .then((results) => {
            const labels = results[0].labelAnnotations;

            console.log('Labels:');
            labels.forEach((label) => console.log(label.description + ':\t' + label.score));

        })
        .catch((err) => {
            console.error('ERROR:', err);
        });
}

const errTxt = 'I am a little slow today. please send msg again';
const chat = [
    'Hello! and welcome to the\n' +
    'Local Rangers Program!\n' +
    'What is your Name?',
    'Would you like to report a bird or nest?'
]

const birdReportQuestions = [
    'Lets a make bird report. Is this a Green Macaw, Scarlet Macaw, or Tucan?',
    'Where are you located?',
    'Did you see any tags or bands on the birds feet?',
    'Is the bird alone or with other birds?'
]

const nestReportQuestions = [
    'Lets a make nest report. Is this a Green Macaw, Scarlet Macaw, or Tucan nest?',
    'Where are you located?',
]

const NAME = 'name';
const REPORT = 'report';

function saveAndSend(res, user, msg) {
    user.save((err, data) =>{
        if (err) return sendMessage(res, errTxt);
        sendMessage(res, msg);
    });
}
function respond(req, res, user){
   const chatPrompt = user.chatPrompt;
   let input = req.body.Body;
    if (input && typeof input === 'string' && chatPrompt !== NAME) {
        input = input.toLowerCase().trim();
    }

   if (!chatPrompt){
       user.chatPrompt = NAME;
        saveAndSend(res, user, chat[0]);
   } else if (chatPrompt === NAME) {
       user.name = input;
       user.chatPrompt = 'reportType'
       saveAndSend(res, user, `Hello ${input}. ${chat[1]}`);

   } else if (chatPrompt === 'reportType') {
       user.chatPrompt = (input === 'bird') ? REPORT : 'nest'
       const msg = input === 'bird' ? birdReportQuestions[0] : nestReportQuestions[0];
       saveAndSend(res, user, `${msg}`);

   } else if (chatPrompt === 'nest') {
       user.chatPrompt = 'nest-1'
       user.reports.push(new Report({
           reportType: 'nest',
           bird: input,
           FromCity: req.body.FromCity,
           FromCountry: req.body.FromCountry,
       }));
       saveAndSend(res, user, `${nestReportQuestions[1]}`);
   } else if (chatPrompt === 'nest-1') {
       user.chatPrompt = 'image'
       user.reports[user.reports.length -1].image = input;
       saveAndSend(res, user, 'Can you upload a photo?');

   } else if (chatPrompt === REPORT) {// bird type
       user.reports.push(new Report({
           reportType:'bird',
           bird: input,
           FromCity: req.body.FromCity,
           FromCountry: req.body.FromCountry,
       }));
       user.chatPrompt = `${REPORT}-0`;
       saveAndSend(res, user, `${birdReportQuestions[1]}`);

   } else if (chatPrompt === `${REPORT}-0`) {// location
       user.chatPrompt = `${REPORT}-1`;
       user.reports[user.reports.length -1].location = input;
       saveAndSend(res, user, birdReportQuestions[2])
   }
   else if (chatPrompt === `${REPORT}-1`) {//tag
       user.chatPrompt = `${REPORT}-2`;
       user.reports[user.reports.length -1].tag = input;
       saveAndSend(res, user, birdReportQuestions[3])
   }
   else if (chatPrompt === `${REPORT}-2`) {// many
       user.chatPrompt = 'image';
       user.reports[user.reports.length -1].many = input;
       saveAndSend(res, user, 'Can you upload a photo?')
   }
   else if (chatPrompt === 'image') {// many
       user.chatPrompt = 'reportDone';
       user.reports[user.reports.length -1].image = req.body.MediaUrl0 ? req.body.MediaUrl0 : '' ;
       detectLabels(req.body.MediaUrl0).then(res =>{
           console.log('RESSSS', res);
           console.log('RESSSS', res);
           console.log('RESSSS', res);
           console.log('RESSSS', res);
           saveAndSend(res, user, `Thanks ${user.name}! You have just helped save an animal from extinction`)
       })
   }
   else {
       sendMessage(res, `Thanks ${user.name}! You have just helped save an animal from extinction`);
   }
}


/* exif */
// function getRecentImages() {
//     return images;
// }
//
// function clearRecentImages() {
//     images = [];
// }
//
// function fetchRecentImages(req, res) {
//     res.status(200).send(getRecentImages());
//     clearRecentImages();
// }

// function deleteMediaItem(mediaItem) {
//     const client = getTwilioClient();
//
//     return client
//       .api.accounts(twilioAccountSid)
//       .messages(mediaItem.MessageSid)
//       .media(mediaItem.mediaSid).remove();
// }

// function getExif(file) {
//     console.log("getExif")
//     try {
//         new ExifImage({ image : file }, function (error, exifData) {
//         if (error)
//             console.log('Error: ' + error.message);
//         else
//             console.log('exifData');
//             console.log(exifData);
//         });
//       } catch (error) {
//         console.log('Error: ' + error.message);
//       }
// }



const sendMessage = (response, message) => {
    const twiml = new MessagingResponse();
    twiml.message(message);
    response.type('text/xml');
    response.send(twiml.toString());
}


app.post('/message', (req, res)=>{
    const phone = req.body.From;
    let input = req.body.Body;
    if (input && typeof input === 'string') {
        input = input.toLowerCase().trim();
    }
    console.log("*******")
    console.log(JSON.stringify(req.body));
    console.log("*******")

    User.findOne({
        phone: phone,
    }, function(err, user) {
        if (err){
            return res.send('not ok :(')
        }
        if (!user){
            let u = new User ({
                phone: phone,
                FromCity: req.body.FromCity,
                FromCountry: req.body.FromCountry,
            });
            u.save((err, userRecord) =>{
                if (err) return sendMessage(res, errTxt);
                return respond(req, res, u);
            })
        } else {
            return respond(req, res, user);
        }
    });
});


app.get('/results', (req, res) =>{
        User.find({}).exec(function(err, result) {
            console.log(err, result);
            res.send(result)
        });
});
app.get('/health', (req, res)=>{
    res.send('ok');
})

app.get('/delete', (req, res) =>{
    // Clear out old data
    User.remove({}, function(err) {
        if (err) {
            console.log ('error deleting old data.');
        }
    });
})
app.get('*', (req, res) => {
    res.sendfile(`${__dirname}/dist/client/index.html`);
});

app.listen(port, ()=>{
    console.log(`Server started on port${port} - oh ya!`);
})






