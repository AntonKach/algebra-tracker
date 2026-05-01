// Οι ασκήσεις μας. Μπορείς να προσθέσεις όσες θέλεις!
const problems = [
    { equation: "2x = 10", answer: 5 },
    { equation: "x + 7 = 12", answer: 5 },
    { equation: "3x - 4 = 11", answer: 5 },
    { equation: "x / 2 = 6", answer: 12 },
    { equation: "5x + 2 = 17", answer: 3 }
];

let currentProblemIndex = 0;
let score = 0;

// Όταν φορτώνει η σελίδα, φέρε το αποθηκευμένο σκορ
window.onload = function() {
    const savedScore = localStorage.getItem("algebraScore");
    if (savedScore !== null) {
        score = parseInt(savedScore);
    }
    document.getElementById("score").innerText = score;
    loadNextProblem();
};

function loadNextProblem() {
    // Επιλογή μιας τυχαίας άσκησης
    currentProblemIndex = Math.floor(Math.random() * problems.length);
    document.getElementById("equation").innerText = problems[currentProblemIndex].equation;
    document.getElementById("answer").value = ""; // Καθαρισμός του πεδίου
    document.getElementById("feedback").innerText = "";
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const correctAnswer = problems[currentProblemIndex].answer;
    const feedbackEl = document.getElementById("feedback");

    if (userAnswer === correctAnswer) {
        feedbackEl.innerText = "✅ Μπράβο! Σωστή απάντηση.";
        feedbackEl.style.color = "green";
        
        // Αύξηση σκορ και αποθήκευση
        score += 10;
        document.getElementById("score").innerText = score;
        localStorage.setItem("algebraScore", score); // ΕΔΩ ΑΠΟΘΗΚΕΥΕΤΑΙ Η ΠΡΟΟΔΟΣ!

        // Φόρτωση νέας άσκησης μετά από 1,5 δευτερόλεπτο
        setTimeout(loadNextProblem, 1500);
    } else {
        feedbackEl.innerText = "❌ Λάθος. Ξαναπροσπάθησε!";
        feedbackEl.style.color = "red";
    }
}

function resetProgress() {
    if (confirm("Είσαι σίγουρος ότι θέλεις να μηδενίσεις την πρόοδό σου;")) {
        score = 0;
        document.getElementById("score").innerText = score;
        localStorage.removeItem("algebraScore");
    }
}
