const accountSid = process.env.TW_API || 'foo';
const authToken = process.env.TW_KEY || 'foo';

const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
//const client = new twilio(accountSid, authToken);
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const compression = require('compression');
const Vision = require('@google-cloud/vision');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const db = require(__dirname + '/src/db');
const User = db.User;
const Report = db.Report;

app.use(compression());
app.use(
  serveStatic(`${__dirname}/dist/client`, {
    index: ['index.html', 'index.htm']
  })
);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

/* Google Cloud Vision */
function detectLabels(fileName) {
  // Imports the Google Cloud client library

  // Instantiates a client
  const vision = Vision({
    projectId: 'animalrangers-180900',
    //keyFilename: process.env.KEYFILENAME
    keyFilename: __dirname + '/AnimalRangers-ed33a9654382.json'
  });

  // Prepare the request object
  const request = {
    source: {
      imageUri: fileName
    }
  };

  // Performs label detection on the image file
  return vision
    .labelDetection(request)
    .then(results => {
      if (results && Array.isArray(results) && results[0]) {
        return results[0].labelAnnotations;
      }
    })
    .catch(err => {
      throw new Error('no image');
      console.error('ERROR:', err);
    });
}

const errTxt = 'I am a little slow today. please send msg again';
const chat = [
  'Hola! and welcome to the\n' +
    'Local Rangers Program!\n' +
    'What is your Name?',
  'Would you like to report a bird or nest?'
];

const birdReportQuestions = [
  'Lets a make bird report. Is this a Green Macaw, Scarlet Macaw, or Toucan?',
  'Dónde están ubicados?',
  'Did you see any tags or bands on the birds feet?'
];

const nestReportQuestions = [
  'Lets a make nest report. Is this a Green Macaw, Scarlet Macaw, or Toucan nest?',
  'Dónde están ubicados?'
];

const NAME = 'name';
const REPORT = 'report';

function saveAndSend(res, user, msg) {
  user.save((err, data) => {
    if (err) {
      user.chatPrompt = null;
      return sendMessage(res, errTxt);
    }
    sendMessage(res, msg);
  });
}
function respond(req, res, user) {
  const chatPrompt = user.chatPrompt;
  let input = req.body.Body;
  if (input && typeof input === 'string' && chatPrompt !== NAME) {
    input = input.toLowerCase().trim();
  }

  if (!chatPrompt) {
    user.chatPrompt = NAME;
    saveAndSend(res, user, chat[0]);
  } else if (chatPrompt === 'reportDone') {
    user.chatPrompt = 'reportType';
    saveAndSend(res, user, `Hello ${user.name}. ${chat[1]}`);
  } else if (chatPrompt === NAME) {
    user.name = input;
    user.chatPrompt = 'reportType';
    saveAndSend(res, user, `Hello ${input}. ${chat[1]}`);
  } else if (chatPrompt === 'reportType') {
    user.chatPrompt = input === 'bird' ? REPORT : 'nest';
    const msg = input === 'bird' ? birdReportQuestions[0] : nestReportQuestions[0];
    saveAndSend(res, user, `${msg}`);
  } else if (chatPrompt === 'nest') {
    user.chatPrompt = 'nest-1';
    user.reports.push(
      new Report({
        reportType: 'nest',
        bird: input,
        FromCity: req.body.FromCity,
        FromCountry: req.body.FromCountry
      })
    );
    saveAndSend(res, user, `${nestReportQuestions[1]}`);
  } else if (chatPrompt === 'nest-1') {
    user.chatPrompt = 'image';
    user.reports[user.reports.length - 1].image = input;
    saveAndSend(res, user, 'Can you upload a photo?');
  } else if (chatPrompt === REPORT) {
    // bird type
    user.reports.push(
      new Report({
        reportType: 'bird',
        bird: input,
        FromCity: req.body.FromCity,
        FromCountry: req.body.FromCountry
      })
    );
    user.chatPrompt = `${REPORT}-0`;
    saveAndSend(res, user, `${birdReportQuestions[1]}`);
  } else if (chatPrompt === `${REPORT}-0`) {
    // location
    user.chatPrompt = `${REPORT}-1`;
    user.reports[user.reports.length - 1].location = input;
    saveAndSend(res, user, birdReportQuestions[2]);
  } else if (chatPrompt === `${REPORT}-1`) {
    //tag
    user.chatPrompt = 'image';
    user.reports[user.reports.length - 1].tag = input;
    saveAndSend(res, user, 'Can you upload a photo?');
  } else if (chatPrompt === 'image') {
    // image
    user.chatPrompt = 'reportDone'; ///reset chat
    user.reports[user.reports.length - 1].image = req.body.MediaUrl0
      ? req.body.MediaUrl0
      : '';
    detectLabels(req.body.MediaUrl0)
      .then(imageData => {
        if (imageData) {
          user.reports[user.reports.length - 1].imageMeta = imageData;
        }
        saveAndSend(
          res,
          user,
          `Thanks ${user.name}! You have just helped save an animal from extinction`
        );
      })
      .catch(e => {
        user.chatPrompt = null;
        sendMessage(res, errTxt);
      });
  } else {
    sendMessage(
      res,
      `Thanks ${user.name}! You have just helped save an animal from extinction`
    );
  }
}

const sendMessage = (response, message) => {
  const twiml = new MessagingResponse();
  twiml.message(message);
  response.type('text/xml');
  response.send(twiml.toString());
};

app.post('/message', (req, res) => {
  const phone = req.body.From;
  let input = req.body.Body;
  if (input && typeof input === 'string') {
    input = input.toLowerCase().trim();
  }
  console.log('*******');
  console.log(JSON.stringify(req.body));
  console.log('*******');

  User.findOne(
    {
      phone: phone
    },
    function(err, user) {
      if (err) {
        return res.send('not ok :(');
      }
      if (!user) {
        let u = new User({
          phone: phone,
          FromCity: req.body.FromCity,
          FromCountry: req.body.FromCountry
        });
        u.save((err, userRecord) => {
          if (err) return sendMessage(res, errTxt);
          return respond(req, res, u);
        });
      } else {
        return respond(req, res, user);
      }
    }
  );
});

app.get('/results', (req, res) => {
  User.find({}).exec(function(err, result) {
    console.log(err, result);
    if (result) {
      res.status(200);
      res.send(result);
    } else {
      res.status(400);
      res.send(err);
    }
  });
});

app.get('/health', (req, res) => {
  res.send('ok');
});

app.get('/delete', (req, res) => {
  // Clear out old data
  User.remove({}, function(err) {
    if (err) {
      console.log('error deleting old data.');
    }
  });
});
app.get('*', (req, res) => {
  res.sendfile(`${__dirname}/dist/client/index.html`);
});

app.listen(port, () => {
  console.log(`Server started on port${port} - oh ya!`);
});
