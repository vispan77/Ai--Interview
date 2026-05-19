
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "ai-interview-17a02.firebaseapp.com",
    projectId: "ai-interview-17a02",
    storageBucket: "ai-interview-17a02.firebasestorage.app",
    messagingSenderId: "881340910503",
    appId: "1:881340910503:web:0fa8d617ec4221ff938482"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

