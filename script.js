let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator, sciCalculator;
let currentLang = "el"; 
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0 };
let lastFocusedInput = "answer";
let currentPhysicsAnswer = 0;

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
};

const translations = {
    el: {
        mainTitle: "Catgebra 🐈🧮", btnLogin: "☁️ Σύνδεση με Google",
        lblLevel: "Επίπεδο Σπουδών:", lblSelectLevel: "Δυσκολία:", 
        optLevel1: "Επίπεδο 1: Γατάκι (ax + b = c)", optLevel2: "Επίπεδο 2: Γάτος (ax + b = cx + d)", optLevel3: "Επίπεδο 3: Τίγρης (Δευτεροβάθμιες)", optLevel4: "Επίπεδο 4: Λιοντάρι (Κλάσματα & Παρενθέσεις)",
        lblScore: "Σκορ:", lblTime: "Χρόνος:", btnSecret: "💡 Μυστικό!", btnChatToggle: "💬 Chat",
        placeholderAns: "Απάντηση...", kbdToggleTitle: "Εμφάνιση Μαθηματικού Πληκτρολογίου",
        btnCheck: "Έλεγχος", btnHelp: "Βήμα-Βήμα", btnSkip: "Παράλειψη",
        lblNotes: "Πρόχειρο & Υπολογιστής 📝🧮", btnAI: "✨ Έλεγχος AI", placeholderNotes: "Γράψε εδώ τις σκέψεις σου...", btnClear: "🗑️ Καθαρισμός",
        lblGraph: "Γραφική Παράσταση 📈",
        btnReset: "Μηδενισμός", btnStats: "📊 Στατιστικά", modalTitle: "Τα Στατιστικά μου 📊",
        lblPlayed: "Λυμένες Ασκήσεις:", lblCorrect: "Σωστές:", lblRate: "Ποσοστό Επιτυχίας:", btnClose: "Κλείσιμο",
        lblAboutTitle: "Σχετικά με την Catgebra 🐾", 
        lblAboutText: "Η Catgebra δημιουργήθηκε για να κάνει την Άλγεβρα διασκεδαστική!",
        lblResources: "Πηγές Μελέτης 📚",
        chatTitle: "Γατό-Chat 💬🐾", chatMsgPlaceholder: "Συνδέσου με Google για να δεις τα μηνύματα!",
        can1: "Γεια σε όλους! 🐾", can2: "Αυτή η άσκηση με δυσκόλεψε! 🙀", can3: "Μόλις ανέβηκα κατηγορία! 🏆",
        btnChatSend: "Αποστολή 📩", btnChatClose: "Κλείσιμο",
        secretModalTitle: "💡 Το Μυστικό της Μισέλ!", btnSecretClose: "Τέλεια! 🐾",
        rank1: "🐱 Αρχάριο Γατάκι", rank2: "🐈 Έξυπνος Γάτος", rank3: "🐆 Γρήγορος Λύγκας", rank4: "🐅 Μαθηματικός Τίγρης",
        stepWords: { move: "Μεταφέρουμε:", div: "Διαιρούμε:", sub: "Αφαιρούμε:", mult: "Πολλαπλασιάζουμε:" },
        catSuccess: ["Purr-fect! Βρήκες το x! 😻", "Meow-gnificent! 🐾", "Γατίσια αντανακλαστικά! 😼"],
        catError: ["Ουπς! Μήπως πάτησα το πληκτρολόγιο; 😿", "Μιάου... Κάτι δεν πήγε καλά. 🙀"],
        secrets: [
            "💡 Το ήξερες; Το σύμβολο του ίσον (=) εφευρέθηκε το 1557 επειδή ένας μαθηματικός βαρέθηκε να γράφει συνέχεια 'είναι ίσο με'!",
            "🐾 Οι γάτες έχουν 32 μύες σε κάθε αυτί. Μπορώ να ακούσω κάθε λάθος πράξη σου! 😼",
            "💡 Ο αριθμός μηδέν (0) ανακαλύφθηκε στην Ινδία γύρω στον 5ο αιώνα. Πριν από αυτό, απλά άφηναν ένα κενό!",
            "🐾 Meow! Αν πολλαπλασιάσεις το 111.111.111 με τον εαυτό του, βγάζει 12345678987654321! 🤯",
            "💡 Όπως ακριβώς και στις εξισώσεις, έτσι και στη ζωή: ό,τι κάνεις στη μία πλευρά, πρέπει να το κάνεις και στην άλλη για να υπάρχει ισορροπία! ⚖️",
            "🐾 Η μύτη κάθε γάτας είναι μοναδική, σαν το ανθρώπινο δακτυλικό αποτύπωμα. Το ίδιο μοναδική είναι και η λύση μιας εξίσωσης!",
            "🐾 Αν προσπαθήσεις να διαιρέσεις με το μηδέν, το σύμπαν θα γεμίσει τριχόμπαλες! 🙀",
            "💡 Η αγαπημένη μου εξίσωση είναι: E = mc^meow 🐈",
            "🐾 Οι γάτες προσγειώνονται πάντα στα 4, ακριβώς όπως το x σε μια τέλεια εξίσωση! 🐾",
            "💡 Ποτέ μην ξεχνάς το πλην (-). Είναι σαν να ξεχνάς να με ταΐσεις. Καταστροφή! 😿",
            "🐾 Το ΕΚΠ δεν σημαίνει Εξαιρετικά Κομψός Πάνθηρας. Ελάχιστο Κοινό Πολλαπλάσιο είναι! 🐆"
        ]
    },
    en: {
        mainTitle: "Catgebra 🐈🧮", btnLogin: "☁️ Login with Google",
        lblLevel: "Study Level:", lblSelectLevel: "Difficulty:",
        optLevel1: "Level 1: Kitten (ax + b = c)", optLevel2: "Level 2: Cat (ax + b = cx + d)", optLevel3: "Level 3: Tiger (Quadratics)", optLevel4: "Level 4: Lion (Fractions & Parentheses)",
        lblScore: "Score:", lblTime: "Time:", btnSecret: "💡 Secret!", btnChatToggle: "💬 Chat",
        placeholderAns: "Answer...", kbdToggleTitle: "Show Math Keyboard",
        btnCheck: "Check", btnHelp: "Step-by-Step", btnSkip: "Skip",
        lblNotes: "Scratchpad & Calculator 📝🧮", btnAI: "✨ AI Check", placeholderNotes: "Write your thoughts...", btnClear: "🗑️ Clear",
        lblGraph: "Graph 📈",
        btnReset: "Reset", btnStats: "📊 Stats", modalTitle: "My Statistics 📊",
        lblPlayed: "Solved:", lblCorrect: "Correct:", lblRate: "Success Rate:", btnClose: "Close",
        lblAboutTitle: "About Catgebra 🐾", lblAboutText: "Catgebra makes Algebra fun!",
        lblResources: "Resources 📚",
        chatTitle: "Cat-Chat 💬🐾", chatMsgPlaceholder: "Login with Google to see messages!",
        can1: "Hello everyone! 🐾", can2: "This problem was hard! 🙀", can3: "I just leveled up! 🏆",
        btnChatSend: "Send 📩", btnChatClose: "Close",
        secretModalTitle: "💡 Michelle's Secret!", btnSecretClose: "Purrfect! 🐾",
        rank1: "🐱 Beginner Kitten", rank2: "🐈 Smart Cat", rank3: "🐆 Fast Lynx", rank4: "🐅 Math Tiger",
        stepWords: { move: "Move:", div: "Divide:", sub: "Subtract:", mult: "Multiply:" },
        catSuccess: ["Purr-fect! You found x! 😻"], catError: ["Oops! Wrong answer. 😿"],
        secrets: [
            "💡 Did you know? The equals sign (=) was invented in 1557 because a mathematician got tired of writing 'is equal to'!",
            "🐾 Cats have 32 muscles in each ear. I can hear every calculation mistake you make! 😼",
            "💡 The number zero (0) was discovered in India around the 5th century. Before that, they just left a blank space!",
            "🐾 Meow! If you multiply 111,111,111 by itself, you get 12345678987654321! 🤯",
            "💡 Just like in equations, in life: whatever you do to one side, you must do to the other to keep balance! ⚖️",
            "🐾 A cat's nose pad is unique, just like a human fingerprint. And just as unique as the solution to an equation!",
            "🐾 If you try to divide by zero, the universe will fill with hairballs! 🙀",
            "💡 My favorite equation is: E = mc^meow 🐈",
            "🐾 Cats always land on all 4s, just like x in a perfect equation! 🐾",
            "💡 Never forget the minus sign (-). It's like forgetting to feed me. A disaster! 😿",
            "🐾 LCM does not stand for Large Cat Meowing. It's Least Common Multiple! 🐆"
        ]
    },
    fr: {
        mainTitle: "Catgebra 🐈🧮", btnLogin: "☁️ Se connecter avec Google",
        lblLevel: "Niveau d'étude:", lblSelectLevel: "Difficulté:",
        optLevel1: "Niveau 1: Chaton (ax + b = c)", optLevel2: "Niveau 2: Chat (ax + b = cx + d)", optLevel3: "Niveau 3: Tigre (Second degré)", optLevel4: "Niveau 4 : Lion (Fractions et Parenthèses)",
        lblScore: "Score:", lblTime: "Temps:", btnSecret: "💡 Secret!", btnChatToggle: "💬 Chat",
        placeholderAns: "Réponse...", kbdToggleTitle: "Afficher le clavier mathématique",
        btnCheck: "Vérifier", btnHelp: "Étape par étape", btnSkip: "Passer",
        lblNotes: "Brouillon & Calculatrice 📝🧮", btnAI: "✨ Vérification IA", placeholderNotes: "Écris tes pensées ici...", btnClear: "🗑️ Effacer",
        lblGraph: "Graphique 📈",
        btnReset: "Réinitialiser", btnStats: "📊 Stats", modalTitle: "Mes Statistiques 📊",
        lblPlayed: "Résolus:", lblCorrect: "Corrects:", lblRate: "Taux de réussite:", btnClose: "Fermer",
        lblAboutTitle: "À propos de Catgebra 🐾", lblAboutText: "Catgebra a été créé pour rendre l'Algèbre amusante!",
        lblResources: "Ressources 📚",
        chatTitle: "Cat-Chat 💬🐾", chatMsgPlaceholder: "Connecte-toi avec Google pour voir les messages!",
        can1: "Salut tout le monde! 🐾", can2: "Cet exercice était difficile! 🙀", can3: "Je viens de monter de niveau! 🏆",
        btnChatSend: "Envoyer 📩", btnChatClose: "Fermer",
        secretModalTitle: "💡 Le Secret de Michelle!", btnSecretClose: "Parfait! 🐾",
        rank1: "🐱 Chaton Débutant", rank2: "🐈 Chat Intelligent", rank3: "🐆 Lynx Rapide", rank4: "🐅 Tigre Math.",
        stepWords: { move: "On déplace:", div: "On divise:", sub: "On soustrait:", mult: "On multiplie:" },
        catSuccess: ["Purr-fect! Tu as trouvé x! 😻"], catError: ["Oups! Mauvaise réponse. 😿"],
        secrets: [
            "💡 Le savais-tu ? Le signe égal (=) a été inventé en 1557 parce qu'un mathématicien en avait marre d'écrire 'est égal à' !",
            "🐾 Les chats ont 32 muscles dans chaque oreille. Je peux entendre toutes tes erreurs de calcul ! 😼",
            "💡 Le chiffre zéro (0) a été découvert en Inde vers le Ve siècle. Avant cela, on laissait simplement un espace vide !",
            "🐾 Miaou ! Si tu multiplies 111 111 111 par lui-même, tu obtiens 12345678987654321 ! 🤯",
            "💡 Tout comme dans les équations, dans la vie : ce que tu fais d'un côté, tu dois le faire de l'autre pour garder l'équilibre ! ⚖️",
            "🐾 La truffe d'un chat est unique, comme une empreinte digitale humaine. Tout aussi unique que la solution d'une équation !",
            "🐾 Si tu essaies de diviser par zéro, l'univers se remplira de boules de poils ! 🙀",
            "💡 Mon équation préférée est : E = mc^meow 🐈",
            "🐾 Les chats retombent toujours sur leurs 4 pattes, tout comme x dans une équation parfaite ! 🐾",
            "💡 N'oublie jamais le signe moins (-). C'est comme oublier de me nourrir. Une catastrophe ! 😿",
            "🐾 Le PPCM ne signifie pas Petit Puma Très Mignon. C'est le Plus Petit Commun Multiple ! 🐆"
        ]
    },
    tr: {
        mainTitle: "Catgebra 🐈🧮", btnLogin: "☁️ Google ile Giriş",
        lblLevel: "Eğitim Seviyesi:", lblSelectLevel: "Zorluk:",
        optLevel1: "Seviye 1: Yavru Kedi (ax + b = c)", optLevel2: "Seviye 2: Kedi (ax + b = cx + d)", optLevel3: "Seviye 3: Kaplan (İkinci Dereceden)", optLevel4: "Seviye 4: Aslan (Kesirler ve Parantezler)",
        lblScore: "Puan:", lblTime: "Zaman:", btnSecret: "💡 Sır!", btnChatToggle: "💬 Sohbet",
        placeholderAns: "Cevap...", kbdToggleTitle: "Matematik Klavyesini Göster",
        btnCheck: "Kontrol", btnHelp: "Adım Adım", btnSkip: "Geç",
        lblNotes: "Karalama Defteri 📝🧮", btnAI: "✨ AI Kontrolü", placeholderNotes: "Düşüncelerini yaz...", btnClear: "🗑️ Temizle",
        lblGraph: "Grafik 📈",
        btnReset: "Sıfırla", btnStats: "📊 İstatistikler", modalTitle: "İstatistiklerim 📊",
        lblPlayed: "Çözülen:", lblCorrect: "Doğru:", lblRate: "Başarı Oranı:", btnClose: "Kapat",
        lblAboutTitle: "Catgebra Hakkında 🐾", lblAboutText: "Catgebra matematiği eğlenceli hale getirir!",
        lblResources: "Kaynaklar 📚",
        chatTitle: "Kedi Sohbeti 💬🐾", chatMsgPlaceholder: "Mesajları görmek için giriş yapın!",
        can1: "Herkese merhaba! 🐾", can2: "Bu çok zordu! 🙀", can3: "Seviye atladım! 🏆",
        btnChatSend: "Gönder 📩", btnChatClose: "Kapat",
        secretModalTitle: "💡 Michelle'in Sırrı!", btnSecretClose: "Mükemmel! 🐾",
        rank1: "🐱 Acemi Yavru Kedi", rank2: "🐈 Akıllı Kedi", rank3: "🐆 Hızlı Vaşak", rank4: "🐅 Matematik Kaplanı",
        stepWords: { move: "Taşıyoruz:", div: "Bölüyoruz:", sub: "Çıkarıyoruz:", mult: "Çarpıyoruz:" },
        catSuccess: ["Purr-fect! x'i buldun! 😻"], catError: ["Oops! Yanlış cevap. 😿"],
        secrets: [
            "💡 Biliyor muydun? Eşittir işareti (=) 1557'de icat edildi!",
            "🐾 Kedilerin her kulağında 32 kas vardır. Yaptığın her hatayı duyabilirim! 😼",
            "💡 Sıfır (0) sayısı 5. yüzyılda Hindistan'da keşfedildi!",
            "🐾 Miyav! 111.111.111'i kendisiyle çarparsan 12345678987654321 elde edersin! 🤯",
            "💡 Hayatta dengeyi korumak için bir tarafa ne yaparsan diğerine de aynısını yapmalısın! ⚖️",
            "🐾 Bir kedinin burnu insan parmak izi gibi benzersizdir!",
            "🐾 Sıfıra bölmeye çalışırsan, evren tüy yumaklarıyla dolar! 🙀",
            "💡 En sevdiğim denklem: E = mc^miyav 🐈",
            "🐾 Kediler her zaman 4 ayak üstüne düşer, tıpkı mükemmel bir denklemdeki x gibi! 🐾",
            "💡 Eksi (-) işaretini asla unutma. Beni beslemeyi unutmak gibidir. Gerçek bir felaket! 😿",
            "🐾 EKOK, Ekstra Komik Orman Kedisi demek değildir. En Küçük Ortak Kat demektir! 🐆"
        ]
    }
};

window.onload = function() {
    try {
        const savedScore = localStorage.getItem("mathScore");
        if (savedScore) score = parseInt(savedScore);
        
        const sciEl = document.getElementById('scientific-calculator');
        if (sciEl && typeof Desmos !== 'undefined') sciCalculator = Desmos.ScientificCalculator(sciEl, { invertedColors: true });
        
        const calcEl = document.getElementById('calculator');
        if (calcEl && typeof Desmos !== 'undefined') calculator = Desmos.GraphingCalculator(calcEl, { keypad: true, expressions: false, settingsMenu: false, invertedColors: true });

        safeSetText("score", score);
        updateRank();
        
        const ansEl = document.getElementById("answer");
        if (ansEl) ansEl.addEventListener("focus", () => lastFocusedInput = "answer");
        
        const notesEl = document.getElementById("user-notes");
        if (notesEl) notesEl.addEventListener("focus", () => lastFocusedInput = "user-notes");

        changeLanguage(); 
        startTimer();     
    } catch (e) { console.error("OnLoad Error:", e); }
};

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() => {
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

    updateRank();
    populateGradeSelect();
    loadNextProblem();
}

function changeGrade() { startTimer(); loadNextProblem(); }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function loadNextProblem() {
    try {
        const levelSelect = document.getElementById("level-select");
        const words = translations[currentLang] ? translations[currentLang].stepWords : translations["el"].stepWords;
        let equationStr = "", correctAns = "", stepList = [];
        const level = levelSelect ? parseInt(levelSelect.value) : 1;

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
            let roots = [r1, r2].sort((a,b) => a - b);
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

        currentProblem = { equation: equationStr, answer: correctAns, steps: stepList };
        safeSetHTML("equation", equationStr.replace(/x²/g, "x²"));
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
        userAns = userAns.split(',').sort((a,b) => parseFloat(a) - parseFloat(b)).join(',');
        expected = expected.split(',').sort((a,b) => parseFloat(a) - parseFloat(b)).join(',');
    }

    userStats.played++; 
    const t = translations[currentLang] || translations["el"];

    if (userAns === expected) {
        userStats.correct++;
        score += 20;
        safeSetText("feedback", t.catSuccess[Math.floor(Math.random() * t.catSuccess.length)]);
        
        if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        try { new Audio('correct.mp3').play().catch(()=>{}); } catch(e){}
        setTimeout(loadNextProblem, 2000);
    } else {
        safeSetText("feedback", t.catError[Math.floor(Math.random() * t.catError.length)]);
        try { new Audio('fail.mp3').play().catch(()=>{}); } catch(e){}
    }

    safeSetText("score", score);
    updateRank();
    updateStatsUI();

    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);

    if (window.saveToCloud) window.saveToCloud(score, userStats);
}

window.checkPhysicsAnswer = function() {
    const ansEl = document.getElementById("physics-answer");
    if(!ansEl) return;
    
    const userAns = parseFloat(ansEl.value);
    
    if (isNaN(userAns)) {
        safeSetText("physics-feedback", "Παρακαλώ βάλε έναν αριθμό! 🐾");
        document.getElementById("physics-feedback").style.color = "#FFC107";
        return;
    }
    
    if (userAns === currentPhysicsAnswer) {
        safeSetText("physics-feedback", "Μπράβο! Σωστή απάντηση! 🎉");
        document.getElementById("physics-feedback").style.color = "#4CAF50";
        triggerConfetti();
        
        score += 10;
        userStats.correct++;
        userStats.played++;
        
        updateRank();
        updateStatsUI();
        updateGameData();
    } else {
        safeSetText("physics-feedback", "Ουπς! Προσπάθησε ξανά. Δεν πειράζει! 🐱");
        document.getElementById("physics-feedback").style.color = "#cf6679";
        
        userStats.wrong++;
        userStats.played++;
        updateStatsUI();
        updateGameData();
    }
};

window.generatePhysicsProblem = function() {
    const level = document.getElementById("physics-level-select").value;
    const problemEl = document.getElementById("physics-problem");
    const inputEl = document.getElementById("physics-answer");
    const feedbackEl = document.getElementById("physics-feedback");
    
    if (inputEl) inputEl.value = "";
    if (feedbackEl) feedbackEl.innerText = "";

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    let scenarios = [];
    let text = "";

    if (level === "1") {
        // v = s / t
        let t = rand(2, 10);
        let v = rand(2, 12);
        let s = v * t; 
        currentPhysicsAnswer = v;
        scenarios = [
            `Η Μισέλ τρέχει να πιάσει το κόκκινο λέιζερ! Διανύει ${s} μέτρα σε ${t} δευτερόλεπτα. Ποια είναι η ταχύτητά της; (v = s / t)`,
            `Ένα ρομποτικό ποντίκι διασχίζει το σαλόνι (${s} μέτρα) σε ${t} δευτερόλεπτα. Με τι ταχύτητα κινείται;`,
            `Η Μισέλ άκουσε τον ήχο της κονσέρβας! Έτρεξε ${s} μέτρα σε ${t} δευτερόλεπτα. Βρες την ταχύτητά της.`
        ];
    } else if (level === "2") {
        // s = v * t
        let v = rand(2, 8);
        let t = rand(3, 10);
        let s = v * t;
        currentPhysicsAnswer = s;
        scenarios = [
            `Η Μισέλ τρέχει σταθερά με ταχύτητα ${v} m/s για ${t} δευτερόλεπτα κυνηγώντας μια πεταλούδα. Πόσα μέτρα διένυσε; (s = v * t)`,
            `Ο Άντον περπατάει με ${v} m/s για ${t} δευτερόλεπτα για να πάρει τον καφέ του. Τι απόσταση κάλυψε;`,
            `Ένα πουλί πετάει με ταχύτητα ${v} m/s για ${t} δευτερόλεπτα και η Μισέλ το κοιτάζει από το παράθυρο. Πόση απόσταση διένυσε το πουλί;`
        ];
    } else if (level === "3") {
        // t = s / v
        let t = rand(2, 10);
        let v = rand(2, 10);
        let s = v * t;
        currentPhysicsAnswer = t;
        scenarios = [
            `Η απόσταση μέχρι το μπολ με το φαγητό είναι ${s} μέτρα. Αν η Μισέλ τρέχει με ταχύτητα ${v} m/s, σε πόσα δευτερόλεπτα θα φτάσει; (t = s / v)`,
            `Ο Άντον έχει να διανύσει ${s} μέτρα μέχρι το γραφείο του. Περπατάει με ταχύτητα ${v} m/s. Πόσο χρόνο θα κάνει;`,
            `Η Μισέλ περπατάει στον διάδρομο μήκους ${s} μέτρων με ταχύτητα ${v} m/s. Σε πόσα δευτερόλεπτα θα τον διασχίσει;`
        ];
    }
    
    text = scenarios[Math.floor(Math.random() * scenarios.length)];
    if (problemEl) problemEl.innerText = text;
};

function updateStatsUI() {
    safeSetText("stats-played", userStats.played);
    safeSetText("stats-correct", userStats.correct);
    let rate = userStats.played > 0 ? Math.round((userStats.correct / userStats.played) * 100) : 0;
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
        hb.innerHTML = currentProblem.steps.map(s => "• " + s).join("<br>");
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
    const mathSection = document.getElementById("math-section");
    const physicsSection = document.getElementById("physics-section");
    const tabMath = document.getElementById("tab-math");
    const tabPhysics = document.getElementById("tab-physics");

    if (tabName === 'math') {
        if(mathSection) mathSection.classList.remove("hidden");
        if(physicsSection) physicsSection.classList.add("hidden");
        if(tabMath) tabMath.classList.add("active");
        if(tabPhysics) tabPhysics.classList.remove("active");
    } else {
        if(mathSection) mathSection.classList.add("hidden");
        if(physicsSection) physicsSection.classList.remove("hidden");
        if(tabMath) tabMath.classList.remove("active");
        if(tabPhysics) tabPhysics.classList.add("active");
    }
};

function sendCannedMessage() {
    const el = document.getElementById("canned-messages");
    if (!el) return;
    const selectedText = el.options[el.selectedIndex].text;
    if (window.sendChatMessage) {
        window.sendChatMessage(selectedText);
    } else {
        let msg = "Περίμενε να φορτώσει η σύνδεση! 🐾";
        if (currentLang === 'en') msg = "Please wait for the connection! 🐾";
        if (currentLang === 'fr') msg = "Veuillez patienter pour la connexion! 🐾";
        if (currentLang === 'tr') msg = "Lütfen bağlantıyı bekleyin! 🐾";
        alert(msg);
    }
}

async function askAI() {
    const notesEl = document.getElementById("user-notes");
    if(!notesEl) return;
    const notes = notesEl.value.trim();
    
    if (!notes) { safeSetText("ai-response", "Γράψε πρώτα κάτι στο πρόχειρο! 🐾"); return; }
    safeSetText("ai-response", "Η Catgebra σκέφτεται... 🧠🐾");
    
    try {
        const response = await fetch('/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: notes }) });
        const data = await response.json();
        safeSetText("ai-response", data.reply);
    } catch (error) {
        console.error("Σφάλμα AI:", error);
        safeSetText("ai-response", "Ουπς! Υπήρξε ένα μικρό πρόβλημα σύνδεσης. 😿");
    }
}

window.triggerCatSecret = function() {
    const t = translations[currentLang] || translations["el"];
    const secrets = t.secrets;
    const randomSecret = secrets[Math.floor(Math.random() * secrets.length)];
    const modal = document.getElementById("secret-modal");
    const textEl = document.getElementById("secret-text");
    
    if (modal && textEl) {
        textEl.innerText = randomSecret;
        modal.style.display = "flex";
    } else {
        alert(randomSecret); 
    }
};
