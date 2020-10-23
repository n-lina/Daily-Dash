const admin = require('firebase-admin');
const serviceAccount = require("../config/fbServiceAccountKey.json");

class Firebase {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://dailydash-6d979.firebaseio.com"
    });

  }
  
  // This registration token comes from the client FCM SDKs.
}

module.exports = new Firebase();
