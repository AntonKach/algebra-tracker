import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, getDocs, where, or } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Load Firebase config from environment variables (never hardcode secrets!)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Fallback for development if env vars not set
if (!firebaseConfig.apiKey) {
  console.warn("Firebase config not loaded from environment. Using fallback (dev only).");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// HTML Escape function to prevent XSS attacks
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(text).replace(/[&<>"']/g, c => map[c]);
}

// Ο 'Θυρωρός' που ελέγχει αν είσαι ήδη συνδεδεμένος
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const btn = document.getElementById("btn-login");
            if (btn) btn.innerText = "👤 " + escapeHtml(user.displayName);
            
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
                try {
                    await window.initE2EE();
                } catch (e2eeError) {
                    console.error("E2EE initialization failed:", e2eeError);
                }
            }

            if (window.listenToChat) {
                window.listenToChat();
            }

            const btnLogout = document.getElementById("btn-logout");
            if (btnLogout) btnLogout.style.display = "inline-block";
        } catch (error) {
            console.error("Error during auth state change:", error);
        }
    } else {
        const btn = document.getElementById("btn-login");
        if (btn) btn.innerText = "Σύνδεση";
        
        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) btnLogout.style.display = "none";
        
        window.currentUserId = null;
        window.currentUserName = null;
    }
});

window.loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        const btn = document.getElementById("btn-login");
        if (btn) btn.innerText = "👤 " + escapeHtml(user.displayName);
        
        window.currentUserId = user.uid;
        window.currentUserName = user.displayName; 
        
        const userRef = doc(db, "users", user.uid);
        let docSnap;
        try {
            docSnap = await getDoc(userRef);
        } catch (e) {
            console.error("Error loading user document:", e);
            alert("Σφάλμα φόρτωσης προφίλ. Παρακαλώ προσπάθησε ξανά.");
            return;
        }
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(window.updateGameData) {
                window.updateGameData(data.score, data.stats);
            }
            alert("Καλώς ήρθες, " + escapeHtml(user.displayName) + "! Το σκορ σου φορτώθηκε! ☁️🐾");
        } else {
            alert("Καλώς ήρθες, " + escapeHtml(user.displayName) + "! Έγινε δημιουργία προφίλ. 🐾");
        }
        
        if (window.initE2EE) {
            try {
                await window.initE2EE();
            } catch (e) {
                console.error("E2EE init failed:", e);
            }
        }

        if (window.listenToChat) window.listenToChat();
        
        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) btnLogout.style.display = "inline-block";

    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + (error.message || "Unknown error"));
    }
};

window.logoutFromGoogle = async () => {
    try {
        await signOut(auth);
        alert("Αποσυνδεθήκατε επιτυχώς. 🐾");
        // Reload page to clear sensitive chat/game data in memory
        window.location.reload();
    } catch (error) {
        console.error("Σφάλμα αποσύνδεσης:", error);
        alert("Ουπς! Σφάλμα αποσύνδεσης: " + error.message);
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

window.activeChatUserId = null;
window.activeChatUserName = "";
window.unsubscribeChat = null;

window.openGlobalChat = function() {
    window.activeChatUserId = null;
    window.activeChatUserName = "";
    const backBtn = document.getElementById("btn-back-chat");
    if(backBtn) backBtn.style.display = "none";
    document.getElementById("chat-title").innerText = "Γατό-Chat (Global)";
    document.getElementById("chat-view").style.display = "flex";
    document.getElementById("users-list-view").style.display = "none";
    
    document.getElementById("btn-tab-global").style.background = "#03dac6";
    document.getElementById("btn-tab-global").style.color = "black";
    document.getElementById("btn-tab-private").style.background = "#252525";
    document.getElementById("btn-tab-private").style.color = "white";

    window.listenToChat();
};

window.openPrivateList = function() {
    window.activeChatUserId = null;
    window.activeChatUserName = "";
    if (window.unsubscribeChat) {
        window.unsubscribeChat();
        window.unsubscribeChat = null;
    }
    
    const backBtn = document.getElementById("btn-back-chat");
    if(backBtn) backBtn.style.display = "none";
    document.getElementById("chat-title").innerText = "Private Messages";
    document.getElementById("chat-view").style.display = "none";
    document.getElementById("users-list-view").style.display = "flex";
    
    document.getElementById("btn-tab-global").style.background = "#252525";
    document.getElementById("btn-tab-global").style.color = "white";
    document.getElementById("btn-tab-private").style.background = "#03dac6";
    document.getElementById("btn-tab-private").style.color = "black";

    window.loadUsersList();
};

window.openPrivateChat = function(userId, userName) {
    window.activeChatUserId = userId;
    window.activeChatUserName = userName;
    
    const backBtn = document.getElementById("btn-back-chat");
    if(backBtn) backBtn.style.display = "block";
    document.getElementById("chat-title").innerText = "Chat w/ " + userName;
    document.getElementById("chat-view").style.display = "flex";
    document.getElementById("users-list-view").style.display = "none";
    
    window.listenToChat();
};

window.loadUsersList = async function() {
    const listEl = document.getElementById("users-list");
    if (!listEl) return;
    listEl.innerHTML = "<p style='color:#888;text-align:center;'>Φόρτωση χρηστών...</p>";
    
    if (!window.currentUserId) {
        listEl.innerHTML = "<p style='color:#cf6679;text-align:center;'>Συνδέσου με Google για να δεις τους χρήστες!</p>";
        return;
    }
    
    try {
        const usersSnap = await getDocs(collection(db, "users"));
        listEl.innerHTML = "";
        let found = false;
        
        usersSnap.forEach(doc => {
            if (doc.id === window.currentUserId) return;
            found = true;
            const data = doc.data();
            const escapedName = escapeHtml(data.name || 'Άγνωστος');
            const firstChar = escapeHtml((data.name || '?').charAt(0).toUpperCase());
            
            const div = document.createElement('div');
            div.style.padding = '10px';
            div.style.borderBottom = '1px solid #444';
            div.style.cursor = 'pointer';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.gap = '10px';
            div.onclick = () => window.openPrivateChat(doc.id, escapedName);
            
            const avatar = document.createElement('div');
            avatar.style.background = '#03dac6';
            avatar.style.color = 'black';
            avatar.style.width = '30px';
            avatar.style.height = '30px';
            avatar.style.borderRadius = '50%';
            avatar.style.display = 'flex';
            avatar.style.justifyContent = 'center';
            avatar.style.alignItems = 'center';
            avatar.style.fontWeight = 'bold';
            avatar.textContent = firstChar;
            
            const nameDiv = document.createElement('div');
            const nameLabel = document.createElement('div');
            nameLabel.style.color = 'white';
            nameLabel.style.fontWeight = 'bold';
            nameLabel.textContent = escapedName;
            nameDiv.appendChild(nameLabel);
            
            div.appendChild(avatar);
            div.appendChild(nameDiv);
            listEl.appendChild(div);
        });
        
        if (!found) {
            listEl.innerHTML = "<p style='color:#888;text-align:center;'>Δεν βρέθηκαν άλλοι χρήστες.</p>";
        }
    } catch (e) {
        console.error("Error loading users:", e);
        listEl.innerHTML = "<p style='color:#cf6679;text-align:center;'>Σφάλμα φόρτωσης χρηστών.</p>";
    }
};

window.listenToChat = function() {
    if (window.unsubscribeChat) {
        window.unsubscribeChat();
        window.unsubscribeChat = null;
    }

    let q;
    if (window.activeChatUserId) {
        // Private Chat logic
        if (!window.currentUserId) return;
        q = query(collection(db, "private_messages"), 
                  where("participants", "array-contains", window.currentUserId),
                  orderBy("createdAt", "desc"), 
                  limit(20));
    } else {
        // Global Chat logic
        q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(15));
    }
    
    window.unsubscribeChat = onSnapshot(q, async (snapshot) => {
        const chatBox = document.getElementById("chat-messages");
        if (!chatBox) return;
        
        const msgs = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (window.activeChatUserId) {
                if (!data.participants || !data.participants.includes(window.activeChatUserId)) return;
            }
            msgs.push(data);
        });
        
        chatBox.innerHTML = "";
        const reversedMsgs = msgs.reverse();
        
        for (const data of reversedMsgs) {
            let displayText = "(Μη αναγνώσιμο μήνυμα - Δεν υπάρχει E2EE κλειδί)";
            
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
                displayText = escapeHtml(data.text);
            }

            const isMe = data.user === window.currentUserName ? " (Εγώ)" : "";
            const msgDiv = document.createElement('div');
            msgDiv.style.marginBottom = '8px';
            msgDiv.style.padding = '6px';
            msgDiv.style.background = 'rgba(0,0,0,0.4)';
            msgDiv.style.borderRadius = '5px';
            
            const sender = document.createElement('strong');
            sender.style.color = '#bb86fc';
            sender.textContent = escapeHtml(data.user) + isMe + ': ';
            
            msgDiv.appendChild(sender);
            
            const content = document.createElement('span');
            content.innerHTML = displayText;
            msgDiv.appendChild(content);
            
            chatBox.appendChild(msgDiv);
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

        if (window.activeChatUserId) {
            // Private Message
            const targetUserDoc = await getDoc(doc(db, "users", window.activeChatUserId));
            if (targetUserDoc.exists()) {
                const userData = targetUserDoc.data();
                if (userData.publicKey) {
                    try {
                        const recipientPubKey = await window.crypto.subtle.importKey(
                            "jwk",
                            userData.publicKey,
                            { name: "RSA-OAEP", hash: "SHA-256" },
                            true,
                            ["encrypt"]
                        );
                        
                        const encryptedBuffer = await window.CryptoEngine.encryptMessage(text, recipientPubKey);
                        encryptedTexts[window.activeChatUserId] = window.CryptoEngine.arrayBufferToBase64(encryptedBuffer);
                    } catch (e) {
                        console.error("Failed to encrypt for user:", window.activeChatUserId, e);
                    }
                }
            }

            await addDoc(collection(db, "private_messages"), {
                encryptedTexts: encryptedTexts,
                user: window.currentUserName,
                senderId: window.currentUserId,
                participants: [window.currentUserId, window.activeChatUserId],
                createdAt: serverTimestamp()
            });

        } else {
            // Global Message
            const usersSnap = await getDocs(collection(db, "users"));

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
        }
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

