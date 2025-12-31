// ===============================
// Firebase Imports
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===============================
// Firebase Configuration
// 🔴 REPLACE WITH YOUR OWN CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyAztebvc83440nbPsrHBhLtIGca1tuZ5M0",
  authDomain: "emocare-7e318.firebaseapp.com",
  projectId: "emocare-7e318",
  storageBucket: "emocare-7e318.firebasestorage.app",
  messagingSenderId: "552257090926",
  appId: "1:552257090926:web:136e44ab4082e215247d7f",
  measurementId: "G-XFZSS86L3M"
};
// ===============================
// Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===============================
// TOGGLE AUTH SECTIONS (OR logic)
// ===============================
window.showAuth = function (type) {
  document.getElementById("emailAuth").classList.add("hidden");
  document.getElementById("googleAuth").classList.add("hidden");
  document.getElementById("phoneAuth").classList.add("hidden");

  if (type === "email") {
    document.getElementById("emailAuth").classList.remove("hidden");
  }
  if (type === "google") {
    document.getElementById("googleAuth").classList.remove("hidden");
  }
  if (type === "phone") {
    document.getElementById("phoneAuth").classList.remove("hidden");
  }
};

// ===============================
// EMAIL SIGN UP
// ===============================
window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      redirectToDashboard();
    })
    .catch((error) => {
      showMessage(error.message);
    });
};

// ===============================
// EMAIL LOGIN
// ===============================
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      redirectToDashboard();
    })
    .catch((error) => {
      showMessage(error.message);
    });
};

// ===============================
// GOOGLE LOGIN
// ===============================
window.googleLogin = function () {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(() => {
      redirectToDashboard();
    })
    .catch((error) => {
      showMessage(error.message);
    });
};

// ===============================
// PHONE AUTH - reCAPTCHA SETUP
// ===============================
window.onload = function () {
  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "normal"
    },
    auth
  );
};

// ===============================
// SEND OTP
// ===============================
window.sendOTP = function () {
  const phoneNumber = document.getElementById("phone").value;
  const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      showMessage("OTP sent to your phone");
    })
    .catch((error) => {
      showMessage(error.message);
    });
};

// ===============================
// VERIFY OTP
// ===============================
window.verifyOTP = function () {
  const code = document.getElementById("otp").value;

  window.confirmationResult.confirm(code)
    .then(() => {
      redirectToDashboard();
    })
    .catch(() => {
      showMessage("Invalid OTP");
    });
};

// ===============================
// HELPER FUNCTIONS
// ===============================
function redirectToDashboard() {
  showMessage("Login successful");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 700);
}

function showMessage(msg) {
  document.getElementById("message").innerText = msg;
}
