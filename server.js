/**
 * Created by rford on 9/23/17.
 */
console.log('YOLO');
const accountSid = 'AC05e5e36cdd8805d91483a43ffdba1ca3'; // Your Account SID from www.twilio.com/console
const authToken = 'deaf596b59bdc360252d0782a69b3b94';   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = new twilio(accountSid, authToken);
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const compression = require('compression');
const app = express();
const port = process.env.PORT || 5000;


app.use(compression());
app.use(serveStatic(`${__dirname}/dist/client`, { index: ['index.html', 'index.htm'] }));


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


function respond(message) {
    var twiml = new MessagingResponse();
    twiml.message(message);
    response.type('text/xml');
    response.send(twiml.toString());
}

const chat = [
    'Hello! and welcome to the\n' +
    'Jr Rangers Program!\n' +
    'Are you ready to get started?',

    'Lets make your first bird report'

]
app.post('/message', (req, res)=>{
    const phone = req.body.From;
    let input = req.body.Body;
    console.log("*******")
    console.log(req.body);
    console.log("*******")

    const twiml = new MessagingResponse();

    let msg = chat[0];
    if (input === 'yes') msg[1];


    twiml.message(msg);







    res.type('text/xml');
    res.send(twiml.toString());
});

app.get('/hello', (req, res) =>{
    client.messages.create({
    body: 'Hello from Node',
    to: '+17605225669',  // Text this number
    from: '+17603003698' // From a valid Twilio number
}).then(message => {
        console.log(message);
        res.send('ok')
    })
})

app.get('*', (req, res) => {
    res.sendfile(`${__dirname}/dist/client/index.html`);
});

app.listen(port, ()=>{
    console.log('oh yea!')
})






