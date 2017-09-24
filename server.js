const accountSid = process.env.TW_API || 'AC05e5e36cdd8805d91483a43ffdba1ca3';
const authToken = process.env.TW_KEY || 'deaf596b59bdc360252d0782a69b3b94';

const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
//const client = new twilio(accountSid, authToken);
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

const report = {
    birdName: 'macaw',
    color: 'blue',
    amountOfBirds: 'one ore more',
    location: 'flight or grand',
    tagged: 'yes',
    marks: 'blue feathers,one eye',
    nest: true,


}

const errTxt = 'I am a little slow today. please send msg again';
const chat = [
    'Hello! and welcome to the\n' +
    'Jr Rangers Program!\n' +
    'What is your Name?',
    'Lets a make bird report. Describe the birds colors',
    'Where did you find this bird?'
]

const chatExistingUser = [
    'Where did you find this bird?'
]

const NAME = 'name';
const REPORT = 'report';

function updateUser (user, key, value, prompt, cb){
    user.chatPrompt = prompt;
    if (key === REPORT){
        user.reportInProgress = true;
    }
    if (key === 'report-0') {
        console.log('ADDING REPORT');
        user.reports.push(value);
    }
    if (key && value){
        user[key] = value;
    }
    user.save((err, data) =>{
        return cb(err, data)
    });
}

function respond(req, res, user){
   const chatPrompt = user.chatPrompt;
   const input = req.body.Body;

   if (!chatPrompt){
       updateUser(user, null, null, NAME, (err)=>{
           if (err) return sendMessage(res, errTxt);
           sendMessage(res, chat[0]);
       });
   } else if (chatPrompt === NAME) {
       updateUser(user, NAME, input, REPORT, (err)=>{
           if (err) return sendMessage(res, errTxt);
           sendMessage(res, `Hello ${input}. ${chat[1]}`);
       });
   } else if (chatPrompt === REPORT) {
       updateUser(user, REPORT, new Report({color: input}), `${REPORT}-0`, (err)=>{
           if (err) return sendMessage(res, errTxt);
           sendMessage(res, `${chat[2]}`);
       });
   } else {
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
            let u = new User ({phone: phone});
            u.save((err, userRecord) =>{
                console.log(err,'ERROR');
                console.log(userRecord, 'RECORD');
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






