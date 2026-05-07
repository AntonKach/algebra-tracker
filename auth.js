import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
// Προσθέσαμε το onAuthStateChanged στα εργαλεία
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// --- ΝΕΟ: Ο "Θυρωρός" που ελέγχει αν είσαι ήδη συνδεδεμένος ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Ο browser σε θυμάται!
        document.getElementById("btn-login").innerText = "👤 " + user.displayName;
        window.currentUserId = user.uid;
        window.currentUserName = user.displayName;
        
        // Φέρνουμε αθόρυβα το σκορ σου
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(window.updateGameData) {
                window.updateGameData(data.score, data.stats);
            }
        }
        
        // Συνδέουμε το Chat
        if (window.listenToChat) {
            window.listenToChat();
        }
    }
});

window.loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        document.getElementById("btn-login").innerText = "👤 " + user.displayName;
        window.currentUserId = user.uid;
        window.currentUserName = user.displayName; 
        
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(window.updateGameData) {
                window.updateGameData(data.score, data.stats);
            }
            alert("Καλώς ήρθες, " + user.displayName + "! Το σκορ σου φορτώθηκε! ☁️🐾");
        } else {
            alert("Καλώς ήρθες, " + user.displayName + "! Έγινε δημιουργία προφίλ. 🐾");
        }
        
        if (window.listenToChat) window.listenToChat();

    } catch (error) {
        console.error("Σφάλμα σύνδεσης:", error);
    }
};

window.saveToCloud = async (newScore, newStats) => {
    if (window.currentUserId) {
        const userRef = doc(db, "users", window.currentUserId);
        await setDoc(userRef, {
            score: newScore,
            stats: newStats
        }, { merge: true });
    }
};

window.listenToChat = function() {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(15));
    
    onSnapshot(q, (snapshot) => {
        const chatBox = document.getElementById("chat-messages");
        if (!chatBox) return;
        
        const msgs = [];
        snapshot.forEach((doc) => msgs.push(doc.data()));
        
        chatBox.innerHTML = "";
        msgs.reverse().forEach(data => {
            const isMe = data.user === window.currentUserName ? " (Εγώ)" : "";
            chatBox.innerHTML += `<div style="margin-bottom: 8px; padding: 6px; background: rgba(0,0,0,0.4); border-radius: 5px;">
                <strong style="color: #bb86fc;">${data.user}${isMe}:</strong> ${data.text}
            </div>`;
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
};

window.sendChatMessage = async function(text) {
    if (!window.currentUserId) {
        alert("Πρέπει να κάνεις Σύνδεση με Google για να στείλεις μήνυμα! 🐾");
        return;
    }
    await addDoc(collection(db, "messages"), {
        text: text,
        user: window.currentUserName,
        createdAt: serverTimestamp()
    });
};import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// Φέρνουμε ΟΛΑ τα νέα εργαλεία για το Chat
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
        
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(window.updateGameData) {
                window.updateGameData(data.score, data.stats);
            }
            alert("Καλώς ήρθες, " + user.displayName + "! Το σκορ σου φορτώθηκε! ☁️🐾");
        } else {
            alert("Καλώς ήρθες, " + user.displayName + "! Έγινε δημιουργία προφίλ. 🐾");
        }
        
        window.currentUserId = user.uid;
        window.currentUserName = user.displayName; // Κρατάμε το όνομα για το Chat!

        // Μόλις συνδεθεί, ξεκινάμε να "ακούμε" για νέα μηνύματα
        window.listenToChat();

    } catch (error) {
        console.error("Σφάλμα σύνδεσης:", error);
    }
};

window.saveToCloud = async (newScore, newStats) => {
    if (window.currentUserId) {
        const userRef = doc(db, "users", window.currentUserId);
        await setDoc(userRef, {
            score: newScore,
            stats: newStats
        }, { merge: true });
    }
};

// --- ΝΕΟ: ЛΕΙΤΟΥΡΓΙΕΣ CHAT ΣΕ ΠΡΑΓΜΑΤΙΚΟ ΧΡΟΝΟ ---
window.listenToChat = function() {
    // Ζητάμε από το Firebase τα 15 πιο πρόσφατα μηνύματα
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(15));
    
    // Το onSnapshot ανανεώνει την οθόνη ΑΥΤΟΜΑΤΑ μόλις μπει νέο μήνυμα!
    onSnapshot(q, (snapshot) => {
        const chatBox = document.getElementById("chat-messages");
        if (!chatBox) return;
        
        const msgs = [];
        snapshot.forEach((doc) => msgs.push(doc.data()));
        
        chatBox.innerHTML = "";
        msgs.reverse().forEach(data => {
            const isMe = data.user === window.currentUserName ? " (Εγώ)" : "";
            chatBox.innerHTML += `<div style="margin-bottom: 8px; padding: 6px; background: #2c2c2c; border-radius: 5px;">
                <strong style="color: #bb86fc;">${data.user}${isMe}:</strong> ${data.text}
            </div>`;
        });
        chatBox.scrollTop = chatBox.scrollHeight; // Αυτόματο σκρολάρισμα κάτω
    });
};

window.sendChatMessage = async function(text) {
    if (!window.currentUserId) {
        alert("Πρέπει να κάνεις Σύνδεση με Google για να στείλεις μήνυμα! 🐾");
        return;
    }
    // Αποστολή στο Cloud
    await addDoc(collection(db, "messages"), {
        text: text,
        user: window.currentUserName,
        createdAt: serverTimestamp()
    });
};
