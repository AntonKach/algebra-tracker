const educationData = {
    gym_a: {
        problems: [{ equation: "x + 12 = 20", answer: "8", steps: ["Αφαιρούμε το 12: x = 20 - 12", "x = 8"] }]
    },
    gym_b: {
        problems: [{ equation: "2x + 5 = 15", answer: "5", steps: ["2x = 15 - 5", "2x = 10", "x = 5"] }]
    },
    gym_g: {
        problems: [{ equation: "x² = 16", answer: "4", steps: ["Παίρνουμε ρίζα: x = √16", "x = 4"] }]
    },
    lyc_a: {
        problems: [{ equation: "x² - 5x + 6 = 0", answer: "2,3", steps: ["Δ = 25 - 24 = 1", "x = (5±1)/2", "x=2, x=3"] }]
    },
    lyc_b: {
        problems: [{ equation: "ημ(x) = 1", answer: "90", steps: ["Το ημίτονο είναι 1 στις 90 μοίρες."] }]
    },
    lyc_g: {
        problems: [{ equation: "∫ 2x dx", answer: "x²", steps: ["Κανόνας δύναμης: (2x²)/2", "x²"] }]
    }
};

let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator;

window.onload = function() {
    calculator = Desmos.GraphingCalculator(document.getElementById('calculator'), {
        keypad: false, expressions: false, invertedColors: true
    });
    changeGrade();
};

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        let m = Math.floor(seconds/60), s = seconds%60;
        document.getElementById("timer").innerText = `Χρόνος: ${m}:${s<10?'0'+s:s}`;
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
    document.getElementById("help-steps").classList.add("hidden");
    updateGraph(currentProblem.equation);
}

function updateGraph(eq) {
    calculator.setBlank();
    let latex = eq.replace('=', '-(') + ')'; // Μετατροπή για τον Desmos
    if (eq.includes('∫')) latex = "y = x^2"; // Placeholder για ολοκληρώματα
    calculator.setExpression({ id: 'graph', latex: latex, color: '#bb86fc' });
}

function checkAnswer() {
    const userAns = document.getElementById("answer").value.trim();
    const feedback = document.getElementById("feedback");
    if (userAns === currentProblem.answer) {
        score += 20;
        document.getElementById("score").innerText = score;
        feedback.innerText = "✅ Σωστά! (+20 πόντοι)";
        setTimeout(loadNextProblem, 2000);
    } else {
        feedback.innerText = "❌ Λάθος. Δες τα βήματα λύσης.";
    }
}

function showHelp() {
    const helpBox = document.getElementById("help-steps");
    helpBox.innerHTML = "<strong>Βήματα:</strong><br>" + currentProblem.steps.map(s => "• " + s).join("<br>");
    helpBox.classList.remove("hidden");
}

function insertSymbol(sym) { document.getElementById("answer").value += sym; }
function toggleKeyboard() { document.getElementById("math-keyboard").classList.toggle("hidden"); }
function skipProblem() { loadNextProblem(); }
function resetProgress() { location.reload(); }
