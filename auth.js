// Συνδέουμε το Firebase κατευθείαν από το ίντερνετ (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Το δικό σου Διαβατήριο!
const firebaseConfig = {
  apiKey: "AIzaSyCovxsWgdbcq2xcvtEMcg281DshyVRQl7A",
  authDomain: "catgebra.firebaseapp.com",
  projectId: "catgebra",
  storageBucket: "catgebra.firebasestorage.app",
  messagingSenderId: "921114748837",
  appId: "1:921114748837:web:69c05ee6c4e5616d2aaa4c"
};

// Ξεκινάμε τη μηχανή του Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Φτιάχνουμε τη μαγική λειτουργία Σύνδεσης (και τη δίνουμε σε όλο το site)
window.loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Επιτυχής σύνδεση από:", user.displayName);
        alert("Καλώς ήρθες, " + user.displayName + "! 🐾");
        
        // Αλλάζουμε το κείμενο του κουμπιού για να φαίνεται ποιος μπήκε
        document.getElementById("btn-login").innerText = "👤 " + user.displayName;
    } catch (error) {
        console.error("Σφάλμα κατά τη σύνδεση:", error);
        alert("Ουπς! Κάτι πήγε στραβά με τη σύνδεση. 😿");
    }
};
