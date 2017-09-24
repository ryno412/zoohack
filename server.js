const accountSid = process.env.TW_API || 'AC05e5e36cdd8805d91483a43ffdba1ca3';
const authToken = process.env.TW_KEY || 'deaf596b59bdc360252d0782a69b3b94';

const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = new twilio(accountSid, authToken);
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const compression = require('compression');
const app = express();
const port = process.env.PORT || 5000;

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
    'Local Rangers Program!\n' +
    'What is your Name?',
    'Would you like to report a bird or nest?'
]

const birdReportQuestions = [
    'Lets a make bird report. Is this a Green Macaw, Scarlet Macaw, or Tucan?',
    'Where did you find this bird?',
    'Did you see any tags or bands on the birds feet?',
    'Is the bird alone or with other birds?'
]

const nestReportQuestions = [
    'Lets a make nest report. Is this a Green Macaw, Scarlet Macaw, or Tucan nest?',
    'Where is this nest located?',
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
    if (input && typeof input === 'string') {
        input = input.toLowerCase().trim();
    }
   console.log(input, 'IIIIIII');
   console.log(input, 'IIIIIII');
   console.log(input, 'IIIIIII');
   console.log(input, 'IIIIIII');

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
       saveAndSend(res, user, `Thanks ${user.name}! You have just helped save an animal from extinction`)
   }
   else {
       sendMessage(res, `Thanks ${user.name}! You have just helped save an animal from extinction`);
   }
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






