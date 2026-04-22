import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVW3uSGg86xGKxeXJ5PSwAYAPYET3sZQ8",
  authDomain: "trackerpro-d090e.firebaseapp.com",
  projectId: "trackerpro-d090e",
  storageBucket: "trackerpro-d090e.firebasestorage.app",
  messagingSenderId: "445130757587",
  appId: "1:445130757587:web:33618cbd508558ab310b26",
  measurementId: "G-RJ22T0PWGS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
