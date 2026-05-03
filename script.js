let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator;
let currentLang = "el"; 
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0 };

// --- ΤΟ ΛΕΞΙΚΟ ΤΗΣ ΕΦΑΡΜΟΓΗΣ (i18n) ---
const translations = {
    el: {
        lblLevel: "Επίπεδο Σπουδών:", lblScore: "Σκορ:", lblTime: "Χρόνος:",
        placeholderAns: "Απάντηση...", btnCheck: "Έλεγχος", btnHelp: "Βήμα-Βήμα", btnSkip: "Παράλειψη",
        lblNotes: "Πρόχειρο Σημειώσεων 📝", placeholderNotes: "Γράψε εδώ τις σκέψεις σου...",
        btnReset: "Μηδενισμός", btnStats: "📊 Στατιστικά", modalTitle: "Τα Στατιστικά μου 📊",
        lblPlayed: "Λυμένες Ασκήσεις:", lblCorrect: "Σωστές Απαντήσεις:", lblRate: "Ποσοστό Επιτυχίας:", btnClose: "Κλείσιμο",
        stepWords: { move: "Μεταφέρουμε:", div: "Διαιρούμε:", sub: "Αφαιρούμε:", mult: "Πολλαπλασιάζουμε:" },
        catSuccess: ["Purr-fect! Βρήκες το x! 😻", "Meow-gnificent! Προχωράμε! 🐾", "Γατίσια αντανακλαστικά! 😼"],
        catError: ["Ουπς! Μήπως πάτησα εγώ το πληκτρολόγιο; 😿", "Μιάου... Κάτι δεν πήγε καλά. 🙀", "Χσσς! Λάθος υπολογισμός. 😾"]
    },
    en: {
        lblLevel: "Study Level:", lblScore: "Score:", lblTime: "Time:",
        placeholderAns: "Answer...", btnCheck: "Check", btnHelp: "Step-by-Step", btnSkip: "Skip",
        lblNotes: "Scratchpad 📝", placeholderNotes: "Write your thoughts here...",
        btnReset: "Reset", btnStats: "📊 Stats", modalTitle: "My Statistics 📊",
        lblPlayed: "Problems Solved:", lblCorrect: "Correct Answers:", lblRate: "Success Rate:", btnClose: "Close",
        stepWords: { move: "Move constant:", div: "Divide by:", sub: "Subtract:", mult: "Multiply by:" },
        catSuccess: ["Purr-fect! You found x! 😻", "Meow-gnificent! Let's go! 🐾", "Cat-like reflexes! 😼"],
        catError: ["Oops! Did I step on the keyboard? 😿", "Meow... Something went wrong. 🙀", "Hiss! Wrong calculation. 😾"]
    },
    fr: {
        lblLevel: "Niveau:", lblScore: "Score:", lblTime: "Temps:",
        placeholderAns: "Réponse...", btnCheck: "Vérifier", btnHelp: "Pas-à-pas", btnSkip: "Passer",
        lblNotes: "Brouillon 📝", placeholderNotes: "Écrivez vos pensées ici...",
        btnReset: "Réinitialiser", btnStats: "📊 Statistiques", modalTitle: "Mes Statistiques 📊",
        lblPlayed: "Problèmes Résolus:", lblCorrect: "Bonnes Réponses:", lblRate: "Taux de Réussite:", btnClose: "Fermer",
        stepWords: { move: "Déplacer:", div: "Diviser par:", sub: "Soustraire:", mult: "Multiplier par:" },
        catSuccess: ["Purr-fait ! Tu as trouvé x ! 😻", "Meow-gnifique ! On continue ! 🐾", "Réflexes de chat ! 😼"],
        catError: ["Oups ! J'ai marché sur le clavier ? 😿", "Miaou... Quelque chose cloche. 🙀", "Hiss ! Mauvais calcul. 😾"]
    },
    tr: {
        lblLevel: "Eğitim Seviyesi:", lblScore: "Puan:", lblTime: "Süre:",
        placeholderAns: "Cevap...", btnCheck: "Kontrol Et", btnHelp: "Adım Adım", btnSkip: "Geç",
        lblNotes: "Karalama Defteri 📝", placeholderNotes: "Düşüncelerinizi buraya yazın...",
        btnReset: "Sıfırla", btnStats: "📊 İstatistikler", modalTitle: "İstatistiklerim 📊",
        lblPlayed: "Çözülen Sorular:", lblCorrect: "Doğru Cevaplar:", lblRate: "Başarı Oranı:", btnClose: "Kapat",
        stepWords: { move: "Sabiti taşı:", div: "Böl:", sub: "Çıkar:", mult: "Çarp:" },
        catSuccess: ["Purr-fect! x'i buldun! 😻", "Miyav-harika! Devam! 🐾", "Kedi refleksleri! 😼"],
        catError: ["Oops! Klavyeye ben mi bastım? 😿", "Miyav... Bir şeyler ters gitti. 🙀", "Tısss! Yanlış hesap. 😾"]
    }
};

window.onload = function() {
    const savedScore = localStorage.getItem("mathScore");
    if (savedScore) score = parseInt(savedScore);
    
    calculator = Desmos.GraphingCalculator(document.getElementById('calculator'), {
        keypad: false, expressions: false, invertedColors: true
    });

    document.getElementById("score").innerText = score;
    
    // Αρχικοποίηση Γλώσσας
    populateGradeSelect();
    changeLanguage();
};

function populateGradeSelect() {
    const select = document.getElementById("grade-select");
    select.innerHTML = "";
    for (const key in educationData) {
        let option = document.createElement("option");
        option.value = key;
        option.text = educationData[key].title[currentLang];
        select.appendChild(option);
    }
}

function changeLanguage() {
    currentLang = document.getElementById("lang-select").value;
    const t = translations[currentLang];

    // Ενημέρωση UI Text
    document.getElementById("lbl-level").innerText = t.lblLevel;
    document.getElementById("lbl-score").innerText = t.lblScore;
    document.getElementById("lbl-time").innerText = t.lblTime;
    document.getElementById("answer").placeholder = t.placeholderAns;
    document.getElementById("btn-check").innerText = t.btnCheck;
    document.getElementById("btn-help").innerText = t.btnHelp;
    document.getElementById("btn-skip").innerText = t.btnSkip;
    document.getElementById("lbl-notes").innerText = t.lblNotes;
    document.getElementById("user-notes").placeholder = t.placeholderNotes;
    document.getElementById("btn-reset").innerText = t.btnReset;
    document.getElementById("btn-stats").innerText = t.btnStats;
    
    // Ενημέρωση Modal Στατιστικών
    document.getElementById("modal-title").innerText = t.modalTitle;
    document.getElementById("lbl-played").innerText = t.lblPlayed;
    document.getElementById("lbl-correct").innerText = t.lblCorrect;
    document.getElementById("lbl-rate").innerText = t.lblRate;
    document.getElementById("btn-close").innerText = t.btnClose;

    populateGradeSelect();
    loadNextProblem(); // Φορτώνει ξανά την άσκηση στη σωστή γλώσσα
}

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        let m = Math.floor(seconds/60), s = seconds%60;
        document.getElementById("timer").innerText = `${m}:${s<10?'0'+s:s}`;
    }, 1000);
}

function changeGrade() {
    loadNextProblem();
    startTimer();
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
            steps: [
                `${words.move} ${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`,
                `${a}x = ${c - b}`,
                `${words.div} ${a}: x = ${(c - b) / a}`
            ]
        };
    } else if (type === "dynamic_fraction") {
        let x = Math.floor(Math.random() * 10) + 1;
        let denom = Math.floor(Math.random() * 4) + 2;
        let c = Math.floor(Math.random() * 10) + 1;
        let result = x + c;
        
        return {
            equation: `x/${denom} + ${c} = ${result}`,
            answer: (x * denom).toString(),
            steps: [
                `${words.sub} ${c}: x/${denom} = ${result - c}`,
                `${words.mult} ${denom}: x = ${(result - c) * denom}`
            ]
        };
    }
}

function loadNextProblem() {
    const grade = document.getElementById("grade-select").value;
    const gradeData = educationData[grade];
    
    if (gradeData.type.includes("dynamic")) {
        currentProblem = generateDynamicProblem(gradeData.type);
    } else {
        const problems = gradeData.problems;
        let prob = problems[Math.floor(Math.random() * problems.length)];
        // Προσαρμογή βημάτων για τις στατικές ασκήσεις
        currentProblem = { equation: prob.equation, answer: prob.answer, steps: prob.steps[currentLang] };
    }
    
    document.getElementById("equation").innerText = currentProblem.equation;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-steps").classList.add("hidden");
    
    const notes = document.getElementById("user-notes");
    if (notes) notes.value = "";
    
    updateGraph(currentProblem.equation);
}

function updateGraph(eq) {
    calculator.setBlank();
    let latex = eq.replace('=', '-(') + ')'; 
    if (eq.includes('∫')) latex = "y = x^2"; 
    calculator.setExpression({ id: 'graph', latex: latex, color: '#bb86fc' });
}

function playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime); 
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }
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
        feedback.innerText = msgs[Math.floor(Math.random() * msgs.length)] + " (+20)";
        
        playSound('success');
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

        setTimeout(loadNextProblem, 2500);
    } else {
        const errs = translations[currentLang].catError;
        feedback.innerText = errs[Math.floor(Math.random() * errs.length)];
        playSound('error');
    }
    
    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);
}

function toggleStats() {
    const modal = document.getElementById("stats-modal");
    if (modal.classList.contains("hidden")) {
        document.getElementById("stat-played").innerText = userStats.played;
        document.getElementById("stat-correct").innerText = userStats.correct;
        let rate = userStats.played > 0 ? Math.round((userStats.correct / userStats.played) * 100) : 0;
        document.getElementById("stat-rate").innerText = rate + "%";
        modal.classList.remove("hidden");
    } else {
        modal.classList.add("hidden");
    }
}

function showHelp() {
    const helpBox = document.getElementById("help-steps");
    // Επειδή αλλάξαμε γλώσσα, η λέξη "Βήματα" πρέπει να ταιριάζει!
    let stepTitle = currentLang === "el" ? "Βήματα:" : currentLang === "en" ? "Steps:" : currentLang === "fr" ? "Étapes:" : "Adımlar:";
    helpBox.innerHTML = `<strong>${stepTitle}</strong><br>` + currentProblem.steps.map(s => "• " + s).join("<br>");
    helpBox.classList.remove("hidden");
}

function insertSymbol(sym) { document.getElementById("answer").value += sym; }
function toggleKeyboard() { document.getElementById("math-keyboard").classList.toggle("hidden"); }
function skipProblem() { loadNextProblem(); }
function resetProgress() { 
    localStorage.removeItem("mathScore");
    localStorage.removeItem("mathUserStats");
    location.reload(); 
}
