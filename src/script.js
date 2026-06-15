if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
const soundCorrect = new Audio('correct.mp3');
const soundFail = new Audio('fail.mp3');

let consecutiveCorrect = 0;
let consecutiveWrong = 0;
let score = 0, currentProblem = {}, timerInterval, seconds = 0, calculator, sciCalculator;
let currentLang = "el";
let userStats = JSON.parse(localStorage.getItem("mathUserStats")) || { played: 0, correct: 0, wrong: 0 };
let lastFocusedInput = "answer";
let currentGeoAnswer = 0;
let currentGeoProblem = { formula: "", steps: [] };
let currentTrigAnswer = 0;
let currentTrigProblem = { formula: "", steps: [] };
let currentTopologyAnswer = 0;
let currentTopologyProblem = { formula: "", steps: [] };

if (typeof educationData === 'undefined') {
    window.educationData = {
        "gym_a": { title: { el: "Α' Γυμνασίου", en: "7th Grade", fr: "5e", es: "1º ESO", it: "1ª Media", tr: "7. Sınıf", ar: "الصف السابع" } },
        "gym_b": { title: { el: "Β' Γυμνασίου", en: "8th Grade", fr: "4e", es: "2º ESO", it: "2ª Media", tr: "8. Sınıf", ar: "الصف الثامن" } },
        "gym_g": { title: { el: "Γ' Γυμνασίου", en: "9th Grade", fr: "3e", es: "3º ESO", it: "3ª Media", tr: "9. Sınıf", ar: "الصف التاسع" } },
        "lyc_a": { title: { el: "Α' Λυκείου", en: "10th Grade", fr: "2de", es: "4º ESO", it: "1ª Superiore", tr: "10. Sınıf", ar: "الصف العاشر" } }
    };
}

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΑΣΦΑΛΕΙΑΣ ---
function sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}
window.sanitizeInput = sanitizeInput;

function safeSetText(id, text) { const el = document.getElementById(id); if (el) el.innerText = text; }
function safeSetHTML(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
function safeSetPlaceholder(id, text) { const el = document.getElementById(id); if (el) el.placeholder = text; }

window.updateGameData = function (cloudScore, cloudStats) {
    if (cloudScore !== undefined) score = cloudScore;
    if (cloudStats !== undefined) userStats = cloudStats;

    safeSetText("score", score);
    updateRank();
    if (typeof updateStatsUI === "function") updateStatsUI();

    localStorage.setItem("mathUserStats", JSON.stringify(userStats));
    localStorage.setItem("mathScore", score);

    if (window.saveToCloud) window.saveToCloud(score, userStats);
};


window.onload = function () {
    try {
        const savedStats = localStorage.getItem("mathUserStats");
        if (savedStats) userStats = JSON.parse(savedStats);

        const savedScore = localStorage.getItem("mathScore");
        if (savedScore && !isNaN(parseInt(savedScore))) score = parseInt(savedScore);

        const savedAvatar = localStorage.getItem("userAvatar");
        if (savedAvatar) {
            const mainAvatar = document.getElementById("main-avatar");
            const profileAvatar = document.getElementById("profile-avatar");
            if (mainAvatar) mainAvatar.src = savedAvatar;
            if (profileAvatar) profileAvatar.src = savedAvatar;
        }

        const sciEl = document.getElementById('scientific-calculator');
        if (sciEl && typeof Desmos !== 'undefined' && typeof Desmos.ScientificCalculator === 'function') {
            sciCalculator = Desmos.ScientificCalculator(sciEl, { invertedColors: true });
            window.sciCalculator = sciCalculator;
        }

        const calcEl = document.getElementById('calculator');
        if (calcEl && typeof Desmos !== 'undefined') {
            calculator = Desmos.GraphingCalculator(calcEl, { keypad: true, expressions: false, settingsMenu: false, invertedColors: true });
            window.calculator = calculator;
        }

        const geoEl = document.getElementById('desmos-geometry');
        if (geoEl && typeof Desmos !== 'undefined' && typeof Desmos.Geometry === 'function') {
            window.geoCalculator = Desmos.Geometry(geoEl, { language: 'el' });
        }

        window.resizeAllCalculators = function() {
            const doResize = () => {
                if (window.calculator && typeof window.calculator.resize === 'function') {
                    window.calculator.resize();
                }
                if (window.sciCalculator && typeof window.sciCalculator.resize === 'function') {
                    window.sciCalculator.resize();
                }
                if (window.geoCalculator && typeof window.geoCalculator.resize === 'function') {
                    window.geoCalculator.resize();
                }
            };
            doResize();
            setTimeout(doResize, 100);
            setTimeout(doResize, 250);
        };

        initOcrCanvas();

        safeSetText("score", score);
        updateRank();

        const ansEl = document.getElementById("answer");
        if (ansEl) ansEl.addEventListener("focus", () => lastFocusedInput = "answer");

        const notesEl = document.getElementById("user-notes");
        if (notesEl) notesEl.addEventListener("focus", () => lastFocusedInput = "user-notes");

        changeLanguage();
        startTimer();

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const aeId = document.activeElement ? document.activeElement.id : null;
                if (aeId === 'answer') checkAnswer();
                else if (aeId === 'geo-answer') window.checkContextAnswer('geometry');
                else if (aeId === 'trig-answer') window.checkContextAnswer('trig');
                else if (aeId === 'topology-answer') window.checkContextAnswer('topology');
            }
        });
    } catch (e) { console.error("OnLoad Error:", e); }
};

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        let m = Math.floor(seconds / 60), s = seconds % 60;
        safeSetText("timer", `${m}:${s < 10 ? '0' + s : s}`);
    }, 1000);
}

function populateGradeSelect() {
    const select = document.getElementById("grade-select");
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = "";
    for (const key in educationData) {
        let option = document.createElement("option");
        option.value = key;
        option.text = educationData[key].title[currentLang] || educationData[key].title["en"];
        select.appendChild(option);
    }
    if (currentVal) select.value = currentVal;
}

function changeLanguage() {
    const langSelect = document.getElementById("lang-select");
    currentLang = langSelect ? langSelect.value : "el";
    const t = translations[currentLang] || translations["el"];

    safeSetText("main-title", t.mainTitle);
    safeSetHTML("btn-login", t.btnLogin);
    safeSetText("lbl-level", t.lblLevel);
    safeSetText("lbl-select-level", t.lblSelectLevel);
    safeSetText("opt-level-1", t.optLevel1);
    safeSetText("opt-level-2", t.optLevel2);
    safeSetText("opt-level-3", t.optLevel3);
    safeSetText("opt-level-4", t.optLevel4);
    safeSetText("lbl-score", t.lblScore);
    safeSetText("lbl-time", t.lblTime);
    safeSetText("btn-secret", t.btnSecret);
    safeSetText("btn-chat-toggle", t.btnChatToggle);
    safeSetText("btn-profile", t.btnProfile);
    safeSetText("profile-title", t.profileTitle);
    safeSetText("btn-profile-close", t.btnProfileClose);
    safeSetText("lbl-badges", t.lblBadges);
    safeSetPlaceholder("answer", t.placeholderAns);
    const kbdBtn = document.getElementById("kbd-toggle-btn");
    if (kbdBtn) kbdBtn.title = t.kbdToggleTitle;
    safeSetText("btn-check", t.btnCheck);
    safeSetText("btn-help", t.btnHelp);
    safeSetText("btn-mathjs-step", t.btnMathjsStep);
    safeSetText("btn-skip", t.btnSkip);
    safeSetText("lbl-notes", t.lblNotes);
    safeSetText("btn-clear", t.btnClear);
    safeSetPlaceholder("user-notes", t.placeholderNotes);
    safeSetText("lbl-graph", t.lblGraph);
    safeSetText("btn-reset", t.btnReset);
    safeSetText("btn-stats", t.btnStats);
    safeSetText("modal-title", t.modalTitle);
    safeSetText("lbl-played", t.lblPlayed);
    safeSetText("lbl-correct", t.lblCorrect);
    safeSetText("lbl-rate", t.lblRate);
    safeSetText("btn-close", t.btnClose);
    safeSetText("chat-title", t.chatTitle);
    safeSetText("chat-msg-placeholder", t.chatMsgPlaceholder);
    safeSetText("can-1", t.can1);
    safeSetText("can-2", t.can2);
    safeSetText("can-3", t.can3);
    safeSetText("btn-chat-send", t.btnChatSend);
    safeSetText("btn-chat-close", t.btnChatClose);
    safeSetText("secret-modal-title", t.secretModalTitle);
    safeSetText("btn-secret-close", t.btnSecretClose);

    safeSetText("tab-algebra", t.tabAlgebra);
    safeSetText("tab-geometry", t.tabGeometry);
    safeSetText("tab-trig", t.tabTrig);
    safeSetText("tab-topology", t.tabTopology);
    safeSetText("tab-encyclopedia", t.tabEncyclopedia);

    // Μεταφράσεις Εγκυκλοπαίδειας
    safeSetText("encyclopedia-title", t.encyclopediaTitle);
    safeSetPlaceholder("encyclopedia-search", t.encSearchPlaceholder);
    safeSetText("filter-all", t.encFilterAll);
    safeSetText("filter-algebra", t.encFilterAlgebra);
    safeSetText("filter-geometry", t.encFilterGeometry);
    safeSetText("filter-analysis", t.encFilterAnalysis);
    safeSetText("lbl-enc-cat-explain", t.lblEncCatExplain);
    safeSetText("btn-enc-see-graph", t.btnEncSeeGraph);
    safeSetText("btn-enc-try-quiz", t.btnEncTryQuiz);
    safeSetText("btn-enc-close", t.btnEncClose);

    if (typeof renderEncyclopedia === 'function') {
        renderEncyclopedia();
    }

    safeSetPlaceholder("geo-answer", t.placeholderAns);
    safeSetPlaceholder("trig-answer", t.placeholderAns);
    safeSetPlaceholder("topology-answer", t.placeholderAns);

    safeSetText("btn-geo-check", t.btnCheck);
    safeSetText("btn-trig-check", t.btnCheck);
    safeSetText("btn-topology-check", t.btnCheck);

    safeSetText("btn-geo-next", t.btnNext || t.btnSkip);
    safeSetText("btn-trig-next", t.btnNext || t.btnSkip);
    safeSetText("btn-topology-next", t.btnNext || t.btnSkip);

    safeSetText("btn-help-geo", t.btnHelp);
    safeSetText("btn-mathjs-step-geo", t.btnMathjsStep);
    safeSetText("btn-help-trig", t.btnHelp);
    safeSetText("btn-mathjs-step-trig", t.btnMathjsStep);
    safeSetText("btn-help-top", t.btnHelp);
    safeSetText("btn-mathjs-step-top", t.btnMathjsStep);

    safeSetText("btn-ai", t.btnAI);
    safeSetText("lbl-resources", t.lblResources);
    safeSetText("lbl-about-title", t.lblAboutTitle);
    safeSetText("lbl-about-text", t.lblAboutText);

    safeSetText("ocr-instructions", t.ocrTitle);
    safeSetText("btn-ocr-clear", t.ocrClear);
    safeSetText("btn-ocr-recognize", t.ocrRecognize);

    safeSetText("legal-title", t.legalTitle);
    safeSetText("legal-welcome", t.legalWelcome);
    safeSetHTML("legal-desc-1", t.legalDesc1);
    safeSetHTML("legal-desc-2", t.legalDesc2);
    safeSetText("legal-checkbox-label", t.legalCheckbox);
    safeSetText("btn-agree", t.legalAgree);

    const modalSelect = document.getElementById("legal-lang-select");
    if (modalSelect && modalSelect.value !== currentLang) {
        modalSelect.value = currentLang;
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        if (currentLang === "el") btnLogout.innerText = "Έξοδος";
        else if (currentLang === "en") btnLogout.innerText = "Logout";
        else if (currentLang === "fr") btnLogout.innerText = "Déconnexion";
        else if (currentLang === "es") btnLogout.innerText = "Salir";
        else if (currentLang === "it") btnLogout.innerText = "Esci";
        else if (currentLang === "tr") btnLogout.innerText = "Çıkış";
        else if (currentLang === "ar") btnLogout.innerText = "تسجيل الخروج";
    }




    updateRank();
    populateGradeSelect();
    loadNextProblem();
    if (typeof window.generateContextProblem === 'function') {
        window.generateContextProblem('geometry');
        window.generateContextProblem('trig');
        window.generateContextProblem('topology');
    }
}

function changeGrade() { startTimer(); loadNextProblem(); }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function loadNextProblem() {
    try {
        const levelSelect = document.getElementById("level-select");
        const gradeSelect = document.getElementById("grade-select");
        const gradeKey = gradeSelect ? gradeSelect.value : "gym_a";
        const gradeInfo = typeof educationData !== 'undefined' ? educationData[gradeKey] : null;

        const words = translations[currentLang] ? translations[currentLang].stepWords : translations["el"].stepWords;
        let equationStr = "", correctAns = "", stepList = [];
        const level = levelSelect ? parseInt(levelSelect.value) : 1;

        if (levelSelect) {
            const diffContainer = levelSelect.parentElement;
            if (gradeInfo && gradeInfo.type === "static") {
                diffContainer.style.display = "none";
            } else {
                diffContainer.style.display = "block";
            }
        }

        if (gradeInfo && gradeInfo.type === "static" && gradeInfo.problems && gradeInfo.problems.length > 0) {
            const randIdx = Math.floor(Math.random() * gradeInfo.problems.length);
            const p = gradeInfo.problems[randIdx];
            equationStr = p.equation;
            correctAns = p.answer;
            const stepsObj = p.steps[currentLang] || p.steps["el"];
            stepList = Array.isArray(stepsObj) ? stepsObj : [stepsObj];
        } else {
            const t = translations[currentLang] || translations["el"];
            if (level === 1) {
                let x = getRandomInt(-10, 10), a = getRandomInt(1, 10), b = getRandomInt(-20, 20);
                let c = (a * x) + b;
                equationStr = `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`;
                correctAns = x.toString();
                stepList = [`${words.move} ${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`, `${words.div} x = ${x}`];
            } else if (level === 2) {
                let x = getRandomInt(-10, 10), a = getRandomInt(1, 10), c_c = getRandomInt(1, 10);
                while (a === c_c) c_c = getRandomInt(1, 10);
                let b = getRandomInt(-20, 20);
                let d = (a * x) + b - (c_c * x);
                equationStr = `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c_c}x ${d >= 0 ? "+" : "-"} ${Math.abs(d)}`;
                correctAns = x.toString();
                stepList = [`${words.move} ${a}x - ${c_c}x = ${d} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`, `${t.helpSolution || "Solution"}: x = ${x}`];
            } else if (level === 3) {
                let r1 = getRandomInt(-5, 5), r2 = getRandomInt(-5, 5);
                let b = -(r1 + r2), c = r1 * r2;
                equationStr = `x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`;
                let roots = [r1, r2].sort((a, b) => a - b);
                correctAns = r1 === r2 ? r1.toString() : `${roots[0]},${roots[1]}`;
                stepList = [`Δ = ${b}² - 4(1)(${c})`, `x₁,₂ = (-(${b}) ± √Δ) / 2`, `${t.helpSolution || "Solution"}: ${correctAns}`];
            } else if (level === 4) {
                let x = 0;
                while (x === 0) x = getRandomInt(-5, 5);
                let a = 0;
                while (a === 0) a = getRandomInt(-4, 5);
                let c_val = getRandomInt(2, 6);
                let d = getRandomInt(-8, 8);

                let b = c_val * d - a * x;

                let aStr = a === 1 ? "" : (a === -1 ? "-" : a);
                equationStr = `(${aStr}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) / ${c_val} = ${d}`;
                correctAns = x.toString();
                stepList = [`* ${c_val}`, `${words.move} x ->`, `${t.helpSolution || "Solution"}: x = ${x}`];
            }
        }

        currentProblem = { equation: equationStr, answer: correctAns, steps: stepList };
        safeSetHTML("equation", equationStr);
        safeSetValue("answer", "");
        safeSetText("feedback", "");

        const hb = document.getElementById("help-steps");
        if (hb) hb.classList.add("hidden");

        if (calculator) {
            calculator.setBlank();
            let latex = equationStr.replace('=', '-(') + ')';
            calculator.setExpression({ id: 'graph', latex: latex.replace(/x²/g, 'x^2'), color: '#bb86fc' });
        }
    } catch (e) { console.error("Error in loadNextProblem:", e); }
}

function safeSetValue(id, val) { const el = document.getElementById(id); if (el) el.value = val; }

function checkAnswer() {
    const ansEl = document.getElementById("answer");
    if (!ansEl) return;
    let userAns = ansEl.value.replace(/\s+/g, '').trim();
    let expected = currentProblem.answer;

    if (expected.includes(',') && userAns.includes(',')) {
        userAns = userAns.split(',').sort((a, b) => parseFloat(a) - parseFloat(b)).join(',');
        expected = expected.split(',').sort((a, b) => parseFloat(a) - parseFloat(b)).join(',');
    }

    userStats.played++;
    const t = translations[currentLang] || translations["el"];
    const isEl = currentLang === "el";

    if (userAns === expected) {
        userStats.correct++;
        score += 20;
        consecutiveCorrect++;
        consecutiveWrong = 0;

        let fbEl = document.getElementById("feedback");
        if (consecutiveCorrect === 3) {
            if (fbEl) {
                fbEl.innerHTML = isEl ? `Είσαι ασταμάτητος! 🚀 Μήπως ήρθε η ώρα να δοκιμάσεις το επόμενο επίπεδο δυσκολίας;` : `You're unstoppable! 🚀 Time to try the next difficulty level?`;
                fbEl.style.color = "#0A84FF"; // iOS Blue
            }
        } else {
            safeSetText("feedback", t.catSuccess[Math.floor(Math.random() * t.catSuccess.length)]);
            if (fbEl) fbEl.style.color = ""; // reset color
        }

        if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        try {
            soundCorrect.currentTime = 0;
            soundCorrect.play().catch(() => { });
        } catch (e) { }
        setTimeout(loadNextProblem, 2000);
    } else {
        consecutiveWrong++;
        consecutiveCorrect = 0;

        let fbEl = document.getElementById("feedback");
        if (consecutiveWrong >= 2) {
            const levelSelect = document.getElementById("level-select");
            const level = levelSelect ? parseInt(levelSelect.value) : 1;
            let tipMsg = "";
            if (level === 1) tipMsg = isEl ? "💡 Tip: Όταν μεταφέρεις έναν αριθμό στην άλλη πλευρά του ίσον, μην ξεχνάς να του αλλάζεις πρόσημο!" : "💡 Tip: When moving a number to the other side, change its sign!";
            else if (level === 2) tipMsg = isEl ? "💡 Tip: Μάζεψε πρώτα όλα τα x στη μία πλευρά και όλους τους αριθμούς στην άλλη." : "💡 Tip: Gather all 'x' on one side and numbers on the other.";
            else tipMsg = isEl ? "💡 Tip: Πρόσεξε καλά τις πράξεις με τα κλάσματα και τις παρενθέσεις. Κάνε το βήμα-βήμα στο πρόχειρο!" : "💡 Tip: Be careful with fractions and parentheses. Go step-by-step on the scratchpad!";

            if (fbEl) {
                fbEl.innerText = tipMsg;
                fbEl.style.color = "#FFD60A"; // iOS Yellow
            }
        } else {
            safeSetText("feedback", t.catError[Math.floor(Math.random() * t.catError.length)]);
            if (fbEl) fbEl.style.color = ""; // reset color
        }
        try {
            soundFail.currentTime = 0;
            soundFail.play().catch(() => { });
        } catch (e) { }
    }

    safeSetText("score", score);
    updateGameData();
}

window.checkContextAnswer = function (category) {
    const ids = {
        'geometry': { input: 'geo-answer', feedback: 'geo-feedback', answerVar: 'currentGeoAnswer', generator: 'geometry' },
        'trig': { input: 'trig-answer', feedback: 'trig-feedback', answerVar: 'currentTrigAnswer', generator: 'trig' },
        'topology': { input: 'topology-answer', feedback: 'topology-feedback', answerVar: 'currentTopologyAnswer', generator: 'topology' }
    };

    const config = ids[category];
    if (!config) return;

    const ansEl = document.getElementById(config.input);
    const fbEl = document.getElementById(config.feedback);
    if (!ansEl) return;

    const userAns = parseFloat(ansEl.value);
    const expected = window[config.answerVar];

    if (isNaN(userAns)) {
        if (fbEl) {
            fbEl.innerText = currentLang === 'el' ? "Βάλε αριθμό!" : "Enter a number!";
            fbEl.style.color = "#FFD60A";
        }
        return;
    }

    if (Math.abs(userAns - expected) < 0.001) {
        if (fbEl) {
            fbEl.innerText = currentLang === 'el' ? "Σωστά! 🥳" : "Correct! 🥳";
            fbEl.style.color = "#32D74B";
        }
        score += (category === 'topology' ? 20 : 15);
        userStats.correct++;
        userStats.played++;
        updateGameData();
        if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        try {
            soundCorrect.currentTime = 0;
            soundCorrect.play().catch(() => { });
        } catch (e) { }
        setTimeout(() => window.generateContextProblem(config.generator), 1500);
    } else {
        if (fbEl) {
            fbEl.innerText = currentLang === 'el' ? "Ουπς! Λάθος. Ξαναδοκίμασε." : "Oops! Wrong. Try again.";
            fbEl.style.color = "#FF453A";
        }
        userStats.wrong = (userStats.wrong || 0) + 1;
        userStats.played++;
        updateGameData();
        try {
            soundFail.currentTime = 0;
            soundFail.play().catch(() => { });
        } catch (e) { }
    }
};

window.generateContextProblem = function (category) {
    const prefix = category === 'geometry' ? 'geo' : category;
    const probEl = document.getElementById(`${prefix}-problem`);
    const inputEl = document.getElementById(`${prefix}-answer`);
    const feedbackEl = document.getElementById(`${prefix}-feedback`);

    if (inputEl) inputEl.value = "";
    if (feedbackEl) feedbackEl.innerText = "";

    const t = translations[currentLang] || translations["el"];

    if (category === 'geometry') {
        const scenario = Math.floor(Math.random() * 3);
        if (scenario === 0) {
            const a = Math.floor(Math.random() * 10) + 3;
            const b = Math.floor(Math.random() * 8) + 2;
            window.currentGeoAnswer = a * b;
            let text = t.geoScenarios[0].replace("{a}", a).replace("{b}", b);
            if (probEl) probEl.innerHTML = text;
            window.currentGeoProblem = { formula: `${a} * ${b}`, steps: [`${t.geoStepArea}: E = a · b`, `${t.stepHence}: E = ${a} · ${b}`, `${t.helpSolution}: E = ${window.currentGeoAnswer}`] };
        } else if (scenario === 1) {
            const a = Math.floor(Math.random() * 5) + 3;
            const b = Math.floor(Math.random() * 5) + 3;
            const c = Math.floor(Math.random() * 5) + 3;
            window.currentGeoAnswer = a + b + c;
            let text = t.geoScenarios[1].replace("{a}", a).replace("{b}", b).replace("{c}", c);
            if (probEl) probEl.innerHTML = text;
            window.currentGeoProblem = { formula: `${a} + ${b} + ${c}`, steps: [`${t.geoStepPerim}: P = a + b + c`, `${t.stepHence}: P = ${a} + ${b} + ${c}`, `${t.helpSolution}: P = ${window.currentGeoAnswer}`] };
        } else {
            const a = Math.floor(Math.random() * 5) + 2;
            const b = Math.floor(Math.random() * 5) + 2;
            const c = Math.floor(Math.random() * 5) + 2;
            window.currentGeoAnswer = a * b * c;
            let text = t.geoScenarios[2].replace("{a}", a).replace("{b}", b).replace("{c}", c);
            if (probEl) probEl.innerHTML = text;
            window.currentGeoProblem = { formula: `${a} * ${b} * ${c}`, steps: [`${t.geoStepVol}: V = a · b · c`, `${t.stepHence}: V = ${a} · ${b} · ${c}`, `${t.helpSolution}: V = ${window.currentGeoAnswer}`] };
        }
    } else if (category === 'trig') {
        const canvas = document.getElementById("trig-canvas");
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#0A84FF";
            ctx.lineWidth = 4;
            ctx.fillStyle = "rgba(10, 132, 255, 0.1)";
            ctx.beginPath();
            ctx.moveTo(100, 200); ctx.lineTo(300, 200); ctx.lineTo(300, 50); ctx.closePath();
            ctx.fill(); ctx.stroke();
            ctx.strokeRect(280, 180, 20, 20);
        }
        const scenario = Math.floor(Math.random() * 2);
        if (scenario === 0) {
            const multiplier = Math.floor(Math.random() * 3) + 1;
            const a = 3 * multiplier; const b = 4 * multiplier;
            window.currentTrigAnswer = 5 * multiplier;
            let text = t.trigScenarios[0].replace("{a}", a).replace("{b}", b);
            if (probEl) probEl.innerHTML = text;
            window.currentTrigProblem = { formula: `sqrt(${a}^2 + ${b}^2)`, steps: [`${t.trigStepPyth}: c² = a² + b²`, `c² = ${a}² + ${b}²`, `c = √(${a * a} + ${b * b})`, `${t.helpSolution}: c = ${window.currentTrigAnswer}`] };
        } else {
            const opposite = Math.floor(Math.random() * 5) + 1;
            window.currentTrigAnswer = 2 * opposite;
            let text = t.trigScenarios[1].replace("{opposite}", opposite);
            if (probEl) probEl.innerHTML = text;
            window.currentTrigProblem = { formula: `${opposite} / 0.5`, steps: [`${t.trigStepSin}: sin(30°) = ${t.lblOpposite} / ${t.lblHypotenuse}`, `0.5 = ${opposite} / c`, `c = ${opposite} / 0.5`, `${t.helpSolution}: c = ${window.currentTrigAnswer}`] };
        }
    } else if (category === 'topology') {
        const canvas = document.getElementById("topology-canvas");
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#32D74B"; ctx.lineWidth = 3; ctx.fillStyle = "#32D74B";
            const nodes = [[200, 50], [100, 150], [300, 150], [150, 220], [250, 220]];
            const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [1, 4], [2, 3]];
            ctx.beginPath();
            edges.forEach(e => { ctx.moveTo(nodes[e[0]][0], nodes[e[0]][1]); ctx.lineTo(nodes[e[1]][0], nodes[e[1]][1]); });
            ctx.stroke();
            nodes.forEach(n => { ctx.beginPath(); ctx.arc(n[0], n[1], 8, 0, Math.PI * 2); ctx.fill(); });
        }
        const V = Math.floor(Math.random() * 10) + 4;
        const E = V + Math.floor(Math.random() * 10) + 2;
        window.currentTopologyAnswer = 2 - V + E;
        let text = t.topScenario.replace("{V}", V).replace("{E}", E);
        if (probEl) probEl.innerHTML = text;
        window.currentTopologyProblem = { formula: `2 - ${V} + ${E}`, steps: [`${t.topStepEuler}: V - E + F = 2`, `${V} - ${E} + F = 2`, `F = 2 - ${V} + ${E}`, `${t.helpSolution}: F = ${window.currentTopologyAnswer}`] };
    }
};

// Removed duplicate trig/topology checkers and generators

function updateStatsUI() {
    safeSetText("stats-played", userStats.played);
    safeSetText("stats-correct", userStats.correct);
    let rate = userStats.played > 0 ? Math.round((userStats.correct / userStats.played) * 100) : 0;
    safeSetText("stats-rate", rate + "%");
}

function updateRank() {
    const t = translations[currentLang] || translations["el"];
    let title = t.rank1;
    if (score >= 600) title = t.rank4;
    else if (score >= 300) title = t.rank3;
    else if (score >= 100) title = t.rank2;
    safeSetText("user-rank", title);

    // Ενημέρωση του Profile Modal
    safeSetText("profile-rank", title);
    safeSetText("profile-xp", score);

    // Ενημέρωση των Badges
    const b1 = document.getElementById("badge-1");
    if (b1) {
        if (score >= 100) { b1.classList.remove("locked"); b1.title = "Ξεκλείδωτο: 100+ Πόντοι!"; } else { b1.classList.add("locked"); }
    }
    const b2 = document.getElementById("badge-2");
    if (b2) {
        if (score >= 300) { b2.classList.remove("locked"); b2.title = "Ξεκλείδωτο: 300+ Πόντοι!"; } else { b2.classList.add("locked"); }
    }
    const b3 = document.getElementById("badge-3");
    if (b3) {
        if (score >= 600) { b3.classList.remove("locked"); b3.title = "Ξεκλείδωτο: 600+ Πόντοι!"; } else { b3.classList.add("locked"); }
    }
    const b4 = document.getElementById("badge-4");
    if (b4) {
        if (score >= 1000) { b4.classList.remove("locked"); b4.title = "Ξεκλείδωτο: 1000+ Πόντοι!"; } else { b4.classList.add("locked"); }
    }

    // Υπολογισμός Progress Bar (έστω max 1000 XP)
    let progressEl = document.getElementById("profile-progress");
    if (progressEl) {
        let percent = Math.min((score / 1000) * 100, 100);
        progressEl.style.width = percent + "%";
    }
}

function showHelp() {
    const hb = document.getElementById("help-steps");
    if (hb) {
        hb.innerHTML = currentProblem.steps.map(s => "• " + s).join("<br>");
        hb.classList.remove("hidden");
    }
}

function clearNotes() {
    safeSetValue("user-notes", "");
    safeSetText("ai-response", "");
}
window.toggleStats = function () { updateStatsUI(); const sm = document.getElementById("stats-modal"); if (sm) sm.classList.toggle("hidden"); };
function skipProblem() { loadNextProblem(); }
function resetProgress() { localStorage.clear(); location.reload(); }
function insertSymbol(sym) { const input = document.getElementById(lastFocusedInput); if (input) { input.value += sym; input.focus(); } }
function toggleKeyboard() { const mk = document.getElementById("math-keyboard"); if (mk) mk.classList.toggle("hidden"); }

window.toggleChat = function () { const cm = document.getElementById("chat-modal"); if (cm) cm.classList.toggle("hidden"); };
window.toggleProfile = function () { const pm = document.getElementById("profile-modal"); if (pm) pm.classList.toggle("hidden"); };

window.uploadAvatar = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 150;
            canvas.width = MAX_SIZE;
            canvas.height = MAX_SIZE;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, MAX_SIZE, MAX_SIZE);
            
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

            try {
                localStorage.setItem("userAvatar", compressedBase64);
                const mainAvatar = document.getElementById("main-avatar");
                const profileAvatar = document.getElementById("profile-avatar");
                if (mainAvatar) mainAvatar.src = compressedBase64;
                if (profileAvatar) profileAvatar.src = compressedBase64;
            } catch (error) {
                console.error("Storage error:", error);
                alert("Σφάλμα αποθήκευσης της εικόνας. Δοκίμασε μικρότερο αρχείο.");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.exploreApp = function () {
    const landingView = document.getElementById("landing-view");
    if (landingView) landingView.style.display = "none";

    const legalAccepted = localStorage.getItem('catgebra_legal_accepted');
    if (legalAccepted !== 'true') {
        const disclaimerModal = document.getElementById("disclaimer-modal");
        if (disclaimerModal) {
            disclaimerModal.style.display = "flex";
        }
    } else {
        const loginView = document.getElementById("login-view");
        if (loginView) {
            loginView.style.display = "flex";
        }
    }
};

window.showLoginView = function () {
    const mainApp = document.getElementById("main-app");
    if (mainApp) mainApp.style.display = "none";

    const landingContainer = document.getElementById("landing-container");
    if (landingContainer) landingContainer.style.display = "flex";

    const landingView = document.getElementById("landing-view");
    if (landingView) landingView.style.display = "none";

    const loginView = document.getElementById("login-view");
    if (loginView) loginView.style.display = "flex";
};

window.goBackToLanding = function () {
    const legalAccepted = localStorage.getItem('catgebra_legal_accepted');
    if (legalAccepted === 'true') {
        const loginView = document.getElementById("login-view");
        if (loginView) loginView.style.display = "none";

        const landingContainer = document.getElementById("landing-container");
        if (landingContainer) landingContainer.style.display = "none";

        const mainApp = document.getElementById("main-app");
        if (mainApp) {
            mainApp.style.display = "block";
            if (window.resizeAllCalculators) {
                window.resizeAllCalculators();
            }
        }
    } else {
        const landingView = document.getElementById("landing-view");
        const loginView = document.getElementById("login-view");
        if (landingView && loginView) {
            loginView.style.display = "none";
            landingView.style.display = "flex";
        }
    }
};

window.submitLogin = function () {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const pass = passwordInput.value;
    if (!email || !pass) {
        alert("Παρακαλώ συμπληρώστε όλα τα πεδία! 🐾");
        return;
    }
    if (window.loginWithEmail) {
        window.loginWithEmail(email, pass);
    }
};

window.submitSignup = function () {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const pass = passwordInput.value;
    if (!email || !pass) {
        alert("Παρακαλώ συμπληρώστε όλα τα πεδία! 🐾");
        return;
    }
    if (window.signUpWithEmail) {
        window.signUpWithEmail(email, pass);
    }
};

window.toggleLegalButton = function () {
    const cb = document.getElementById('legal-checkbox');
    const btn = document.getElementById('btn-agree');
    if (cb && btn) {
        btn.disabled = !cb.checked;
        btn.style.opacity = cb.checked ? "1" : "0.5";
        btn.style.cursor = cb.checked ? "pointer" : "not-allowed";
    }
};

window.acceptLegalAgreement = function () {
    localStorage.setItem('catgebra_legal_accepted', 'true');
    const modal = document.getElementById('disclaimer-modal');
    if (modal) modal.style.display = 'none';

    const welcomeSplash = document.getElementById("welcome-splash");
    if (welcomeSplash) welcomeSplash.style.display = 'none';

    const landingContainer = document.getElementById("landing-container");
    if (landingContainer) landingContainer.style.display = 'none';

    const mainApp = document.getElementById("main-app");
    if (mainApp) {
        mainApp.style.display = 'block';
        if (window.resizeAllCalculators) {
            window.resizeAllCalculators();
        }
    }
};

window.switchTab = function (tabName) {
    const sections = {
        'algebra': document.getElementById("algebra-section"),
        'geometry': document.getElementById("geometry-section"),
        'trig': document.getElementById("trig-section"),
        'topology': document.getElementById("topology-section"),
        'encyclopedia': document.getElementById("encyclopedia-section")
    };
    const tabs = {
        'algebra': document.getElementById("tab-algebra"),
        'geometry': document.getElementById("tab-geometry"),
        'trig': document.getElementById("tab-trig"),
        'topology': document.getElementById("tab-topology"),
        'encyclopedia': document.getElementById("tab-encyclopedia")
    };

    for (let key in sections) {
        if (sections[key]) sections[key].classList.add("hidden");
        if (tabs[key]) tabs[key].classList.remove("active");
    }

    if (sections[tabName]) sections[tabName].classList.remove("hidden");
    if (tabs[tabName]) tabs[tabName].classList.add("active");

    if (tabName === 'geometry') {
        if (window.geoCalculator && typeof window.geoCalculator.resize === 'function') {
            window.geoCalculator.resize();
        }
        if (!window.currentGeoAnswer) window.generateContextProblem('geometry');
    }
    if (tabName === 'trig' && !window.currentTrigAnswer) window.generateContextProblem('trig');
    if (tabName === 'topology' && !window.currentTopologyAnswer) window.generateContextProblem('topology');
    
    if (tabName === 'encyclopedia') {
        renderEncyclopedia();
    }
};

async function sendCustomMessage() {
    const inputEl = document.getElementById("chat-input");
    const btn = document.getElementById("btn-chat-send");
    if (!inputEl || !btn) return;

    const text = inputEl.value.trim();
    if (!text) return;

    if (!window.sendChatMessage) {
        let msg = "Περίμενε να φορτώσει η σύνδεση! 🐾";
        if (currentLang === 'en') msg = "Please wait for the connection! 🐾";
        if (currentLang === 'fr') msg = "Veuillez patienter pour la connexion! 🐾";
        if (currentLang === 'tr') msg = "Lütfen bağlantıyı bekleyin! 🐾";
        alert(msg);
        return;
    }

    const originalBtnText = btn.innerText;
    btn.innerText = "Έλεγχος AI...";
    btn.disabled = true;
    inputEl.disabled = true;

    try {
        const prompt = `Αξιολόγησε αυστηρά αν το παρακάτω μήνυμα είναι υβριστικό, προσβλητικό, επικίνδυνο ή ακατάλληλο για παιδιά. Απάντησε ΜΟΝΟ με τη λέξη "ΝΑΙ" (αν είναι ακατάλληλο) ή "ΟΧΙ" (αν είναι ασφαλές): "${text}"`;
        const response = await fetch('/api/tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: prompt, type: 'moderate' })
        });

        const data = await response.json();
        const aiReply = data.reply ? data.reply.trim().toUpperCase() : "";

        // Checking if the reply contains "ΝΑΙ"
        if (aiReply.includes("ΝΑΙ")) {
            alert("Το μήνυμά σου κρίθηκε ακατάλληλο από το AI Moderator και δεν στάλθηκε. Παρακαλούμε κράτησε το chat καθαρό! 🐾");
        } else {
            await window.sendChatMessage(text);
            inputEl.value = ""; // Clear input only if sent successfully
        }
    } catch (error) {
        console.error("Σφάλμα AI Moderation:", error);
        alert("Αποτυχία σύνδεσης με τον AI Moderator. Προσπάθησε ξανά.");
    } finally {
        btn.innerText = originalBtnText;
        btn.disabled = false;
        inputEl.disabled = false;
        inputEl.focus();
    }
}

async function askAI() {
    const notesEl = document.getElementById("user-notes");
    if (!notesEl) return;
    const notes = notesEl.value.trim();

    if (!notes) { 
        safeSetText("ai-response", currentLang === 'el' ? "Γράψε πρώτα κάτι στο πρόχειρο! 🐾" : "Write something in the scratchpad first! 🐾"); 
        return; 
    }
    
    safeSetText("ai-response", currentLang === 'el' ? "Η Catgebra σκέφτεται... 💭" : "Catgebra is thinking... 💭");

    const langMap = { "el": "Greek", "en": "English", "fr": "French", "es": "Spanish", "it": "Italian", "tr": "Turkish", "ar": "Arabic" };
    const langName = langMap[currentLang] || "Greek";
    
    // Κρυφή οδηγία προς το AI για να απαντάει στη σωστή γλώσσα
    const aiPrompt = `You are a helpful, encouraging, and highly precise math tutor named Catgebra. 
You MUST respond strictly in ${langName} language. 
If the user's query is not related to math or is gibberish, kindly redirect them to ask a math question.
Provide clear, step-by-step explanations and encourage the student.
User query: ${notes}`;

    try {
        const response = await fetch('/api/tutor', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ text: aiPrompt, type: 'tutor' }) 
        });
        const data = await response.json();
        safeSetText("ai-response", data.reply);
    } catch (error) {
        console.error("Σφάλμα AI:", error);
        safeSetText("ai-response", currentLang === 'el' ? "Ουπς! Υπήρξε ένα μικρό πρόβλημα σύνδεσης. 😿" : "Oops! Connection problem. 😿");
    }
}

window.triggerCatSecret = function () {
    const secretsList = (window.michelleSecrets && window.michelleSecrets[currentLang]) ? window.michelleSecrets[currentLang] : window.michelleSecrets["el"];
    if (!secretsList || secretsList.length === 0) return;

    const randomSecret = secretsList[Math.floor(Math.random() * secretsList.length)];
    const modal = document.getElementById("secret-modal");
    const textEl = document.getElementById("secret-text");

    if (modal && textEl) {
        textEl.innerText = randomSecret;
        modal.style.display = "flex";
    } else {
        alert(randomSecret);
    }
};

function sanitizeMathExpression(str) {
    if (typeof str !== 'string') return "";
    let cleaned = str.trim();
    const safeRegex = /^[0-9a-zA-Z\+\-\*\/\=\.\,\(\)\s\^²³\u2070\u2074-\u2079\u221a\u00b7]*$/;
    if (!safeRegex.test(cleaned)) {
        throw new Error("Invalid characters in math expression");
    }
    return cleaned;
}

function formatMathString(str) {
    if (!str) return "";
    return str.replace(/\^2/g, '²')
        .replace(/\^3/g, '³')
        .replace(/\^4/g, '⁴')
        .replace(/\^5/g, '⁵')
        .replace(/\^6/g, '⁶')
        .replace(/\^7/g, '⁷')
        .replace(/\^8/g, '⁸')
        .replace(/\^9/g, '⁹')
        .replace(/\^0/g, '⁰')
        .replace(/\*/g, '·')
        .replace(/sqrt/g, '√');
}

window.analyzeSteps = function () {
    const eqText = document.getElementById("equation").innerText;
    const helpDiv = document.getElementById("help-steps");
    if (!helpDiv) return;

    const t = translations[currentLang] || translations["el"];
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = `<strong style='color: #03dac6;'>${t.helpAnalysis || "Ανάλυση με math.js"}:</strong><br>`;

    try {
        if (typeof math !== 'undefined') {
            let equationToSolve = sanitizeMathExpression(eqText);
            equationToSolve = equationToSolve.replace(/ /g, '');

            if (equationToSolve.includes('=')) {
                const parts = equationToSolve.split('=');
                let lhs = parts[0].trim();
                let rhs = parts[1].trim();

                helpDiv.innerHTML += `${t.helpOriginal || "Αρχική"}: <code>${formatMathString(lhs)} = ${formatMathString(rhs)}</code><br>`;

                let expr = `(${lhs}) - (${rhs})`;
                let rawExpr = math.simplify(expr).toString();
                let simplifiedExpr = formatMathString(rawExpr);
                helpDiv.innerHTML += `${t.helpStep1 || "Βήμα 1"} (f(x) = 0): <code>${simplifiedExpr} = 0</code><br>`;

                try {
                    
                    // Derivatives
                    let d1 = math.derivative(rawExpr, 'x');
                    let d2 = math.derivative(d1, 'x');

                    // Evaluate at x = 0 and x = 1
                    let f_0 = math.evaluate(rawExpr, { x: 0 });
                    let df_0 = d1.evaluate({ x: 0 });
                    let df_1 = d1.evaluate({ x: 1 });
                    let ddf_0 = d2.evaluate({ x: 0 });
                    let ddf_1 = d2.evaluate({ x: 1 });

                    const epsilon = 1e-9;
                    const isLinear = Math.abs(ddf_0) < epsilon && Math.abs(ddf_1) < epsilon && Math.abs(df_0 - df_1) < epsilon;

                    if (isLinear) {
                        let b = df_0; // Coefficient of x
                        let c = f_0;  // Constant term
                        if (Math.abs(b) > epsilon) {
                            let root = -c / b;
                            // Clean up float representation
                            root = Math.round(root * 1000) / 1000;
                            let step2Word = currentLang === 'el' ? "Βήμα 2 (Εύρεση συντελεστών)" : "Step 2 (Find coefficients)";
                            helpDiv.innerHTML += `${step2Word}: <code>a = ${Math.round(b*1000)/1000}, b = ${Math.round(c*1000)/1000}</code> (ax + b = 0)<br>`;
                            helpDiv.innerHTML += `${t.helpSolution || "Λύση"}: x = -b / a = <strong>${root}</strong>`;
                        } else {
                            helpDiv.innerHTML += currentLang === 'el' ? "Η εξίσωση είναι αδύνατη ή αόριστη." : "The equation is inconsistent or has infinite solutions.";
                        }
                    } else {
                        // Check if quadratic
                        let a_quad = ddf_0 / 2;
                        let b_quad = df_0;
                        let c_quad = f_0;

                        if (Math.abs(a_quad) > epsilon) {
                            let disc = b_quad * b_quad - 4 * a_quad * c_quad;
                            let step2Word = currentLang === 'el' ? "Βήμα 2 (Συντελεστές)" : "Step 2 (Coefficients)";
                            helpDiv.innerHTML += `${step2Word}: <code>a = ${Math.round(a_quad*1000)/1000}, b = ${Math.round(b_quad*1000)/1000}, c = ${Math.round(c_quad*1000)/1000}</code> (ax² + bx + c = 0)<br>`;
                            
                            if (disc > epsilon) {
                                let x1 = (-b_quad + Math.sqrt(disc)) / (2 * a_quad);
                                let x2 = (-b_quad - Math.sqrt(disc)) / (2 * a_quad);
                                x1 = Math.round(x1 * 1000) / 1000;
                                x2 = Math.round(x2 * 1000) / 1000;
                                let roots = [x1, x2].sort((a,b) => a - b);
                                helpDiv.innerHTML += `Διακρίνουσα Δ = b² - 4ac = ${Math.round(disc*1000)/1000}<br>`;
                                helpDiv.innerHTML += `${t.helpSolution || "Λύση"}: x₁ = <strong>${roots[0]}</strong>, x₂ = <strong>${roots[1]}</strong>`;
                            } else if (Math.abs(disc) < epsilon) {
                                let x_double = -b_quad / (2 * a_quad);
                                x_double = Math.round(x_double * 1000) / 1000;
                                helpDiv.innerHTML += `Διακρίνουσα Δ = 0<br>`;
                                helpDiv.innerHTML += `${t.helpSolution || "Λύση"}: Διπλή ρίζα x = <strong>${x_double}</strong>`;
                            } else {
                                helpDiv.innerHTML += `Διακρίνουσα Δ < 0 (Δ = ${Math.round(disc*1000)/1000})<br>`;
                                helpDiv.innerHTML += currentLang === 'el' ? "Δεν υπάρχουν πραγματικές ρίζες." : "No real roots exist.";
                            }
                        } else {
                            helpDiv.innerHTML += t.helpError || "Δεν ήταν δυνατή η ανάλυση της εξίσωσης.";
                        }
                    }
                } catch (err) {
                    console.error("Step derivative error:", err);
                    helpDiv.innerHTML += t.helpError || "Η εξίσωση δεν είναι απλή γραμμική ή δευτεροβάθμια.";
                }

            } else {
                let simplified = formatMathString(math.simplify(equationToSolve).toString());
                helpDiv.innerHTML += `Απλοποίηση: ${simplified}`;
            }
        } else {
            helpDiv.innerHTML += "Σφάλμα: Η βιβλιοθήκη math.js δεν φόρτωσε!";
        }
    } catch (e) {
        console.error(e);
        helpDiv.innerHTML += (t.helpError || "Δεν ήταν δυνατή η ανάλυση με τη math.js. Μάλλον η εξίσωση είναι πολύπλοκη!");
    }
};

window.showGeoHelp = function () {
    const helpDiv = document.getElementById("geo-help-steps");
    if (!helpDiv) return;
    const t = translations[currentLang] || translations["el"];
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = `<strong>${t.helpStepsTitle || "Βήματα Επίλυσης"}:</strong><br>` + currentGeoProblem.steps.join("<br>");
};

window.analyzeGeoSteps = function () {
    const helpDiv = document.getElementById("geo-help-steps");
    if (!helpDiv) return;
    const t = translations[currentLang] || translations["el"];
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = `<strong style='color: #03dac6;'>${t.helpAnalysis || "Ανάλυση με math.js"}:</strong><br>`;
    if (typeof math !== 'undefined') {
        try {
            let formula = sanitizeMathExpression(currentGeoProblem.formula);
            let simplified = formatMathString(math.simplify(formula).toString());
            helpDiv.innerHTML += `${t.helpAction || "Πράξη"}: <code>${formatMathString(formula)}</code><br>`;
            helpDiv.innerHTML += `${t.helpResult || "Αποτέλεσμα"}: <strong>${simplified}</strong>`;
        } catch (e) {
            helpDiv.innerHTML += (t.helpError || "Η πράξη δεν μπορεί να αναλυθεί περαιτέρω από το math.js.");
        }
    } else {
        helpDiv.innerHTML += "Σφάλμα: Η βιβλιοθήκη math.js δεν φόρτωσε!";
    }
};

window.showTrigHelp = function () {
    const helpDiv = document.getElementById("trig-help-steps");
    if (!helpDiv) return;
    const t = translations[currentLang] || translations["el"];
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = `<strong>${t.helpStepsTitle || "Βήματα Επίλυσης"}:</strong><br>` + currentTrigProblem.steps.join("<br>");
};

window.analyzeTrigSteps = function () {
    const helpDiv = document.getElementById("trig-help-steps");
    if (!helpDiv) return;
    const t = translations[currentLang] || translations["el"];
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = `<strong style='color: #03dac6;'>${t.helpAnalysis || "Ανάλυση με math.js"}:</strong><br>`;
    if (typeof math !== 'undefined') {
        try {
            let formula = sanitizeMathExpression(currentTrigProblem.formula);
            let simplified = formatMathString(math.evaluate(formula).toString());
            helpDiv.innerHTML += `${t.helpAction || "Πράξη"}: <code>${formatMathString(formula)}</code><br>`;
            helpDiv.innerHTML += `${t.helpResult || "Αποτέλεσμα"}: <strong>${simplified}</strong>`;
        } catch (e) {
            helpDiv.innerHTML += (t.helpError || "Η πράξη δεν μπορεί να αναλυθεί περαιτέρω από το math.js.");
        }
    } else {
        helpDiv.innerHTML += "Σφάλμα: Η βιβλιοθήκη math.js δεν φόρτωσε!";
    }
};

window.showTopologyHelp = function () {
    const helpDiv = document.getElementById("topology-help-steps");
    if (!helpDiv) return;
    const t = translations[currentLang] || translations["el"];
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = `<strong>${t.helpStepsTitle || "Βήματα Επίλυσης"}:</strong><br>` + currentTopologyProblem.steps.join("<br>");
};

window.analyzeTopologySteps = function () {
    const helpDiv = document.getElementById("topology-help-steps");
    if (!helpDiv) return;
    const t = translations[currentLang] || translations["el"];
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = `<strong style='color: #03dac6;'>${t.helpAnalysis || "Ανάλυση με math.js"}:</strong><br>`;
    if (typeof math !== 'undefined') {
        try {
            let formula = sanitizeMathExpression(currentTopologyProblem.formula);
            let simplified = formatMathString(math.simplify(formula).toString());
            helpDiv.innerHTML += `${t.helpAction || "Πράξη"}: <code>${formatMathString(formula)}</code><br>`;
            helpDiv.innerHTML += `${t.helpResult || "Αποτέλεσμα"}: <strong>${simplified}</strong>`;
        } catch (e) {
            helpDiv.innerHTML += (t.helpError || "Η πράξη δεν μπορεί να αναλυθεί περαιτέρω από το math.js.");
        }
    } else {
        helpDiv.innerHTML += "Σφάλμα: Η βιβλιοθήκη math.js δεν φόρτωσε!";
    }
};

let ocrCanvas, ocrCtx;
let isDrawingOcr = false;

window.initOcrCanvas = function () {
    ocrCanvas = document.getElementById('ocr-canvas');
    if (!ocrCanvas) return;
    ocrCtx = ocrCanvas.getContext('2d');

    ocrCtx.fillStyle = 'white';
    ocrCtx.fillRect(0, 0, ocrCanvas.width, ocrCanvas.height);
    ocrCtx.lineWidth = 4;
    ocrCtx.lineCap = 'round';
    ocrCtx.strokeStyle = 'black';

    ocrCanvas.addEventListener('mousedown', startOcrDraw);
    ocrCanvas.addEventListener('mousemove', drawOcr);
    ocrCanvas.addEventListener('mouseup', stopOcrDraw);
    ocrCanvas.addEventListener('mouseout', stopOcrDraw);

    ocrCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); startOcrDraw(e.touches[0]); });
    ocrCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); drawOcr(e.touches[0]); });
    ocrCanvas.addEventListener('touchend', stopOcrDraw);
};

function startOcrDraw(e) {
    isDrawingOcr = true;
    const rect = ocrCanvas.getBoundingClientRect();
    const x = (e.clientX || e.pageX) - rect.left;
    const y = (e.clientY || e.pageY) - rect.top;
    ocrCtx.beginPath();
    ocrCtx.moveTo(x, y);
}

function drawOcr(e) {
    if (!isDrawingOcr) return;
    const rect = ocrCanvas.getBoundingClientRect();
    const x = (e.clientX || e.pageX) - rect.left;
    const y = (e.clientY || e.pageY) - rect.top;
    ocrCtx.lineTo(x, y);
    ocrCtx.stroke();
}

function stopOcrDraw() {
    isDrawingOcr = false;
    if (ocrCtx) ocrCtx.closePath();
}

window.clearOcrCanvas = function () {
    if (!ocrCtx) return;
    ocrCtx.fillStyle = 'white';
    ocrCtx.fillRect(0, 0, ocrCanvas.width, ocrCanvas.height);
};

window.changeLanguageFromModal = function () {
    const mainSelect = document.getElementById("lang-select");
    const modalSelect = document.getElementById("legal-lang-select");
    if (mainSelect && modalSelect) {
        mainSelect.value = modalSelect.value;
        changeLanguage();
    }
};

window.recognizeHandwriting = async function () {
    const btn = document.querySelector('.ocr-container .check-btn');
    if (!ocrCanvas || !btn) return;

    const t = translations[currentLang] || translations["el"];

    const originalText = btn.innerText;
    btn.innerText = t.ocrThinking || "Σκέφτεται...";
    btn.disabled = true;

    try {
        if (typeof Tesseract === 'undefined') {
            alert(t.ocrNotLoaded || "Το Tesseract.js OCR δεν έχει φορτώσει!");
            return;
        }

        const dataUrl = ocrCanvas.toDataURL('image/png');

        const result = await Tesseract.recognize(dataUrl, 'eng', {
            tessedit_char_whitelist: '0123456789+-*/=.,()xy'
        });

        const text = result.data.text.trim();
        if (text) {
            const input = document.getElementById("geo-answer");
            if (input) {
                // Keep numbers and math symbols
                let cleaned = text.replace(/[^0-9a-zA-Z\+\-\*\/\=\.\,\(\)]/g, "");
                cleaned = cleaned.replace(/O/g, '0').replace(/l/g, '1');
                input.value = cleaned;
            }
        } else {
            alert(t.ocrNoMatch || "Δεν καταφέραμε να αναγνωρίσουμε τι έγραψες! Δοκίμασε να γράψεις πιο καθαρά.");
        }
    } catch (err) {
        console.error("OCR Error:", err);
        alert(t.ocrError || "Σφάλμα κατά την αναγνώριση OCR.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const btnWelcomeExplore = document.getElementById("btn-welcome-explore");
    if (btnWelcomeExplore) {
        btnWelcomeExplore.addEventListener("click", () => {
            const welcomeSplash = document.getElementById("welcome-splash");
            if (welcomeSplash) welcomeSplash.style.display = "none";
        });
    }

    const btnExplore = document.getElementById("btn-explore");
    if (btnExplore) {
        btnExplore.addEventListener("click", () => {
            if (typeof window.exploreApp === 'function') {
                window.exploreApp();
            }
        });
    }
});

/* --- ENCYCLOPEDIA LOGIC --- */
let activeCategoryFilter = "all";
let activeEncyclopediaEntry = null;

window.renderEncyclopedia = function() {
    const grid = document.getElementById("encyclopedia-grid");
    if (!grid) return;

    const searchInput = document.getElementById("encyclopedia-search");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    grid.innerHTML = "";

    if (typeof encyclopediaEntries === 'undefined') {
        grid.innerHTML = "<p>Loading data...</p>";
        return;
    }

    const filtered = encyclopediaEntries.filter(entry => {
        // Category filter
        if (activeCategoryFilter !== "all" && entry.category !== activeCategoryFilter) {
            return false;
        }
        // Search query
        if (query) {
            const titleText = (entry.title[currentLang] || entry.title["en"] || "").toLowerCase();
            const formulaText = (entry.formula || "").toLowerCase();
            const defText = (entry.definition[currentLang] || entry.definition["en"] || "").toLowerCase();
            return titleText.includes(query) || formulaText.includes(query) || defText.includes(query);
        }
        return true;
    });

    if (filtered.length === 0) {
        let noResults = "Δεν βρέθηκαν αποτελέσματα! 😿";
        if (currentLang === 'en') noResults = "No results found! 😿";
        if (currentLang === 'fr') noResults = "Aucun résultat trouvé ! 😿";
        if (currentLang === 'es') noResults = "Sin resultados! 😿";
        if (currentLang === 'it') noResults = "Nessun risultato! 😿";
        if (currentLang === 'tr') noResults = "Sonuç bulunamadı! 😿";
        if (currentLang === 'ar') noResults = "لم يتم العثور على نتائج! 😿";
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #cf6679; font-weight: bold; margin-top: 20px;">${noResults}</p>`;
        return;
    }

    filtered.forEach(entry => {
        const title = entry.title[currentLang] || entry.title["en"];
        const formula = entry.formula;
        let catName = entry.category;
        const t = translations[currentLang] || translations["el"];
        if (entry.category === 'algebra') catName = t.encFilterAlgebra;
        else if (entry.category === 'geometry') catName = t.encFilterGeometry;
        else if (entry.category === 'analysis') catName = t.encFilterAnalysis;

        const card = document.createElement("div");
        card.className = "encyclopedia-card";
        card.onclick = () => showEncyclopediaEntry(entry.id);
        card.innerHTML = `
            <div class="card-category">${catName}</div>
            <h3>${title}</h3>
            <div class="card-formula">${formula}</div>
        `;
        grid.appendChild(card);
    });
};

window.filterCategory = function(cat) {
    activeCategoryFilter = cat;
    
    // Update active filter button state
    const buttons = document.querySelectorAll(".category-filters .filter-btn");
    buttons.forEach(btn => {
        if (btn.id === `filter-${cat}`) {
            btn.classList.add("active");
            btn.style.borderColor = "#03dac6";
        } else {
            btn.classList.remove("active");
            btn.style.borderColor = "";
        }
    });

    renderEncyclopedia();
};

window.searchEncyclopedia = function() {
    renderEncyclopedia();
};

window.showEncyclopediaEntry = function(id) {
    if (typeof encyclopediaEntries === 'undefined') return;
    const entry = encyclopediaEntries.find(e => e.id === id);
    if (!entry) return;

    activeEncyclopediaEntry = entry;

    const overlay = document.getElementById("entry-details-overlay");
    const titleEl = document.getElementById("entry-detail-title");
    const catEl = document.getElementById("entry-detail-category");
    const formulaEl = document.getElementById("entry-detail-formula");
    const defEl = document.getElementById("entry-detail-definition");
    const adviceEl = document.getElementById("entry-detail-advice");

    const t = translations[currentLang] || translations["el"];
    let catName = entry.category;
    if (entry.category === 'algebra') catName = t.encFilterAlgebra;
    else if (entry.category === 'geometry') catName = t.encFilterGeometry;
    else if (entry.category === 'analysis') catName = t.encFilterAnalysis;

    if (titleEl) titleEl.innerText = entry.title[currentLang] || entry.title["en"];
    if (catEl) catEl.innerText = catName;
    if (formulaEl) formulaEl.innerText = entry.formula;
    if (defEl) defEl.innerText = entry.definition[currentLang] || entry.definition["en"];
    if (adviceEl) adviceEl.innerText = entry.catAdvice[currentLang] || entry.catAdvice["en"];

    if (overlay) overlay.classList.remove("hidden");
};

window.closeEncyclopediaEntry = function() {
    const overlay = document.getElementById("entry-details-overlay");
    if (overlay) overlay.classList.add("hidden");
    activeEncyclopediaEntry = null;
};

window.plotEncyclopediaGraph = function() {
    if (!activeEncyclopediaEntry) return;
    const latex = activeEncyclopediaEntry.latex;
    if (!latex || !calculator) return;

    // Load in calculator
    calculator.setBlank();
    calculator.setExpression({ id: 'graph', latex: latex, color: '#bb86fc' });

    // Close entry details modal
    closeEncyclopediaEntry();

    // Scroll to the calculator with smooth animation
    const calcEl = document.getElementById("calculator");
    if (calcEl) {
        calcEl.scrollIntoView({ behavior: "smooth", block: "center" });
        // Briefly glow the calculator border to draw the user's attention!
        calcEl.style.boxShadow = "0 0 25px rgba(187, 134, 252, 0.8)";
        setTimeout(() => {
            calcEl.style.boxShadow = "";
        }, 1500);
    }
};

window.tryEncyclopediaPractice = function() {
    if (!activeEncyclopediaEntry) return;
    const grade = activeEncyclopediaEntry.grade;
    
    // Close the modal
    closeEncyclopediaEntry();

    // Switch to algebra (Math) tab
    switchTab('algebra');

    // Select the correct grade in the dropdown
    const gradeSelect = document.getElementById("grade-select");
    if (gradeSelect) {
        gradeSelect.value = grade;
        // Trigger manual change event
        changeGrade();
    }

    // Scroll to the quiz box
    const quizEl = document.querySelector(".quiz-box");
    if (quizEl) {
        quizEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
};


window.startTimer = startTimer;
window.populateGradeSelect = populateGradeSelect;
window.changeLanguage = changeLanguage;
window.changeGrade = changeGrade;
window.loadNextProblem = loadNextProblem;
window.checkAnswer = checkAnswer;
window.updateStatsUI = updateStatsUI;
window.updateRank = updateRank;
window.showHelp = showHelp;
window.clearNotes = clearNotes;
window.skipProblem = skipProblem;
window.resetProgress = resetProgress;
window.insertSymbol = insertSymbol;
window.toggleKeyboard = toggleKeyboard;

// Ensure variables that might be used globally are available
window.getScore = () => score;
window.getUserStats = () => userStats;
