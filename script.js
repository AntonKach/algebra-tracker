// Οι νέες μας, εμπλουτισμένες ασκήσεις σε 4 επίπεδα!
const problems = {
    1: [ // Εύκολο: Πρόσθεση και αφαίρεση
        { equation: "x + 5 = 12", answer: 7 },
        { equation: "x - 4 = 6", answer: 10 },
        { equation: "8 + x = 15", answer: 7 },
        { equation: "x - 2 = 0", answer: 2 },
        { equation: "10 - x = 4", answer: 6 },
        { equation: "x + 15 = 25", answer: 10 }
    ],
    2: [ // Μεσαίο: Πολλαπλασιασμός, διαίρεση και απλά κλάσματα
        { equation: "3x = 15", answer: 5 },
        { equation: "x / 2 = 8", answer: 16 },
        { equation: "4x = 20", answer: 5 },
        { equation: "10x = 100", answer: 10 },
        { equation: "x / 3 = 7", answer: 21 },
        { equation: "5x = 45", answer: 9 }
    ],
    3: [ // Δύσκολο: Συνδυασμός 2 βημάτων
        { equation: "2x + 1 = 9", answer: 4 },
        { equation: "3x - 2 = 10", answer: 4 },
        { equation: "5x + 5 = 30", answer: 5 },
        { equation: "2x - 8 = 0", answer: 4 },
        { equation: "x / 2 + 3 = 8", answer: 10 },
        { equation: "4x - 5 = 11", answer: 4 }
    ],
    4: [ // Επίπεδο Master: Παρενθέσεις & x στις 2 πλευρές!
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

window.onload = function() {
    const savedScore = localStorage.getItem("algebraScore");
    if (savedScore !== null) {
        score = parseInt(savedScore);
    }
    updateLevel(); 
    updateUI();    
    loadNextProblem();
};

function updateLevel() {
    // Προσθέσαμε το Επίπεδο 4 για σκορ πάνω από 150!
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
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const feedbackEl = document.getElementById("feedback");

    if (userAnswer === currentProblem.answer) {
        feedbackEl.innerText = "✅ Μπράβο! Σωστή απάντηση.";
        feedbackEl.style.color = "green";
        
        score += 10;
        updateLevel(); 
        updateUI();
        localStorage.setItem("algebraScore", score);

        setTimeout(loadNextProblem, 1500); 
    } else {
        feedbackEl.innerText = "❌ Λάθος. Ξαναπροσπάθησε!";
        feedbackEl.style.color = "red";
    }
}

function showHelp() {
    const helpEl = document.getElementById("help-text");
    helpEl.innerText = "💡 Βοήθεια: Η σωστή απάντηση είναι " + currentProblem.answer;
}

function resetProgress() {
    if (confirm("Είσαι σίγουρος ότι θέλεις να μηδενίσεις την πρόοδό σου;")) {
        score = 0;
        currentLevel = 1;
        updateUI();
        localStorage.removeItem("algebraScore");
        loadNextProblem();
    }
}    if (score >= 100) {
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
    document.getElementById("help-text").innerText = ""; // Καθαρίζει τη βοήθεια στη νέα άσκηση
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const feedbackEl = document.getElementById("feedback");

    if (userAnswer === currentProblem.answer) {
        feedbackEl.innerText = "✅ Μπράβο! Σωστή απάντηση.";
        feedbackEl.style.color = "green";
        
        score += 10;
        updateLevel(); 
        updateUI();
        localStorage.setItem("algebraScore", score);

        setTimeout(loadNextProblem, 1500); 
    } else {
        feedbackEl.innerText = "❌ Λάθος. Ξαναπροσπάθησε!";
        feedbackEl.style.color = "red";
    }
}

// Η ΝΕΑ ΜΑΣ ΣΥΝΑΡΤΗΣΗ ΓΙΑ ΤΗ ΒΟΗΘΕΙΑ
function showHelp() {
    const helpEl = document.getElementById("help-text");
    helpEl.innerText = "💡 Βοήθεια: Η σωστή απάντηση είναι " + currentProblem.answer;
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
function updateLevel() {
    if (score >= 100) {
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
    // Παίρνει τις ασκήσεις του τρέχοντος επιπέδου
    const levelProblems = problems[currentLevel];
    // Διαλέγει μία στην τύχη
    const randomIndex = Math.floor(Math.random() * levelProblems.length);
    currentProblem = levelProblems[randomIndex];
    
    document.getElementById("equation").innerText = currentProblem.equation;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const feedbackEl = document.getElementById("feedback");

    if (userAnswer === currentProblem.answer) {
        feedbackEl.innerText = "✅ Μπράβο! Σωστή απάντηση.";
        feedbackEl.style.color = "green";
        
        score += 10;
        updateLevel(); // Ελέγχει αν ανέβηκες επίπεδο
        updateUI();
        localStorage.setItem("algebraScore", score);

        setTimeout(loadNextProblem, 1500); // 1,5 δευτερόλεπτο καθυστέρηση
    } else {
        feedbackEl.innerText = "❌ Λάθος. Ξαναπροσπάθησε!";
        feedbackEl.style.color = "red";
    }
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
