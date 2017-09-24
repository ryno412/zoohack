require('dotenv').config()

const accountSid = process.env.TW_API || 'foo';
const authToken = process.env.TW_KEY || 'foo';
const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = new twilio(accountSid, authToken);
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const compression = require('compression');
const extName = require('ext-name');
const path = require('path');
const urlUtil = require('url');
const fs = require('fs')

var ExifImage = require('exif').ExifImage;

const app = express();
const port = process.env.PORT || 5000;

const db = require(__dirname + '/src/db');

app.use(compression());
app.use(serveStatic(`${__dirname}/dist/client`, { index: ['index.html', 'index.htm'] }));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var images = []
var count = 0

const report = {
    birdName: 'macaw',
    color: 'blue',
    amountOfBirds: 'one or more',
    location: 'flight or ground',
    tagged: 'yes',
    marks: 'blue feathers, one eye',
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

app.get('/results', (req, res) =>{
    db.find({}).exec(function(err, result) {
        console.log(err, result);
        res.send(result)
    });
});

app.get('/health', (req, res)=>{
    res.send('ok');
})

app.get('/exif', (req, res)=>{
    // getExif('src/IMG_2709.jpg');
})

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/dist/client/index.html`);
});

app.listen(port, ()=>{
    console.log(`Server started on port${port} - oh ya!`);
})






