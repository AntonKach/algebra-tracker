let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator;
let currentLang = "el"; 
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0 };

const translations = {
    el: {
        lblLevel: "Επίπεδο Σπουδών:", lblScore: "Σκορ:", lblTime: "Χρόνος:",
        placeholderAns: "Απάντηση...", btnCheck: "Έλεγχος", btnHelp: "Βήμα-Βήμα", btnSkip: "Παράλειψη",
        lblNotes: "Πρόχειρο Σημειώσεων 📝", placeholderNotes: "Γράψε εδώ τις σκέψεις σου...", btnClear: "🗑️ Καθαρισμός",
        btnReset: "Μηδενισμός Προόδου", btnStats: "📊 Στατιστικά", modalTitle: "Τα Στατιστικά μου 📊",
        lblPlayed: "Λυμένες Ασκήσεις:", lblCorrect: "Σωστές Απαντήσεις:", lblRate: "Ποσοστό Επιτυχίας:", btnClose: "Κλείσιμο",
        lblResources: "Πηγές Μελέτης 📚",
        stepWords: { move: "Μεταφέρουμε:", div: "Διαιρούμε:", sub: "Αφαιρούμε:", mult: "Πολλαπλασιάζουμε:" },
        catSuccess: ["Purr-fect! Βρήκες το x! 😻", "Meow-gnificent! 🐾", "Γατίσια αντανακλαστικά! 😼"],
        catError: ["Ουπς! Μήπως πάτησα εγώ το πληκτρολόγιο; 😿", "Μιάου... Κάτι δεν πήγε καλά. 🙀"]
    },
    en: {
        lblLevel: "Study Level:", lblScore: "Score:", lblTime: "Time:",
        placeholderAns: "Answer...", btnCheck: "Check", btnHelp: "Step-by-Step", btnSkip: "Skip",
        lblNotes: "Scratchpad 📝", placeholderNotes: "Write your thoughts here...", btnClear: "🗑️ Clear",
        btnReset: "Reset Progress", btnStats: "📊 Stats", modalTitle: "My Statistics 📊",
        lblPlayed: "Solved:", lblCorrect: "Correct:", lblRate: "Success Rate:", btnClose: "Close",
        lblResources: "Study Resources 📚",
        stepWords: { move: "Move:", div: "Divide:", sub: "Subtract:", mult: "Multiply:" },
        catSuccess: ["Purr-fect! You found x! 😻", "Meow-gnificent! 🐾", "Cat-like reflexes! 😼"],
        catError: ["Oops! Did I step on the keyboard? 😿", "Meow... Something's wrong. 🙀"]
    },
    fr: {
        lblLevel: "Niveau:", lblScore: "Score:", lblTime: "Temps:",
        placeholderAns: "Réponse...", btnCheck: "Vérifier", btnHelp: "Pas-à-pas", btnSkip: "Passer",
        lblNotes: "Brouillon 📝", placeholderNotes: "Écrivez ici...", btnClear: "🗑️ Effacer",
        btnReset: "Réinitialiser", btnStats: "📊 Stats", modalTitle: "Statistiques 📊",
        lblPlayed: "Résolus:", lblCorrect: "Corrects:", lblRate: "Taux:", btnClose: "Fermer",
        lblResources: "Ressources 📚",
        stepWords: { move: "Déplacer:", div: "Diviser:", sub: "Soustraire:", mult: "Multiplier:" },
        catSuccess: ["Purr-fait ! 😻", "Meow-gnifique ! 🐾"],
        catError: ["Oups ! Le chat sur le clavier ? 😿", "Miaou... Erreur. 🙀"]
    },
    tr: {
        lblLevel: "Seviye:", lblScore: "Puan:", lblTime: "Süre:",
        placeholderAns: "Cevap...", btnCheck: "Kontrol Et", btnHelp: "Adım Adım", btnSkip: "Geç",
        lblNotes: "Notlar 📝", placeholderNotes: "Buraya yazın...", btnClear: "🗑️ Temizle",
        btnReset: "Sıfırla", btnStats: "📊 İstatistik", modalTitle: "İstatistiklerim 📊",
        lblPlayed: "Çözülen:", lblCorrect: "Doğru:", lblRate: "Başarı:", btnClose: "Kapat",
        lblResources: "Kaynaklar 📚",
        stepWords: { move: "Taşı:", div: "Böl:", sub: "Çıkar:", mult: "Çarp:" },
        catSuccess: ["Purr-fect! x'i buldun! 😻", "Miyav-harika! 🐾"],
        catError: ["Oops! Ben mi bastım tuşa? 😿", "Miyav... Bir hata var. 🙀"]
    }
};

window.onload = function() {
    const savedScore = localStorage.getItem("mathScore");
    if (savedScore) score = parseInt(savedScore);
    
    // ΕΝΕΡΓΟΠΟΙΗΣΗ KEYPAD: TRUE και EXPRESSIONS: TRUE για το Super Calculator!
    calculator = Desmos.GraphingCalculator(document.getElementById('calculator'), {
        keypad: true, 
        expressions: true, 
        invertedColors: true,
        settingsMenu: true
    });

    document.getElementById("score").innerText = score;
    
    populateGradeSelect();
    changeLanguage(); // Αυτό φορτώνει το UI
    startTimer();     // ΑΥΤΟ ΔΙΟΡΘΩΝΕΙ ΤΟ ΧΡΟΝΟΜΕΤΡΟ
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
    
    // Ενημέρωση των Πηγών Μελέτης με έλεγχο για να μην βγάλει σφάλμα
    const lblRes = document.getElementById("lbl-resources");
    if (lblRes) lblRes.innerText = t.lblResources;

    populateGradeSelect();
    loadNextProblem();
}

function populateGradeSelect() {
    const select = document.getElementById("grade-select");
    const currentVal = select.value;
    select.innerHTML = "";
    for (const key in educationData) {
        let option = document.createElement("option");
        option.value = key;
        option.text = educationData[key].title[currentLang];
        select.appendChild(option);
    }
    if (currentVal) select.value = currentVal;
}

function generateDynamicProblem(type) {
    const words = translations[currentLang].stepWords;
    if (type === "dynamic_linear") {
        let a = Math.floor(Math.random() * 9) + 1;
        let x = Math.floor(Math.random() * 21) - 10;
        let b = Math.floor(Math.random() * 21) - 10;
        let c = a * x + b;
        let bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        return {
            equation: `${a}x ${bStr} = ${c}`,
            answer: x.toString(),
            steps: [`${words.move} ${a}x = ${c - b}`, `${words.div} ${a}: x = ${x}`]
        };
    } else if (type === "dynamic_fraction") {
        let x = Math.floor(Math.random() * 10) + 1;
        let denom = Math.floor(Math.random() * 4) + 2;
        let c = Math.floor(Math.random() * 10) + 1;
        let result = x + c;
        return {
            equation: `x/${denom} + ${c} = ${result}`,
            answer: (x * denom).toString(),
            steps: [`${words.sub} ${c}: x/${denom} = ${x}`, `${words.mult} ${denom}: x = ${x * denom}`]
        };
    }
}

function loadNextProblem() {
    const grade = document.getElementById("grade-select").value;
    if (!grade) return;
    const gradeData = educationData[grade];
    
    if (gradeData.type.includes("dynamic")) {
        currentProblem = generateDynamicProblem(gradeData.type);
    } else {
        const problems = gradeData.problems;
        let prob = problems[Math.floor(Math.random() * problems.length)];
        currentProblem = { equation: prob.equation, answer: prob.answer, steps: prob.steps[currentLang] };
    }
    
    document.getElementById("equation").innerText = currentProblem.equation;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-steps").classList.add("hidden");
    updateGraph(currentProblem.equation);
}

function updateGraph(eq) {
    calculator.setBlank();
    let latex = eq.replace('=', '-(') + ')'; 
    if (eq.includes('∫')) latex = "y = x^2"; 
    calculator.setExpression({ id: 'graph', latex: latex, color: '#bb86fc' });
}

function checkAnswer() {
    const userAns = document.getElementById("answer").value.trim();
    const feedback = document.getElementById("feedback");
    userStats.played++; 
    if (userAns === currentProblem.answer) {
        userStats.correct++;
        score += 20;
        document.getElementById("score").innerText = score;
        const msgs = translations[currentLang].catSuccess;
        feedback.innerText = msgs[Math.floor(Math.random() * msgs.length)];
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(loadNextProblem, 2500);
    } else {
        const errs = translations[currentLang].catError;
        feedback.innerText = errs[Math.floor(Math.random() * errs.length)];
    }
    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);
}

function clearNotes() { document.getElementById("user-notes").value = ""; }
function changeGrade() { startTimer(); loadNextProblem(); }
function toggleKeyboard() { document.getElementById("math-keyboard").classList.toggle("hidden"); }
function insertSymbol(sym) { document.getElementById("answer").value += sym; }
function showHelp() {
    const helpBox = document.getElementById("help-steps");
    helpBox.innerHTML = currentProblem.steps.map(s => "• " + s).join("<br>");
    helpBox.classList.remove("hidden");
}
function skipProblem() { loadNextProblem(); }
function toggleStats() { document.getElementById("stats-modal").classList.toggle("hidden"); }
function resetProgress() { localStorage.clear(); location.reload(); }
