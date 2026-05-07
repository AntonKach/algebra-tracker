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

// Βοηθητική συνάρτηση για τυχαίους αριθμούς
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Για να δουλεύει το onchange του HTML που προσθέσαμε
function generateNewProblem() {
    loadNextProblem();
}

function loadNextProblem() {
    const levelSelect = document.getElementById("level-select");
    const words = translations[currentLang].stepWords;
    let equationStr = "";
    let correctAns = "";
    let stepList = [];

    // Αν υπάρχει το νέο μενού Δυσκολίας, βγάζουμε ασκήσεις από εκεί!
    if (levelSelect) {
        const level = parseInt(levelSelect.value);

        if (level === 1) {
            let x = getRandomInt(-10, 10);
            let a = getRandomInt(1, 10);
            let b = getRandomInt(-20, 20);
            let c = (a * x) + b;
            let signB = b >= 0 ? "+" : "-";
            equationStr = `${a}x ${signB} ${Math.abs(b)} = ${c}`;
            correctAns = x.toString();
            stepList = [`${words.move} ${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`, `${words.div} x = ${x}`];
        } else if (level === 2) {
            let x = getRandomInt(-10, 10);
            let a = getRandomInt(1, 10);
            let c_coeff = getRandomInt(1, 10);
            while(a === c_coeff) { c_coeff = getRandomInt(1, 10); }
            let b = getRandomInt(-20, 20);
            let d = (a * x) + b - (c_coeff * x);
            let signB = b >= 0 ? "+" : "-";
            let signD = d >= 0 ? "+" : "-";
            equationStr = `${a}x ${signB} ${Math.abs(b)} = ${c_coeff}x ${signD} ${Math.abs(d)}`;
            correctAns = x.toString();
            stepList = [`Φέρνουμε τα x στο πρώτο μέλος: ${a}x ${c_coeff >= 0 ? '-' : '+'} ${Math.abs(c_coeff)}x = ${d} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`, `Κάνουμε τις πράξεις... x = ${x}`];
        } else if (level === 3) {
            let r1 = getRandomInt(-5, 5);
            let r2 = getRandomInt(-5, 5);
            let b = -(r1 + r2);
            let c = r1 * r2;
            let signB = b >= 0 ? "+" : "-";
            let signC = c >= 0 ? "+" : "-";
            
            let bTerm = "";
            if (b === 1) bTerm = "+ x";
            else if (b === -1) bTerm = "- x";
            else if (b !== 0) bTerm = `${signB} ${Math.abs(b)}x`;

            let cTerm = c !== 0 ? `${signC} ${Math.abs(c)}` : "";
            equationStr = `x² ${bTerm} ${cTerm} = 0`;
            
            if (r1 === r2) {
                correctAns = r1.toString();
                stepList = [`Η εξίσωση έχει μία διπλή ρίζα.`, `Λύση: x = ${r1}`];
            } else {
                let roots = [r1, r2].sort((a,b) => a - b);
                correctAns = `${roots[0]},${roots[1]}`;
                stepList = [`Λύνουμε με διακρίνουσα (Δ) ή με παραγοντοποίηση.`, `Λύσεις (με κόμμα): ${roots[0]},${roots[1]}`];
            }
        }
        currentProblem = { equation: equationStr, answer: correctAns, steps: stepList };
    }

    // Εμφάνιση της εξίσωσης στην οθόνη
    let displayEq = currentProblem.equation.replace(/\^x/g, "<sup>x</sup>");
    document.getElementById("equation").innerHTML = displayEq;
    
    // Καθαρισμός πεδίων
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-steps").classList.add("hidden");
    document.getElementById("ai-response").innerText = ""; 
    
    // Ενημέρωση του Desmos Graph
    calculator.setBlank();
    let latex = currentProblem.equation.replace('=', '-(') + ')'; 
    // Μετατροπή του x² για να το καταλαβαίνει το γράφημα!
    latex = latex.replace(/x²/g, 'x^2');
    if (currentProblem.equation.includes('∫')) latex = "y = x^2"; 
    calculator.setExpression({ id: 'graph', latex: latex, color: '#bb86fc' });
}

function checkAnswer() {
    let userAns = document.getElementById("answer").value.replace(/\s+/g, '').trim();
    let expected = currentProblem.answer;

    if (expected.includes(',') && userAns.includes(',')) {
        let userRoots = userAns.split(',').sort((a,b) => parseFloat(a) - parseFloat(b));
        let expectedRoots = expected.split(',').sort((a,b) => parseFloat(a) - parseFloat(b));
        userAns = userRoots.join(',');
        expected = expectedRoots.join(',');
    }

    const feedback = document.getElementById("feedback");
    userStats.played++; 
    
    if (userAns === expected) {
        userStats.correct++;
        score += 20;
        document.getElementById("score").innerText = score;
        const msgs = translations[currentLang].catSuccess;
        feedback.innerText = msgs[Math.floor(Math.random() * msgs.length)];
        
        // --- ΝΕΟ: ΗΧΟΣ ΚΑΙ ΕΦΕ ΕΠΙΒΡΑΒΕΥΣΗΣ! ---
        new Audio('correct.mp3').play();
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        
        setTimeout(loadNextProblem, 2500);
    } else {
        const errs = translations[currentLang].catError;
        feedback.innerText = errs[Math.floor(Math.random() * errs.length)];
        
        // --- ΝΕΟ: ΗΧΟΣ ΛΑΘΟΥΣ! ---
        new Audio('fail.mp3').play();
    }
    
    // Αποθήκευση τοπικά
    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);
    
    // Αποθήκευση στο Cloud του Firebase!
    if (window.saveToCloud) {
        window.saveToCloud(score, userStats);
    }
};function clearNotes() { 
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
// --- ΣΥΝΔΕΣΗ ΜΕ ΤΟ FIREBASE CLOUD ---
window.updateGameData = function(cloudScore, cloudStats) {
    if (cloudScore !== undefined) score = cloudScore;
    if (cloudStats !== undefined) userStats = cloudStats;
    
    // Ανανεώνουμε την οθόνη και τα τοπικά δεδομένα
    document.getElementById("score").innerText = score;
    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);

    // --- ΣΥΣΤΗΜΑ ΒΑΘΜΙΔΩΝ (GAMIFICATION) ---
function updateRank() {
    const rankElement = document.getElementById("user-rank");
    if (!rankElement) return;

    if (score >= 600) {
        rankElement.innerText = "🐅 Μαθηματικός Τίγρης";
    } else if (score >= 300) {
        rankElement.innerText = "🐆 Γρήγορος Λύγκας";
    } else if (score >= 100) {
        rankElement.innerText = "🐈 Έξυπνος Γάτος";
    } else {
        rankElement.innerText = "🐱 Αρχάριο Γατάκι";
    }
}};
