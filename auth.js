import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// Ο 'Θυρωρός' που ελέγχει αν είσαι ήδη συνδεδεμένος
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const btn = document.getElementById("btn-login");
        if (btn) btn.innerText = "👤 " + user.displayName;
        
        window.currentUserId = user.uid;
        window.currentUserName = user.displayName;
        
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(window.updateGameData) {
                window.updateGameData(data.score, data.stats);
            }
        }
        
        if (window.initE2EE) {
            await window.initE2EE();
        }

        if (window.listenToChat) {
            window.listenToChat();
        }
    }
});

window.loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        const btn = document.getElementById("btn-login");
        if (btn) btn.innerText = "👤 " + user.displayName;
        
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
        
        if (window.initE2EE) {
            await window.initE2EE();
        }

        if (window.listenToChat) window.listenToChat();

    } catch (error) {
        console.error("Σφάλμα σύνδεσης:", error);
        // ΤΩΡΑ ΘΑ ΒΛΕΠΟΥΜΕ ΤΟ ΣΦΑΛΜΑ ΣΤΗΝ ΟΘΟΝΗ:
        alert("Ουπς! Σφάλμα σύνδεσης: " + error.message);
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
    
    onSnapshot(q, async (snapshot) => {
        const chatBox = document.getElementById("chat-messages");
        if (!chatBox) return;
        
        const msgs = [];
        snapshot.forEach((doc) => msgs.push(doc.data()));
        
        chatBox.innerHTML = "";
        const reversedMsgs = msgs.reverse();
        
        for (const data of reversedMsgs) {
            let displayText = "(Μη αναγνώσιμο μήνυμα - Δεν υπάρχει E2EE κλειδί)";
            
            // Decrypt if it's an encrypted message
            if (data.encryptedTexts && window.myPrivateKey && window.currentUserId) {
                const myEncryptedBase64 = data.encryptedTexts[window.currentUserId];
                if (myEncryptedBase64) {
                    try {
                        const encryptedBuffer = window.CryptoEngine.base64ToArrayBuffer(myEncryptedBase64);
                        displayText = await window.CryptoEngine.decryptMessage(encryptedBuffer, window.myPrivateKey);
                        displayText += ' <span style="font-size: 0.8em; color: #32D74B;" title="E2EE Προστατευμένο">🔒</span>';
                    } catch (e) {
                        console.error("Failed to decrypt message", e);
                        displayText = "(Σφάλμα αποκρυπτογράφησης)";
                    }
                }
            } else if (data.text) {
                // Fallback for old unencrypted messages
                displayText = data.text;
            }

            const isMe = data.user === window.currentUserName ? " (Εγώ)" : "";
            chatBox.innerHTML += `<div style="margin-bottom: 8px; padding: 6px; background: rgba(0,0,0,0.4); border-radius: 5px;">
                <strong style="color: #bb86fc;">${data.user}${isMe}:</strong> ${displayText}
            </div>`;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    });
};

window.sendChatMessage = async function(text) {
    if (!window.currentUserId) {
        alert("Πρέπει να κάνεις Σύνδεση με Google για να στείλεις μήνυμα! 🐾");
        return;
    }

    try {
        // Fetch all users to get their public keys
        const usersSnap = await getDocs(collection(db, "users"));
        const encryptedTexts = {};

        // Always encrypt for ourselves first to guarantee we can read our own message
        if (window.myPublicKey) {
            try {
                const myEncryptedBuffer = await window.CryptoEngine.encryptMessage(text, window.myPublicKey);
                encryptedTexts[window.currentUserId] = window.CryptoEngine.arrayBufferToBase64(myEncryptedBuffer);
            } catch (e) {
                console.error("Failed to encrypt for self:", e);
            }
        }

        for (const userDoc of usersSnap.docs) {
            if (userDoc.id === window.currentUserId) continue; // Ήδη το κάναμε
            
            const userData = userDoc.data();
            if (userData.publicKey) {
                try {
                    // Import the recipient's public key
                    const recipientPubKey = await window.crypto.subtle.importKey(
                        "jwk",
                        userData.publicKey,
                        { name: "RSA-OAEP", hash: "SHA-256" },
                        true,
                        ["encrypt"]
                    );
                    
                    // Encrypt the message
                    const encryptedBuffer = await window.CryptoEngine.encryptMessage(text, recipientPubKey);
                    
                    // Convert to Base64
                    encryptedTexts[userDoc.id] = window.CryptoEngine.arrayBufferToBase64(encryptedBuffer);
                } catch (e) {
                    console.error("Failed to encrypt for user:", userDoc.id, e);
                }
            }
        }

        await addDoc(collection(db, "messages"), {
            encryptedTexts: encryptedTexts,
            user: window.currentUserName,
            senderId: window.currentUserId,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Σφάλμα κατά την αποστολή του μηνύματος.");
    }
};

window.initE2EE = async function() {
    if (!window.CryptoEngine) return;
    try {
        let privateKeyJwk = localStorage.getItem("e2ee_private_key");
        let publicKeyJwk = localStorage.getItem("e2ee_public_key");

        if (!privateKeyJwk || !publicKeyJwk) {
            console.log("Generating new E2EE keys...");
            const keyPair = await window.CryptoEngine.generateKeyPair();
            
            const pubJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
            const privJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
            
            localStorage.setItem("e2ee_public_key", JSON.stringify(pubJwk));
            localStorage.setItem("e2ee_private_key", JSON.stringify(privJwk));
            
            window.myPrivateKey = keyPair.privateKey;
            window.myPublicKey = keyPair.publicKey;
            
            // Αποθήκευση του public key στο προφίλ του χρήστη ώστε να μπορούν να το βρουν οι άλλοι
            const userRef = doc(db, "users", window.currentUserId);
            await setDoc(userRef, { publicKey: pubJwk }, { merge: true });
            
        } else {
            console.log("Loading E2EE keys from storage...");
            window.myPrivateKey = await window.crypto.subtle.importKey(
                "jwk",
                JSON.parse(privateKeyJwk),
                { name: "RSA-OAEP", hash: "SHA-256" },
                true,
                ["decrypt"]
            );
            window.myPublicKey = await window.crypto.subtle.importKey(
                "jwk",
                JSON.parse(publicKeyJwk),
                { name: "RSA-OAEP", hash: "SHA-256" },
                true,
                ["encrypt"]
            );
        }
        
        // Update UI (Το λουκέτο γίνεται πράσινο)
        const lockIcon = document.getElementById("e2ee-lock");
        if (lockIcon) {
            lockIcon.style.color = "#32D74B"; // iOS Green
            lockIcon.title = "E2EE Active";
            lockIcon.style.filter = "drop-shadow(0 0 5px rgba(50,215,75,0.4))";
        }
    } catch (e) {
        console.error("E2EE Init Error:", e);
    }
};

