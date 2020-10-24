const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const admin = require('firebase-admin');
const router = express.Router();
const GoalModel = require('../models/goals');
const database = require('./db/database');

const port = 8000;

app.use(cors())
app.use(bodyParser.json());

app.listen(port, () =>
  console.log(`Server listening on port ${port}!`),
);



const sendMessage = () => {
  var registrationToken = 'eysn1FN-RhGZ4ptNSqBZyR:APA91bGi5OqkOdoxRosRXmqU5WMEKObJbIdC5QgZQqKX9-BnspCi6LCAsrevL9bFU8pEQp0NXc8YwHVDCHAvTy2YP2C__PZgJX7E5zD7J3guQ9258CsmoMJAT93mQCRttfVIfIpgm56v';

  var message = {
    notification: {
      title: "Test",
      body: "test",
    },
    token: registrationToken
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

module.exports.app = app;
