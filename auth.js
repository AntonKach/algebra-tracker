import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, getDocs, where, or } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

const sanitizeInput = window.sanitizeInput || ((str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#x27;");
});

// Ο 'Θυρωρός' που ελέγχει αν είσαι ήδη συνδεδεμένος
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const btn = document.getElementById("btn-login");
        if (btn) btn.innerText = "👤 " + (user.displayName || user.email.split('@')[0]);
        
        window.currentUserId = user.uid;
        window.currentUserName = user.displayName || user.email.split('@')[0];
        
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(window.updateGameData) {
                window.updateGameData(data.score, data.stats);
            }
        } else {
            await setDoc(userRef, {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                createdAt: serverTimestamp()
            });
        }
        
        if (window.initE2EE) {
            await window.initE2EE();
        }

        if (window.listenToChat) {
            window.listenToChat();
        }

        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) btnLogout.style.display = "inline-block";

        const welcomeSplash = document.getElementById("welcome-splash");
        if (welcomeSplash) {
            welcomeSplash.style.display = "none";
        }
        const landingContainer = document.getElementById("landing-container");
        if (landingContainer) {
            landingContainer.style.display = "none";
        }
        const mainApp = document.getElementById("main-app");
        if (mainApp) {
            mainApp.style.display = "block";
            if (window.resizeAllCalculators) {
                window.resizeAllCalculators();
            }
        }
    } else {
        const btn = document.getElementById("btn-login");
        if (btn) btn.innerText = "Σύνδεση";
        
        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) btnLogout.style.display = "none";
        
        window.currentUserId = null;
        window.currentUserName = null;

        const welcomeSplash = document.getElementById("welcome-splash");
        if (welcomeSplash) {
            welcomeSplash.style.display = "none";
        }
        const landingContainer = document.getElementById("landing-container");
        if (landingContainer) {
            landingContainer.style.display = "flex";
        }
        const mainApp = document.getElementById("main-app");
        if (mainApp) {
            mainApp.style.display = "none";
        }
    }
});

window.loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // UI updates are now handled by onAuthStateChanged handler
        window.currentUserId = user.uid;
        window.currentUserName = user.displayName;
        // Immediately hide splash and show main app to avoid flash
        const welcomeSplash = document.getElementById("welcome-splash");
        if (welcomeSplash) welcomeSplash.style.display = "none";
        const landingContainer = document.getElementById("landing-container");
        if (landingContainer) landingContainer.style.display = "none";
        const mainApp = document.getElementById("main-app");
        if (mainApp) {
            mainApp.style.display = "block";
            if (window.resizeAllCalculators) {
                window.resizeAllCalculators();
            }
        }
        const loginView = document.getElementById("login-view");
        if (loginView) loginView.style.display = "none";
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(window.updateGameData) {
                window.updateGameData(data.score, data.stats);
            }
            alert("Καλώς ήρθες, " + user.displayName + "! Το σκορ σου φορτώθηκε! ☁️🐾");
        } else {
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                createdAt: serverTimestamp()
            });
            alert("Καλώς ήρθες, " + user.displayName + "! Έγινε δημιουργία προφίλ. 🐾");
        }
        
        if (window.initE2EE) {
            await window.initE2EE();
        }

        if (window.listenToChat) window.listenToChat();
        
        // UI updates are now handled by onAuthStateChanged handler

    } catch (error) {
        console.error("Σφάλμα σύνδεσης:", error);
        // ΤΩΡΑ ΘΑ ΒΛΕΠΟΥΜΕ ΤΟ ΣΦΑΛΜΑ ΣΤΗΝ ΟΘΟΝΗ:
        alert("Ουπς! Σφάλμα σύνδεσης: " + error.message);
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
            const escapedNameForJs = (data.name || 'Άγνωστος').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            const sanitizedName = sanitizeInput(data.name || 'Άγνωστος');
            listEl.innerHTML += `<div onclick="window.openPrivateChat('${doc.id}', '${escapedNameForJs}')" style="padding:10px; border-bottom:1px solid #444; cursor:pointer; display:flex; align-items:center; gap:10px;">
                <div style="background:#03dac6; color:black; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:bold;">${(sanitizedName).charAt(0).toUpperCase()}</div>
                <div>
                    <div style="color:white; font-weight:bold;">${sanitizedName}</div>
                </div>
            </div>`;
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
                // For private messages, ensure it belongs to the EXACT pair of users
                if (!data.participants || !data.participants.includes(window.activeChatUserId)) return;
            }
            msgs.push(data);
        });
        
        chatBox.innerHTML = "";
        const reversedMsgs = msgs.reverse();
        
        for (const data of reversedMsgs) {
            let displayText = "(Μη αναγνώσιμο μήνυμα - Δεν υπάρχει E2EE κλειδί)";
            let isEncrypted = false;
            
            // Decrypt if it's an encrypted message
            if (data.encryptedTexts && window.myPrivateKey && window.currentUserId) {
                const myEncryptedBase64 = data.encryptedTexts[window.currentUserId];
                if (myEncryptedBase64) {
                    try {
                        const encryptedBuffer = window.CryptoEngine.base64ToArrayBuffer(myEncryptedBase64);
                        displayText = await window.CryptoEngine.decryptMessage(encryptedBuffer, window.myPrivateKey);
                        isEncrypted = true;
                    } catch (e) {
                        console.error("Failed to decrypt message", e);
                        displayText = "(Σφάλμα αποκρυπτογράφησης)";
                    }
                }
            } else if (data.text) {
                // Fallback for old unencrypted messages
                displayText = data.text;
            }

            displayText = sanitizeInput(displayText);
            if (isEncrypted) {
                displayText += ' <span style="font-size: 0.8em; color: #32D74B;" title="E2EE Προστατευμένο">🔒</span>';
            }

            const sanitizedUser = sanitizeInput(data.user || 'Άγνωστος');
            const isMe = data.user === window.currentUserName ? " (Εγώ)" : "";
            chatBox.innerHTML += `<div style="margin-bottom: 8px; padding: 6px; background: rgba(0,0,0,0.4); border-radius: 5px;">
                <strong style="color: #bb86fc;">${sanitizedUser}${isMe}:</strong> ${displayText}
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

window.loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        window.currentUserId = user.uid;
        window.currentUserName = user.displayName || user.email.split('@')[0];
        // Immediately hide splash and show main app to avoid flash
        const welcomeSplash = document.getElementById("welcome-splash");
        if (welcomeSplash) welcomeSplash.style.display = "none";
        const landingContainer = document.getElementById("landing-container");
        if (landingContainer) landingContainer.style.display = "none";
        const mainApp = document.getElementById("main-app");
        if (mainApp) {
            mainApp.style.display = "block";
            if (window.resizeAllCalculators) {
                window.resizeAllCalculators();
            }
        }
        
        if (window.initE2EE) {
            await window.initE2EE();
        }
        if (window.listenToChat) window.listenToChat();
        
        alert('Καλώς ήρθες ξανά! 🐾');
    } catch (e) {
        console.error("Login error:", e);
        alert('Λάθος email ή κωδικός. Δοκίμασε ξανά! 🐾');
    }
};

window.signUpWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const displayName = email.split('@')[0];
        await updateProfile(user, { displayName: displayName });
        
        window.currentUserId = user.uid;
        window.currentUserName = displayName;
        // Immediately hide splash and show main app to avoid flash
        const welcomeSplash = document.getElementById("welcome-splash");
        if (welcomeSplash) welcomeSplash.style.display = "none";
        const landingContainer = document.getElementById("landing-container");
        if (landingContainer) landingContainer.style.display = "none";
        const mainApp = document.getElementById("main-app");
        if (mainApp) {
            mainApp.style.display = "block";
            if (window.resizeAllCalculators) {
                window.resizeAllCalculators();
            }
        }
        
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            name: displayName,
            email: user.email,
            createdAt: serverTimestamp()
        });
        
        if (window.initE2EE) {
            await window.initE2EE();
        }
        if (window.listenToChat) window.listenToChat();
        
        alert('Επιτυχής δημιουργία λογαριασμού! 🐾');
    } catch (e) {
        console.error("Signup error:", e);
        if (e.code === 'auth/email-already-in-use') {
            alert('Αυτό το email υπάρχει ήδη! Σε παρακαλώ πάτα "Σύνδεση". 🐾');
        } else {
            alert("Σφάλμα εγγραφής: " + e.message);
        }
    }
};

