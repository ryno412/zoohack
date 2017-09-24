const accountSid = process.env.TW_API || 'foo';
const authToken = process.env.TW_KEY || 'foo';

const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = new twilio(accountSid, authToken);
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const compression = require('compression');
const app = express();
const port = process.env.PORT || 5000;

// File I/O 
const extName = require('ext-name');
const path = require('path');
const urlUtil = require('url');
const fs = require('fs')

// Image Metadata
var ExifImage = require('exif').ExifImage;

const db = require(__dirname + '/src/db')
const User = db.User;
const Report = db.Report;

app.use(compression());
app.use(serveStatic(`${__dirname}/dist/client`, { index: ['index.html', 'index.htm'] }));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const errTxt = 'I am a little slow today. please send msg again';
const chat = [
    'Hello! and welcome to the\n' +
    'Jr Rangers Program!\n' +
    'What is your Name?'
]

const birdReportQuestions = [
    'Lets a make bird report. Is this a Green Macaw, Scarlet Macaw, or Tucan?',
    'Where did you find this bird?',
    'Did you see any tags or bands on the birds feet?',
    'Is the bird alone or with other birds?'

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
   const input = req.body.Body;
   if (!chatPrompt){
       user.chatPrompt = NAME;
        saveAndSend(res, user, chat[0]);
   } else if (chatPrompt === NAME) {
       user.name = input;
       user.chatPrompt = REPORT;
       saveAndSend(res, user, `Hello ${input}. ${birdReportQuestions[0]}`);

   } else if (chatPrompt === REPORT) {// bird type
       user.reports.push(new Report({
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
       saveAndSend(res, user, `Thanks ${user.name}! You have just helped save an animal from extinction`)
   }
   else {
       sendMessage(res, `Thanks ${user.name}! You have just helped save an animal from extinction`);
   }
}


/* exif */
function getRecentImages() {
    return images;
}

function clearRecentImages() {
    images = [];
}

function fetchRecentImages(req, res) {
    res.status(200).send(getRecentImages());
    clearRecentImages();
}

function deleteMediaItem(mediaItem) {
    const client = getTwilioClient();

    return client
      .api.accounts(twilioAccountSid)
      .messages(mediaItem.MessageSid)
      .media(mediaItem.mediaSid).remove();
}

function getExif(file) {
    console.log("getExif")
    try {
        new ExifImage({ image : file }, function (error, exifData) {
        if (error)
            console.log('Error: ' + error.message);
        else
            console.log('exifData');
            console.log(exifData);
        });
      } catch (error) {
        console.log('Error: ' + error.message);
      }
}

/* Google Cloud Vision */
function detectLabels(fileName) {
    // Imports the Google Cloud client library
    const Vision = require('@google-cloud/vision');

    // Instantiates a client
    const vision = Vision({
        projectId: process.env.GOOGLE_PROJECT_ID,
        keyFilename: process.env.KEYFILENAME
    });

    const filename = fileName
    // Prepare the request object
    const request = {
      source: {
        imageUri: fileName
      }
    };

    // Performs label detection on the image file
    vision.labelDetection(request)
        .then((results) => {
        const labels = results[0].labelAnnotations;

        console.log('Labels:');
        labels.forEach((label) => console.log(label.description + ':\t' + label.score));

    })
    .catch((err) => {
        console.error('ERROR:', err);
    });
}

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

    // Extract Media (image, video, etc.)
    const { body } = req;
    const { NumMedia, From: SenderNumber, MessageSid } = body;
    let saveOperations = [];
    const mediaItems = [];

    for (var i = 0; i < NumMedia; i++) {  // eslint-disable-line
      const mediaUrl = body[`MediaUrl${i}`];
      const contentType = body[`MediaContentType${i}`];
      const extension = extName.mime(contentType)[0].ext;
      const mediaSid = path.basename(urlUtil.parse(mediaUrl).pathname);
      const filename = `${mediaSid}.${extension}`;

      mediaItems.push({ mediaSid, MessageSid, mediaUrl, filename });
      //saveOperations = mediaItems.map(mediaItem => SaveMedia(mediaItem));
      
      //getExif(mediaUrl);
      var name = count + '.txt';
      fs.writeFile(name, mediaUrl, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
      });
      count++;
    }


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

app.get('*', (req, res) => {
    res.sendfile(`${__dirname}/dist/client/index.html`);
});

app.listen(port, ()=>{
    console.log(`Server started on port${port} - oh ya!`);
})






