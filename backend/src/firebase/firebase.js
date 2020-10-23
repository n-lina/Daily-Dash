const admin = require('firebase-admin');
const serviceAccount = require("../config/fbServiceAccountKey.json");

class Firebase {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://dailydash-6d979.firebaseio.com"
    });
    
    // sendMessage();
  }

  // This registration token comes from the client FCM SDKs.
}

// function sendMessage() {
//   var registrationToken = 'YOUR_REGISTRATION_TOKEN';

//   var message = {
//     data: {
//       score: '850',
//       time: '2:45'
//     },
//     token: registrationToken
//   };

//   // Send a message to the device corresponding to the provided
//   // registration token.
//   admin.messaging().send(message)
//     .then((response) => {
//       // Response is a message ID string.
//       console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//       console.log('Error sending message:', error);
//     });
// }
module.exports = new Firebase();