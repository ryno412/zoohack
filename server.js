const accountSid = process.env.TW_API || 'foo';
const authToken = process.env.TW_KEY || 'foo';
const accountSid = "ACfbec6cae01cb4afb173e268bd5501f5f";
const authToken = "932725c460539deadb0154bdb594bf68";

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

var ExifImage = require('exif').ExifImage;

const app = express();
const port = process.env.PORT || 5000;

app.use(compression());
app.use(
  serveStatic(`${__dirname}/dist/client`, {
    index: ['index.html', 'index.htm']
  })
);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const report = {
  birdName: 'macaw',
  color: 'blue',
  amountOfBirds: 'one ore more',
  location: 'flight or grand',
  tagged: 'yes',
  marks: 'blue feathers,one eye',
  nest: true
};
var images = []

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
];

app.post('/message', (req, res) => {
  const phone = req.body.From;
  let input = req.body.Body;
  if (input && typeof input === 'string') {
    input = input.toLowerCase().trim();
  }
  console.log('*******');
  console.log(JSON.stringify(req.body));
  console.log('*******');

  const twiml = new MessagingResponse();
  let msg = chat[0];
  if (input == 'yes') msg = chat[1];

  twiml.message(msg);

  res.type('text/xml');
  res.send(twiml.toString());


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
    }

    clearRecentImages()


    twiml.message(msg);

    res.type('text/xml');
    res.send(twiml.toString());
});

app.get('/hello', (req, res) => {
  client.messages
    .create({
      body: 'Hello from Node',
      to: '+17605225669', // Text this number
      from: '+17603003698' // From a valid Twilio number
    })
})

app.get('/health', (req, res)=>{
    res.send('ok');
})

app.get('/exif', (req, res)=>{
    // getExif('src/IMG_2709.jpg');
    // getExif('src/IMG_2737.jpg');
    // getExif('src/flower.jpg');
    getExif('src/IMG_2739.jpg');
    getExif('src/IMG_2739 2.jpg');
})

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/dist/client/index.html`);
});

app.get('/health', (req, res) => {
  res.send('ok');
});

app.get('/mock-data', (req, res) => {
  res.json(report);
});

app.get('*', (req, res) => {
  res.sendfile(`${__dirname}/dist/client/index.html`);
});

app.listen(port, () => {
  console.log(`Server started on port${port} - oh ya!`);
});
