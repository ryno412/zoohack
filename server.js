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
const Users = db.User;
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

const sendMessage = (message, response) => {
    const twiml = new MessagingResponse();
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

const chatExistingUser = [
    'Ready to make a bird report?'
]




app.post('/message', (req, res)=>{
    const phone = req.body.From;
    let input = req.body.Body;
    if (input && typeof input === 'string') {
        input = input.toLowerCase().trim();
    }
    // console.log("*******")
    // console.log(JSON.stringify(req.body));
    // console.log("*******")
    //
    // const twiml = new MessagingResponse();
    // let msg = chat[0];
    // if (input == 'yes') msg = chat[1];
    //
    //
    // twiml.message(msg);
    //
    // res.type('text/xml');
    // res.send(twiml.toString());

    Users.findOne({
        phone: phone,
    }, function(err, doc) {
        console.log('DOC!', doc);
        if (doc) {
            sendMessage(`Hello ${doc.name.first}!`, res)
        } else {
            sendMessage(chat[0], res)
        }
    });
});

app.get('/hello', (req, res) =>{
    Users.findOne({
        phone: '76088899999',
    }, function(err, doc){
        console.log('DOC!', doc);
        if (doc){
            sendMessage(`Hello ${doc.name.first}!`, res)
            res.send('hello')
        } else {
            sendMessage('Ready to get Started', res)
            res.send('New')
        }
        // doc.reports.push(new Report({
        //     bird: 'macaw',
        //     color: 'blue'
        // }))
        // doc.save(function(err, r){
        //     console.log(err, r);
        // })
    })


})


app.get('/results', (req, res) =>{
        Users.find({}).exec(function(err, result) {
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






