/**
 * Created by rford on 9/23/17.
 */
console.log('YOLO');
const accountSid = 'AC05e5e36cdd8805d91483a43ffdba1ca3'; // Your Account SID from www.twilio.com/console
const authToken = 'deaf596b59bdc360252d0782a69b3b94';   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send('Welcome to the zoo zoo chat');
})

app.get('/hello', (req, res) =>{
    res.send('ok')
})

app.listen(port, ()=>{
    console.log('oh yea!')
})


// client.messages.create({
//     body: 'Hello from Node',
//     to: '+17605225669',  // Text this number
//     from: '+17603003698' // From a valid Twilio number
// }).then((message) => console.log(message.sid));



