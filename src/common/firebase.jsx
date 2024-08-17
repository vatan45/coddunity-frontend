import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyChpb1CdpXm-nbjoCa19BiaT6A2bNC0aVo",
    authDomain: "coddunity.firebaseapp.com",
    projectId: "coddunity",
    storageBucket: "coddunity.appspot.com",
    messagingSenderId: "867900441511",
    appId: "1:867900441511:web:949365ce36e7a60904ec82"
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to handle Google sign-in
export const authWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Error during Google authentication:', error);
        return null;
    }
};