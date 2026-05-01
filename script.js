const problems = {
    1: [ 
        { equation: "x + 5 = 12", answer: 7 },
        { equation: "x - 4 = 6", answer: 10 },
        { equation: "8 + x = 15", answer: 7 },
        { equation: "x - 2 = 0", answer: 2 },
        { equation: "10 - x = 4", answer: 6 },
        { equation: "x + 15 = 25", answer: 10 }
    ],
    2: [ 
        { equation: "3x = 15", answer: 5 },
        { equation: "x / 2 = 8", answer: 16 },
        { equation: "4x = 20", answer: 5 },
        { equation: "10x = 100", answer: 10 },
        { equation: "x / 3 = 7", answer: 21 },
        { equation: "5x = 45", answer: 9 }
    ],
    3: [ 
        { equation: "2x + 1 = 9", answer: 4 },
        { equation: "3x - 2 = 10", answer: 4 },
        { equation: "5x + 5 = 30", answer: 5 },
        { equation: "2x - 8 = 0", answer: 4 },
        { equation: "x / 2 + 3 = 8", answer: 10 },
        { equation: "4x - 5 = 11", answer: 4 }
    ],
    4: [ 
        { equation: "2(x - 3) = 8", answer: 7 },
        { equation: "3(x + 1) = 15", answer: 4 },
        { equation: "5x = 2x + 12", answer: 4 },
        { equation: "4(x - 2) = 16", answer: 6 },
        { equation: "3x + 2 = x + 10", answer: 4 },
        { equation: "2(2x + 1) = 18", answer: 4 }
    ]
};

let currentLevel = 1;
let score = 0;
let currentProblem = {};
let calculator;

window.onload = function() {
    const savedScore = localStorage.getItem("algebraScore");
    if (savedScore !== null) {
        score = parseInt(savedScore);
    }
    
    const elt = document.getElementById('calculator');
    calculator = Desmos.GraphingCalculator(elt, {
        keypad: false,         
        expressions: false,    
        settingsMenu: false,   
        invertedColors: true   
    });

    updateLevel(); 
    updateUI();    
    loadNextProblem();
};

function updateLevel() {
    if (score >= 150) {
        currentLevel = 4;
    } else if (score >= 100) {
        currentLevel = 3;
    } else if (score >= 50) {
        currentLevel = 2;
    } else {
        currentLevel = 1;
    }
}

function updateUI() {
    document.getElementById("score").innerText = score;
    document.getElementById("level-display").innerText = "Επίπεδο " + currentLevel;
}

function loadNextProblem() {
    const levelProblems = problems[currentLevel];
    const randomIndex = Math.floor(Math.random() * levelProblems.length);
    currentProblem = levelProblems[randomIndex];
    
    document.getElementById("equation").innerText = currentProblem.equation;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-text").innerText = ""; 

    updateGraph();
}

function updateGraph() {
    calculator.setBlank(); 

    let parts = currentProblem.equation.split('=');
    let leftSide = parts[0].trim();
    let rightSide = parts[1].trim();

    calculator.setExpression({ id: 'left', latex: 'y = ' + leftSide, color: '#bb86fc' });
    calculator.setExpression({ id: 'right', latex: 'y = ' + rightSide, color: '#03dac6' });

    calculator.setMathBounds({
        left: -5,
        right: currentProblem.answer + 10,
        bottom: -5,
        top: 110 
    });
}

// --- Ο ΝΕΟΣ ΜΑΣ AI ΔΑΣΚΑΛΟΣ ---
function generateAIFeedback(userAnswer, correctAnswer, equation) {
    // 1. Έλεγχος για λάθος πρόσημο (π.χ. σωστό είναι 5, έγραψε -5)
    if (userAnswer === -correctAnswer && correctAnswer !== 0) {
        return "🤖 AI Ανάλυση: Ήσουν πολύ κοντά! Φαίνεται να έχεις κάνει λάθος στο πρόσημο. Θυμήσου: όταν αλλάζουμε πλευρά στο ίσον, το + γίνεται - και αντίστροφα.";
    }
    
    // 2. Έλεγχος αν έκανε πρόσθεση αντί για αφαίρεση (ή το ανάποδο)
    // Πιάνουμε το δεξί μέρος της εξίσωσης (μετά το =)
    const rightSide = parseInt(equation.split('=')[1]); 
    // Αν η διαφορά μεταξύ της απάντησής του και του δεξιού μέρους υποδηλώνει λάθος πράξη
    if (Math.abs(userAnswer - rightSide) === Math.abs(correctAnswer - rightSide) && userAnswer !== correctAnswer) {
         return "🤖 AI Ανάλυση: Προσοχή στις πράξεις! Μήπως αντί να προσθέσεις/αφαιρέσεις τον αριθμό για να απομονώσεις το x, έκανες την αντίθετη πράξη;";
    }

    // 3. Έλεγχος αν πολλαπλασίασε αντί να διαιρέσει (σε εξισώσεις τύπου 3x = 15)
    // Αν η απάντηση του χρήστη διαιρεμένη με το σωστό αποτέλεσμα μας δίνει πάλι το σωστό αποτέλεσμα ή κάτι σχετικό
    if (userAnswer > correctAnswer * 2 && equation.includes("x") && !equation.includes("/")) {
         return "🤖 AI Ανάλυση: Ο αριθμός που βρήκες είναι αρκετά μεγάλος. Μήπως πολλαπλασίασες αντί να διαιρέσεις για να βρεις το x;";
    }

    // 4. Γενικό λάθος
    return "🤖 AI Ανάλυση: Λάθος. Ξαναδές τη γραφική παράσταση (το σημείο που τέμνονται οι γραμμές) για να βοηθηθείς!";
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const feedbackEl = document.getElementById("feedback");

    // Έλεγχος αν άφησε το πεδίο κενό
    if (isNaN(userAnswer)) {
        feedbackEl.innerText = "Παρακαλώ γράψε έναν αριθμό!";
        feedbackEl.style.color = "#cf6679";
        return;
    }

    if (userAnswer === currentProblem.answer) {
        feedbackEl.innerText = "✅ Σωστά! +10 πόντοι";
        feedbackEl.style.color = "#03dac6"; 
        
        score += 10;
        updateLevel(); 
        updateUI();
        localStorage.setItem("algebraScore", score);

        setTimeout(loadNextProblem, 1500); 
    } else {
        // Καλούμε τον AI Δάσκαλο να αναλύσει το λάθος!
        const aiMessage = generateAIFeedback(userAnswer, currentProblem.answer, currentProblem.equation);
        
        feedbackEl.innerText = "❌ " + aiMessage;
        feedbackEl.style.color = "#cf6679"; 
    }
}

function showHelp() {
    const helpEl = document.getElementById("help-text");
    helpEl.innerText = "💡 Λύση: Η απάντηση είναι " + currentProblem.answer;
    
    calculator.setExpression({ id: 'solutionLine', latex: 'x = ' + currentProblem.answer, color: '#cf6679', lineStyle: Desmos.Styles.DASHED });
}

function skipProblem() {
    const feedbackEl = document.getElementById("feedback");
    feedbackEl.innerText = "⏭️ Πάμε στην επόμενη...";
    feedbackEl.style.color = "#bb86fc"; 
    
    setTimeout(loadNextProblem, 1000);
}

function resetProgress() {
    if (confirm("Είσαι σίγουρος ότι θέλεις να μηδενίσεις την πρόοδό σου;")) {
        score = 0;
        currentLevel = 1;
        updateUI();
        localStorage.removeItem("algebraScore");
        loadNextProblem();
    }
}let score = 0;
let currentProblem = {};

// Μεταβλητή για να αποθηκεύσουμε τον "εγκέφαλο" του Desmos
let calculator;

window.onload = function() {
    const savedScore = localStorage.getItem("algebraScore");
    if (savedScore !== null) {
        score = parseInt(savedScore);
    }
    
    // Αρχικοποίηση του Desmos με Σκούρο Θέμα!
    const elt = document.getElementById('calculator');
    calculator = Desmos.GraphingCalculator(elt, {
        keypad: false,         // Κρύβει το πληκτρολόγιο
        expressions: false,    // Κρύβει την αριστερή στήλη με τις συναρτήσεις
        settingsMenu: false,   // Κρύβει τις ρυθμίσεις
        invertedColors: true   // ΤΕΛΕΙΟ ΓΙΑ ΤΟ DARK MODE ΜΑΣ!
    });

    updateLevel(); 
    updateUI();    
    loadNextProblem();
};

function updateLevel() {
    if (score >= 150) {
        currentLevel = 4;
    } else if (score >= 100) {
        currentLevel = 3;
    } else if (score >= 50) {
        currentLevel = 2;
    } else {
        currentLevel = 1;
    }
}

function updateUI() {
    document.getElementById("score").innerText = score;
    document.getElementById("level-display").innerText = "Επίπεδο " + currentLevel;
}

function loadNextProblem() {
    const levelProblems = problems[currentLevel];
    const randomIndex = Math.floor(Math.random() * levelProblems.length);
    currentProblem = levelProblems[randomIndex];
    
    document.getElementById("equation").innerText = currentProblem.equation;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-text").innerText = ""; 

    // Σχεδιασμός της γραφικής παράστασης!
    updateGraph();
}

function updateGraph() {
    calculator.setBlank(); // Καθαρίζει την προηγούμενη άσκηση

    // Χωρίζουμε την εξίσωση στα δύο (αριστερό και δεξί μέλος)
    let parts = currentProblem.equation.split('=');
    let leftSide = parts[0].trim();
    let rightSide = parts[1].trim();

    // Λέμε στον Desmos να ζωγραφίσει το αριστερό μέλος (y = ...) με μοβ χρώμα
    calculator.setExpression({ id: 'left', latex: 'y = ' + leftSide, color: '#bb86fc' });
    // Και το δεξί μέλος (y = ...) με γαλάζιο χρώμα
    calculator.setExpression({ id: 'right', latex: 'y = ' + rightSide, color: '#03dac6' });

    // Κεντράρουμε την κάμερα ώστε να φαίνεται σίγουρα η λύση
    calculator.setMathBounds({
        left: -5,
        right: currentProblem.answer + 10,
        bottom: -5,
        top: 110 // Αρκετά ψηλά για να πιάνει και εξισώσεις όπως 10x = 100
    });
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const feedbackEl = document.getElementById("feedback");

    if (userAnswer === currentProblem.answer) {
        feedbackEl.innerText = "✅ Σωστά! +10 πόντοι";
        feedbackEl.style.color = "#03dac6"; 
        
        score += 10;
        updateLevel(); 
        updateUI();
        localStorage.setItem("algebraScore", score);

        setTimeout(loadNextProblem, 1500); 
    } else {
        feedbackEl.innerText = "❌ Λάθος. Δοκίμασε ξανά!";
        feedbackEl.style.color = "#cf6679"; 
    }
}

function showHelp() {
    const helpEl = document.getElementById("help-text");
    helpEl.innerText = "💡 Λύση: Η απάντηση είναι " + currentProblem.answer;
    
    // Όταν πατάς βοήθεια, βάζουμε μια κόκκινη κάθετη γραμμή ακριβώς πάνω στη λύση (x = απάντηση)!
    calculator.setExpression({ id: 'solutionLine', latex: 'x = ' + currentProblem.answer, color: '#cf6679', lineStyle: Desmos.Styles.DASHED });
}

function skipProblem() {
    const feedbackEl = document.getElementById("feedback");
    feedbackEl.innerText = "⏭️ Πάμε στην επόμενη...";
    feedbackEl.style.color = "#bb86fc"; 
    
    setTimeout(loadNextProblem, 1000);
}

function resetProgress() {
    if (confirm("Είσαι σίγουρος ότι θέλεις να μηδενίσεις την πρόοδό σου;")) {
        score = 0;
        currentLevel = 1;
        updateUI();
        localStorage.removeItem("algebraScore");
        loadNextProblem();
    }
}
