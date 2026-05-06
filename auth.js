import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// Φέρνουμε τα εργαλεία της Βάσης Δεδομένων (Firestore)
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCovxsWgdbcq2xcvtEMcg281DshyVRQl7A",
  authDomain: "catgebra.firebaseapp.com",
  projectId: "catgebra",
  storageBucket: "catgebra.firebasestorage.app",
  messagingSenderId: "921114748837",
  appId: "1:921114748837:web:69c05ee6c4e5616d2aaa4c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

window.loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        document.getElementById("btn-login").innerText = "👤 " + user.displayName;
        
        // Ψάχνουμε να βρούμε τον χρήστη στη Βάση Δεδομένων
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Αν υπάρχει, στέλνουμε το σκορ του στο παιχνίδι!
            if(window.updateGameData) {
                window.updateGameData(data.score, data.stats);
            }
            alert("Καλώς ήρθες, " + user.displayName + "! Το σκορ σου φορτώθηκε από το Cloud! ☁️🐾");
        } else {
            alert("Καλώς ήρθες, " + user.displayName + "! Έγινε δημιουργία του νέου σου προφίλ. 🐾");
        }
        
        // Κρατάμε το ID του χρήστη ανοιχτό για να σώζουμε το σκορ του
        window.currentUserId = user.uid;

    } catch (error) {
        console.error("Σφάλμα σύνδεσης:", error);
    }
};

// Λειτουργία για αποθήκευση στο Cloud (τη φωνάζει η Γατούλα όποτε βρίσκει το x!)
window.saveToCloud = async (newScore, newStats) => {
    if (window.currentUserId) {
        const userRef = doc(db, "users", window.currentUserId);
        // Το merge: true σημαίνει "ενημέρωσε μόνο το σκορ, μην σβήσεις κάτι άλλο"
        await setDoc(userRef, {
            score: newScore,
            stats: newStats
        }, { merge: true });
    }
};
