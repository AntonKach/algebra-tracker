let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator, sciCalculator;
let currentLang = "el"; 
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0 };
let lastFocusedInput = "answer";

// --- 1. ΔΕΔΟΜΕΝΑ ΕΠΙΠΕΔΩΝ (Αυτό έλειπε και έβγαζε λευκή οθόνη!) ---
const educationData = {
    "1": { title: { el: "Επίπεδο 1 (Απλές Εξισώσεις)", en: "Level 1 (Simple)", fr: "Niveau 1", tr: "Seviye 1" } },
    "2": { title: { el: "Επίπεδο 2 (X και στα 2 μέλη)", en: "Level 2 (Medium)", fr: "Niveau 2", tr: "Seviye 2" } },
    "3": { title: { el: "Επίπεδο 3 (Δευτεροβάθμιες)", en: "Level 3 (Hard)", fr: "Niveau 3", tr: "Seviye 3" } }
};

// --- 2. ΣΥΓΧΡΟΝΙΣΜΟΣ ΜΕ CLOUD (FIREBASE) ---
window.updateGameData = function(cloudScore, cloudStats) {
    if (cloudScore !== undefined) score = cloudScore;
    if (cloudStats !== undefined) userStats = cloudStats;
    
    document.getElementById("score").innerText = score;
    updateRank();
    if (typeof updateStatsUI === "function") updateStatsUI(); 
    
    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);
};

// --- 3. ΜΕΤΑΦΡΑΣΕΙΣ ---
const translations = {
    el: {
        lblLevel: "Επίπεδο Σπουδών:", lblScore: "Σκορ:", lblTime: "Χρόνος:",
        placeholderAns: "Απάντηση...", btnCheck: "Έλεγχος", btnHelp: "Βήμα-Βήμα", btnSkip: "Παράλειψη",
        lblNotes: "Πρόχειρο & Υπολογιστής 📝🧮", btnAI: "✨ Έλεγχος AI", placeholderNotes: "Γράψε εδώ τις σκέψεις σου...", btnClear: "🗑️ Καθαρισμός",
        lblGraph: "Γραφική Παράσταση 📈",
        btnReset: "Μηδενισμός", btnStats: "📊 Στατιστικά", modalTitle: "Τα Στατιστικά μου 📊",
        lblPlayed: "Λυμένες Ασκήσεις:", lblCorrect: "Σωστές:", lblRate: "Ποσοστό Επιτυχίας:", btnClose: "Κλείσιμο",
        lblAboutTitle: "Σχετικά με την Catgebra 🐾", 
        lblAboutText: "Η Catgebra δημιουργήθηκε για να κάνει την Άλγεβρα διασκεδαστική! Χρησιμοποίησε τα εργαλεία για να λύσεις τις εξισώσεις.",
        lblResources: "Πηγές Μελέτης 📚",
        stepWords: { move: "Μεταφέρουμε:", div: "Διαιρούμε:", sub: "Αφαιρούμε:", mult: "Πολλαπλασιάζουμε:" },
        catSuccess: ["Purr-fect! Βρήκες το x! 😻", "Meow-gnificent! 🐾", "Γατίσια αντανακλαστικά! 😼"],
        catError: ["Ουπς! Μήπως πάτησα το πληκτρολόγιο; 😿", "Μιάου... Κάτι δεν πήγε καλά. 🙀"]
    },
    en: {
        lblLevel: "Study Level:", lblScore: "Score:", lblTime: "Time:",
        placeholderAns: "Answer...", btnCheck: "Check", btnHelp: "Step-by-Step", btnSkip: "Skip",
        lblNotes: "Scratchpad & Calculator 📝🧮", btnAI: "✨ AI Check", placeholderNotes: "Write your thoughts...", btnClear: "🗑️ Clear",
        lblGraph: "Graph 📈",
        btnReset: "Reset", btnStats: "📊 Stats", modalTitle: "My Statistics 📊",
        lblPlayed: "Solved:", lblCorrect: "Correct:", lblRate: "Success Rate:", btnClose: "Close",
        lblAboutTitle: "About Catgebra 🐾", lblAboutText: "Catgebra makes Algebra fun!",
        lblResources: "Resources 📚",
        stepWords: { move: "Move:", div: "Divide:", sub: "Subtract:", mult: "Multiply:" },
        catSuccess: ["Purr-fect! You found x! 😻"], catError: ["Oops! Wrong answer. 😿"]
    }
};

// --- 4. ΑΡΧΙΚΟΠΟΙΗΣΗ ---
window.onload = function() {
    const savedScore = localStorage.getItem("mathScore");
    if (savedScore) score = parseInt(savedScore);
    
    sciCalculator = Desmos.ScientificCalculator(document.getElementById('scientific-calculator'), { invertedColors: true });
    calculator = Desmos.GraphingCalculator(document.getElementById('calculator'), { keypad: true, expressions: false, settingsMenu: false, invertedColors: true });

    document.getElementById("score").innerText = score;
    updateRank();
    
    document.getElementById("answer").addEventListener("focus", () => lastFocusedInput = "answer");
    document.getElementById("user-notes").addEventListener("focus", () => lastFocusedInput = "user-notes");

    changeLanguage(); 
    startTimer();     
};

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        let m = Math.floor(seconds/60), s = seconds%60;
        document.getElementById("timer").innerText = `${m}:${s<10?'0'+s:s}`;
    }, 1000);
}

// --- 5. ΔΙΑΧΕΙΡΙΣΗ ΓΛΩΣΣΑΣ ΚΑΙ ΕΠΙΠΕΔΩΝ ---
function populateGradeSelect() {
    const select = document.getElementById("grade-select");
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = "";
    for (const key in educationData) {
        let option = document.createElement("option");
        option.value = key;
        
        // Ασφαλής έλεγχος μετάφρασης (αν λείπει γλώσσα, βάζει Αγγλικά ή Ελληνικά)
        const tTitle = educationData[key].title[currentLang] || educationData[key].title["en"];
        option.text = tTitle;
        select.appendChild(option);
    }
    if (currentVal) select.value = currentVal;
}

function changeLanguage() {
    currentLang = document.getElementById("lang-select").value || "el";
    const t = translations[currentLang] || translations["en"];

    document.getElementById("lbl-level").innerText = t.lblLevel;
    document.getElementById("lbl-score").innerText = t.lblScore;
    document.getElementById("lbl-time").innerText = t.lblTime;
    document.getElementById("answer").placeholder = t.placeholderAns;
    document.getElementById("btn-check").innerText = t.btnCheck;
    document.getElementById("btn-help").innerText = t.btnHelp;
    document.getElementById("btn-skip").innerText = t.btnSkip;
    document.getElementById("lbl-notes").innerText = t.lblNotes;
    document.getElementById("btn-clear").innerText = t.btnClear;
    document.getElementById("user-notes").placeholder = t.placeholderNotes;
    document.getElementById("btn-reset").innerText = t.btnReset;
    document.getElementById("btn-stats").innerText = t.btnStats;
    document.getElementById("modal-title").innerText = t.modalTitle;
    document.getElementById("lbl-played").innerText = t.lblPlayed;
    document.getElementById("lbl-correct").innerText = t.lblCorrect;
    document.getElementById("lbl-rate").innerText = t.lblRate;
    document.getElementById("btn-close").innerText = t.btnClose;
    
    if (document.getElementById("btn-ai")) document.getElementById("btn-ai").innerText = t.btnAI;
    if (document.getElementById("lbl-graph")) document.getElementById("lbl-graph").innerText = t.lblGraph;
    if (document.getElementById("lbl-resources")) document.getElementById("lbl-resources").innerText = t.lblResources;
    if (document.getElementById("lbl-about-title")) document.getElementById("lbl-about-title").innerText = t.lblAboutTitle;
    if (document.getElementById("lbl-about-text")) document.getElementById("lbl-about-text").innerText = t.lblAboutText;

    populateGradeSelect();
    loadNextProblem();
}

function changeGrade() { 
    startTimer(); 
    loadNextProblem(); 
}

// --- 6. ΛΟΓΙΚΗ ΠΑΙΧΝΙΔΙΟΥ (ΑΣΚΗΣΕΙΣ) ---
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function loadNextProblem() {
    const gradeSelect = document.getElementById("grade-select");
    const words = translations[currentLang] ? translations[currentLang].stepWords : translations["en"].stepWords;
    let equationStr = "", correctAns = "", stepList = [];
    const level = gradeSelect ? parseInt(gradeSelect.value) : 1;

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
    } else {
        let r1 = getRandomInt(-5, 5), r2 = getRandomInt(-5, 5);
        let b = -(r1 + r2), c = r1 * r2;
        equationStr = `x² ${b>=0?'+':'-'} ${Math.abs(b)}x ${c>=0?'+':'-'} ${Math.abs(c)} = 0`;
        let roots = [r1, r2].sort((a,b) => a - b);
        correctAns = r1 === r2 ? r1.toString() : `${roots[0]},${roots[1]}`;
        stepList = [`Λύνουμε τη δευτεροβάθμια...`, `Ρίζες: ${correctAns}`];
    }

    currentProblem = { equation: equationStr, answer: correctAns, steps: stepList };
    document.getElementById("equation").innerHTML = equationStr.replace(/x²/g, "x²");
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-steps").classList.add("hidden");

    if (calculator) {
        calculator.setBlank();
        let latex = equationStr.replace('=', '-(') + ')';
        calculator.setExpression({ id: 'graph', latex: latex.replace(/x²/g, 'x^2'), color: '#bb86fc' });
    }
}

function checkAnswer() {
    let userAns = document.getElementById("answer").value.replace(/\s+/g, '').trim();
    let expected = currentProblem.answer;

    if (expected.includes(',') && userAns.includes(',')) {
        userAns = userAns.split(',').sort((a,b) => parseFloat(a) - parseFloat(b)).join(',');
        expected = expected.split(',').sort((a,b) => parseFloat(a) - parseFloat(b)).join(',');
    }

    userStats.played++; 
    const feedbackMsg = document.getElementById("feedback");
    const t = translations[currentLang] || translations["en"];

    if (userAns === expected) {
        userStats.correct++;
        score += 20;
        feedbackMsg.innerText = t.catSuccess[Math.floor(Math.random() * t.catSuccess.length)];
        
        // Ασφαλής κλήση εφέ (για να μην κρασάρει ο Safari)
        if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        try { new Audio('correct.mp3').play().catch(e => console.log("Audio muted by Safari")); } catch(e){}
        
        setTimeout(loadNextProblem, 2000);
    } else {
        feedbackMsg.innerText = t.catError[Math.floor(Math.random() * t.catError.length)];
        try { new Audio('fail.mp3').play().catch(e => console.log("Audio muted by Safari")); } catch(e){}
    }

    document.getElementById("score").innerText = score;
    updateRank();
    updateStatsUI();

    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);

    if (window.saveToCloud) window.saveToCloud(score, userStats);
}

// --- 7. UI & ΒΟΗΘΗΤΙΚΕΣ ΛΕΙΤΟΥΡΓΙΕΣ ---
function updateStatsUI() {
    if(!document.getElementById("stats-played")) return;
    document.getElementById("stats-played").innerText = userStats.played;
    document.getElementById("stats-correct").innerText = userStats.correct;
    let rate = userStats.played > 0 ? Math.round((userStats.correct / userStats.played) * 100) : 0;
    document.getElementById("stats-rate").innerText = rate + "%";
}

function updateRank() {
    const rankEl = document.getElementById("user-rank");
    if (!rankEl) return;
    if (score >= 600) rankEl.innerText = "🐅 Μαθηματικός Τίγρης";
    else if (score >= 300) rankEl.innerText = "🐆 Γρήγορος Λύγκας";
    else if (score >= 100) rankEl.innerText = "🐈 Έξυπνος Γάτος";
    else rankEl.innerText = "🐱 Αρχάριο Γατάκι";
}

function showHelp() {
    const hb = document.getElementById("help-steps");
    hb.innerHTML = currentProblem.steps.map(s => "• " + s).join("<br>");
    hb.classList.remove("hidden");
}

function clearNotes() { 
    document.getElementById("user-notes").value = ""; 
    if (document.getElementById("ai-response")) document.getElementById("ai-response").innerText = ""; 
}
function toggleStats() { updateStatsUI(); document.getElementById("stats-modal").classList.toggle("hidden"); }
function skipProblem() { loadNextProblem(); }
function resetProgress() { localStorage.clear(); location.reload(); }
function insertSymbol(sym) { const input = document.getElementById(lastFocusedInput); input.value += sym; input.focus(); }
function toggleKeyboard() { document.getElementById("math-keyboard").classList.toggle("hidden"); }

// --- 8. CHAT & AI ΛΕΙΤΟΥΡΓΙΕΣ (Επανήλθαν!) ---
function toggleChat() { 
    document.getElementById("chat-modal").classList.toggle("hidden"); 
}

function sendCannedMessage() {
    const msg = document.getElementById("canned-messages").value;
    if (window.sendChatMessage) {
        window.sendChatMessage(msg);
    } else {
        alert("Περίμενε να φορτώσει η σύνδεση! 🐾");
    }
}

async function askAI() {
    const notes = document.getElementById("user-notes").value.trim();
    const aiText = document.getElementById("ai-response");
    
    if (!notes) {
        aiText.innerText = "Γράψε πρώτα κάτι στο πρόχειρο για να το ελέγξω! 🐾";
        return;
    }

    aiText.innerText = "Η Catgebra σκέφτεται... 🧠🐾";
    
    try {
        const response = await fetch('/api/tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: notes })
        });
        
        const data = await response.json();
        aiText.innerText = data.reply;
    } catch (error) {
        console.error("Σφάλμα AI:", error);
        aiText.innerText = "Ουπς! Υπήρξε ένα μικρό πρόβλημα σύνδεσης. Δοκίμασε ξανά! 😿";
    }
}
