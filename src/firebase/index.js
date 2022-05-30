// import { isValidFormat } from '@firebase/util';
// import firebase from 'firebase/app';
// import 'firebase/auth'
// import 'firebase/firestore'
// import 'firebase/storage'
// import 'firebase/functions'
// import { firebaseConfig } from './config';

// firebase.initializeApp(firebaseConfig);
// export const auth = firebase.auth();
// export const db = firebase.firestore();
// export const storage = firebase.storage();
// export const functions = firebase.functions();
// export const FirebaseTimestamp = firebase.firestore.FirebaseTimestamp;

import {initializeApp} from 'firebase/app';
import { getFirestore, serverTimestamp, Timestamp } from "firebase/firestore"
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyD5zPpH6N7rp67j16noQazTEjMm4NAp4kw",
    authDomain: "ec-app-45c96.firebaseapp.com",
    projectId: "ec-app-45c96",
    storageBucket: "ec-app-45c96.appspot.com",
    messagingSenderId: "239331241733",
    appId: "1:239331241733:web:9840e9f9e3c37eb134d16c",
    measurementId: "G-19VC6P6DE0"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore();
  export const auth = getAuth();
  export const FirebaseTimestamp = serverTimestamp();

  export const FirebaseTimestamp2 = Timestamp;