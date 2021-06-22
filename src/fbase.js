import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvyo7w-mVXoiTTyank6VWK5H-NHZp4ERE",
  authDomain: "nwitter-ee680.firebaseapp.com",
  projectId: "nwitter-ee680",
  storageBucket: "nwitter-ee680.appspot.com",
  messagingSenderId: "728565078097",
  appId: "1:728565078097:web:f06b1738ece4dd3aa70070",
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;

export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();
