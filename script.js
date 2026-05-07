let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator, sciCalculator;
let currentLang = "el"; 
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0 };
let lastFocusedInput = "answer";

// --- 1. ΣΥΓΧΡΟΝΙΣΜΟΣ ΜΕ CLOUD (FIREBASE) ---
window.updateGameData = function(cloudScore, cloudStats) {
    console.log("🔄 Λήψη δεδομένων από το Cloud...");
    if (cloudScore !== undefined) score = cloudScore;
    if (cloudStats !== undefined) userStats = cloudStats;
    
    // Ενημέρωση οθόνης
    document.getElementById("score").innerText = score;
    updateRank();
    updateStatsUI(); // Ανανέωση των αριθμών στο modal
    
    // Αποθήκευση και τοπικά για ασφάλεια
    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);
};

// --- 2. ΜΕΤΑΦΡΑΣΕΙΣ ---
const translations = {
    el: {
        lblLevel: "Επίπεδο Σπουδών:", lblScore: "Σκορ:", lblTime: "Χρόνος:",
        placeholderAns: "Απάντηση...", btnCheck: "Έλεγχος", btnHelp: "Βήμα-Βήμα", btnSkip: "Παράλειψη",
        lblNotes: "Πρόχειρο & Υπολογιστής 📝🧮", btnAI: "✨ Έλεγχος AI", placeholderNotes: "Γράψε εδώ τις σκέψεις σου...", btnClear: "🗑️ Καθαρισμός",
        lblGraph: "Γραφική Παράσταση 📈",
        btnReset: "Μηδενισμός Προόδου", btnStats: "📊 Στατιστικά", modalTitle: "Τα Στατιστικά μου 📊",
        lblPlayed: "Λυμένες Ασκήσεις:", lblCorrect: "Σωστές Απαντήσεις:", lblRate: "Ποσοστό Επιτυχίας:", btnClose: "Κλείσιμο",
        lblAboutTitle: "Σχετικά με την Catgebra 🐾", 
        lblAboutText: "Η Catgebra δημιουργήθηκε για να κάνει την εκμάθηση της Άλγεβρας διασκεδαστική! Χρησιμοποίησε το ενσωματωμένο επιστημονικό κομπιουτεράκι για τις πράξεις σου, κράτα σημειώσεις στο πρόχειρο και λύσε τις εξισώσεις βήμα-βήμα.",
        lblResources: "Πηγές Μελέτης 📚",
        stepWords: { move: "Μεταφέρουμε:", div: "Διαιρούμε:", sub: "Αφαιρούμε:", mult: "Πολλαπλασιάζουμε:" },
        catSuccess: ["Purr-fect! Βρήκες το x! 😻", "Meow-gnificent! 🐾", "Γατίσια αντανακλαστικά! 😼"],
        catError: ["Ουπς! Μήπως πάτησα εγώ το πληκτρολόγιο; 😿", "Μιάου... Κάτι δεν πήγε καλά. 🙀"]
    },
    en: {
        lblLevel: "Study Level:", lblScore: "Score:", lblTime: "Time:",
        placeholderAns: "Answer...", btnCheck: "Check", btnHelp: "Step-by-Step", btnSkip: "Skip",
        lblNotes: "Scratchpad & Calculator 📝🧮", btnAI: "✨ AI Check", placeholderNotes: "Write your thoughts here...", btnClear: "🗑️ Clear",
        lblGraph: "Graph 📈",
        btnReset: "Reset Progress", btnStats: "📊 Stats", modalTitle: "My Statistics 📊",
        lblPlayed: "Solved:", lblCorrect: "Correct:", lblRate: "Success Rate:", btnClose: "Close",
        lblAboutTitle: "About Catgebra 🐾",
        lblAboutText: "Catgebra was created to make learning Algebra fun! Use the built-in scientific calculator, take notes in the scratchpad, and solve equations step-by-step.",
        lblResources: "Study Resources 📚",
        stepWords: { move: "Move:", div: "Divide:", sub: "Subtract:", mult: "Multiply:" },
        catSuccess: ["Purr-fect! You found x! 😻", "Meow-gnificent! 🐾", "Cat-like reflexes! 😼"],
        catError: ["Oops! Did I step on the keyboard? 😿", "Meow... Something's wrong. 🙀"]
    }
};

// --- 3. ΑΡΧΙΚΟΠΟΙΗΣΗ ---
window.onload = function() {
    const savedScore = localStorage.getItem("mathScore");
    if (savedScore) score = parseInt(savedScore);
    
    sciCalculator = Desmos.ScientificCalculator(document.getElementById('scientific-calculator'), { invertedColors: true });
    calculator = Desmos.GraphingCalculator(document.getElementById('calculator'), {
        keypad: true, expressions: false, settingsMenu: false, invertedColors: true
    });

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

function changeLanguage() {
    currentLang = document.getElementById("lang-select").value;
    const t = translations[currentLang];

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

    loadNextProblem();
}

// --- 4. ΛΟΓΙΚΗ ΠΑΙΧΝΙΔΙΟΥ ---
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function loadNextProblem() {
    const levelSelect = document.getElementById("level-select");
    const words = translations[currentLang].stepWords;
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

    calculator.setBlank();
    let latex = equationStr.replace('=', '-(') + ')';
    calculator.setExpression({ id: 'graph', latex: latex.replace(/x²/g, 'x^2'), color: '#bb86fc' });
}

function checkAnswer() {
    let userAns = document.getElementById("answer").value.replace(/\s+/g, '').trim();
    let expected = currentProblem.answer;

    if (expected.includes(',') && userAns.includes(',')) {
        userAns = userAns.split(',').sort((a,b) => parseFloat(a) - parseFloat(b)).join(',');
        expected = expected.split(',').sort((a,b) => parseFloat(a) - parseFloat(b)).join(',');
    }

    userStats.played++; 
    if (userAns === expected) {
        userStats.correct++;
        score += 20;
        const msgs = translations[currentLang].catSuccess;
        document.getElementById("feedback").innerText = msgs[Math.floor(Math.random() * msgs.length)];
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(loadNextProblem, 2000);
    } else {
        const errs = translations[currentLang].catError;
        document.getElementById("feedback").innerText = errs[Math.floor(Math.random() * errs.length)];
    }

    document.getElementById("score").innerText = score;
    updateRank();
    updateStatsUI();

    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);

    if (window.saveToCloud) window.saveToCloud(score, userStats);
}

// --- 5. ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ---
function updateStatsUI() {
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

function clearNotes() { document.getElementById("user-notes").value = ""; document.getElementById("ai-response").innerText = ""; }
function toggleStats() { updateStatsUI(); document.getElementById("stats-modal").classList.toggle("hidden"); }
function skipProblem() { loadNextProblem(); }
function resetProgress() { localStorage.clear(); location.reload(); }
function insertSymbol(sym) { const input = document.getElementById(lastFocusedInput); input.value += sym; input.focus(); }
