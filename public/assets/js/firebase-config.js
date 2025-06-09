import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCxG5Y8Gu0BcZ0N-Sf2WM7oKDSuPO9qQl4",
    authDomain: "hackathon-37d07.firebaseapp.com",
    projectId: "hackathon-37d07",
    storageBucket: "hackathon-37d07.firebasestorage.app",
    messagingSenderId: "777890425672",
    appId: "1:777890425672:web:76fd0310e35a941753217d",
    measurementId: "G-8818WDW8SH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Define collection names as constants
export const COLLECTIONS = {
    USERS: 'users',
    TRANSACTIONS: 'transactions',
    PORTFOLIOS: 'portfolios'
};

export { auth, db };