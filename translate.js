const fs = require('fs');

const newTranslations = {
  el: {
    geoScenarios: [
      "Θέλουμε να αγοράσουμε ένα νέο χαλί για το σαλόνι. Αν ο χώρος έχει μήκος {a} μέτρα και πλάτος {b} μέτρα, ποιο είναι το εμβαδόν του χαλιού που χρειαζόμαστε; (E = a · b)",
      "Φτιάχνουμε ένα μικρό παρτέρι με λουλούδια σε τριγωνικό σχήμα και θέλουμε να του βάλουμε ξύλινο φράχτη γύρω γύρω. Αν οι πλευρές είναι {a}, {b} και {c} μέτρα, πόσα μέτρα φράχτη πρέπει να αγοράσουμε; (P = a + b + c)",
      "Θέλουμε να οργανώσουμε την ντουλάπα με κουτιά αποθήκευσης. Αν ένα κουτί έχει διαστάσεις {a}, {b}, {c} μέτρα, ποιος είναι ο όγκος του; (V = a · b · c)"
    ],
    trigScenarios: [
      "Ακουμπάμε μια σκάλα στον τοίχο για να κρεμάσουμε ένα κάδρο. Αν η βάση της σκάλας απέχει {a} μέτρα από τον τοίχο και το ύψος μέχρι το κάδρο είναι {b} μέτρα, τι μήκος πρέπει να έχει η σκάλα; (Πυθαγόρειο: c² = a² + b²)",
      "Μια ξύλινη ράμπα στο κατώφλι του σπιτιού σχηματίζει γωνία 30 μοιρών με το έδαφος. Αν το ύψος του κατωφλιού (απέναντι πλευρά) είναι {opposite} μέτρα, πόσο μήκος πρέπει να έχει η ράμπα (υποτείνουσα); (sin30° = 0.5, οπότε Υποτείνουσα = Απέναντι / 0.5)"
    ],
    topScenario: "Φτιάχνουμε μια χάρτινη κατασκευή origami. Αν η κατασκευή έχει {V} γωνίες (κορυφές - V) και {E} τσακίσεις (ακμές - E), πόσες επίπεδες επιφάνειες (έδρες - F) έχει; (Τύπος Euler: V - E + F = 2)",
    helpAnalysis: "Ανάλυση με math.js (Math Machine)",
    helpOriginal: "Αρχική",
    helpStep1: "Βήμα 1",
    helpStep2: "Βήμα 2 (Παράγωγος - Εύρεση κλίσης)",
    helpSolution: "Λύση",
    helpError: "Δεν ήταν δυνατή η ανάλυση.",
    helpStepsTitle: "Βήματα Επίλυσης",
    helpAction: "Πράξη",
    helpResult: "Αποτέλεσμα",
    geoStepArea: "Εμβαδόν Ορθογωνίου",
    geoStepPerim: "Περίμετρος Τριγώνου",
    geoStepVol: "Όγκος Ορθογωνίου Παραλληλεπιπέδου",
    stepHence: "Επομένως",
    trigStepPyth: "Πυθαγόρειο Θεώρημα",
    trigStepSin: "Ημίτονο Γωνίας",
    topStepEuler: "Τύπος Euler"
  },
  en: {
    geoScenarios: [
      "We want to buy a new carpet for the living room. If the room is {a} meters long and {b} meters wide, what is the area of the carpet we need? (A = a · b)",
      "We are making a small flower bed in a triangular shape and want to put a wooden fence around it. If the sides are {a}, {b} and {c} meters, how many meters of fence should we buy? (P = a + b + c)",
      "We want to organize the closet with storage boxes. If a box has dimensions {a}, {b}, {c} meters, what is its volume? (V = a · b · c)"
    ],
    trigScenarios: [
      "We lean a ladder against the wall to hang a picture. If the base of the ladder is {a} meters from the wall and the height to the picture is {b} meters, how long should the ladder be? (Pythagorean: c² = a² + b²)",
      "A wooden ramp at the threshold of the house forms a 30-degree angle with the ground. If the height of the threshold (opposite side) is {opposite} meters, how long should the ramp be (hypotenuse)? (sin30° = 0.5, so Hypotenuse = Opposite / 0.5)"
    ],
    topScenario: "We are making a paper origami craft. If the craft has {V} corners (vertices - V) and {E} folds (edges - E), how many flat surfaces (faces - F) does it have? (Euler's Formula: V - E + F = 2)",
    helpAnalysis: "Math.js Analysis (Math Machine)",
    helpOriginal: "Original",
    helpStep1: "Step 1",
    helpStep2: "Step 2 (Derivative - Finding slope)",
    helpSolution: "Solution",
    helpError: "Analysis was not possible.",
    helpStepsTitle: "Solution Steps",
    helpAction: "Operation",
    helpResult: "Result",
    geoStepArea: "Rectangle Area",
    geoStepPerim: "Triangle Perimeter",
    geoStepVol: "Rectangular Cuboid Volume",
    stepHence: "Hence",
    trigStepPyth: "Pythagorean Theorem",
    trigStepSin: "Sine of Angle",
    topStepEuler: "Euler's Formula"
  },
  fr: {
    geoScenarios: [
      "Nous voulons acheter un nouveau tapis pour le salon. Si la pièce fait {a} mètres de long et {b} mètres de large, quelle est la surface du tapis dont nous avons besoin ? (A = a · b)",
      "Nous créons un petit parterre de fleurs de forme triangulaire et voulons l'entourer d'une clôture en bois. Si les côtés mesurent {a}, {b} et {c} mètres, combien de mètres de clôture devrions-nous acheter ? (P = a + b + c)",
      "Nous voulons organiser le placard avec des boîtes de rangement. Si une boîte a pour dimensions {a}, {b}, {c} mètres, quel est son volume ? (V = a · b · c)"
    ],
    trigScenarios: [
      "Nous posons une échelle contre le mur pour accrocher un tableau. Si la base de l'échelle est à {a} mètres du mur et la hauteur du tableau est de {b} mètres, quelle doit être la longueur de l'échelle ? (Pythagore : c² = a² + b²)",
      "Une rampe en bois au seuil de la maison forme un angle de 30 degrés avec le sol. Si la hauteur du seuil (côté opposé) est de {opposite} mètres, quelle doit être la longueur de la rampe (hypoténuse) ? (sin30° = 0.5, donc Hypoténuse = Opposé / 0.5)"
    ],
    topScenario: "Nous fabriquons un origami en papier. Si la création a {V} coins (sommets - V) et {E} plis (arêtes - E), combien de surfaces planes (faces - F) a-t-elle ? (Formule d'Euler : V - E + F = 2)",
    helpAnalysis: "Analyse Math.js (Machine Mathématique)",
    helpOriginal: "Original",
    helpStep1: "Étape 1",
    helpStep2: "Étape 2 (Dérivée - Trouver la pente)",
    helpSolution: "Solution",
    helpError: "L'analyse n'a pas été possible.",
    helpStepsTitle: "Étapes de résolution",
    helpAction: "Opération",
    helpResult: "Résultat",
    geoStepArea: "Aire du rectangle",
    geoStepPerim: "Périmètre du triangle",
    geoStepVol: "Volume du parallélépipède",
    stepHence: "Donc",
    trigStepPyth: "Théorème de Pythagore",
    trigStepSin: "Sinus de l'angle",
    topStepEuler: "Formule d'Euler"
  },
  es: {
    geoScenarios: [
      "Queremos comprar una alfombra nueva para la sala de estar. Si la habitación tiene {a} metros de largo y {b} metros de ancho, ¿cuál es el área de la alfombra que necesitamos? (A = a · b)",
      "Estamos haciendo un pequeño macizo de flores en forma triangular y queremos ponerle una valla de madera alrededor. Si los lados miden {a}, {b} y {c} metros, ¿cuántos metros de valla deberíamos comprar? (P = a + b + c)",
      "Queremos organizar el armario con cajas de almacenamiento. Si una caja tiene dimensiones {a}, {b}, {c} metros, ¿cuál es su volumen? (V = a · b · c)"
    ],
    trigScenarios: [
      "Apoyamos una escalera contra la pared para colgar un cuadro. Si la base de la escalera está a {a} metros de la pared y la altura al cuadro es de {b} metros, ¿cuánto debe medir la escalera? (Pitágoras: c² = a² + b²)",
      "Una rampa de madera en el umbral de la casa forma un ángulo de 30 grados con el suelo. Si la altura del umbral (lado opuesto) es de {opposite} metros, ¿cuánto debe medir la rampa (hipotenusa)? (sin30° = 0.5, por lo tanto Hipotenusa = Opuesto / 0.5)"
    ],
    topScenario: "Estamos haciendo una manualidad de origami de papel. Si la manualidad tiene {V} esquinas (vértices - V) y {E} pliegues (aristas - E), ¿cuántas superficies planas (caras - F) tiene? (Fórmula de Euler: V - E + F = 2)",
    helpAnalysis: "Análisis con Math.js (Máquina Matemática)",
    helpOriginal: "Original",
    helpStep1: "Paso 1",
    helpStep2: "Paso 2 (Derivada - Encontrar pendiente)",
    helpSolution: "Solución",
    helpError: "El análisis no fue posible.",
    helpStepsTitle: "Pasos de resolución",
    helpAction: "Operación",
    helpResult: "Resultado",
    geoStepArea: "Área del rectángulo",
    geoStepPerim: "Perímetro del triángulo",
    geoStepVol: "Volumen del paralelepípedo",
    stepHence: "Por lo tanto",
    trigStepPyth: "Teorema de Pitágoras",
    trigStepSin: "Seno del ángulo",
    topStepEuler: "Fórmula de Euler"
  },
  tr: {
    geoScenarios: [
      "Oturma odası için yeni bir halı almak istiyoruz. Oda {a} metre uzunluğunda ve {b} metre genişliğindeyse, ihtiyacımız olan halının alanı nedir? (A = a · b)",
      "Üçgen şeklinde küçük bir çiçeklik yapıyoruz ve etrafına ahşap bir çit koymak istiyoruz. Kenarlar {a}, {b} ve {c} metre ise kaç metre çit almalıyız? (P = a + b + c)",
      "Dolabı saklama kutularıyla düzenlemek istiyoruz. Bir kutunun boyutları {a}, {b}, {c} metre ise hacmi nedir? (V = a · b · c)"
    ],
    trigScenarios: [
      "Bir resim asmak için duvara bir merdiven dayıyoruz. Merdivenin tabanı duvardan {a} metre uzaklıkta ve resmin yüksekliği {b} metre ise, merdiven ne kadar uzun olmalıdır? (Pisagor: c² = a² + b²)",
      "Evin eşiğindeki ahşap bir rampa yerle 30 derecelik bir açı oluşturur. Eşiğin yüksekliği (karşı kenar) {opposite} metre ise, rampa ne kadar uzun olmalıdır (hipotenüs)? (sin30° = 0.5, yani Hipotenüs = Karşı / 0.5)"
    ],
    topScenario: "Kağıttan bir origami yapıyoruz. Eserin {V} köşesi (köşeler - V) ve {E} katlaması (ayrıtlar - E) varsa, kaç tane düz yüzeyi (yüzler - F) vardır? (Euler Formülü: V - E + F = 2)",
    helpAnalysis: "Math.js Analizi (Matematik Makinesi)",
    helpOriginal: "Orijinal",
    helpStep1: "Adım 1",
    helpStep2: "Adım 2 (Türev - Eğim bulma)",
    helpSolution: "Çözüm",
    helpError: "Analiz mümkün olmadı.",
    helpStepsTitle: "Çözüm Adımları",
    helpAction: "İşlem",
    helpResult: "Sonuç",
    geoStepArea: "Dikdörtgenin Alanı",
    geoStepPerim: "Üçgenin Çevresi",
    geoStepVol: "Dikdörtgenler Prizmasının Hacmi",
    stepHence: "Böylece",
    trigStepPyth: "Pisagor Teoremi",
    trigStepSin: "Açının Sinüsü",
    topStepEuler: "Euler Formülü"
  },
  it: {
    geoScenarios: [
      "Vogliamo comprare un nuovo tappeto per il soggiorno. Se la stanza è lunga {a} metri e larga {b} metri, qual è l'area del tappeto di cui abbiamo bisogno? (A = a · b)",
      "Stiamo realizzando una piccola aiuola a forma triangolare e vogliamo metterci una staccionata di legno intorno. Se i lati misurano {a}, {b} e {c} metri, quanti metri di staccionata dovremmo comprare? (P = a + b + c)",
      "Vogliamo organizzare l'armadio con scatole di immagazzinaggio. Se una scatola ha dimensioni {a}, {b}, {c} metri, qual è il suo volume? (V = a · b · c)"
    ],
    trigScenarios: [
      "Appoggiamo una scala al muro per appendere un quadro. Se la base della scala si trova a {a} metri dal muro e l'altezza del quadro è di {b} metri, quanto deve essere lunga la scala? (Pitagora: c² = a² + b²)",
      "Una rampa di legno sulla soglia di casa forma un angolo di 30 gradi con il suolo. Se l'altezza della soglia (lato opposto) è di {opposite} metri, quanto deve essere lunga la rampa (ipotenusa)? (sin30° = 0.5, quindi Ipotenusa = Opposto / 0.5)"
    ],
    topScenario: "Stiamo realizzando un origami di carta. Se la creazione ha {V} angoli (vertici - V) e {E} pieghe (spigoli - E), quante superfici piane (facce - F) ha? (Formula di Euler: V - E + F = 2)",
    helpAnalysis: "Analisi con Math.js (Macchina Matematica)",
    helpOriginal: "Originale",
    helpStep1: "Passo 1",
    helpStep2: "Passo 2 (Derivata - Trovare pendenza)",
    helpSolution: "Soluzione",
    helpError: "L'analisi non è stata possibile.",
    helpStepsTitle: "Passaggi della soluzione",
    helpAction: "Operazione",
    helpResult: "Risultato",
    geoStepArea: "Area del rettangolo",
    geoStepPerim: "Perimetro del triangolo",
    geoStepVol: "Volume del parallelepipedo",
    stepHence: "Quindi",
    trigStepPyth: "Teorema di Pitagora",
    trigStepSin: "Seno dell'angolo",
    topStepEuler: "Formula di Eulero"
  },
  ar: {
    geoScenarios: [
      "نريد شراء سجادة جديدة لغرفة المعيشة. إذا كان طول الغرفة {a} مترًا وعرضها {b} مترًا، فما هي مساحة السجادة التي نحتاجها؟ (A = a · b)",
      "نحن نصنع حوض زهور صغير على شكل مثلث ونريد وضع سياج خشبي حوله. إذا كانت الأضلاع {a} و {b} و {c} مترًا، فكم مترًا من السياج يجب أن نشتري؟ (P = a + b + c)",
      "نريد تنظيم الخزانة بصناديق التخزين. إذا كان الصندوق بأبعاد {a} و {b} و {c} مترًا، فما هو حجمه؟ (V = a · b · c)"
    ],
    trigScenarios: [
      "نسند سلمًا على الحائط لتعليق صورة. إذا كانت قاعدة السلم تبعد {a} متر عن الحائط والارتفاع إلى الصورة هو {b} متر، فكم يجب أن يكون طول السلم؟ (فيثاغورس: c² = a² + b²)",
      "يشكل منحدر خشبي عند عتبة المنزل زاوية 30 درجة مع الأرض. إذا كان ارتفاع العتبة (الضلع المقابل) هو {opposite} متر، فكم يجب أن يكون طول المنحدر (الوتر)؟ (sin30° = 0.5، إذن الوتر = المقابل / 0.5)"
    ],
    topScenario: "نحن نصنع حرفة أوريغامي ورقية. إذا كان للحرفة {V} زاوية (رؤوس - V) و {E} طية (حواف - E)، فكم عدد الأسطح المستوية (أوجه - F) التي تحتوي عليها؟ (صيغة أويلر: V - E + F = 2)",
    helpAnalysis: "تحليل Math.js (الآلة الرياضية)",
    helpOriginal: "أصلي",
    helpStep1: "الخطوة 1",
    helpStep2: "الخطوة 2 (المشتق - إيجاد الميل)",
    helpSolution: "الحل",
    helpError: "لم يكن التحليل ممكنا.",
    helpStepsTitle: "خطوات الحل",
    helpAction: "عملية",
    helpResult: "نتيجة",
    geoStepArea: "مساحة المستطيل",
    geoStepPerim: "محيط المثلث",
    geoStepVol: "حجم متوازي المستطيلات",
    stepHence: "وبالتالي",
    trigStepPyth: "نظرية فيثاغورس",
    trigStepSin: "جيب الزاوية",
    topStepEuler: "صيغة أويلر"
  }
};

let scriptJs = fs.readFileSync('script.js', 'utf8');

// We will inject the new properties into the `translations` object for each language
for (const lang of Object.keys(newTranslations)) {
  const data = newTranslations[lang];
  let injection = ``;
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) {
      injection += ` ${k}: ${JSON.stringify(v)},\n`;
    } else {
      injection += ` ${k}: ${JSON.stringify(v)},\n`;
    }
  }

  // Find where the lang object is defined in translations
  // It looks like ` lang: {`
  const regex = new RegExp(`\\n\\s*${lang}:\\s*\\{`, 'g');
  scriptJs = scriptJs.replace(regex, `\n ${lang}: {\n${injection}`);
}

fs.writeFileSync('script.js', scriptJs);
console.log('Translations injected successfully!');
