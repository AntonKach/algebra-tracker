let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator;
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0 };

// --- ΟΙ ΓΑΤΙΣΙΕΣ ΑΤΑΚΕΣ ΜΑΣ 🐾 ---
const catSuccessMessages = [
    "Purr-fect! Βρήκες το x! 😻 (+20 πόντοι)",
    "Meow-gnificent! Προχωράμε! 🐾 (+20 πόντοι)",
    "Γατίσια αντανακλαστικά! Σωστή απάντηση. 😼 (+20 πόντοι)",
    "Είσαι μαθηματική γάτα! Τέλεια! 🐈 (+20 πόντοι)",
    "Νιάου! Μέχρι κι εγώ εντυπωσιάστηκα! 😺 (+20 πόντοι)"
];

const catErrorMessages = [
    "Ουπς! Μήπως πάτησα εγώ το πληκτρολόγιο; Δοκίμασε ξανά! 😿",
    "Μιάου... Κάτι δεν πήγε καλά. Δες τη βοήθεια! 🙀",
    "Όχι ακριβώς... Μην το βάζεις κάτω! 🐈‍⬛",
    "Χσσς! Λάθος υπολογισμός. Πάμε πάλι! 😾"
];

window.onload = function() {
    const savedScore = localStorage.getItem("mathScore");
    if (savedScore) score = parseInt(savedScore);
    
    calculator = Desmos.GraphingCalculator(document.getElementById('calculator'), {
        keypad: false, expressions: false, invertedColors: true
    });

    document.getElementById("score").innerText = score;
    changeGrade();
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

function changeGrade() {
    loadNextProblem();
    startTimer();
}

function generateDynamicProblem(type) {
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
                `Μεταφέρουμε το γνωστό: ${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`,
                `${a}x = ${c - b}`,
                `Διαιρούμε με το ${a}: x = ${(c - b) / a}`
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
                `Αφαιρούμε το ${c}: x/${denom} = ${result - c}`,
                `Πολλαπλασιάζουμε με το ${denom}: x = ${(result - c) * denom}`
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
        currentProblem = problems[Math.floor(Math.random() * problems.length)];
    }
    
    document.getElementById("equation").innerText = currentProblem.equation;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("help-steps").classList.add("hidden");
    
    // Καθαρίζει το πρόχειρο σημειώσεων (αν υπάρχει)
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
        
        // Επιλέγει ένα τυχαίο θετικό μήνυμα!
        const randomSuccess = catSuccessMessages[Math.floor(Math.random() * catSuccessMessages.length)];
        feedback.innerText = randomSuccess;
        
        playSound('success');
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

        setTimeout(loadNextProblem, 2500); // Το έκανα 2.5 δευτερόλεπτα για να προλαβαίνει να το διαβάσει!
    } else {
        // Επιλέγει ένα τυχαίο μήνυμα λάθους!
        const randomError = catErrorMessages[Math.floor(Math.random() * catErrorMessages.length)];
        feedback.innerText = randomError;
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
    helpBox.innerHTML = "<strong>Βήματα:</strong><br>" + currentProblem.steps.map(s => "• " + s).join("<br>");
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
