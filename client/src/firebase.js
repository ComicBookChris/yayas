// import * as firebase from "firebase/app"; // old way, wont work anymore
import firebase from "firebase/app";
import "firebase/auth";
// firebase config
const config = {
    apiKey: "AIzaSyDcQrxyP_v1_IRwTr8zIi42jYzM0PlS2eA",
    authDomain: "yayas-688a9.firebaseapp.com",
    databaseURL: "https://yayas-688a9.firebaseio.com",
    projectId: "yayas-688a9",
    storageBucket: "yayas-688a9.appspot.com",
    messagingSenderId: "278065975775",
    appId: "1:278065975775:web:355bc0f5ce4a948213b46a"
  };
  // initialize firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

  // export
// export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();