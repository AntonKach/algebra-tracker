const problems = {
    1: [ 
        { equation: "x + 5 = 12", answer: 7 },
        { equation: "x - 4 = 6", answer: 10 },
        { equation: "8 + x = 15", answer: 7 },
        { equation: "x - 2 = 0", answer: 2 }
    ],
    2: [ 
        { equation: "3x = 15", answer: 5 },
        { equation: "x / 2 = 8", answer: 16 },
        { equation: "4x = 20", answer: 5 },
        { equation: "10x = 100", answer: 10 }
    ],
    3: [ 
        { equation: "2x + 1 = 9", answer: 4 },
        { equation: "3x - 2 = 10", answer: 4 },
        { equation: "5x + 5 = 30", answer: 5 },
        { equation: "2x - 8 = 0", answer: 4 }
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
