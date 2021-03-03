import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAn5_sAv5ot_UpdN_TVmZL64TNTaJPOR3g",
  authDomain: "p76-barter-system-1844a.firebaseapp.com",
  projectId: "p76-barter-system-1844a",
  storageBucket: "p76-barter-system-1844a.appspot.com",
  messagingSenderId: "890510169575",
  appId: "1:890510169575:web:e25b0a6172aced4b559942",
};

firebase.initializeApp(firebaseConfig);
export default firebase.firestore();
