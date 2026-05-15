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
  "gym_c": { title: { el: "Γ' Γυμνασίου", en: "9th Grade", fr: "3e", es: "3º ESO", it: "3ª Media", tr: "9. Sınıf", ar: "الصف التاسع" } },
  "lyc_a": { title: { el: "Α' Λυκείου", en: "10th Grade", fr: "2de", es: "4º ESO", it: "1ª Superiore", tr: "10. Sınıf", ar: "الصف العاشر" } }
 };
}

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΑΣΦΑΛΕΙΑΣ ---
function safeSetText(id, text) { const el = document.getElementById(id); if (el) el.innerText = text; }
function safeSetHTML(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
function safeSetPlaceholder(id, text) { const el = document.getElementById(id); if (el) el.placeholder = text; }

window.updateGameData = function(cloudScore, cloudStats) {
 if (cloudScore !== undefined) score = cloudScore;
 if (cloudStats !== undefined) userStats = cloudStats;
 
 safeSetText("score", score);
 updateRank();
 if (typeof updateStatsUI === "function") updateStatsUI(); 
 
 localStorage.setItem("mathUserStats", JSON.stringify(userStats));
 localStorage.setItem("mathScore", score);
 
 if (window.saveToCloud) window.saveToCloud(score, userStats);
 };

const translations = {
 el: {
 mainTitle: "Catgebra ", btnLogin: " Σύνδεση με Google",
 lblLevel: "Επίπεδο Σπουδών:", lblSelectLevel: "Δυσκολία:", 
 optLevel1: "Επίπεδο 1: Γατάκι (ax + b = c)", optLevel2: "Επίπεδο 2: Γάτος (ax + b = cx + d)", optLevel3: "Επίπεδο 3: Τίγρης (Δευτεροβάθμιες)", optLevel4: "Επίπεδο 4: Λιοντάρι (Κλάσματα & Παρενθέσεις)",
 lblScore: "Σκορ:", lblTime: "Χρόνος:", btnSecret: " Μυστικό!", btnChatToggle: " Chat",
 placeholderAns: "Απάντηση...", kbdToggleTitle: "Εμφάνιση Μαθηματικού Πληκτρολογίου",
 btnCheck: "Έλεγχος", btnHelp: "Βήμα-Βήμα", btnMathjsStep: "Ανάλυση Βημάτων", btnSkip: "Παράλειψη",
 lblNotes: "Πρόχειρο & Υπολογιστής ", btnAI: " Έλεγχος AI", placeholderNotes: "Γράψε εδώ τις σκέψεις σου...", btnClear: " Καθαρισμός",
 lblGraph: "Γραφική Παράσταση ",
 btnReset: "Μηδενισμός", btnStats: " Στατιστικά", modalTitle: "Τα Στατιστικά μου ",
 lblPlayed: "Λυμένες Ασκήσεις:", lblCorrect: "Σωστές:", lblRate: "Ποσοστό Επιτυχίας:", btnClose: "Κλείσιμο",
 lblAboutTitle: "Σχετικά με την Catgebra ", 
 lblAboutText: "Η Catgebra δημιουργήθηκε για να κάνει την Άλγεβρα διασκεδαστική!",
 lblResources: "Πηγές Μελέτης ",
 chatTitle: "Γατό-Chat ", chatMsgPlaceholder: "Συνδέσου με Google για να δεις τα μηνύματα!",
 can1: "Γεια σε όλους! ", can2: "Αυτή η άσκηση με δυσκόλεψε! ", can3: "Μόλις ανέβηκα κατηγορία! ",
 btnChatSend: "Αποστολή ", btnChatClose: "Κλείσιμο",
 secretModalTitle: " Το Μυστικό της Μισέλ!", btnSecretClose: "Τέλεια! ",
 rank1: " Αρχάριο Γατάκι", rank2: " Έξυπνος Γάτος", rank3: " Γρήγορος Λύγκας", rank4: " Μαθηματικός Τίγρης",
 stepWords: { move: "Μεταφέρουμε:", div: "Διαιρούμε:", sub: "Αφαιρούμε:", mult: "Πολλαπλασιάζουμε:" },
 catSuccess: ["Purr-fect! Βρήκες το x! ", "Meow-gnificent! ", "Γατίσια αντανακλαστικά! "],
 catError: ["Ουπς! Μήπως πάτησα το πληκτρολόγιο; ", "Μιάου... Κάτι δεν πήγε καλά. "],
 tabMath: " Μαθηματικά", tabPhysics: " Φυσική",
 tabAlgebra: "Άλγεβρα", tabGeometry: "Γεωμετρία", tabTrig: "Τριγωνομετρία", tabTopology: "Τοπολογία",
 physicsTitle: "Εργαστήριο Φυσικής της Μισέλ ", lblPhysicsLevel: "Θέμα:",
 physOpt1: "1. Ταχύτητα (v = s/t)", physOpt2: "2. Απόσταση (s = v*t)", physOpt3: "3. Χρόνος (t = s/v)",
 btnPhysicsNext: "Επόμενο", physicsPlaceholder: "Επίλεξε θέμα για να ξεκινήσεις τα πειράματα!",
 physCheckNum: "Παρακαλώ βάλε έναν αριθμό! ",
 physScenarios1: [
 "Η Μισέλ τρέχει να πιάσει το κόκκινο λέιζερ! Διανύει {s} μέτρα σε {t} δευτερόλεπτα. Ποια είναι η ταχύτητά της; (v = s / t)",
 "Ένα ρομποτικό ποντίκι διασχίζει το σαλόνι ({s} μέτρα) σε {t} δευτερόλεπτα. Με τι ταχύτητα κινείται;",
 "Η Μισέλ άκουσε τον ήχο της κονσέρβας! Έτρεξε {s} μέτρα σε {t} δευτερόλεπτα. Βρες την ταχύτητά της."
 ],
 physScenarios2: [
 "Η Μισέλ τρέχει σταθερά με ταχύτητα {v} m/s για {t} δευτερόλεπτα κυνηγώντας μια πεταλούδα. Πόσα μέτρα διένυσε; (s = v * t)",
 "Ο Άντον περπατάει με {v} m/s για {t} δευτερόλεπτα για να πάρει τον καφέ του. Τι απόσταση κάλυψε;",
 "Ένα πουλί πετάει με ταχύτητα {v} m/s για {t} δευτερόλεπτα και η Μισέλ το κοιτάζει από το παράθυρο. Πόση απόσταση διένυσε το πουλί;"
 ],
 physScenarios3: [
 "Η απόσταση μέχρι το μπολ με το φαγητό είναι {s} μέτρα. Αν η Μισέλ τρέχει με ταχύτητα {v} m/s, σε πόσα δευτερόλεπτα θα φτάσει; (t = s / v)",
 "Ο Άντον έχει να διανύσει {s} μέτρα μέχρι το γραφείο του. Περπατάει με ταχύτητα {v} m/s. Πόσο χρόνο θα κάνει;",
 "Η Μισέλ περπατάει στον διάδρομο μήκους {s} μέτρων με ταχύτητα {v} m/s. Σε πόσα δευτερόλεπτα θα τον διασχίσει;"
 ],
 legalTitle: "Όροι Χρήσης & Ασφάλεια",
 legalWelcome: "Καλώς ήρθατε στην Catgebra. Πριν ξεκινήσουμε την περιήγηση στον κόσμο των μαθηματικών, παρακαλούμε διαβάστε τα παρακάτω:",
 legalDesc1: "<strong>Εκπαιδευτικός Σκοπός (As-Is):</strong> Η εφαρμογή παρέχεται \"ως έχει\", αποκλειστικά ως υποστηρικτικό εκπαιδευτικό βοήθημα. Δεν φέρουμε ουδεμία ευθύνη για τυχόν σφάλματα στους αλγορίθμους, στα αποτελέσματα ή για τις επιπτώσεις αυτών σε ακαδημαϊκές βαθμολογίες.",
 legalDesc2: "<strong>Ιδιωτικότητα & Δεδομένα:</strong> Ο σεβασμός στην ιδιωτικότητά σας είναι απόλυτος. Τα δεδομένα προόδου αποθηκεύονται αυστηρά και μόνο τοπικά στη συσκευή σας. Η επικοινωνία στο E2EE Chat προστατεύεται με κρυπτογράφηση από άκρο σε άκρο. Δεν έχουμε καμία δυνατότητα πρόσβασης, ανάγνωσης ή αποθήκευσης των μηνυμάτων σας.",
 legalCheckbox: "Έχω διαβάσει, κατανοώ και αποδέχομαι τους Όρους Χρήσης.",
 legalAgree: "Συμφωνώ"
 },
 en: {
 mainTitle: "Catgebra ", btnLogin: " Login with Google",
 lblLevel: "Study Level:", lblSelectLevel: "Difficulty:",
 optLevel1: "Level 1: Kitten (ax + b = c)", optLevel2: "Level 2: Cat (ax + b = cx + d)", optLevel3: "Level 3: Tiger (Quadratics)", optLevel4: "Level 4: Lion (Fractions & Parentheses)",
 lblScore: "Score:", lblTime: "Time:", btnSecret: " Secret!", btnChatToggle: " Chat",
 placeholderAns: "Answer...", kbdToggleTitle: "Show Math Keyboard",
 btnCheck: "Check", btnHelp: "Step-by-Step", btnMathjsStep: "Step Analysis", btnSkip: "Skip",
 lblNotes: "Scratchpad & Calculator ", btnAI: " AI Check", placeholderNotes: "Write your thoughts...", btnClear: " Clear",
 lblGraph: "Graph ",
 btnReset: "Reset", btnStats: " Stats", modalTitle: "My Statistics ",
 lblPlayed: "Solved:", lblCorrect: "Correct:", lblRate: "Success Rate:", btnClose: "Close",
 lblAboutTitle: "About Catgebra ", lblAboutText: "Catgebra makes Algebra fun!",
 lblResources: "Resources ",
 chatTitle: "Cat-Chat ", chatMsgPlaceholder: "Login with Google to see messages!",
 can1: "Hello everyone! ", can2: "This problem was hard! ", can3: "I just leveled up! ",
 btnChatSend: "Send ", btnChatClose: "Close",
 secretModalTitle: " Michelle's Secret!", btnSecretClose: "Purrfect! ",
 rank1: " Beginner Kitten", rank2: " Smart Cat", rank3: " Fast Lynx", rank4: " Math Tiger",
 stepWords: { move: "Move:", div: "Divide:", sub: "Subtract:", mult: "Multiply:" },
 catSuccess: ["Purr-fect! You found x! "], catError: ["Oops! Wrong answer. "],
 tabMath: " Math", tabPhysics: " Physics",
 tabAlgebra: "Algebra", tabGeometry: "Geometry", tabTrig: "Trigonometry", tabTopology: "Topology",
 physicsTitle: "Michelle's Physics Lab ", lblPhysicsLevel: "Topic:",
 physOpt1: "1. Velocity (v = s/t)", physOpt2: "2. Distance (s = v*t)", physOpt3: "3. Time (t = s/v)",
 btnPhysicsNext: "Next", physicsPlaceholder: "Select a topic to start the experiments!",
 physCheckNum: "Please enter a number! ",
 physScenarios1: [
 "Michelle runs to catch the red laser! She covers {s} meters in {t} seconds. What is her velocity? (v = s / t)",
 "A robotic mouse crosses the living room ({s} meters) in {t} seconds. What is its speed?",
 "Michelle heard the sound of the can! She ran {s} meters in {t} seconds. Find her speed."
 ],
 physScenarios2: [
 "Michelle runs at a steady speed of {v} m/s for {t} seconds chasing a butterfly. How many meters did she cover? (s = v * t)",
 "Anton walks at {v} m/s for {t} seconds to get his coffee. What distance did he cover?",
 "A bird flies at a speed of {v} m/s for {t} seconds and Michelle watches it from the window. What distance did the bird cover?"
 ],
 physScenarios3: [
 "The distance to the food bowl is {s} meters. If Michelle runs at a speed of {v} m/s, in how many seconds will she reach it? (t = s / v)",
 "Anton has to cover {s} meters to his office. He walks at a speed of {v} m/s. How much time will it take?",
 "Michelle walks in the {s}-meter corridor at a speed of {v} m/s. In how many seconds will she cross it?"
 ],
 legalTitle: "Terms of Use & Privacy",
 legalWelcome: "Welcome to Catgebra. Before we begin our math journey, please review the following:",
 legalDesc1: "<strong>Educational Purpose (As-Is):</strong> This application is provided \"as is\", strictly as a supplemental educational tool. We assume no liability for any algorithmic errors, incorrect results, or their impact on academic performance or grading.",
 legalDesc2: "<strong>Privacy & Data Security:</strong> Your privacy is absolute. Progress data is stored exclusively on your local device. Communication within the E2EE Chat is protected by end-to-end encryption. We have zero access to read, intercept, or store the content of your messages.",
 legalCheckbox: "I have read, understood, and agree to the Terms of Use.",
 legalAgree: "I Agree"
 },
 fr: {
 mainTitle: "Catgebra ", btnLogin: " Se connecter avec Google",
 lblLevel: "Niveau d'étude:", lblSelectLevel: "Difficulté:",
 optLevel1: "Niveau 1: Chaton (ax + b = c)", optLevel2: "Niveau 2: Chat (ax + b = cx + d)", optLevel3: "Niveau 3: Tigre (Second degré)", optLevel4: "Niveau 4 : Lion (Fractions et Parenthèses)",
 lblScore: "Score:", lblTime: "Temps:", btnSecret: " Secret!", btnChatToggle: " Chat",
 placeholderAns: "Réponse...", kbdToggleTitle: "Afficher le clavier mathématique",
 btnCheck: "Vérifier", btnHelp: "Étape par étape", btnMathjsStep: "Analyse des étapes", btnSkip: "Passer",
 lblNotes: "Brouillon & Calculatrice ", btnAI: " Vérification IA", placeholderNotes: "Écris tes pensées ici...", btnClear: " Effacer",
 lblGraph: "Graphique ",
 btnReset: "Réinitialiser", btnStats: " Stats", modalTitle: "Mes Statistiques ",
 lblPlayed: "Résolus:", lblCorrect: "Corrects:", lblRate: "Taux de réussite:", btnClose: "Fermer",
 lblAboutTitle: "À propos de Catgebra ", lblAboutText: "Catgebra a été créé pour rendre l'Algèbre amusante!",
 lblResources: "Ressources ",
 chatTitle: "Cat-Chat ", chatMsgPlaceholder: "Connecte-toi avec Google pour voir les messages!",
 can1: "Salut tout le monde! ", can2: "Cet exercice était difficile! ", can3: "Je viens de monter de niveau! ",
 btnChatSend: "Envoyer ", btnChatClose: "Fermer",
 secretModalTitle: " Le Secret de Michelle!", btnSecretClose: "Parfait! ",
 rank1: " Chaton Débutant", rank2: " Chat Intelligent", rank3: " Lynx Rapide", rank4: " Tigre Math.",
 stepWords: { move: "On déplace:", div: "On divise:", sub: "On soustrait:", mult: "On multiplie:" },
 catSuccess: ["Purr-fect! Tu as trouvé x! "], catError: ["Oups! Mauvaise réponse. "],
 tabMath: " Mathématiques", tabPhysics: " Physique",
 tabAlgebra: "Algèbre", tabGeometry: "Géométrie", tabTrig: "Trigonométrie", tabTopology: "Topologie",
 physicsTitle: "Laboratoire de Physique de Michelle ", lblPhysicsLevel: "Sujet:",
 physOpt1: "1. Vitesse (v = s/t)", physOpt2: "2. Distance (s = v*t)", physOpt3: "3. Temps (t = s/v)",
 btnPhysicsNext: "Suivant", physicsPlaceholder: "Sélectionnez un sujet pour commencer les expériences!",
 physCheckNum: "Veuillez entrer un nombre! ",
 physScenarios1: [
 "Michelle court pour attraper le laser rouge! Elle parcourt {s} mètres en {t} secondes. Quelle est sa vitesse ? (v = s / t)",
 "Une souris robotique traverse le salon ({s} mètres) en {t} secondes. À quelle vitesse se déplace-t-elle ?",
 "Michelle a entendu le bruit de la boîte ! Elle a couru {s} mètres en {t} secondes. Trouve sa vitesse."
 ],
 physScenarios2: [
 "Michelle court à une vitesse constante de {v} m/s pendant {t} secondes en chassant un papillon. Combien de mètres a-t-elle parcouru ? (s = v * t)",
 "Anton marche à {v} m/s pendant {t} secondes pour prendre son café. Quelle distance a-t-il couverte ?",
 "Un oiseau vole à une vitesse de {v} m/s pendant {t} secondes et Michelle le regarde par la fenêtre. Quelle distance l'oiseau a-t-il couverte ?"
 ],
 physScenarios3: [
 "La distance jusqu'à la gamelle de nourriture est de {s} mètres. Si Michelle court à une vitesse de {v} m/s, en combien de secondes l'atteindra-t-elle ? (t = s / v)",
 "Anton doit parcourir {s} mètres jusqu'à son bureau. Il marche à une vitesse de {v} m/s. Combien de temps cela prendra-t-il ?",
 "Michelle marche dans le couloir de {s} mètres à une vitesse de {v} m/s. En combien de secondes le traversera-t-elle ?"
 ],
 legalTitle: "Conditions d'Utilisation et Confidentialité",
 legalWelcome: "Bienvenue sur Catgebra. Avant de commencer, veuillez lire attentivement ce qui suit :",
 legalDesc1: "<strong>But Éducatif (En l'état) :</strong> Cette application est fournie « telle quelle », strictement comme un outil éducatif de soutien. Nous déclinons toute responsabilité en cas d'erreurs algorithmiques, de résultats inexacts ou de leur impact sur vos notes académiques.",
 legalDesc2: "<strong>Confidentialité et Données :</strong> Votre vie privée est absolue. Vos données de progression sont stockées uniquement sur votre appareil local. Les communications dans le chat E2EE sont protégées par un chiffrement de bout en bout. Nous n'avons aucun moyen d'accéder, de lire ou de stocker vos messages.",
 legalCheckbox: "J'ai lu, compris et j'accepte les Conditions d'Utilisation.",
 legalAgree: "J'accepte"
 },
 es: {
 mainTitle: "Catgebra ", btnLogin: " Iniciar sesión con Google",
 lblLevel: "Nivel de estudio:", lblSelectLevel: "Dificultad:",
 optLevel1: "Nivel 1: Gatito (ax + b = c)", optLevel2: "Nivel 2: Gato (ax + b = cx + d)", optLevel3: "Nivel 3: Tigre (Cuadráticas)", optLevel4: "Nivel 4: León (Fracciones y Paréntesis)",
 lblScore: "Puntaje:", lblTime: "Tiempo:", btnSecret: " ¡Secreto!", btnChatToggle: " Chat",
 placeholderAns: "Respuesta...", kbdToggleTitle: "Mostrar Teclado Matemático",
 btnCheck: "Comprobar", btnHelp: "Paso a paso", btnMathjsStep: "Análisis de pasos", btnSkip: "Saltar",
 lblNotes: "Borrador y Calculadora ", btnAI: " Comprobación AI", placeholderNotes: "Escribe tus pensamientos...", btnClear: " Borrar",
 lblGraph: "Gráfico ",
 btnReset: "Restablecer", btnStats: " Estadísticas", modalTitle: "Mis Estadísticas ",
 lblPlayed: "Resueltos:", lblCorrect: "Correctos:", lblRate: "Tasa de éxito:", btnClose: "Cerrar",
 lblAboutTitle: "Sobre Catgebra ", lblAboutText: "¡Catgebra hace que el álgebra sea divertida!",
 lblResources: "Recursos ",
 chatTitle: "Cat-Chat ", chatMsgPlaceholder: "¡Inicia sesión con Google para ver los mensajes!",
 can1: "¡Hola a todos! ", can2: "¡Este problema fue difícil! ", can3: "¡Acabo de subir de nivel! ",
 btnChatSend: "Enviar ", btnChatClose: "Cerrar",
 secretModalTitle: " ¡El Secreto de Michelle!", btnSecretClose: "¡Purrfecto! ",
 rank1: " Gatito Principiante", rank2: " Gato Inteligente", rank3: " Lince Rápido", rank4: " Tigre Matemático",
 stepWords: { move: "Mover:", div: "Dividir:", sub: "Restar:", mult: "Multiplicar:" },
 catSuccess: ["¡Purr-fecto! ¡Encontraste x! "], catError: ["¡Ups! Respuesta equivocada. "],
 tabMath: " Matemáticas", tabPhysics: " Física",
 tabAlgebra: "Álgebra", tabGeometry: "Geometría", tabTrig: "Trigonometría", tabTopology: "Topología",
 physicsTitle: "Laboratorio de Física de Michelle ", lblPhysicsLevel: "Tema:",
 physOpt1: "1. Velocidad (v = s/t)", physOpt2: "2. Distancia (s = v*t)", physOpt3: "3. Tiempo (t = s/v)",
 btnPhysicsNext: "Siguiente", physicsPlaceholder: "¡Selecciona un tema para comenzar los experimentos!",
 physCheckNum: "¡Por favor, ingresa un número! ",
 physScenarios1: [
 "¡Michelle corre para atrapar el láser rojo! Cubre {s} metros en {t} segundos. ¿Cuál es su velocidad? (v = s / t)",
 "Un ratón robótico cruza la sala ({s} metros) en {t} segundos. ¿Cuál es su velocidad?",
 "¡Michelle escuchó el sonido de la lata! Corrió {s} metros en {t} segundos. Encuentra su velocidad."
 ],
 physScenarios2: [
 "Michelle corre a una velocidad constante de {v} m/s durante {t} segundos persiguiendo una mariposa. ¿Cuántos metros cubrió? (s = v * t)",
 "Anton camina a {v} m/s durante {t} segundos para tomar su café. ¿Qué distancia cubrió?",
 "Un pájaro vuela a una velocidad de {v} m/s durante {t} segundos y Michelle lo observa desde la ventana. ¿Qué distancia cubrió el pájaro?"
 ],
 physScenarios3: [
 "La distancia al tazón de comida es de {s} metros. Si Michelle corre a una velocidad de {v} m/s, ¿en cuántos segundos lo alcanzará? (t = s / v)",
 "Anton tiene que cubrir {s} metros hasta su oficina. Camina a una velocidad de {v} m/s. ¿Cuánto tiempo le tomará?",
 "Michelle camina en el pasillo de {s} metros a una velocidad de {v} m/s. ¿En cuántos segundos lo cruzará?"
 ],
 legalTitle: "Términos de Uso y Privacidad",
 legalWelcome: "Bienvenido a Catgebra. Antes de comenzar, por favor revise lo siguiente:",
 legalDesc1: "<strong>Propósito Educativo (Tal cual):</strong> Esta aplicación se proporciona \"tal cual\", estrictamente como una herramienta educativa complementaria. No asumimos ninguna responsabilidad por errores algorítmicos, resultados incorrectos o su impacto en el rendimiento académico.",
 legalDesc2: "<strong>Privacidad y Datos:</strong> Su privacidad es absoluta. Los datos de progreso se almacenan exclusivamente de forma local en su dispositivo. La comunicación en el Chat E2EE está protegida por cifrado de extremo a extremo. No tenemos acceso para leer, interceptar ni almacenar el contenido de sus mensajes.",
 legalCheckbox: "He leído, comprendido y acepto los Términos de Uso.",
 legalAgree: "Acepto"
 },
 tr: {
 mainTitle: "Catgebra ", btnLogin: " Google ile Giriş",
 lblLevel: "Eğitim Seviyesi:", lblSelectLevel: "Zorluk:",
 optLevel1: "Seviye 1: Yavru Kedi (ax + b = c)", optLevel2: "Seviye 2: Kedi (ax + b = cx + d)", optLevel3: "Seviye 3: Kaplan (İkinci Dereceden)", optLevel4: "Seviye 4: Aslan (Kesirler ve Parantezler)",
 lblScore: "Puan:", lblTime: "Zaman:", btnSecret: " Sır!", btnChatToggle: " Sohbet",
 placeholderAns: "Cevap...", kbdToggleTitle: "Matematik Klavyesini Göster",
 btnCheck: "Kontrol", btnHelp: "Adım Adım", btnMathjsStep: "Adım Analizi", btnSkip: "Geç",
 lblNotes: "Karalama Defteri ", btnAI: " AI Kontrolü", placeholderNotes: "Düşüncelerini yaz...", btnClear: " Temizle",
 lblGraph: "Grafik ",
 btnReset: "Sıfırla", btnStats: " İstatistikler", modalTitle: "İstatistiklerim ",
 lblPlayed: "Çözülen:", lblCorrect: "Doğru:", lblRate: "Başarı Oranı:", btnClose: "Kapat",
 lblAboutTitle: "Catgebra Hakkında ", lblAboutText: "Catgebra matematiği eğlenceli hale getirir!",
 lblResources: "Kaynaklar ",
 chatTitle: "Kedi Sohbeti ", chatMsgPlaceholder: "Mesajları görmek için giriş yapın!",
 can1: "Herkese merhaba! ", can2: "Bu çok zordu! ", can3: "Seviye atladım! ",
 btnChatSend: "Gönder ", btnChatClose: "Kapat",
 secretModalTitle: " Michelle'in Sırrı!", btnSecretClose: "Mükemmel! ",
 rank1: " Acemi Yavru Kedi", rank2: " Akıllı Kedi", rank3: " Hızlı Vaşak", rank4: " Matematik Kaplanı",
 stepWords: { move: "Taşıyoruz:", div: "Bölüyoruz:", sub: "Çıkarıyoruz:", mult: "Çarpıyoruz:" },
 catSuccess: ["Purr-fect! x'i buldun! "], catError: ["Oops! Yanlış cevap. "],
 tabMath: " Matematik", tabPhysics: " Fizik",
 tabAlgebra: "Cebir", tabGeometry: "Geometri", tabTrig: "Trigonometri", tabTopology: "Topoloji",
 physicsTitle: "Michelle'in Fizik Laboratuvarı ", lblPhysicsLevel: "Konu:",
 physOpt1: "1. Hız (v = s/t)", physOpt2: "2. Mesafe (s = v*t)", physOpt3: "3. Zaman (t = s/v)",
 btnPhysicsNext: "Sonraki", physicsPlaceholder: "Deneylere başlamak için bir konu seçin!",
 physCheckNum: "Lütfen bir sayı girin! ",
 physScenarios1: [
 "Michelle kırmızı lazeri yakalamak için koşuyor! {t} saniyede {s} metre yol alıyor. Hızı nedir? (v = s / t)",
 "Robotik bir fare oturma odasını ({s} metre) {t} saniyede geçiyor. Hangi hızda hareket ediyor?",
 "Michelle konserve kutusunun sesini duydu! {t} saniyede {s} metre koştu. Hızını bulun."
 ],
 physScenarios2: [
 "Michelle bir kelebeği kovalarken {t} saniye boyunca sabit {v} m/s hızla koşuyor. Kaç metre yol aldı? (s = v * t)",
 "Anton kahvesini almak için {t} saniye boyunca {v} m/s hızla yürüyor. Ne kadar mesafe kat etti?",
 "Bir kuş {t} saniye boyunca {v} m/s hızla uçuyor ve Michelle onu pencereden izliyor. Kuş ne kadar mesafe kat etti?"
 ],
 physScenarios3: [
 "Yemek kabına olan mesafe {s} metredir. Michelle {v} m/s hızla koşarsa kaç saniyede ulaşır? (t = s / v)",
 "Anton'un ofisine gitmesi için {s} metre gitmesi gerekiyor. {v} m/s hızla yürüyor. Ne kadar zaman alacak?",
 "Michelle {s} metrelik koridorda {v} m/s hızla yürüyor. Kaç saniyede geçecek?"
 ],
 legalTitle: "Kullanım Koşulları ve Gizlilik",
 legalWelcome: "Catgebra'ya hoş geldiniz. Matematik dünyasına adım atmadan önce lütfen aşağıdakileri okuyun:",
 legalDesc1: "<strong>Eğitim Amacı (Olduğu Gibi / As-Is):</strong> Bu uygulama \"olduğu gibi\", yalnızca destekleyici bir eğitim aracı olarak sunulmaktadır. Algoritmik hatalar, yanlış sonuçlar veya bunların akademik notlara etkisi konusunda hiçbir sorumluluk kabul etmiyoruz.",
 legalDesc2: "<strong>Gizlilik ve Veriler:</strong> Gizliliğinize saygımız mutlaktır. İlerleme verileriniz yalnızca cihazınızda yerel olarak saklanır. E2EE Sohbet (Chat) içindeki iletişim, uçtan uca şifreleme ile korunmaktadır. Mesajlarınızın içeriğine erişme, okuma veya depolama imkanımız kesinlikle yoktur.",
 legalCheckbox: "Kullanım Koşullarını okudum, anladım ve kabul ediyorum.",
 legalAgree: "Kabul Ediyorum"
 },
 it: {
 mainTitle: "Catgebra ", btnLogin: " Accedi con Google",
 lblLevel: "Livello di studio:", lblSelectLevel: "Difficoltà:",
 optLevel1: "Livello 1: Gattino (ax + b = c)", optLevel2: "Livello 2: Gatto (ax + b = cx + d)", optLevel3: "Livello 3: Tigre (Equazioni)", optLevel4: "Livello 4: Leone (Frazioni)",
 lblScore: "Punteggio:", lblTime: "Tempo:", btnSecret: " Segreto!", btnChatToggle: " Chat",
 placeholderAns: "Risposta...", kbdToggleTitle: "Mostra Tastiera Matematica",
 btnCheck: "Controlla", btnHelp: "Passo dopo passo", btnMathjsStep: "Analisi dei passi", btnSkip: "Salta",
 lblNotes: "Bozza e Calcolatrice ", btnAI: " Controllo AI", placeholderNotes: "Scrivi i tuoi pensieri...", btnClear: " Pulisci",
 lblGraph: "Grafico ",
 btnReset: "Ripristina", btnStats: " Statistiche", modalTitle: "Le mie Statistiche ",
 lblPlayed: "Risolti:", lblCorrect: "Corretti:", lblRate: "Percentuale di successo:", btnClose: "Chiudi",
 lblAboutTitle: "A proposito di Catgebra ", lblAboutText: "Catgebra rende l'algebra divertente!",
 lblResources: "Risorse ",
 chatTitle: "Cat-Chat ", chatMsgPlaceholder: "Accedi con Google per vedere i messaggi!",
 can1: "Ciao a tutti! ", can2: "Questo problema era difficile! ", can3: "Sono appena salito di livello! ",
 btnChatSend: "Invia ", btnChatClose: "Chiudi",
 secretModalTitle: " Il Segreto di Michelle!", btnSecretClose: "Purr-fetto! ",
 rank1: " Gattino Principiante", rank2: " Gatto Intelligente", rank3: " Lince Veloce", rank4: " Tigre Matematica",
 stepWords: { move: "Spostare:", div: "Dividere:", sub: "Sottrarre:", mult: "Moltiplicare:" },
 catSuccess: ["Purr-fetto! Hai trovato x! "], catError: ["Ops! Risposta sbagliata. "],
 tabMath: " Matematica", tabPhysics: " Fisica",
 tabAlgebra: "Algebra", tabGeometry: "Geometria", tabTrig: "Trigonometria", tabTopology: "Topologia",
 physicsTitle: "Laboratorio di Fisica di Michelle ", lblPhysicsLevel: "Argomento:",
 physOpt1: "1. Velocità (v = s/t)", physOpt2: "2. Distanza (s = v*t)", physOpt3: "3. Tempo (t = s/v)",
 btnPhysicsNext: "Avanti", physicsPlaceholder: "Seleziona un argomento per iniziare gli esperimenti!",
 physCheckNum: "Per favore inserisci un numero! ",
 physScenarios1: [
 "Michelle corre per prendere il laser rosso! Copre {s} metri in {t} secondi. Qual è la sua velocità? (v = s / t)",
 "Un topo robotico attraversa il soggiorno ({s} metri) in {t} secondi. A che velocità si muove?",
 "Michelle ha sentito il suono della scatoletta! Ha corso {s} metri in {t} secondi. Trova la sua velocità."
 ],
 physScenarios2: [
 "Michelle corre a una velocità costante di {v} m/s per {t} secondi inseguendo una farfalla. Quanti metri ha percorso? (s = v * t)",
 "Anton cammina a {v} m/s per {t} secondi per prendere il suo caffè. Che distanza ha coperto?",
 "Un uccello vola a una velocità di {v} m/s per {t} secondi e Michelle lo guarda dalla finestra. Che distanza ha coperto l'uccello?"
 ],
 physScenarios3: [
 "La distanza dalla ciotola del cibo è di {s} metri. Se Michelle corre a una velocità di {v} m/s, in quanti secondi la raggiungerà? (t = s / v)",
 "Anton deve coprire {s} metri fino al suo ufficio. Cammina a una velocità di {v} m/s. Quanto tempo ci vorrà?",
 "Michelle cammina nel corridoio di {s} metri a una velocità di {v} m/s. In quanti secondi lo attraverserà?"
 ],
 legalTitle: "Termini di Utilizzo e Privacy",
 legalWelcome: "Benvenuti su Catgebra. Prima di iniziare, si prega di leggere quanto segue:",
 legalDesc1: "<strong>Scopo Educativo (Come è):</strong> Questa applicazione è fornita \"così com'è\", come strumento educativo di supporto. Non ci assumiamo alcuna responsabilità per errori algoritmici o per il loro impatto sul rendimento scolastico.",
 legalDesc2: "<strong>Privacy e Dati:</strong> La tua privacy è assoluta. I dati sui progressi sono memorizzati esclusivamente a livello locale sul tuo dispositivo. La comunicazione nella Chat E2EE è protetta da crittografia. Non abbiamo alcun accesso per leggere i tuoi messaggi.",
 legalCheckbox: "Ho letto, compreso e accetto i Termini di Utilizzo.",
 legalAgree: "Accetto"
 },
 ar: {
 mainTitle: "Catgebra ", btnLogin: " تسجيل الدخول",
 lblLevel: "مستوى الدراسة:", lblSelectLevel: "الصعوبة:",
 optLevel1: "المستوى 1: قطة صغيرة (ax + b = c)", optLevel2: "المستوى 2: قطة (ax + b = cx + d)", optLevel3: "المستوى 3: نمر (المعادلات التربيعية)", optLevel4: "المستوى 4: أسد (الكسور والأقواس)",
 lblScore: "النتيجة:", lblTime: "الوقت:", btnSecret: " سر!", btnChatToggle: " دردشة",
 placeholderAns: "الإجابة...", kbdToggleTitle: "إظهار لوحة المفاتيح الرياضية",
 btnCheck: "تحقق", btnHelp: "خطوة بخطوة", btnMathjsStep: "تحليل الخطوات", btnSkip: "تخطي",
 lblNotes: "مسودة وآلة حاسبة ", btnAI: " فحص الذكاء الاصطناعي", placeholderNotes: "اكتب أفكارك هنا...", btnClear: " مسح",
 lblGraph: "رسم بياني ",
 btnReset: "إعادة تعيين", btnStats: " إحصائيات", modalTitle: "إحصائياتي ",
 lblPlayed: "تم حلها:", lblCorrect: "صحيح:", lblRate: "معدل النجاح:", btnClose: "إغلاق",
 lblAboutTitle: "حول Catgebra ", lblAboutText: "Catgebra يجعل الجبر ممتعًا!",
 lblResources: "الموارد ",
 chatTitle: "دردشة القطط ", chatMsgPlaceholder: "سجل الدخول لرؤية الرسائل!",
 can1: "مرحبا بالجميع! ", can2: "كانت هذه المشكلة صعبة! ", can3: "لقد ارتفعت في المستوى للتو! ",
 btnChatSend: "إرسال ", btnChatClose: "إغلاق",
 secretModalTitle: " سر ميشيل!", btnSecretClose: "رائع! ",
 rank1: " قطة مبتدئة", rank2: " قطة ذكية", rank3: " وشق سريع", rank4: " نمر الرياضيات",
 stepWords: { move: "نقل:", div: "قسمة:", sub: "طرح:", mult: "ضرب:" },
 catSuccess: ["رائع! لقد وجدت x! "], catError: ["عفوا! إجابة خاطئة. "],
 tabMath: " رياضيات", tabPhysics: " فيزياء",
 tabAlgebra: "جبر", tabGeometry: "هندسة", tabTrig: "علم المثلثات", tabTopology: "طوبولوجيا",
 physicsTitle: "مختبر فيزياء ميشيل ", lblPhysicsLevel: "الموضوع:",
 physOpt1: "1. السرعة (v = s/t)", physOpt2: "2. المسافة (s = v*t)", physOpt3: "3. الوقت (t = s/v)",
 btnPhysicsNext: "التالي", physicsPlaceholder: "اختر موضوعًا لبدء التجارب!",
 physCheckNum: "الرجاء إدخال رقم! ",
 physScenarios1: [
 "تركض ميشيل للقبض على الليزر الأحمر! تقطع {s} متر في {t} ثانية. ما هي سرعتها؟ (v = s / t)",
 "فأر آلي يعبر غرفة المعيشة ({s} متر) في {t} ثانية. ما هي سرعته؟",
 "سمعت ميشيل صوت العلبة! ركضت {s} متر في {t} ثانية. جد سرعتها."
 ],
 physScenarios2: [
 "تركض ميشيل بسرعة ثابتة {v} م/ث لمدة {t} ثانية تطارد فراشة. كم متراً قطعت؟ (s = v * t)",
 "يمشي أنطون بسرعة {v} م/ث لمدة {t} ثانية للحصول على قهوته. ما المسافة التي قطعها؟",
 "يطير طائر بسرعة {v} م/ث لمدة {t} ثانية وميشيل تراقبه من النافذة. ما المسافة التي قطعها الطائر؟"
 ],
 physScenarios3: [
 "المسافة إلى وعاء الطعام هي {s} متر. إذا ركضت ميشيل بسرعة {v} م/ث، في كم ثانية ستصل؟ (t = s / v)",
 "يجب على أنطون قطع {s} متر إلى مكتبه. يمشي بسرعة {v} m/s. كم من الوقت سيستغرق؟",
 "تمشي ميشيل في الممر بطول {s} متر بسرعة {v} م/ث. في كم ثانية ستعبره؟"
 ],
 legalTitle: "شروط الاستخدام والخصوصية",
 legalWelcome: "مرحباً بك في Catgebra. قبل أن نبدأ، يرجى قراءة ما يلي:",
 legalDesc1: "<strong>الغرض التعليمي (كما هو):</strong> يتم تقديم هذا التطبيق كأداة تعليمية داعمة. لا نتحمل أي مسؤولية عن الأخطاء الخوارزمية أو النتائج غير الصحيحة أو تأثيرها على الأداء الأكاديمي.",
 legalDesc2: "<strong>الخصوصية والبيانات:</strong> خصوصيتك مطلقة. يتم تخزين بيانات التقدم محليًا فقط على جهازك. الاتصال داخل E2EE Chat محمي بتشفير من طرف إلى طرف. ليس لدينا أي وصول لقراءة محتوى رسائلك.",
 legalCheckbox: "لقد قرأت وفهمت وأوافق على شروط الاستخدام.",
 legalAgree: "أوافق"
 }
};

window.onload = function() {
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
 if (sciEl && typeof Desmos !== 'undefined' && typeof Desmos.ScientificCalculator === 'function') sciCalculator = Desmos.ScientificCalculator(sciEl, { invertedColors: true });
 
 const calcEl = document.getElementById('calculator');
 if (calcEl && typeof Desmos !== 'undefined') calculator = Desmos.GraphingCalculator(calcEl, { keypad: true, expressions: false, settingsMenu: false, invertedColors: true });

 const geoEl = document.getElementById('desmos-geometry');
 if (geoEl && typeof Desmos !== 'undefined' && typeof Desmos.Geometry === 'function') {
    window.geoCalculator = Desmos.Geometry(geoEl, { language: 'el' });
 }

 initOcrCanvas();

 safeSetText("score", score);
 updateRank();
 
 const ansEl = document.getElementById("answer");
 if (ansEl) ansEl.addEventListener("focus", () =>lastFocusedInput = "answer");
 
 const notesEl = document.getElementById("user-notes");
 if (notesEl) notesEl.addEventListener("focus", () =>lastFocusedInput = "user-notes");

 changeLanguage(); 
 startTimer();
 
 document.addEventListener('keydown', function(event) {
     if (event.key === 'Enter') {
         const aeId = document.activeElement ? document.activeElement.id : null;
         if (aeId === 'answer') checkAnswer();
         else if (aeId === 'geo-answer') window.checkGeoAnswer();
         else if (aeId === 'trig-answer') window.checkTrigAnswer();
         else if (aeId === 'topology-answer') window.checkTopologyAnswer();
     }
 });

 if (localStorage.getItem('catgebra_agreement') !== 'true') {
     const modal = document.getElementById('legal-modal');
     if (modal) modal.style.display = 'flex';
 }
 } catch (e) { console.error("OnLoad Error:", e); }
};

function startTimer() {
 clearInterval(timerInterval);
 seconds = 0;
 timerInterval = setInterval(() =>{
 seconds++;
 let m = Math.floor(seconds/60), s = seconds%60;
 safeSetText("timer", `${m}:${s<10?'0'+s:s}`);
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
 
 safeSetPlaceholder("geo-answer", t.placeholderAns);
 safeSetPlaceholder("trig-answer", t.placeholderAns);
 safeSetPlaceholder("topology-answer", t.placeholderAns);
 
 safeSetText("btn-geo-check", t.btnCheck);
 safeSetText("btn-trig-check", t.btnCheck);
 safeSetText("btn-topology-check", t.btnCheck);
 
 safeSetText("btn-geo-next", t.btnPhysicsNext || t.btnSkip);
 safeSetText("btn-trig-next", t.btnPhysicsNext || t.btnSkip);
 safeSetText("btn-topology-next", t.btnPhysicsNext || t.btnSkip);
 
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


 // Μεταφράσεις Φυσικής
 safeSetText("tab-math", t.tabMath);
 safeSetText("tab-physics", t.tabPhysics);
 safeSetText("physics-title", t.physicsTitle);
 safeSetText("lbl-physics-level", t.lblPhysicsLevel);
 safeSetText("phys-opt-1", t.physOpt1);
 safeSetText("phys-opt-2", t.physOpt2);
 safeSetText("phys-opt-3", t.physOpt3);
 safeSetText("btn-physics-next", t.btnPhysicsNext);
 safeSetPlaceholder("physics-answer", t.placeholderAns);

 updateRank();
 populateGradeSelect();
 loadNextProblem();
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

 if (gradeInfo && gradeInfo.type === "static" && gradeInfo.problems && gradeInfo.problems.length >0) {
 const randIdx = Math.floor(Math.random() * gradeInfo.problems.length);
 const p = gradeInfo.problems[randIdx];
 equationStr = p.equation;
 correctAns = p.answer;
 const stepsObj = p.steps[currentLang] || p.steps["el"];
 stepList = Array.isArray(stepsObj) ? stepsObj : [stepsObj];
 } else {
 if (level === 1) {
 let x = getRandomInt(-10, 10), a = getRandomInt(1, 10), b = getRandomInt(-20, 20);
 let c = (a * x) + b;
 equationStr = `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`;
 correctAns = x.toString();
 stepList = [`${words.move} ${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`, `${words.div} x = ${x}`];
 } else if (level === 2) {
 let x = getRandomInt(-10, 10), a = getRandomInt(1, 10), c_c = getRandomInt(1, 10);
 while(a === c_c) c_c = getRandomInt(1, 10);
 let b = getRandomInt(-20, 20);
 let d = (a * x) + b - (c_c * x);
 equationStr = `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c_c}x ${d >= 0 ? "+" : "-"} ${Math.abs(d)}`;
 correctAns = x.toString();
 stepList = [`Φέρνουμε τα x αριστερά...`, `Λύση: x = ${x}`];
 } else if (level === 3) {
 let r1 = getRandomInt(-5, 5), r2 = getRandomInt(-5, 5);
 let b = -(r1 + r2), c = r1 * r2;
 equationStr = `x² ${b>=0?'+':'-'} ${Math.abs(b)}x ${c>=0?'+':'-'} ${Math.abs(c)} = 0`;
 let roots = [r1, r2].sort((a,b) =>a - b);
 correctAns = r1 === r2 ? r1.toString() : `${roots[0]},${roots[1]}`;
 stepList = [`Λύνουμε τη δευτεροβάθμια...`, `Ρίζες: ${correctAns}`];
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
 stepList = [`Πολλαπλασιάζουμε με το ${c_val} για να διώξουμε τον παρανομαστή...`, `Χωρίζουμε γνωστούς από αγνώστους...`, `Λύση: x = ${x}`];
 }
 }

 currentProblem = { equation: equationStr, answer: correctAns, steps: stepList };
 safeSetHTML("equation", equationStr);
 safeSetValue("answer", "");
 safeSetText("feedback", "");
 
 const hb = document.getElementById("help-steps");
 if(hb) hb.classList.add("hidden");

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
 if(!ansEl) return;
 let userAns = ansEl.value.replace(/\s+/g, '').trim();
 let expected = currentProblem.answer;

 if (expected.includes(',') && userAns.includes(',')) {
 userAns = userAns.split(',').sort((a,b) =>parseFloat(a) - parseFloat(b)).join(',');
 expected = expected.split(',').sort((a,b) =>parseFloat(a) - parseFloat(b)).join(',');
 }

 userStats.played++; 
 const t = translations[currentLang] || translations["el"];

 if (userAns === expected) {
 userStats.correct++;
 score += 20;
 consecutiveCorrect++;
 consecutiveWrong = 0;
 
 let fbEl = document.getElementById("feedback");
 if (consecutiveCorrect === 3) {
   if(fbEl) {
     fbEl.innerHTML = `Είσαι ασταμάτητος! 🚀 Μήπως ήρθε η ώρα να δοκιμάσεις το επόμενο επίπεδο δυσκολίας;`;
     fbEl.style.color = "#0A84FF"; // iOS Blue
   }
 } else {
   safeSetText("feedback", t.catSuccess[Math.floor(Math.random() * t.catSuccess.length)]);
   if(fbEl) fbEl.style.color = ""; // reset color
 }
 
 if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
 try { new Audio('correct.mp3').play().catch(()=>{}); } catch(e){}
 setTimeout(loadNextProblem, 2000);
 } else {
 consecutiveWrong++;
 consecutiveCorrect = 0;
 
 let fbEl = document.getElementById("feedback");
 if (consecutiveWrong >= 2) {
   const levelSelect = document.getElementById("level-select");
   const level = levelSelect ? parseInt(levelSelect.value) : 1;
   let tipMsg = "";
   if (level === 1) tipMsg = "💡 Tip: Όταν μεταφέρεις έναν αριθμό στην άλλη πλευρά του ίσον, μην ξεχνάς να του αλλάζεις πρόσημο!";
   else if (level === 2) tipMsg = "💡 Tip: Μάζεψε πρώτα όλα τα x στη μία πλευρά και όλους τους αριθμούς στην άλλη.";
   else tipMsg = "💡 Tip: Πρόσεξε καλά τις πράξεις με τα κλάσματα και τις παρενθέσεις. Κάνε το βήμα-βήμα στο πρόχειρο!";
   
   if(fbEl) {
     fbEl.innerText = tipMsg;
     fbEl.style.color = "#FFD60A"; // iOS Yellow
   }
 } else {
   safeSetText("feedback", t.catError[Math.floor(Math.random() * t.catError.length)]);
   if(fbEl) fbEl.style.color = ""; // reset color
 }
 try { new Audio('fail.mp3').play().catch(()=>{}); } catch(e){}
 }

 safeSetText("score", score);
 updateGameData();
}

window.checkGeoAnswer = function() {
    const ansEl = document.getElementById("geo-answer");
    if(!ansEl) return;
    const userAns = parseFloat(ansEl.value);
    const fbEl = document.getElementById("geo-feedback");
    
    if (isNaN(userAns)) {
        if(fbEl) { fbEl.innerText = "Βάλε αριθμό!"; fbEl.style.color = "#FFD60A"; }
        return;
    }
    
    if (userAns === currentGeoAnswer) {
        if(fbEl) { fbEl.innerText = "Σωστά! 🥳"; fbEl.style.color = "#32D74B"; }
        score += 15;
        userStats.correct++;
        userStats.played++;
        updateGameData();
        if(typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(window.generateGeoProblem, 1500);
    } else {
        if(fbEl) { fbEl.innerText = "Ουπς! Λάθος. Ξαναδοκίμασε."; fbEl.style.color = "#FF453A"; }
        userStats.wrong = (userStats.wrong || 0) + 1;
        userStats.played++;
        updateGameData();
    }
};

window.generateGeoProblem = function() {
    const probEl = document.getElementById("geo-problem");
    const inputEl = document.getElementById("geo-answer");
    const feedbackEl = document.getElementById("geo-feedback");
    
    if(inputEl) inputEl.value = "";
    if(feedbackEl) feedbackEl.innerText = "";
    
    const scenario = Math.floor(Math.random() * 3);
    if (scenario === 0) {
        const a = Math.floor(Math.random() * 10) + 3;
        const b = Math.floor(Math.random() * 8) + 2;
        currentGeoAnswer = a * b;
        if(probEl) probEl.innerHTML = `Θέλουμε να αγοράσουμε ένα νέο χαλί για το σαλόνι. Αν ο χώρος έχει μήκος ${a} μέτρα και πλάτος ${b} μέτρα, ποιο είναι το εμβαδόν του χαλιού που χρειαζόμαστε; (E = a · b)`;
        currentGeoProblem = { formula: `${a} * ${b}`, steps: [`Εμβαδόν Ορθογωνίου: E = a · b`, `Επομένως: E = ${a} · ${b}`, `Λύση: E = ${currentGeoAnswer}`] };
    } else if (scenario === 1) {
        const a = Math.floor(Math.random() * 5) + 3;
        const b = Math.floor(Math.random() * 5) + 3;
        const c = Math.floor(Math.random() * 5) + 3;
        currentGeoAnswer = a + b + c;
        if(probEl) probEl.innerHTML = `Φτιάχνουμε ένα μικρό παρτέρι με λουλούδια σε τριγωνικό σχήμα και θέλουμε να του βάλουμε ξύλινο φράχτη γύρω γύρω. Αν οι πλευρές είναι ${a}, ${b} και ${c} μέτρα, πόσα μέτρα φράχτη πρέπει να αγοράσουμε; (P = a + b + c)`;
        currentGeoProblem = { formula: `${a} + ${b} + ${c}`, steps: [`Περίμετρος Τριγώνου: P = a + b + c`, `Επομένως: P = ${a} + ${b} + ${c}`, `Λύση: P = ${currentGeoAnswer}`] };
    } else {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 2;
        const c = Math.floor(Math.random() * 5) + 2;
        currentGeoAnswer = a * b * c;
        if(probEl) probEl.innerHTML = `Θέλουμε να οργανώσουμε την ντουλάπα με κουτιά αποθήκευσης. Αν ένα κουτί έχει διαστάσεις ${a}, ${b}, ${c} μέτρα, ποιος είναι ο όγκος του; (V = a · b · c)`;
        currentGeoProblem = { formula: `${a} * ${b} * ${c}`, steps: [`Όγκος Ορθογωνίου Παραλληλεπιπέδου: V = a · b · c`, `Επομένως: V = ${a} · ${b} · ${c}`, `Λύση: V = ${currentGeoAnswer}`] };
    }
};

window.checkTrigAnswer = function() {
    const ansEl = document.getElementById("trig-answer");
    if(!ansEl) return;
    const userAns = parseFloat(ansEl.value);
    const fbEl = document.getElementById("trig-feedback");
    
    if (isNaN(userAns)) {
        if(fbEl) { fbEl.innerText = "Βάλε αριθμό!"; fbEl.style.color = "#FFD60A"; }
        return;
    }
    
    if (userAns === currentTrigAnswer) {
        if(fbEl) { fbEl.innerText = "Σωστά! 🥳"; fbEl.style.color = "#32D74B"; }
        score += 15;
        userStats.correct++;
        userStats.played++;
        updateGameData();
        if(typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(window.generateTrigProblem, 1500);
    } else {
        if(fbEl) { fbEl.innerText = "Ουπς! Λάθος. Ξαναδοκίμασε."; fbEl.style.color = "#FF453A"; }
        userStats.wrong = (userStats.wrong || 0) + 1;
        userStats.played++;
        updateGameData();
    }
};

window.generateTrigProblem = function() {
    const probEl = document.getElementById("trig-problem");
    const inputEl = document.getElementById("trig-answer");
    const feedbackEl = document.getElementById("trig-feedback");
    
    if(inputEl) inputEl.value = "";
    if(feedbackEl) feedbackEl.innerText = "";
    
    const canvas = document.getElementById("trig-canvas");
    if(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a generic right triangle for trig
        ctx.strokeStyle = "#0A84FF";
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(10, 132, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(100, 200); // bottom left
        ctx.lineTo(300, 200); // bottom right
        ctx.lineTo(300, 50); // top right
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw right angle square
        ctx.strokeRect(280, 180, 20, 20);
    }
    
    const scenario = Math.floor(Math.random() * 2);
    if (scenario === 0) {
        const multiplier = Math.floor(Math.random() * 3) + 1;
        const a = 3 * multiplier;
        const b = 4 * multiplier;
        currentTrigAnswer = 5 * multiplier;
        if(probEl) probEl.innerHTML = `Ακουμπάμε μια σκάλα στον τοίχο για να κρεμάσουμε ένα κάδρο. Αν η βάση της σκάλας απέχει ${a} μέτρα από τον τοίχο και το ύψος μέχρι το κάδρο είναι ${b} μέτρα, τι μήκος πρέπει να έχει η σκάλα; (Πυθαγόρειο: c² = a² + b²)`;
        currentTrigProblem = { formula: `sqrt(${a}^2 + ${b}^2)`, steps: [`Πυθαγόρειο Θεώρημα: c² = a² + b²`, `c² = ${a}² + ${b}²`, `c = √(${a*a} + ${b*b})`, `Λύση: c = ${currentTrigAnswer}`] };
    } else {
        const opposite = Math.floor(Math.random() * 5) + 1;
        currentTrigAnswer = 2 * opposite;
        if(probEl) probEl.innerHTML = `Μια ξύλινη ράμπα στο κατώφλι του σπιτιού σχηματίζει γωνία 30 μοιρών με το έδαφος. Αν το ύψος του κατωφλιού (απέναντι πλευρά) είναι ${opposite} μέτρα, πόσο μήκος πρέπει να έχει η ράμπα (υποτείνουσα); (sin30° = 0.5, οπότε Υποτείνουσα = Απέναντι / 0.5)`;
        currentTrigProblem = { formula: `${opposite} / 0.5`, steps: [`Ημίτονο Γωνίας: sin(30°) = Απέναντι / Υποτείνουσα`, `0.5 = ${opposite} / c`, `c = ${opposite} / 0.5`, `Λύση: c = ${currentTrigAnswer}`] };
    }
};

window.checkTopologyAnswer = function() {
    const ansEl = document.getElementById("topology-answer");
    if(!ansEl) return;
    const userAns = parseFloat(ansEl.value);
    const fbEl = document.getElementById("topology-feedback");
    
    if (isNaN(userAns)) {
        if(fbEl) { fbEl.innerText = "Βάλε αριθμό!"; fbEl.style.color = "#FFD60A"; }
        return;
    }
    
    if (userAns === currentTopologyAnswer) {
        if(fbEl) { fbEl.innerText = "Σωστά! 🥳"; fbEl.style.color = "#32D74B"; }
        score += 20;
        userStats.correct++;
        userStats.played++;
        updateGameData();
        if(typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(window.generateTopologyProblem, 1500);
    } else {
        if(fbEl) { fbEl.innerText = "Ουπς! Λάθος. Ξαναδοκίμασε."; fbEl.style.color = "#FF453A"; }
        userStats.wrong = (userStats.wrong || 0) + 1;
        userStats.played++;
        updateGameData();
    }
};

window.generateTopologyProblem = function() {
    const probEl = document.getElementById("topology-problem");
    const inputEl = document.getElementById("topology-answer");
    const feedbackEl = document.getElementById("topology-feedback");
    
    if(inputEl) inputEl.value = "";
    if(feedbackEl) feedbackEl.innerText = "";
    
    const canvas = document.getElementById("topology-canvas");
    if(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a generic graph (polyhedron planar projection)
        ctx.strokeStyle = "#32D74B"; // green for topology
        ctx.lineWidth = 3;
        ctx.fillStyle = "#32D74B";
        
        const nodes = [[200, 50], [100, 150], [300, 150], [150, 220], [250, 220]];
        const edges = [[0,1], [0,2], [1,2], [1,3], [2,4], [3,4], [1,4], [2,3]];
        
        ctx.beginPath();
        edges.forEach(e => {
            ctx.moveTo(nodes[e[0]][0], nodes[e[0]][1]);
            ctx.lineTo(nodes[e[1]][0], nodes[e[1]][1]);
        });
        ctx.stroke();
        
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n[0], n[1], 8, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    const V = Math.floor(Math.random() * 10) + 4; // Vertices
    const E = V + Math.floor(Math.random() * 10) + 2; // Edges
    currentTopologyAnswer = 2 - V + E;
    
    if(probEl) probEl.innerHTML = `Φτιάχνουμε μια χάρτινη κατασκευή origami. Αν η κατασκευή έχει ${V} γωνίες (κορυφές - V) και ${E} τσακίσεις (ακμές - E), πόσες επίπεδες επιφάνειες (έδρες - F) έχει; (Τύπος Euler: V - E + F = 2)`;
    currentTopologyProblem = { formula: `2 - ${V} + ${E}`, steps: [`Τύπος Euler: V - E + F = 2`, `${V} - ${E} + F = 2`, `F = 2 - ${V} + ${E}`, `Λύση: F = ${currentTopologyAnswer}`] };
};

function updateStatsUI() {
 safeSetText("stats-played", userStats.played);
 safeSetText("stats-correct", userStats.correct);
 let rate = userStats.played >0 ? Math.round((userStats.correct / userStats.played) * 100) : 0;
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
 if(hb) {
 hb.innerHTML = currentProblem.steps.map(s =>"• " + s).join("<br>");
 hb.classList.remove("hidden");
 }
}

function clearNotes() { 
 safeSetValue("user-notes", ""); 
 safeSetText("ai-response", ""); 
}
window.toggleStats = function() { updateStatsUI(); const sm = document.getElementById("stats-modal"); if(sm) sm.classList.toggle("hidden"); };
function skipProblem() { loadNextProblem(); }
function resetProgress() { localStorage.clear(); location.reload(); }
function insertSymbol(sym) { const input = document.getElementById(lastFocusedInput); if(input) { input.value += sym; input.focus(); } }
function toggleKeyboard() { const mk = document.getElementById("math-keyboard"); if(mk) mk.classList.toggle("hidden"); }

window.toggleChat = function() { const cm = document.getElementById("chat-modal"); if(cm) cm.classList.toggle("hidden"); };
window.toggleProfile = function() { const pm = document.getElementById("profile-modal"); if(pm) pm.classList.toggle("hidden"); };

window.uploadAvatar = function(event) {
 const file = event.target.files[0];
 if (!file) return;

 const reader = new FileReader();
 reader.onload = function(e) {
 const base64Image = e.target.result;
 
 try {
 localStorage.setItem("userAvatar", base64Image);
 } catch (error) {
 console.error("Storage limit exceeded", error);
 alert("Η εικόνα είναι πολύ μεγάλη! Παρακαλώ διάλεξε μικρότερο αρχείο.");
 return;
 }

 const mainAvatar = document.getElementById("main-avatar");
 const profileAvatar = document.getElementById("profile-avatar");
 if (mainAvatar) mainAvatar.src = base64Image;
 if (profileAvatar) profileAvatar.src = base64Image;
 };
 reader.readAsDataURL(file);
};

window.toggleLegalButton = function() {
    const cb = document.getElementById('legal-checkbox');
    const btn = document.getElementById('btn-agree');
    if (cb && btn) {
        btn.disabled = !cb.checked;
        btn.style.opacity = cb.checked ? "1" : "0.5";
        btn.style.cursor = cb.checked ? "pointer" : "not-allowed";
    }
};

window.acceptLegalAgreement = function() {
    localStorage.setItem('catgebra_agreement', 'true');
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.switchTab = function(tabName) {
 const sections = {
  'algebra': document.getElementById("algebra-section"),
  'geometry': document.getElementById("geometry-section"),
  'trig': document.getElementById("trig-section"),
  'topology': document.getElementById("topology-section")
 };
 const tabs = {
  'algebra': document.getElementById("tab-algebra"),
  'geometry': document.getElementById("tab-geometry"),
  'trig': document.getElementById("tab-trig"),
  'topology': document.getElementById("tab-topology")
 };

 for (let key in sections) {
  if (sections[key]) sections[key].classList.add("hidden");
  if (tabs[key]) tabs[key].classList.remove("active");
 }

 if (sections[tabName]) sections[tabName].classList.remove("hidden");
 if (tabs[tabName]) tabs[tabName].classList.add("active");

 if (tabName === 'geometry' && !currentGeoAnswer) window.generateGeoProblem();
 if (tabName === 'trig' && !currentTrigAnswer) window.generateTrigProblem();
 if (tabName === 'topology' && !currentTopologyAnswer) window.generateTopologyProblem();
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
   body: JSON.stringify({ text: prompt }) 
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
 if(!notesEl) return;
 const notes = notesEl.value.trim();
 
 if (!notes) { safeSetText("ai-response", "Γράψε πρώτα κάτι στο πρόχειρο! "); return; }
 safeSetText("ai-response", "Η Catgebra σκέφτεται... ");
 
 try {
 const response = await fetch('/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: notes }) });
 const data = await response.json();
 safeSetText("ai-response", data.reply);
 } catch (error) {
 console.error("Σφάλμα AI:", error);
 safeSetText("ai-response", "Ουπς! Υπήρξε ένα μικρό πρόβλημα σύνδεσης. ");
 }
}

window.triggerCatSecret = function() {
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

window.analyzeSteps = function() {
    const eqText = document.getElementById("equation").innerText;
    const helpDiv = document.getElementById("help-steps");
    if (!helpDiv) return;

    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = "<strong style='color: #03dac6;'>Ανάλυση με math.js (Math Machine):</strong><br>";

    try {
        if (typeof math !== 'undefined') {
            let equationToSolve = eqText;
            equationToSolve = equationToSolve.replace(/ /g, '');
            
            if (equationToSolve.includes('=')) {
                const parts = equationToSolve.split('=');
                let lhs = parts[0].trim();
                let rhs = parts[1].trim();

                let simplifiedLHS = formatMathString(math.simplify(lhs).toString());
                let simplifiedRHS = formatMathString(math.simplify(rhs).toString());

                helpDiv.innerHTML += `Αρχική: <code>${formatMathString(lhs)} = ${formatMathString(rhs)}</code><br>`;
                
                let expr = `(${lhs}) - (${rhs})`;
                let simplifiedExpr = formatMathString(math.simplify(expr).toString());
                helpDiv.innerHTML += `Βήμα 1 (f(x) = 0): <code>${simplifiedExpr} = 0</code><br>`;
                
                try {
                    let rawExpr = math.simplify(expr).toString();
                    let b_val = math.evaluate(rawExpr, {x: 0});
                    let a_val = math.derivative(rawExpr, 'x').evaluate({x: 0});
                    
                    if (a_val !== 0) {
                        let root = -b_val / a_val;
                        helpDiv.innerHTML += `Βήμα 2 (Παράγωγος - Εύρεση κλίσης): <code>a=${a_val}, b=${b_val}</code><br>`;
                        helpDiv.innerHTML += `Λύση: x = -b / a = <strong>${root}</strong>`;
                    }
                } catch(err) {
                    helpDiv.innerHTML += "Η εξίσωση δεν είναι απλή γραμμική ή έχει άλλη μεταβλητή (π.χ. y).";
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
        helpDiv.innerHTML += "Δεν ήταν δυνατή η ανάλυση με τη math.js. Μάλλον η εξίσωση είναι πολύπλοκη!";
    }
};

window.showGeoHelp = function() {
    const helpDiv = document.getElementById("geo-help-steps");
    if (!helpDiv) return;
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = "<strong>Βήματα Επίλυσης:</strong><br>" + currentGeoProblem.steps.join("<br>");
};

window.analyzeGeoSteps = function() {
    const helpDiv = document.getElementById("geo-help-steps");
    if (!helpDiv) return;
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = "<strong style='color: #03dac6;'>Ανάλυση με math.js:</strong><br>";
    if (typeof math !== 'undefined') {
        try {
            let simplified = formatMathString(math.simplify(currentGeoProblem.formula).toString());
            helpDiv.innerHTML += `Πράξη: <code>${formatMathString(currentGeoProblem.formula)}</code><br>`;
            helpDiv.innerHTML += `Αποτέλεσμα: <strong>${simplified}</strong>`;
        } catch (e) {
            helpDiv.innerHTML += "Η πράξη δεν μπορεί να αναλυθεί περαιτέρω από το math.js.";
        }
    } else {
        helpDiv.innerHTML += "Σφάλμα: Η βιβλιοθήκη math.js δεν φόρτωσε!";
    }
};

window.showTrigHelp = function() {
    const helpDiv = document.getElementById("trig-help-steps");
    if (!helpDiv) return;
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = "<strong>Βήματα Επίλυσης:</strong><br>" + currentTrigProblem.steps.join("<br>");
};

window.analyzeTrigSteps = function() {
    const helpDiv = document.getElementById("trig-help-steps");
    if (!helpDiv) return;
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = "<strong style='color: #03dac6;'>Ανάλυση με math.js:</strong><br>";
    if (typeof math !== 'undefined') {
        try {
            let formula = currentTrigProblem.formula;
            let simplified = formatMathString(math.evaluate(formula).toString());
            helpDiv.innerHTML += `Πράξη: <code>${formatMathString(formula)}</code><br>`;
            helpDiv.innerHTML += `Αποτέλεσμα: <strong>${simplified}</strong>`;
        } catch (e) {
            helpDiv.innerHTML += "Η πράξη δεν μπορεί να αναλυθεί περαιτέρω από το math.js.";
        }
    } else {
        helpDiv.innerHTML += "Σφάλμα: Η βιβλιοθήκη math.js δεν φόρτωσε!";
    }
};

window.showTopologyHelp = function() {
    const helpDiv = document.getElementById("topology-help-steps");
    if (!helpDiv) return;
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = "<strong>Βήματα Επίλυσης:</strong><br>" + currentTopologyProblem.steps.join("<br>");
};

window.analyzeTopologySteps = function() {
    const helpDiv = document.getElementById("topology-help-steps");
    if (!helpDiv) return;
    helpDiv.classList.remove("hidden");
    helpDiv.innerHTML = "<strong style='color: #03dac6;'>Ανάλυση με math.js:</strong><br>";
    if (typeof math !== 'undefined') {
        try {
            let simplified = formatMathString(math.simplify(currentTopologyProblem.formula).toString());
            helpDiv.innerHTML += `Πράξη: <code>${formatMathString(currentTopologyProblem.formula)}</code><br>`;
            helpDiv.innerHTML += `Αποτέλεσμα: <strong>${simplified}</strong>`;
        } catch (e) {
            helpDiv.innerHTML += "Η πράξη δεν μπορεί να αναλυθεί περαιτέρω από το math.js.";
        }
    } else {
        helpDiv.innerHTML += "Σφάλμα: Η βιβλιοθήκη math.js δεν φόρτωσε!";
    }
};

let ocrCanvas, ocrCtx;
let isDrawingOcr = false;

window.initOcrCanvas = function() {
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
    if(ocrCtx) ocrCtx.closePath();
}

window.clearOcrCanvas = function() {
    if (!ocrCtx) return;
    ocrCtx.fillStyle = 'white';
    ocrCtx.fillRect(0, 0, ocrCanvas.width, ocrCanvas.height);
};

window.changeLanguageFromModal = function() {
    const mainSelect = document.getElementById("lang-select");
    const modalSelect = document.getElementById("legal-lang-select");
    if (mainSelect && modalSelect) {
        mainSelect.value = modalSelect.value;
        changeLanguage();
    }
};

window.recognizeHandwriting = async function() {
    const btn = document.querySelector('.ocr-container .check-btn');
    if (!ocrCanvas || !btn) return;
    
    const originalText = btn.innerText;
    btn.innerText = "Σκέφτεται...";
    btn.disabled = true;

    try {
        if (typeof Tesseract === 'undefined') {
            alert("Το Tesseract.js OCR δεν έχει φορτώσει!");
            return;
        }
        
        const dataUrl = ocrCanvas.toDataURL('image/png');
        
        const result = await Tesseract.recognize(dataUrl, 'eng');
        
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
            alert("Δεν καταφέραμε να αναγνωρίσουμε τι έγραψες! Δοκίμασε να γράψεις πιο καθαρά.");
        }
    } catch (err) {
        console.error("OCR Error:", err);
        alert("Σφάλμα κατά την αναγνώριση OCR.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};

