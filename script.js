let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator, sciCalculator;
let currentLang = "el"; 
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0 };
let lastFocusedInput = "answer";

if (typeof educationData === 'undefined') {
    window.educationData = {
        "gym_a": { title: { el: "Α' Γυμνασίου", en: "7th Grade", fr: "5e", tr: "7. Sınıf" } },
        "gym_b": { title: { el: "Β' Γυμνασίου", en: "8th Grade", fr: "4e", tr: "8. Sınıf" } },
        "gym_c": { title: { el: "Γ' Γυμνασίου", en: "9th Grade", fr: "3e", tr: "9. Sınıf" } },
        "lyc_a": { title: { el: "Α' Λυκείου", en: "10th Grade", fr: "2de", tr: "10. Sınıf" } }
    };
}

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΑΣΦΑΛΕΙΑΣ (Αποτρέπουν τα κρασαρίσματα!) ---
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
        lblLevel: "Επίπεδο Σπουδών:", lblScore: "Σκορ:", lblTime: "Χρόνος:",
        placeholderAns: "Απάντηση...", btnCheck: "Έλεγχος", btnHelp: "Βήμα-Βήμα", btnSkip: "Παράλειψη",
        lblNotes: "Πρόχειρο & Υπολογιστής 📝🧮", btnAI: "✨ Έλεγχος AI", placeholderNotes: "Γράψε εδώ τις σκέψεις σου...", btnClear: "🗑️ Καθαρισμός",
        lblGraph: "Γραφική Παράσταση 📈",
        btnReset: "Μηδενισμός", btnStats: "📊 Στατιστικά", modalTitle: "Τα Στατιστικά μου 📊",
        lblPlayed: "Λυμένες Ασκήσεις:", lblCorrect: "Σωστές:", lblRate: "Ποσοστό Επιτυχίας:", btnClose: "Κλείσιμο",
        lblAboutTitle: "Σχετικά με την Catgebra 🐾", 
        lblAboutText: "Η Catgebra δημιουργήθηκε για να κάνει την Άλγεβρα διασκεδαστική!",
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

    safeSetText("lbl-level", t.lblLevel);
    safeSetText("lbl-score", t.lblScore);
    safeSetText("lbl-time", t.lblTime);
    safeSetPlaceholder("answer", t.placeholderAns);
    safeSetText("btn-check", t.btnCheck);
    safeSetText("btn-help", t.btnHelp);
    safeSetText("btn-skip", t.btnSkip);
    safeSetText("lbl-notes", t.lblNotes);
    safeSetText("btn-clear", t.btnClear);
    safeSetPlaceholder("user-notes", t.placeholderNotes);
    safeSetText("btn-reset", t.btnReset);
    safeSetText("btn-stats", t.btnStats);
    safeSetText("modal-title", t.modalTitle);
    safeSetText("lbl-played", t.lblPlayed);
    safeSetText("lbl-correct", t.lblCorrect);
    safeSetText("lbl-rate", t.lblRate);
    safeSetText("btn-close", t.btnClose);
    
    safeSetText("btn-ai", t.btnAI);
    safeSetText("lbl-graph", t.lblGraph);
    safeSetText("lbl-resources", t.lblResources);
    safeSetText("lbl-about-title", t.lblAboutTitle);
    safeSetText("lbl-about-text", t.lblAboutText);

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
        } else {
            let r1 = getRandomInt(-5, 5), r2 = getRandomInt(-5, 5);
            let b = -(r1 + r2), c = r1 * r2;
            equationStr = `x² ${b>=0?'+':'-'} ${Math.abs(b)}x ${c>=0?'+':'-'} ${Math.abs(c)} = 0`;
            let roots = [r1, r2].sort((a,b) => a - b);
            correctAns = r1 === r2 ? r1.toString() : `${roots[0]},${roots[1]}`;
            stepList = [`Λύνουμε τη δευτεροβάθμια...`, `Ρίζες: ${correctAns}`];
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

function updateStatsUI() {
    safeSetText("stats-played", userStats.played);
    safeSetText("stats-correct", userStats.correct);
    let rate = userStats.played > 0 ? Math.round((userStats.correct / userStats.played) * 100) : 0;
    safeSetText("stats-rate", rate + "%");
}

function updateRank() {
    let title = "🐱 Αρχάριο Γατάκι";
    if (score >= 600) title = "🐅 Μαθηματικός Τίγρης";
    else if (score >= 300) title = "🐆 Γρήγορος Λύγκας";
    else if (score >= 100) title = "🐈 Έξυπνος Γάτος";
    safeSetText("user-rank", title);
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
function toggleStats() { updateStatsUI(); const sm = document.getElementById("stats-modal"); if(sm) sm.classList.toggle("hidden"); }
function skipProblem() { loadNextProblem(); }
function resetProgress() { localStorage.clear(); location.reload(); }
function insertSymbol(sym) { const input = document.getElementById(lastFocusedInput); if(input) { input.value += sym; input.focus(); } }
function toggleKeyboard() { const mk = document.getElementById("math-keyboard"); if(mk) mk.classList.toggle("hidden"); }

function toggleChat() { const cm = document.getElementById("chat-modal"); if(cm) cm.classList.toggle("hidden"); }

function sendCannedMessage() {
    const el = document.getElementById("canned-messages");
    if (!el) return;
    if (window.sendChatMessage) window.sendChatMessage(el.value);
    else alert("Περίμενε να φορτώσει η σύνδεση! 🐾");
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
