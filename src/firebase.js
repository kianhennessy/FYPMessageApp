import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
export const auth = firebase.initializeApp({
    apiKey: "AIzaSyD2O1330XlDbu9ovXlqLOUy5aIct0ZB46I",
    authDomain: "project-57eb2.firebaseapp.com",
    projectId: "project-57eb2",
    storageBucket: "project-57eb2.appspot.com",
    messagingSenderId: "208101619513",
    appId: "1:208101619513:web:076172c575b2ba9d5edae8",
    measurementId: "G-3R3PG5W4CF"
}).auth()
