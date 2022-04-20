import firebase from 'firebase';

// Import the functions you need from the SDKs you need
import { initializeApp } from "./firebase/app";
import { getAnalytics } from "./firebase/analytics";
import { getAuth } from ".firebase/auth";
import { getMessaging, getToken } from "./firebase/messaging";
import { getFirestore, collection, getDocs } from "./firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAYfl7iL49TR-UjU20GGEzPXkSC08qZLVQ",
    authDomain: "fir-test-b22e4.firebaseapp.com",
    projectId: "fir-test-b22e4",
    storageBucket: "fir-test-b22e4.appspot.com",
    messagingSenderId: "23634196988",
    appId: "1:23634196988:web:ec5f6946eecbb524a3da79",
    measurementId: "G-7LML545V4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

//get a list of cities from your database
async function getCities(db) {
    const citiesCol = collection(db, 'cities');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
}

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
getToken(messaging, { vapidKey: 'BCbd4yZ8kwjq8xrGdKgll_T5RPltTAqJ5qtAQ2dHGgMdNAhJErrC24XI6TxpBeYwcP1NodUdVQxiAmMjJ8Vo9eM' });


// Send push notification when user gets a new follower.
exports.sendNotification = functions.database.ref('/followers/{userUID}/{followerUID}')
    .onWrite((change, context) => {
        const userUID = context.params.userUID;
        const followerUID = context.params.followerUID;

        const tokens = getUserDeviceTokens(userUID);
        const name = getUserDisplayName(followerUID);

        // Notification details.
        const payload = {
            notification: {
                title: 'You have a new follower!',
                body: `${name} is now following you.`
            }
        };
        return admin.messaging().sendToDevice(tokens, payload);
    });

export default firebase;