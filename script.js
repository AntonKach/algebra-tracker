if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

let consecutiveCorrect = 0;
let consecutiveWrong = 0;
let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator, sciCalculator;
let currentLang = "el"; 
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0, wrong: 0 };
let lastFocusedInput = "answer";
let currentGeoAnswer = 0;
let currentTrigAnswer = 0;
let currentTopologyAnswer = 0;

if (typeof educationData === 'undefined') {
 window.educationData = {
 "gym_a": { title: { el: "Α' Γυμνασίου", en: "7th Grade", fr: "5e", tr: "7. Sınıf" } },
 "gym_b": { title: { el: "Β' Γυμνασίου", en: "8th Grade", fr: "4e", tr: "8. Sınıf" } },
 "gym_c": { title: { el: "Γ' Γυμνασίου", en: "9th Grade", fr: "3e", tr: "9. Sınıf" } },
 "lyc_a": { title: { el: "Α' Λυκείου", en: "10th Grade", fr: "2de", tr: "10. Sınıf" } }
 };
}

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΑΣΦΑΛΕΙΑΣ ---
function safeSetText(id, text) { const el = document.getElementById(id); if (el) el.innerText = text; }
function safeSetHTML(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
function safeSetPlaceholder(id, text) { const el = document.getElementById(id); if (el) el.placeholder = text; }

window.updateGameData = function(cloudScore, cloudStats) {
 if (cloudScore !== undefined) score = cloudScore;
 if (cloudStats !== undefined) userStats = cloudStats;
 
 safeSetText("score", score);
 updateRank();
 if (typeof updateStatsUI === "function") updateStatsUI(); 
 
 localStorage.setItem("mathUserStats", JSON.stringify(userStats));
 localStorage.setItem("mathScore", score);
 
 if (window.saveToCloud) window.saveToCloud(score, userStats);
 };

const translations = {
 el: {
 mainTitle: "Catgebra ", btnLogin: " Σύνδεση με Google",
 lblLevel: "Επίπεδο Σπουδών:", lblSelectLevel: "Δυσκολία:", 
 optLevel1: "Επίπεδο 1: Γατάκι (ax + b = c)", optLevel2: "Επίπεδο 2: Γάτος (ax + b = cx + d)", optLevel3: "Επίπεδο 3: Τίγρης (Δευτεροβάθμιες)", optLevel4: "Επίπεδο 4: Λιοντάρι (Κλάσματα & Παρενθέσεις)",
 lblScore: "Σκορ:", lblTime: "Χρόνος:", btnSecret: " Μυστικό!", btnChatToggle: " Chat",
 placeholderAns: "Απάντηση...", kbdToggleTitle: "Εμφάνιση Μαθηματικού Πληκτρολογίου",
 btnCheck: "Έλεγχος", btnHelp: "Βήμα-Βήμα", btnSkip: "Παράλειψη",
 lblNotes: "Πρόχειρο & Υπολογιστής ", btnAI: " Έλεγχος AI", placeholderNotes: "Γράψε εδώ τις σκέψεις σου...", btnClear: " Καθαρισμός",
 lblGraph: "Γραφική Παράσταση ",
 btnReset: "Μηδενισμός", btnStats: " Στατιστικά", modalTitle: "Τα Στατιστικά μου ",
 lblPlayed: "Λυμένες Ασκήσεις:", lblCorrect: "Σωστές:", lblRate: "Ποσοστό Επιτυχίας:", btnClose: "Κλείσιμο",
 lblAboutTitle: "Σχετικά με την Catgebra ", 
 lblAboutText: "Η Catgebra δημιουργήθηκε για να κάνει την Άλγεβρα διασκεδαστική!",
 lblResources: "Πηγές Μελέτης ",
 chatTitle: "Γατό-Chat ", chatMsgPlaceholder: "Συνδέσου με Google για να δεις τα μηνύματα!",
 can1: "Γεια σε όλους! ", can2: "Αυτή η άσκηση με δυσκόλεψε! ", can3: "Μόλις ανέβηκα κατηγορία! ",
 btnChatSend: "Αποστολή ", btnChatClose: "Κλείσιμο",
 secretModalTitle: " Το Μυστικό της Μισέλ!", btnSecretClose: "Τέλεια! ",
 rank1: " Αρχάριο Γατάκι", rank2: " Έξυπνος Γάτος", rank3: " Γρήγορος Λύγκας", rank4: " Μαθηματικός Τίγρης",
 stepWords: { move: "Μεταφέρουμε:", div: "Διαιρούμε:", sub: "Αφαιρούμε:", mult: "Πολλαπλασιάζουμε:" },
 catSuccess: ["Purr-fect! Βρήκες το x! ", "Meow-gnificent! ", "Γατίσια αντανακλαστικά! "],
 catError: ["Ουπς! Μήπως πάτησα το πληκτρολόγιο; ", "Μιάου... Κάτι δεν πήγε καλά. "],
 tabMath: " Μαθηματικά", tabPhysics: " Φυσική",
 physicsTitle: "Εργαστήριο Φυσικής της Μισέλ ", lblPhysicsLevel: "Θέμα:",
 physOpt1: "1. Ταχύτητα (v = s/t)", physOpt2: "2. Απόσταση (s = v*t)", physOpt3: "3. Χρόνος (t = s/v)",
 btnPhysicsNext: "Επόμενο", physicsPlaceholder: "Επίλεξε θέμα για να ξεκινήσεις τα πειράματα!",
 physCheckNum: "Παρακαλώ βάλε έναν αριθμό! ",
 physScenarios1: [
 "Η Μισέλ τρέχει να πιάσει το κόκκινο λέιζερ! Διανύει {s} μέτρα σε {t} δευτερόλεπτα. Ποια είναι η ταχύτητά της; (v = s / t)",
 "Ένα ρομποτικό ποντίκι διασχίζει το σαλόνι ({s} μέτρα) σε {t} δευτερόλεπτα. Με τι ταχύτητα κινείται;",
 "Η Μισέλ άκουσε τον ήχο της κονσέρβας! Έτρεξε {s} μέτρα σε {t} δευτερόλεπτα. Βρες την ταχύτητά της."
 ],
 physScenarios2: [
 "Η Μισέλ τρέχει σταθερά με ταχύτητα {v} m/s για {t} δευτερόλεπτα κυνηγώντας μια πεταλούδα. Πόσα μέτρα διένυσε; (s = v * t)",
 "Ο Άντον περπατάει με {v} m/s για {t} δευτερόλεπτα για να πάρει τον καφέ του. Τι απόσταση κάλυψε;",
 "Ένα πουλί πετάει με ταχύτητα {v} m/s για {t} δευτερόλεπτα και η Μισέλ το κοιτάζει από το παράθυρο. Πόση απόσταση διένυσε το πουλί;"
 ],
 physScenarios3: [
 "Η απόσταση μέχρι το μπολ με το φαγητό είναι {s} μέτρα. Αν η Μισέλ τρέχει με ταχύτητα {v} m/s, σε πόσα δευτερόλεπτα θα φτάσει; (t = s / v)",
 "Ο Άντον έχει να διανύσει {s} μέτρα μέχρι το γραφείο του. Περπατάει με ταχύτητα {v} m/s. Πόσο χρόνο θα κάνει;",
 "Η Μισέλ περπατάει στον διάδρομο μήκους {s} μέτρων με ταχύτητα {v} m/s. Σε πόσα δευτερόλεπτα θα τον διασχίσει;"
 ]
 },
 en: {
 mainTitle: "Catgebra ", btnLogin: " Login with Google",
 lblLevel: "Study Level:", lblSelectLevel: "Difficulty:",
 optLevel1: "Level 1: Kitten (ax + b = c)", optLevel2: "Level 2: Cat (ax + b = cx + d)", optLevel3: "Level 3: Tiger (Quadratics)", optLevel4: "Level 4: Lion (Fractions & Parentheses)",
 lblScore: "Score:", lblTime: "Time:", btnSecret: " Secret!", btnChatToggle: " Chat",
 placeholderAns: "Answer...", kbdToggleTitle: "Show Math Keyboard",
 btnCheck: "Check", btnHelp: "Step-by-Step", btnSkip: "Skip",
 lblNotes: "Scratchpad & Calculator ", btnAI: " AI Check", placeholderNotes: "Write your thoughts...", btnClear: " Clear",
 lblGraph: "Graph ",
 btnReset: "Reset", btnStats: " Stats", modalTitle: "My Statistics ",
 lblPlayed: "Solved:", lblCorrect: "Correct:", lblRate: "Success Rate:", btnClose: "Close",
 lblAboutTitle: "About Catgebra ", lblAboutText: "Catgebra makes Algebra fun!",
 lblResources: "Resources ",
 chatTitle: "Cat-Chat ", chatMsgPlaceholder: "Login with Google to see messages!",
 can1: "Hello everyone! ", can2: "This problem was hard! ", can3: "I just leveled up! ",
 btnChatSend: "Send ", btnChatClose: "Close",
 secretModalTitle: " Michelle's Secret!", btnSecretClose: "Purrfect! ",
 rank1: " Beginner Kitten", rank2: " Smart Cat", rank3: " Fast Lynx", rank4: " Math Tiger",
 stepWords: { move: "Move:", div: "Divide:", sub: "Subtract:", mult: "Multiply:" },
 catSuccess: ["Purr-fect! You found x! "], catError: ["Oops! Wrong answer. "],
 tabMath: " Math", tabPhysics: " Physics",
 physicsTitle: "Michelle's Physics Lab ", lblPhysicsLevel: "Topic:",
 physOpt1: "1. Velocity (v = s/t)", physOpt2: "2. Distance (s = v*t)", physOpt3: "3. Time (t = s/v)",
 btnPhysicsNext: "Next", physicsPlaceholder: "Select a topic to start the experiments!",
 physCheckNum: "Please enter a number! ",
 physScenarios1: [
 "Michelle runs to catch the red laser! She covers {s} meters in {t} seconds. What is her velocity? (v = s / t)",
 "A robotic mouse crosses the living room ({s} meters) in {t} seconds. What is its speed?",
 "Michelle heard the sound of the can! She ran {s} meters in {t} seconds. Find her speed."
 ],
 physScenarios2: [
 "Michelle runs at a steady speed of {v} m/s for {t} seconds chasing a butterfly. How many meters did she cover? (s = v * t)",
 "Anton walks at {v} m/s for {t} seconds to get his coffee. What distance did he cover?",
 "A bird flies at a speed of {v} m/s for {t} seconds and Michelle watches it from the window. What distance did the bird cover?"
 ],
 physScenarios3: [
 "The distance to the food bowl is {s} meters. If Michelle runs at a speed of {v} m/s, in how many seconds will she reach it? (t = s / v)",
 "Anton has to cover {s} meters to his office. He walks at a speed of {v} m/s. How much time will it take?",
 "Michelle walks in the {s}-meter corridor at a speed of {v} m/s. In how many seconds will she cross it?"
 ]
 },
 fr: {
 mainTitle: "Catgebra ", btnLogin: " Se connecter avec Google",
 lblLevel: "Niveau d'étude:", lblSelectLevel: "Difficulté:",
 optLevel1: "Niveau 1: Chaton (ax + b = c)", optLevel2: "Niveau 2: Chat (ax + b = cx + d)", optLevel3: "Niveau 3: Tigre (Second degré)", optLevel4: "Niveau 4 : Lion (Fractions et Parenthèses)",
 lblScore: "Score:", lblTime: "Temps:", btnSecret: " Secret!", btnChatToggle: " Chat",
 placeholderAns: "Réponse...", kbdToggleTitle: "Afficher le clavier mathématique",
 btnCheck: "Vérifier", btnHelp: "Étape par étape", btnSkip: "Passer",
 lblNotes: "Brouillon & Calculatrice ", btnAI: " Vérification IA", placeholderNotes: "Écris tes pensées ici...", btnClear: " Effacer",
 lblGraph: "Graphique ",
 btnReset: "Réinitialiser", btnStats: " Stats", modalTitle: "Mes Statistiques ",
 lblPlayed: "Résolus:", lblCorrect: "Corrects:", lblRate: "Taux de réussite:", btnClose: "Fermer",
 lblAboutTitle: "À propos de Catgebra ", lblAboutText: "Catgebra a été créé pour rendre l'Algèbre amusante!",
 lblResources: "Ressources ",
 chatTitle: "Cat-Chat ", chatMsgPlaceholder: "Connecte-toi avec Google pour voir les messages!",
 can1: "Salut tout le monde! ", can2: "Cet exercice était difficile! ", can3: "Je viens de monter de niveau! ",
 btnChatSend: "Envoyer ", btnChatClose: "Fermer",
 secretModalTitle: " Le Secret de Michelle!", btnSecretClose: "Parfait! ",
 rank1: " Chaton Débutant", rank2: " Chat Intelligent", rank3: " Lynx Rapide", rank4: " Tigre Math.",
 stepWords: { move: "On déplace:", div: "On divise:", sub: "On soustrait:", mult: "On multiplie:" },
 catSuccess: ["Purr-fect! Tu as trouvé x! "], catError: ["Oups! Mauvaise réponse. "],
 tabMath: " Mathématiques", tabPhysics: " Physique",
 physicsTitle: "Laboratoire de Physique de Michelle ", lblPhysicsLevel: "Sujet:",
 physOpt1: "1. Vitesse (v = s/t)", physOpt2: "2. Distance (s = v*t)", physOpt3: "3. Temps (t = s/v)",
 btnPhysicsNext: "Suivant", physicsPlaceholder: "Sélectionnez un sujet pour commencer les expériences!",
 physCheckNum: "Veuillez entrer un nombre! ",
 physScenarios1: [
 "Michelle court pour attraper le laser rouge! Elle parcourt {s} mètres en {t} secondes. Quelle est sa vitesse ? (v = s / t)",
 "Une souris robotique traverse le salon ({s} mètres) en {t} secondes. À quelle vitesse se déplace-t-elle ?",
 "Michelle a entendu le bruit de la boîte ! Elle a couru {s} mètres en {t} secondes. Trouve sa vitesse."
 ],
 physScenarios2: [
 "Michelle court à une vitesse constante de {v} m/s pendant {t} secondes en chassant un papillon. Combien de mètres a-t-elle parcouru ? (s = v * t)",
 "Anton marche à {v} m/s pendant {t} secondes pour prendre son café. Quelle distance a-t-il couverte ?",
 "Un oiseau vole à une vitesse de {v} m/s pendant {t} secondes et Michelle le regarde par la fenêtre. Quelle distance l'oiseau a-t-il couverte ?"
 ],
 physScenarios3: [
 "La distance jusqu'à la gamelle de nourriture est de {s} mètres. Si Michelle court à une vitesse de {v} m/s, en combien de secondes l'atteindra-t-elle ? (t = s / v)",
 "Anton doit parcourir {s} mètres jusqu'à son bureau. Il marche à une vitesse de {v} m/s. Combien de temps cela prendra-t-il ?",
 "Michelle marche dans le couloir de {s} mètres à une vitesse de {v} m/s. En combien de secondes le traversera-t-elle ?"
 ]
 },
 tr: {
 mainTitle: "Catgebra ", btnLogin: " Google ile Giriş",
 lblLevel: "Eğitim Seviyesi:", lblSelectLevel: "Zorluk:",
 optLevel1: "Seviye 1: Yavru Kedi (ax + b = c)", optLevel2: "Seviye 2: Kedi (ax + b = cx + d)", optLevel3: "Seviye 3: Kaplan (İkinci Dereceden)", optLevel4: "Seviye 4: Aslan (Kesirler ve Parantezler)",
 lblScore: "Puan:", lblTime: "Zaman:", btnSecret: " Sır!", btnChatToggle: " Sohbet",
 placeholderAns: "Cevap...", kbdToggleTitle: "Matematik Klavyesini Göster",
 btnCheck: "Kontrol", btnHelp: "Adım Adım", btnSkip: "Geç",
 lblNotes: "Karalama Defteri ", btnAI: " AI Kontrolü", placeholderNotes: "Düşüncelerini yaz...", btnClear: " Temizle",
 lblGraph: "Grafik ",
 btnReset: "Sıfırla", btnStats: " İstatistikler", modalTitle: "İstatistiklerim ",
 lblPlayed: "Çözülen:", lblCorrect: "Doğru:", lblRate: "Başarı Oranı:", btnClose: "Kapat",
 lblAboutTitle: "Catgebra Hakkında ", lblAboutText: "Catgebra matematiği eğlenceli hale getirir!",
 lblResources: "Kaynaklar ",
 chatTitle: "Kedi Sohbeti ", chatMsgPlaceholder: "Mesajları görmek için giriş yapın!",
 can1: "Herkese merhaba! ", can2: "Bu çok zordu! ", can3: "Seviye atladım! ",
 btnChatSend: "Gönder ", btnChatClose: "Kapat",
 secretModalTitle: " Michelle'in Sırrı!", btnSecretClose: "Mükemmel! ",
 rank1: " Acemi Yavru Kedi", rank2: " Akıllı Kedi", rank3: " Hızlı Vaşak", rank4: " Matematik Kaplanı",
 stepWords: { move: "Taşıyoruz:", div: "Bölüyoruz:", sub: "Çıkarıyoruz:", mult: "Çarpıyoruz:" },
 catSuccess: ["Purr-fect! x'i buldun! "], catError: ["Oops! Yanlış cevap. "],
 tabMath: " Matematik", tabPhysics: " Fizik",
 physicsTitle: "Michelle'in Fizik Laboratuvarı ", lblPhysicsLevel: "Konu:",
 physOpt1: "1. Hız (v = s/t)", physOpt2: "2. Mesafe (s = v*t)", physOpt3: "3. Zaman (t = s/v)",
 btnPhysicsNext: "Sonraki", physicsPlaceholder: "Deneylere başlamak için bir konu seçin!",
 physCheckNum: "Lütfen bir sayı girin! ",
 physScenarios1: [
 "Michelle kırmızı lazeri yakalamak için koşuyor! {t} saniyede {s} metre yol alıyor. Hızı nedir? (v = s / t)",
 "Robotik bir fare oturma odasını ({s} metre) {t} saniyede geçiyor. Hangi hızda hareket ediyor?",
 "Michelle konserve kutusunun sesini duydu! {t} saniyede {s} metre koştu. Hızını bulun."
 ],
 physScenarios2: [
 "Michelle bir kelebeği kovalarken {t} saniye boyunca sabit {v} m/s hızla koşuyor. Kaç metre yol aldı? (s = v * t)",
 "Anton kahvesini almak için {t} saniye boyunca {v} m/s hızla yürüyor. Ne kadar mesafe kat etti?",
 "Bir kuş {t} saniye boyunca {v} m/s hızla uçuyor ve Michelle onu pencereden izliyor. Kuş ne kadar mesafe kat etti?"
 ],
 physScenarios3: [
 "Yemek kabına olan mesafe {s} metredir. Michelle {v} m/s hızla koşarsa kaç saniyede ulaşır? (t = s / v)",
 "Anton'un ofisine gitmesi için {s} metre gitmesi gerekiyor. {v} m/s hızla yürüyor. Ne kadar zaman alacak?",
 "Michelle {s} metrelik koridorda {v} m/s hızla yürüyor. Kaç saniyede geçecek?"
 ]
 }
};

window.onload = function() {
 try {
 const savedStats = localStorage.getItem("mathUserStats");
 if (savedStats) userStats = JSON.parse(savedStats);
 
 const savedScore = localStorage.getItem("mathScore");
 if (savedScore && !isNaN(parseInt(savedScore))) score = parseInt(savedScore);

 const savedAvatar = localStorage.getItem("userAvatar");
 if (savedAvatar) {
 const mainAvatar = document.getElementById("main-avatar");
 const profileAvatar = document.getElementById("profile-avatar");
 if (mainAvatar) mainAvatar.src = savedAvatar;
 if (profileAvatar) profileAvatar.src = savedAvatar;
 }
 
 const sciEl = document.getElementById('scientific-calculator');
 if (sciEl && typeof Desmos !== 'undefined' && typeof Desmos.ScientificCalculator === 'function') sciCalculator = Desmos.ScientificCalculator(sciEl, { invertedColors: true });
 
 const calcEl = document.getElementById('calculator');
 if (calcEl && typeof Desmos !== 'undefined') calculator = Desmos.GraphingCalculator(calcEl, { keypad: true, expressions: false, settingsMenu: false, invertedColors: true });

 const geoEl = document.getElementById('desmos-geometry');
 if (geoEl && typeof Desmos !== 'undefined') window.geoCalculator = Desmos.Geometry(geoEl, { language: 'el' });

 safeSetText("score", score);
 updateRank();
 
 const ansEl = document.getElementById("answer");
 if (ansEl) ansEl.addEventListener("focus", () =>lastFocusedInput = "answer");
 
 const notesEl = document.getElementById("user-notes");
 if (notesEl) notesEl.addEventListener("focus", () =>lastFocusedInput = "user-notes");

 changeLanguage(); 
 startTimer();
 
 document.addEventListener('keydown', function(event) {
     if (event.key === 'Enter') {
         const aeId = document.activeElement ? document.activeElement.id : null;
         if (aeId === 'answer') checkAnswer();
         else if (aeId === 'geo-answer') window.checkGeoAnswer();
         else if (aeId === 'trig-answer') window.checkTrigAnswer();
         else if (aeId === 'topology-answer') window.checkTopologyAnswer();
     }
 });
 } catch (e) { console.error("OnLoad Error:", e); }
};

function startTimer() {
 clearInterval(timerInterval);
 seconds = 0;
 timerInterval = setInterval(() =>{
 seconds++;
 let m = Math.floor(seconds/60), s = seconds%60;
 safeSetText("timer", `${m}:${s<10?'0'+s:s}`);
 }, 1000);
}

function populateGradeSelect() {
 const select = document.getElementById("grade-select");
 if (!select) return;
 const currentVal = select.value;
 select.innerHTML = "";
 for (const key in educationData) {
 let option = document.createElement("option");
 option.value = key;
 option.text = educationData[key].title[currentLang] || educationData[key].title["en"];
 select.appendChild(option);
 }
 if (currentVal) select.value = currentVal;
}

function changeLanguage() {
 const langSelect = document.getElementById("lang-select");
 currentLang = langSelect ? langSelect.value : "el";
 const t = translations[currentLang] || translations["el"];

 safeSetText("main-title", t.mainTitle);
 safeSetHTML("btn-login", t.btnLogin);
 safeSetText("lbl-level", t.lblLevel);
 safeSetText("lbl-select-level", t.lblSelectLevel);
 safeSetText("opt-level-1", t.optLevel1);
 safeSetText("opt-level-2", t.optLevel2);
 safeSetText("opt-level-3", t.optLevel3);
 safeSetText("opt-level-4", t.optLevel4);
 safeSetText("lbl-score", t.lblScore);
 safeSetText("lbl-time", t.lblTime);
 safeSetText("btn-secret", t.btnSecret);
 safeSetText("btn-chat-toggle", t.btnChatToggle);
 safeSetPlaceholder("answer", t.placeholderAns);
 const kbdBtn = document.getElementById("kbd-toggle-btn");
 if (kbdBtn) kbdBtn.title = t.kbdToggleTitle;
 safeSetText("btn-check", t.btnCheck);
 safeSetText("btn-help", t.btnHelp);
 safeSetText("btn-skip", t.btnSkip);
 safeSetText("lbl-notes", t.lblNotes);
 safeSetText("btn-clear", t.btnClear);
 safeSetPlaceholder("user-notes", t.placeholderNotes);
 safeSetText("lbl-graph", t.lblGraph);
 safeSetText("btn-reset", t.btnReset);
 safeSetText("btn-stats", t.btnStats);
 safeSetText("modal-title", t.modalTitle);
 safeSetText("lbl-played", t.lblPlayed);
 safeSetText("lbl-correct", t.lblCorrect);
 safeSetText("lbl-rate", t.lblRate);
 safeSetText("btn-close", t.btnClose);
 safeSetText("chat-title", t.chatTitle);
 safeSetText("chat-msg-placeholder", t.chatMsgPlaceholder);
 safeSetText("can-1", t.can1);
 safeSetText("can-2", t.can2);
 safeSetText("can-3", t.can3);
 safeSetText("btn-chat-send", t.btnChatSend);
 safeSetText("btn-chat-close", t.btnChatClose);
 safeSetText("secret-modal-title", t.secretModalTitle);
 safeSetText("btn-secret-close", t.btnSecretClose);
 
 safeSetText("btn-ai", t.btnAI);
 safeSetText("lbl-resources", t.lblResources);
 safeSetText("lbl-about-title", t.lblAboutTitle);
 safeSetText("lbl-about-text", t.lblAboutText);

 // Μεταφράσεις Φυσικής
 safeSetText("tab-math", t.tabMath);
 safeSetText("tab-physics", t.tabPhysics);
 safeSetText("physics-title", t.physicsTitle);
 safeSetText("lbl-physics-level", t.lblPhysicsLevel);
 safeSetText("phys-opt-1", t.physOpt1);
 safeSetText("phys-opt-2", t.physOpt2);
 safeSetText("phys-opt-3", t.physOpt3);
 safeSetText("btn-physics-next", t.btnPhysicsNext);
 safeSetPlaceholder("physics-answer", t.placeholderAns);

 updateRank();
 populateGradeSelect();
 loadNextProblem();
}

function changeGrade() { startTimer(); loadNextProblem(); }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function loadNextProblem() {
 try {
 const levelSelect = document.getElementById("level-select");
 const gradeSelect = document.getElementById("grade-select");
 const gradeKey = gradeSelect ? gradeSelect.value : "gym_a";
 const gradeInfo = typeof educationData !== 'undefined' ? educationData[gradeKey] : null;
 
 const words = translations[currentLang] ? translations[currentLang].stepWords : translations["el"].stepWords;
 let equationStr = "", correctAns = "", stepList = [];
 const level = levelSelect ? parseInt(levelSelect.value) : 1;

 if (levelSelect) {
 const diffContainer = levelSelect.parentElement;
 if (gradeInfo && gradeInfo.type === "static") {
 diffContainer.style.display = "none";
 } else {
 diffContainer.style.display = "block";
 }
 }

 if (gradeInfo && gradeInfo.type === "static" && gradeInfo.problems && gradeInfo.problems.length >0) {
 const randIdx = Math.floor(Math.random() * gradeInfo.problems.length);
 const p = gradeInfo.problems[randIdx];
 equationStr = p.equation;
 correctAns = p.answer;
 const stepsObj = p.steps[currentLang] || p.steps["el"];
 stepList = Array.isArray(stepsObj) ? stepsObj : [stepsObj];
 } else {
 if (level === 1) {
 let x = getRandomInt(-10, 10), a = getRandomInt(1, 10), b = getRandomInt(-20, 20);
 let c = (a * x) + b;
 equationStr = `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`;
 correctAns = x.toString();
 stepList = [`${words.move} ${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`, `${words.div} x = ${x}`];
 } else if (level === 2) {
 let x = getRandomInt(-10, 10), a = getRandomInt(1, 10), c_c = getRandomInt(1, 10);
 while(a === c_c) c_c = getRandomInt(1, 10);
 let b = getRandomInt(-20, 20);
 let d = (a * x) + b - (c_c * x);
 equationStr = `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c_c}x ${d >= 0 ? "+" : "-"} ${Math.abs(d)}`;
 correctAns = x.toString();
 stepList = [`Φέρνουμε τα x αριστερά...`, `Λύση: x = ${x}`];
 } else if (level === 3) {
 let r1 = getRandomInt(-5, 5), r2 = getRandomInt(-5, 5);
 let b = -(r1 + r2), c = r1 * r2;
 equationStr = `x² ${b>=0?'+':'-'} ${Math.abs(b)}x ${c>=0?'+':'-'} ${Math.abs(c)} = 0`;
 let roots = [r1, r2].sort((a,b) =>a - b);
 correctAns = r1 === r2 ? r1.toString() : `${roots[0]},${roots[1]}`;
 stepList = [`Λύνουμε τη δευτεροβάθμια...`, `Ρίζες: ${correctAns}`];
 } else if (level === 4) {
 let x = 0;
 while (x === 0) x = getRandomInt(-5, 5);
 let a = 0;
 while (a === 0) a = getRandomInt(-4, 5);
 let c_val = getRandomInt(2, 6);
 let d = getRandomInt(-8, 8);
 
 let b = c_val * d - a * x;
 
 let aStr = a === 1 ? "" : (a === -1 ? "-" : a);
 equationStr = `(${aStr}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) / ${c_val} = ${d}`;
 correctAns = x.toString();
 stepList = [`Πολλαπλασιάζουμε με το ${c_val} για να διώξουμε τον παρανομαστή...`, `Χωρίζουμε γνωστούς από αγνώστους...`, `Λύση: x = ${x}`];
 }
 }

 currentProblem = { equation: equationStr, answer: correctAns, steps: stepList };
 safeSetHTML("equation", equationStr);
 safeSetValue("answer", "");
 safeSetText("feedback", "");
 
 const hb = document.getElementById("help-steps");
 if(hb) hb.classList.add("hidden");

 if (calculator) {
 calculator.setBlank();
 let latex = equationStr.replace('=', '-(') + ')';
 calculator.setExpression({ id: 'graph', latex: latex.replace(/x²/g, 'x^2'), color: '#bb86fc' });
 }
 } catch (e) { console.error("Error in loadNextProblem:", e); }
}

function safeSetValue(id, val) { const el = document.getElementById(id); if (el) el.value = val; }

function checkAnswer() {
 const ansEl = document.getElementById("answer");
 if(!ansEl) return;
 let userAns = ansEl.value.replace(/\s+/g, '').trim();
 let expected = currentProblem.answer;

 if (expected.includes(',') && userAns.includes(',')) {
 userAns = userAns.split(',').sort((a,b) =>parseFloat(a) - parseFloat(b)).join(',');
 expected = expected.split(',').sort((a,b) =>parseFloat(a) - parseFloat(b)).join(',');
 }

 userStats.played++; 
 const t = translations[currentLang] || translations["el"];

 if (userAns === expected) {
 userStats.correct++;
 score += 20;
 consecutiveCorrect++;
 consecutiveWrong = 0;
 
 let fbEl = document.getElementById("feedback");
 if (consecutiveCorrect === 3) {
   if(fbEl) {
     fbEl.innerHTML = `Είσαι ασταμάτητος! 🚀 Μήπως ήρθε η ώρα να δοκιμάσεις το επόμενο επίπεδο δυσκολίας;`;
     fbEl.style.color = "#0A84FF"; // iOS Blue
   }
 } else {
   safeSetText("feedback", t.catSuccess[Math.floor(Math.random() * t.catSuccess.length)]);
   if(fbEl) fbEl.style.color = ""; // reset color
 }
 
 if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
 try { new Audio('correct.mp3').play().catch(()=>{}); } catch(e){}
 setTimeout(loadNextProblem, 2000);
 } else {
 consecutiveWrong++;
 consecutiveCorrect = 0;
 
 let fbEl = document.getElementById("feedback");
 if (consecutiveWrong >= 2) {
   const levelSelect = document.getElementById("level-select");
   const level = levelSelect ? parseInt(levelSelect.value) : 1;
   let tipMsg = "";
   if (level === 1) tipMsg = "💡 Tip: Όταν μεταφέρεις έναν αριθμό στην άλλη πλευρά του ίσον, μην ξεχνάς να του αλλάζεις πρόσημο!";
   else if (level === 2) tipMsg = "💡 Tip: Μάζεψε πρώτα όλα τα x στη μία πλευρά και όλους τους αριθμούς στην άλλη.";
   else tipMsg = "💡 Tip: Πρόσεξε καλά τις πράξεις με τα κλάσματα και τις παρενθέσεις. Κάνε το βήμα-βήμα στο πρόχειρο!";
   
   if(fbEl) {
     fbEl.innerText = tipMsg;
     fbEl.style.color = "#FFD60A"; // iOS Yellow
   }
 } else {
   safeSetText("feedback", t.catError[Math.floor(Math.random() * t.catError.length)]);
   if(fbEl) fbEl.style.color = ""; // reset color
 }
 try { new Audio('fail.mp3').play().catch(()=>{}); } catch(e){}
 }

 safeSetText("score", score);
 updateGameData();
}

window.checkGeoAnswer = function() {
    const ansEl = document.getElementById("geo-answer");
    if(!ansEl) return;
    const userAns = parseFloat(ansEl.value);
    const fbEl = document.getElementById("geo-feedback");
    
    if (isNaN(userAns)) {
        if(fbEl) { fbEl.innerText = "Βάλε αριθμό!"; fbEl.style.color = "#FFD60A"; }
        return;
    }
    
    if (userAns === currentGeoAnswer) {
        if(fbEl) { fbEl.innerText = "Σωστά! 🥳"; fbEl.style.color = "#32D74B"; }
        score += 15;
        userStats.correct++;
        userStats.played++;
        updateGameData();
        if(typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(window.generateGeoProblem, 1500);
    } else {
        if(fbEl) { fbEl.innerText = "Ουπς! Λάθος. Ξαναδοκίμασε."; fbEl.style.color = "#FF453A"; }
        userStats.wrong = (userStats.wrong || 0) + 1;
        userStats.played++;
        updateGameData();
    }
};

window.generateGeoProblem = function() {
    const probEl = document.getElementById("geo-problem");
    const inputEl = document.getElementById("geo-answer");
    const feedbackEl = document.getElementById("geo-feedback");
    
    if(inputEl) inputEl.value = "";
    if(feedbackEl) feedbackEl.innerText = "";
    
    const scenario = Math.floor(Math.random() * 3);
    if (scenario === 0) {
        const a = Math.floor(Math.random() * 10) + 3;
        const b = Math.floor(Math.random() * 8) + 2;
        currentGeoAnswer = a * b;
        if(probEl) probEl.innerHTML = `Θέλουμε να αγοράσουμε ένα νέο χαλί για το σαλόνι. Αν ο χώρος έχει μήκος ${a} μέτρα και πλάτος ${b} μέτρα, ποιο είναι το εμβαδόν του χαλιού που χρειαζόμαστε; (E = a · b)`;
    } else if (scenario === 1) {
        const a = Math.floor(Math.random() * 5) + 3;
        const b = Math.floor(Math.random() * 5) + 3;
        const c = Math.floor(Math.random() * 5) + 3;
        currentGeoAnswer = a + b + c;
        if(probEl) probEl.innerHTML = `Φτιάχνουμε ένα μικρό παρτέρι με λουλούδια σε τριγωνικό σχήμα και θέλουμε να του βάλουμε ξύλινο φράχτη γύρω γύρω. Αν οι πλευρές είναι ${a}, ${b} και ${c} μέτρα, πόσα μέτρα φράχτη πρέπει να αγοράσουμε; (P = a + b + c)`;
    } else {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 2;
        const c = Math.floor(Math.random() * 5) + 2;
        currentGeoAnswer = a * b * c;
        if(probEl) probEl.innerHTML = `Θέλουμε να οργανώσουμε την ντουλάπα με κουτιά αποθήκευσης. Αν ένα κουτί έχει διαστάσεις ${a}, ${b}, ${c} μέτρα, ποιος είναι ο όγκος του; (V = a · b · c)`;
    }
};

window.checkTrigAnswer = function() {
    const ansEl = document.getElementById("trig-answer");
    if(!ansEl) return;
    const userAns = parseFloat(ansEl.value);
    const fbEl = document.getElementById("trig-feedback");
    
    if (isNaN(userAns)) {
        if(fbEl) { fbEl.innerText = "Βάλε αριθμό!"; fbEl.style.color = "#FFD60A"; }
        return;
    }
    
    if (userAns === currentTrigAnswer) {
        if(fbEl) { fbEl.innerText = "Σωστά! 🥳"; fbEl.style.color = "#32D74B"; }
        score += 15;
        userStats.correct++;
        userStats.played++;
        updateGameData();
        if(typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(window.generateTrigProblem, 1500);
    } else {
        if(fbEl) { fbEl.innerText = "Ουπς! Λάθος. Ξαναδοκίμασε."; fbEl.style.color = "#FF453A"; }
        userStats.wrong = (userStats.wrong || 0) + 1;
        userStats.played++;
        updateGameData();
    }
};

window.generateTrigProblem = function() {
    const probEl = document.getElementById("trig-problem");
    const inputEl = document.getElementById("trig-answer");
    const feedbackEl = document.getElementById("trig-feedback");
    
    if(inputEl) inputEl.value = "";
    if(feedbackEl) feedbackEl.innerText = "";
    
    const canvas = document.getElementById("trig-canvas");
    if(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a generic right triangle for trig
        ctx.strokeStyle = "#0A84FF";
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(10, 132, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(100, 200); // bottom left
        ctx.lineTo(300, 200); // bottom right
        ctx.lineTo(300, 50); // top right
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw right angle square
        ctx.strokeRect(280, 180, 20, 20);
    }
    
    const scenario = Math.floor(Math.random() * 2);
    if (scenario === 0) {
        const multiplier = Math.floor(Math.random() * 3) + 1;
        const a = 3 * multiplier;
        const b = 4 * multiplier;
        currentTrigAnswer = 5 * multiplier;
        if(probEl) probEl.innerHTML = `Ακουμπάμε μια σκάλα στον τοίχο για να κρεμάσουμε ένα κάδρο. Αν η βάση της σκάλας απέχει ${a} μέτρα από τον τοίχο και το ύψος μέχρι το κάδρο είναι ${b} μέτρα, τι μήκος πρέπει να έχει η σκάλα; (Πυθαγόρειο: c^2 = a^2 + b^2)`;
    } else {
        const opposite = Math.floor(Math.random() * 5) + 1;
        currentTrigAnswer = 2 * opposite;
        if(probEl) probEl.innerHTML = `Μια ξύλινη ράμπα στο κατώφλι του σπιτιού σχηματίζει γωνία 30 μοιρών με το έδαφος. Αν το ύψος του κατωφλιού (απέναντι πλευρά) είναι ${opposite} μέτρα, πόσο μήκος πρέπει να έχει η ράμπα (υποτείνουσα); (sin30 = 0.5, οπότε Υποτείνουσα = Απέναντι / 0.5)`;
    }
};

window.checkTopologyAnswer = function() {
    const ansEl = document.getElementById("topology-answer");
    if(!ansEl) return;
    const userAns = parseFloat(ansEl.value);
    const fbEl = document.getElementById("topology-feedback");
    
    if (isNaN(userAns)) {
        if(fbEl) { fbEl.innerText = "Βάλε αριθμό!"; fbEl.style.color = "#FFD60A"; }
        return;
    }
    
    if (userAns === currentTopologyAnswer) {
        if(fbEl) { fbEl.innerText = "Σωστά! 🥳"; fbEl.style.color = "#32D74B"; }
        score += 20;
        userStats.correct++;
        userStats.played++;
        updateGameData();
        if(typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(window.generateTopologyProblem, 1500);
    } else {
        if(fbEl) { fbEl.innerText = "Ουπς! Λάθος. Ξαναδοκίμασε."; fbEl.style.color = "#FF453A"; }
        userStats.wrong = (userStats.wrong || 0) + 1;
        userStats.played++;
        updateGameData();
    }
};

window.generateTopologyProblem = function() {
    const probEl = document.getElementById("topology-problem");
    const inputEl = document.getElementById("topology-answer");
    const feedbackEl = document.getElementById("topology-feedback");
    
    if(inputEl) inputEl.value = "";
    if(feedbackEl) feedbackEl.innerText = "";
    
    const canvas = document.getElementById("topology-canvas");
    if(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a generic graph (polyhedron planar projection)
        ctx.strokeStyle = "#32D74B"; // green for topology
        ctx.lineWidth = 3;
        ctx.fillStyle = "#32D74B";
        
        const nodes = [[200, 50], [100, 150], [300, 150], [150, 220], [250, 220]];
        const edges = [[0,1], [0,2], [1,2], [1,3], [2,4], [3,4], [1,4], [2,3]];
        
        ctx.beginPath();
        edges.forEach(e => {
            ctx.moveTo(nodes[e[0]][0], nodes[e[0]][1]);
            ctx.lineTo(nodes[e[1]][0], nodes[e[1]][1]);
        });
        ctx.stroke();
        
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n[0], n[1], 8, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    const V = Math.floor(Math.random() * 10) + 4; // Vertices
    const E = V + Math.floor(Math.random() * 10) + 2; // Edges
    currentTopologyAnswer = 2 - V + E;
    
    if(probEl) probEl.innerHTML = `Φτιάχνουμε μια χάρτινη κατασκευή origami. Αν η κατασκευή έχει ${V} γωνίες (κορυφές - V) και ${E} τσακίσεις (ακμές - E), πόσες επίπεδες επιφάνειες (έδρες - F) έχει; (Τύπος Euler: V - E + F = 2)`;
};

function updateStatsUI() {
 safeSetText("stats-played", userStats.played);
 safeSetText("stats-correct", userStats.correct);
 let rate = userStats.played >0 ? Math.round((userStats.correct / userStats.played) * 100) : 0;
 safeSetText("stats-rate", rate + "%");
}

function updateRank() {
 const t = translations[currentLang] || translations["el"];
 let title = t.rank1;
 if (score >= 600) title = t.rank4;
 else if (score >= 300) title = t.rank3;
 else if (score >= 100) title = t.rank2;
 safeSetText("user-rank", title);
 
 // Ενημέρωση του Profile Modal
 safeSetText("profile-rank", title);
 safeSetText("profile-xp", score);
 
 // Ενημέρωση των Badges
 const b1 = document.getElementById("badge-1");
 if (b1) {
 if (score >= 100) { b1.classList.remove("locked"); b1.title = "Ξεκλείδωτο: 100+ Πόντοι!"; } else { b1.classList.add("locked"); }
 }
 const b2 = document.getElementById("badge-2");
 if (b2) {
 if (score >= 300) { b2.classList.remove("locked"); b2.title = "Ξεκλείδωτο: 300+ Πόντοι!"; } else { b2.classList.add("locked"); }
 }
 const b3 = document.getElementById("badge-3");
 if (b3) {
 if (score >= 600) { b3.classList.remove("locked"); b3.title = "Ξεκλείδωτο: 600+ Πόντοι!"; } else { b3.classList.add("locked"); }
 }
 const b4 = document.getElementById("badge-4");
 if (b4) {
 if (score >= 1000) { b4.classList.remove("locked"); b4.title = "Ξεκλείδωτο: 1000+ Πόντοι!"; } else { b4.classList.add("locked"); }
 }

 // Υπολογισμός Progress Bar (έστω max 1000 XP)
 let progressEl = document.getElementById("profile-progress");
 if (progressEl) {
 let percent = Math.min((score / 1000) * 100, 100);
 progressEl.style.width = percent + "%";
 }
}

function showHelp() {
 const hb = document.getElementById("help-steps");
 if(hb) {
 hb.innerHTML = currentProblem.steps.map(s =>"• " + s).join("<br>");
 hb.classList.remove("hidden");
 }
}

function clearNotes() { 
 safeSetValue("user-notes", ""); 
 safeSetText("ai-response", ""); 
}
window.toggleStats = function() { updateStatsUI(); const sm = document.getElementById("stats-modal"); if(sm) sm.classList.toggle("hidden"); };
function skipProblem() { loadNextProblem(); }
function resetProgress() { localStorage.clear(); location.reload(); }
function insertSymbol(sym) { const input = document.getElementById(lastFocusedInput); if(input) { input.value += sym; input.focus(); } }
function toggleKeyboard() { const mk = document.getElementById("math-keyboard"); if(mk) mk.classList.toggle("hidden"); }

window.toggleChat = function() { const cm = document.getElementById("chat-modal"); if(cm) cm.classList.toggle("hidden"); };
window.toggleProfile = function() { const pm = document.getElementById("profile-modal"); if(pm) pm.classList.toggle("hidden"); };

window.switchTab = function(tabName) {
 const sections = {
  'algebra': document.getElementById("algebra-section"),
  'geometry': document.getElementById("geometry-section"),
  'trig': document.getElementById("trig-section"),
  'topology': document.getElementById("topology-section")
 };
 const tabs = {
  'algebra': document.getElementById("tab-algebra"),
  'geometry': document.getElementById("tab-geometry"),
  'trig': document.getElementById("tab-trig"),
  'topology': document.getElementById("tab-topology")
 };

 for (let key in sections) {
  if (sections[key]) sections[key].classList.add("hidden");
  if (tabs[key]) tabs[key].classList.remove("active");
 }

 if (sections[tabName]) sections[tabName].classList.remove("hidden");
 if (tabs[tabName]) tabs[tabName].classList.add("active");

 if (tabName === 'geometry' && !currentGeoAnswer) window.generateGeoProblem();
 if (tabName === 'trig' && !currentTrigAnswer) window.generateTrigProblem();
 if (tabName === 'topology' && !currentTopologyAnswer) window.generateTopologyProblem();
};

function sendCannedMessage() {
 const el = document.getElementById("canned-messages");
 if (!el) return;
 const selectedText = el.options[el.selectedIndex].text;
 if (window.sendChatMessage) {
 window.sendChatMessage(selectedText);
 } else {
 let msg = "Περίμενε να φορτώσει η σύνδεση! ";
 if (currentLang === 'en') msg = "Please wait for the connection! ";
 if (currentLang === 'fr') msg = "Veuillez patienter pour la connexion! ";
 if (currentLang === 'tr') msg = "Lütfen bağlantıyı bekleyin! ";
 alert(msg);
 }
}

async function askAI() {
 const notesEl = document.getElementById("user-notes");
 if(!notesEl) return;
 const notes = notesEl.value.trim();
 
 if (!notes) { safeSetText("ai-response", "Γράψε πρώτα κάτι στο πρόχειρο! "); return; }
 safeSetText("ai-response", "Η Catgebra σκέφτεται... ");
 
 try {
 const response = await fetch('/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: notes }) });
 const data = await response.json();
 safeSetText("ai-response", data.reply);
 } catch (error) {
 console.error("Σφάλμα AI:", error);
 safeSetText("ai-response", "Ουπς! Υπήρξε ένα μικρό πρόβλημα σύνδεσης. ");
 }
}

window.triggerCatSecret = function() {
 const secretsList = (window.michelleSecrets && window.michelleSecrets[currentLang]) ? window.michelleSecrets[currentLang] : window.michelleSecrets["el"];
 if (!secretsList || secretsList.length === 0) return;
 
 const randomSecret = secretsList[Math.floor(Math.random() * secretsList.length)];
 const modal = document.getElementById("secret-modal");
 const textEl = document.getElementById("secret-text");
 
 if (modal && textEl) {
 textEl.innerText = randomSecret;
 modal.style.display = "flex";
 } else {
 alert(randomSecret); 
 }
};

window.uploadAvatar = function(event) {
 const file = event.target.files[0];
 if (!file) return;

 const reader = new FileReader();
 reader.onload = function(e) {
 const base64Image = e.target.result;
 
 try {
 localStorage.setItem("userAvatar", base64Image);
 } catch (error) {
 console.error("Storage limit exceeded", error);
 alert("Η εικόνα είναι πολύ μεγάλη! Παρακαλώ διάλεξε μικρότερο αρχείο.");
 return;
 }

 const mainAvatar = document.getElementById("main-avatar");
 const profileAvatar = document.getElementById("profile-avatar");
 if (mainAvatar) mainAvatar.src = base64Image;
 if (profileAvatar) profileAvatar.src = base64Image;
 };
 reader.readAsDataURL(file);
};
