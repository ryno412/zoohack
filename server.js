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
    'Lets make your first bird report. Describe the birds colors'
]

app.post('/message', (req, res)=>{
    const phone = req.body.From;
    let input = req.body.Body;
    if (input && typeof input === 'string') {
        input = input.toLowerCase().trim();
    }
    console.log("*******")
    console.log(JSON.stringify(req.body));
    console.log("*******")

    const twiml = new MessagingResponse();
    let msg = chat[0];
    if (input == 'yes') msg = chat[1];


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

app.get('/health', (req, res)=>{
    res.send('ok');
})

app.get('*', (req, res) => {
    res.sendfile(`${__dirname}/dist/client/index.html`);
});

app.listen(port, ()=>{
    console.log(`Server started on port${port} - oh ya!`);
})






