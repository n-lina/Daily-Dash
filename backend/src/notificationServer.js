const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const admin = require('firebase-admin');
const firebase = require('./firebase/firebase');
const UserModel = require('./models/users');
const GoalModel = require('./models/goals');
const database = require('./db/database');

const app = express();

const notificationTitle = "Reminder from DailyDash!";

const port = 8000;

app.use(cors())
app.use(bodyParser.json());

app.listen(port, () =>
  console.log(`Server listening on port ${port}!`),
);

const runServer = () => {
  setInterval(sendNotifications, 60000)
}

const sendNotifications = async () => {
  const options = {weekday: 'long'};
  const day = new Date().toLocaleTimeString('en-us', options).substr(0, 3).toLowerCase();

  const allUsers = await UserModel.find();

  allUsers.forEach(async function(user) {
    const userGoals = await GoalModel.find({userId: user.userId});
    const userRegistrationToken = user.notificationId;

    if (userRegistrationToken !== "") {
      userGoals.forEach(function(userGoal) {
        userGoal.shortTermGoals.forEach(function(shortTermGoal) {
        const shortTermGoalTitle = shortTermGoal.title;

        shortTermGoal[day].forEach(function(time) {
          const currentTimeDate = new Date();
          const currentHour = currentTimeDate.getHours();
          const currentMinute = currentTimeDate.getMinutes();
          const notificationHour = parseInt(time / 60);
          const notificationMinute = time % 60;

          console.log("Notification Time: " + notificationHour + ":" + notificationMinute);
          console.log("Current Time: " + currentHour + ":" + currentMinute);

          if (currentHour === notificationHour && currentMinute === notificationMinute) {
            sendMessage(userRegistrationToken, notificationTitle, shortTermGoalTitle)
            }
          })
        })
      })
    }
  })
}

const sendMessage = (registrationToken, title, body) => {
  var message = {
    notification: {
      title: title,
      body: body,
    },
    token: registrationToken
  };

  console.log(message);

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

runServer();

module.exports.app = app;
