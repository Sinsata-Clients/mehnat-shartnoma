import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsuQhyuf_XpVxf3Ojkp2Hjgf0MjE1isxA",
  authDomain: "mehnat-shartnoma.firebaseapp.com",
  projectId: "mehnat-shartnoma",
  storageBucket: "mehnat-shartnoma.firebasestorage.app",
  messagingSenderId: "511641706399",
  appId: "1:511641706399:web:2f6a153736256818a7a7aa"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);