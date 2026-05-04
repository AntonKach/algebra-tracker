let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator, sciCalculator;
let currentLang = "el"; 
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0 };
let lastFocusedInput = "answer";

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
    },
    fr: {
        lblLevel: "Niveau:", lblScore: "Score:", lblTime: "Temps:",
        placeholderAns: "Réponse...", btnCheck: "Vérifier", btnHelp: "Pas-à-pas", btnSkip: "Passer",
        lblNotes: "Brouillon & Calculatrice 📝🧮", btnAI: "✨ Vérifier AI", placeholderNotes: "Écrivez ici...", btnClear: "🗑️ Effacer",
        lblGraph: "Graphique 📈",
        btnReset: "Réinitialiser", btnStats: "📊 Stats", modalTitle: "Statistiques 📊",
        lblPlayed: "Résolus:", lblCorrect: "Corrects:", lblRate: "Taux:", btnClose: "Fermer",
        lblAboutTitle: "À propos de Catgebra 🐾",
        lblAboutText: "Catgebra a été créé pour rendre l'apprentissage de l'algèbre amusant ! Utilisez la calculatrice scientifique, prenez des notes et résolvez les équations étape par étape.",
        lblResources: "Ressources 📚",
        stepWords: { move: "Déplacer:", div: "Diviser:", sub: "Soustraire:", mult: "Multiplier:" },
        catSuccess: ["Purr-fait ! 😻", "Meow-gnifique ! 🐾"],
        catError: ["Oups ! Le chat sur le clavier ? 😿", "Miaou... Erreur. 🙀"]
    },
    tr: {
        lblLevel: "Seviye:", lblScore: "Puan:", lblTime: "Süre:",
        placeholderAns: "Cevap...", btnCheck: "Kontrol Et", btnHelp: "Adım Adım", btnSkip: "Geç",
        lblNotes: "Notlar & Hesap Makinesi 📝🧮", btnAI: "✨ AI Kontrolü", placeholderNotes: "Buraya yazın...", btnClear: "🗑️ Temizle",
        lblGraph: "Grafik 📈",
        btnReset: "Sıfırla", btnStats: "📊 İstatistik", modalTitle: "İstatistiklerim 📊",
        lblPlayed: "Çözülen:", lblCorrect: "Doğru:", lblRate: "Başarı:", btnClose: "Kapat",
        lblAboutTitle: "Catgebra Hakkında 🐾",
        lblAboutText: "Catgebra, cebir öğrenmeyi eğlenceli hale getirmek için tasarlandı! Hesap makinesini kullanın, notlar alın ve denklemleri adım adım çözün.",
        lblResources: "Kaynaklar 📚",
        stepWords: { move: "Taşı:", div: "Böl:", sub: "Çıkar:", mult: "Çarp:" },
        catSuccess: ["Purr-fect! x'i buldun! 😻", "Miyav-harika! 🐾"],
        catError: ["Oops! Ben mi bastım tuşa? 😿", "Miyav... Bir hata var. 🙀"]
    }
};

window.onload = function() {
    const savedScore = localStorage.getItem("mathScore");
    if (savedScore) score = parseInt(savedScore);
    
    sciCalculator = Desmos.ScientificCalculator(document.getElementById('scientific-calculator'), {
        invertedColors: true
    });

    calculator = Desmos.GraphingCalculator(document.getElementById('calculator'), {
        keypad: true, 
        expressions: false,
        settingsMenu: false,
        invertedColors: true
    });

    document.getElementById("score").innerText = score;
    
    document.getElementById("answer").addEventListener("focus", () => lastFocusedInput = "answer");
    document.getElementById("user-notes").addEventListener("focus", () => lastFocusedInput = "user-notes");

    populateGradeSelect();
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
    
    const btnAI = document.getElementById("btn-ai");
    if (btnAI) btnAI.innerText = t.btnAI;
    const lblGraph = document.getElementById("lbl-graph");
    if (lblGraph) lblGraph.innerText = t.lblGraph;
    const lblRes = document.getElementById("lbl-resources");
    if (lblRes) lblRes.innerText = t.lblResources;
    const lblTitle = document.getElementById("lbl-about-title");
    if (lblTitle) lblTitle.innerText = t.lblAboutTitle;
    const lblText = document.getElementById("lbl-about-text");
    if (lblText) lblText.innerText = t.lblAboutText;

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
    
    let displayEq = currentProblem.equation.replace(/\^x/g, "<sup>x</sup>");
    document.getElementById("equation").innerHTML = displayEq;
    
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-steps").classList.add("hidden");
    document.getElementById("ai-response").innerText = ""; // Καθαρίζει την απάντηση του AI σε νέα άσκηση
    
    calculator.setBlank();
    let latex = currentProblem.equation.replace('=', '-(') + ')'; 
    if (currentProblem.equation.includes('∫')) latex = "y = x^2"; 
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

function clearNotes() { 
    document.getElementById("user-notes").value = ""; 
    document.getElementById("ai-response").innerText = ""; // Καθαρίζει και το AI
}
function changeGrade() { startTimer(); loadNextProblem(); }
function toggleKeyboard() { document.getElementById("math-keyboard").classList.toggle("hidden"); }

function insertSymbol(sym) { 
    const targetInput = document.getElementById(lastFocusedInput);
    targetInput.value += sym;
    targetInput.focus();
}

function showHelp() {
    const helpBox = document.getElementById("help-steps");
    helpBox.innerHTML = currentProblem.steps.map(s => "• " + s).join("<br>");
    helpBox.classList.remove("hidden");
}
function skipProblem() { loadNextProblem(); }
function toggleStats() { document.getElementById("stats-modal").classList.toggle("hidden"); }
function resetProgress() { localStorage.clear(); location.reload(); }

// --- ΝΕΑ ΜΑΓΙΚΗ ΛΕΙΤΟΥΡΓΙΑ: Επικοινωνία με το Vercel Backend ---
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
        console.error("Σφάλμα:", error);
        aiText.innerText = "Ουπς! Υπήρξε ένα μικρό πρόβλημα σύνδεσης. Δοκίμασε ξανά! 😿";
    }
}
