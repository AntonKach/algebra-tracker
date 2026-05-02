const educationData = {
    gym_a: {
        title: "Α' Γυμνασίου",
        problems: [
            { equation: "x + 12 = 20", answer: "8", steps: ["Αφαιρούμε το 12 και από τα δύο μέλη.", "x = 20 - 12", "x = 8"] },
            { equation: "3x = 18", answer: "6", steps: ["Διαιρούμε και τα δύο μέλη με το 3.", "x = 18 / 3", "x = 6"] }
        ]
    },
    gym_b: {
        title: "Β' Γυμνασίου",
        problems: [
            { equation: "2x + 5 = 15", answer: "5", steps: ["Αφαιρούμε το 5: 2x = 10", "Διαιρούμε με το 2: x = 5"] },
            { equation: "x/2 - 1 = 3", answer: "8", steps: ["Προσθέτουμε το 1: x/2 = 4", "Πολλαπλασιάζουμε με το 2: x = 8"] }
        ]
    },
    lyc_a: {
        title: "Α' Λυκείου",
        problems: [
            { equation: "x² - 5x + 6 = 0", answer: "2,3", steps: ["Υπολογίζουμε τη Διακρίνουσα Δ = b² - 4ac", "Δ = 25 - 24 = 1", "Ρίζες: x = (5 ± √1) / 2", "x1 = 3, x2 = 2"] }
        ]
    },
    lyc_g: {
        title: "Γ' Λυκείου",
        problems: [
            { equation: "∫ 2x dx", answer: "x²", steps: ["Χρησιμοποιούμε τον κανόνα ολοκλήρωσης δύναμης.", "∫ x^n dx = (x^(n+1))/(n+1)", "Εδώ n=1, άρα (2 * x^2) / 2 = x²"] }
        ]
    }
};

let score = 0;
let currentProblem = {};
let timerInterval;
let seconds = 0;
let calculator;

window.onload = function() {
    const savedScore = localStorage.getItem("mathScore");
    if (savedScore) score = parseInt(savedScore);
    
    calculator = Desmos.GraphingCalculator(document.getElementById('calculator'), {
        keypad: false, expressions: false, invertedColors: true
    });

    document.getElementById("score").innerText = score;
    startTimer();
    changeGrade(); // Φορτώνει την πρώτη άσκηση
};

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        document.getElementById("timer").innerText = `Χρόνος: ${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`;
    }, 1000);
}

function changeGrade() {
    loadNextProblem();
    startTimer();
}

function loadNextProblem() {
    const grade = document.getElementById("grade-select").value;
    const problems = educationData[grade].problems;
    currentProblem = problems[Math.floor(Math.random() * problems.length)];
    
    document.getElementById("equation").innerText = currentProblem.equation;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-steps").classList.add("hidden");
    
    updateGraph(currentProblem.equation);
}

function insertSymbol(sym) {
    document.getElementById("answer").value += sym;
}

function toggleKeyboard() {
    document.getElementById("math-keyboard").classList.toggle("hidden");
}

function showHelp() {
    const helpBox = document.getElementById("help-steps");
    helpBox.innerHTML = "<strong>Βήματα Λύσης:</strong><br>" + currentProblem.steps.map(s => "• " + s).join("<br>");
    helpBox.classList.remove("hidden");
}

function checkAnswer() {
    const userAns = document.getElementById("answer").value.trim();
    if (userAns === currentProblem.answer) {
        score += 20;
        document.getElementById("score").innerText = score;
        document.getElementById("feedback").innerText = "✅ Εξαιρετικά! (+20 πόντοι)";
        setTimeout(loadNextProblem, 2000);
    } else {
        document.getElementById("feedback").innerText = "❌ Δοκίμασε ξανά ή δες τη βοήθεια.";
    }
}

function updateGraph(eq) {
    calculator.setBlank();
    // Απλουστευμένη λογική σχεδίασης για το παράδειγμα
    if(eq.includes("x²")) calculator.setExpression({ id: 'graph', latex: 'y = x^2 - 5x + 6', color: '#bb86fc' });
    else calculator.setExpression({ id: 'graph', latex: eq.replace('=', '-y='), color: '#bb86fc' });
}

function skipProblem() { loadNextProblem(); }

function resetProgress() {
    score = 0;
    localStorage.removeItem("mathScore");
    location.reload();
}
