import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Login sahifasida ekanmizmi?
if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      errorMsg.textContent = "Email yoki parol noto'g'ri!";
    }
  });

  // Allaqachon kirgan bo'lsa dashboardga o'tkazish
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = "dashboard.html";
  });
}

// Logout tugmasi
if (document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

// Dashboard va boshqa sahifalarda kirganlik tekshiruvi
export function checkAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      callback(user);
    }
  });
}