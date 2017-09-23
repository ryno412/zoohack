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
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


function respond(message) {
    var twiml = new MessagingResponse();
    twiml.message(message);
    response.type('text/xml');
    response.send(twiml.toString());
}

app.get('/', (req, res)=>{
    res.send('Welcome to the zoo zoo chat');
})

app.post('/message', (req, res)=>{
    const phone = req.body.From;
    const input = req.body.Body;
    console.log("*******")
    console.log(req.body);
    console.log("*******")

    const twiml = new MessagingResponse();
    twiml.message('LETS SAVE SOME ANIMALS');
    res.type('text/xml');
    res.send(twiml.toString());

    // res.send({
    //     status: 200,
    //     phone,
    //     msg: input
    // })
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

app.listen(port, ()=>{
    console.log('oh yea!')
})






