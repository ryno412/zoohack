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
    'Jr Rangers Program!\n' +
    'What is your Name?'
]

const birdReportQuestions = [
    'Lets a make bird report.\n Is this a Green Macaw, Scarlet Macaw, or Tucan?',
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
       saveAndSend(res, user, `Thanks ${user.name}! You have just helped save an animal from extinction`)
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






