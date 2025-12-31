import { getAuth, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

window.goToChat = function () {
  window.location.href = "chat.html";
};

window.goToMood = () => alert("Mood tracking coming soon 📊");
window.startBreathing = () => alert("Breathing exercise coming soon 🌿");
window.getHelp = () => alert("Therapist recommendations coming soon 🧠");
