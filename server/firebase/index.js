var admin = require("firebase-admin");

var serviceAccount = require("../config/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yayas-island-mart-default-rtdb.firebaseio.com/"
});

module.exports = admin;
