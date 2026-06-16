const fs = require('fs');

const data = [
    {
        id: "linear_equations",
        category: "algebra",
        title: {
            el: "Πρωτοβάθμιες Εξισώσεις",
            en: "Linear Equations",
            fr: "Équations Linéaires",
            es: "Ecuaciones Lineales",
            it: "Equazioni Lineari",
            tr: "Birinci Dereceden Denklemler",
            ar: "المعادلات الخطية"
        },
        formula: "ax + b = 0",
        latex: "y = 2x - 4",
        grade: "gym_a",
        source: "https://el.wikipedia.org/wiki/Γραμμική_εξίσωση",
        definition: {
            el: "Μια πρωτοβάθμια εξίσωση (ή γραμμική εξίσωση) περιγράφει μια σχέση όπου η άγνωστη μεταβλητή x έχει δύναμη 1. Η γραφική της παράσταση είναι μια ευθεία γραμμή. Η λύση της εξίσωσης ax + b = 0 δίνεται από τον τύπο x = -b/a.",
            en: "A linear equation describes a relationship where the unknown variable x has a power of 1. Its graphical representation is a straight line. The solution to the equation ax + b = 0 is given by the formula x = -b/a.",
            fr: "Une équation linéaire décrit une relation où la variable inconnue x est à la puissance 1. Sa représentation graphique est une ligne droite.",
            es: "Una ecuación lineal describe una relación donde la variable desconocida x tiene una potencia de 1.",
            it: "Un'equazione lineare descrive una relazione in cui la variabile incognita x ha potenza pari a 1.",
            tr: "Birinci dereceden (veya doğrusal) bir denklem, bilinmeyen değişken x'in 1. kuvvete sahip olduğu bir ilişkiyi tanımlar.",
            ar: "تصف المعادلة الخطية العلاقة حيث يكون للمتغير المجهول x القوة 1."
        },
        catAdvice: {
            el: "Φέρε όλα τα x από τη μια πλευρά και τους αριθμούς από την άλλη! Και μην ξεχνάς να αλλάζεις πρόσημο (+ σε -) όταν αλλάζεις πλευρά! Νιάου! 🐾",
            en: "Keep all the x's on one side and the numbers on the other! Change the sign when crossing the equals sign! 🐾",
            fr: "Garde tous les x d'un côté et les nombres de l'autre ! 🐾",
            es: "¡Mantén todas las x de un lado y los números del otro! 🐾",
            it: "Tieni tutte le x da un lato e i numeri dall'altro! 🐾",
            tr: "Tüm x'leri bir tarafta, sayıları diğer tarafta topla! 🐾",
            ar: "ضع كل مجاهيل x في جانب والأرقام في الجانب الآخر! 🐾"
        }
    },
    {
        id: "quadratic_equations",
        category: "algebra",
        title: {
            el: "Δευτεροβάθμιες Εξισώσεις",
            en: "Quadratic Equations",
            fr: "Équations du Second Degré",
            es: "Ecuaciones Cuadráticas",
            it: "Equazioni di Secondo Grado",
            tr: "İkinci Dereceden Denklemler",
            ar: "المعادلات التربيعية"
        },
        formula: "ax² + bx + c = 0",
        latex: "y = x^2 - 4x + 3",
        grade: "gym_g",
        source: "https://el.wikipedia.org/wiki/Δευτεροβάθμια_εξίσωση",
        definition: {
            el: "Η δευτεροβάθμια εξίσωση είναι μια πολυωνυμική εξίσωση βαθμού 2. Η γραφική της παράσταση στο καρτεσιανό επίπεδο είναι μια παραβολή. Η επίλυσή της γίνεται συχνά με τη χρήση της διακρίνουσας (Δ = b² - 4ac).",
            en: "A quadratic equation is a second-order polynomial equation in a single variable x. Its graph is a parabola.",
            fr: "Une équation du second degré est une équation polynomiale de degré 2. Son graphe est une parabole.",
            es: "Una ecuación cuadrática es una ecuación polinómica de segundo grado. Su gráfica es una parábola.",
            it: "Un'equazione di secondo grado è un'equazione polinomiale di grado 2. Il suo grafico è una parabola.",
            tr: "İkinci dereceden bir denklem, 2. dereceden bir polinom denklemidir. Grafiği bir paraboldür.",
            ar: "المعادلة التربيعية هي معادلة متعددة الحدود من الدرجة الثانية. رسمها البياني هو قطع مكافئ."
        },
        catAdvice: {
            el: "Υπολόγισε πρώτα τη διακρίνουσα Δ! Αν είναι θετική έχεις δύο λύσεις, αν είναι μηδέν μία, και αν είναι αρνητική καμία πραγματική λύση! 🐈",
            en: "Calculate the discriminant Δ first! Positive means two solutions, zero means one, and negative means no real solutions! 🐈",
            fr: "Calcule d'abord le discriminant Δ ! 🐈",
            es: "¡Calcula primero el discriminante Δ! 🐈",
            it: "Calcola prima il discriminante Δ! 🐈",
            tr: "Önce diskriminantı (Δ) hesapla! 🐈",
            ar: "احسب المميز Δ أولاً! 🐈"
        }
    },
    {
        id: "systems_of_equations",
        category: "algebra",
        title: {
            el: "Συστήματα Γραμμικών Εξισώσεων",
            en: "Systems of Linear Equations",
            fr: "Systèmes d'équations linéaires",
            es: "Sistemas de ecuaciones lineales",
            it: "Sistemi di equazioni lineari",
            tr: "Doğrusal Denklem Sistemleri",
            ar: "أنظمة المعادلات الخطية"
        },
        formula: "ax+by=c, dx+ey=f",
        latex: "x+y=5; x-y=1",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Σύστημα_γραμμικών_εξισώσεων",
        definition: {
            el: "Ένα σύστημα γραμμικών εξισώσεων αποτελείται από δύο ή περισσότερες γραμμικές εξισώσεις. Η λύση του είναι το σημείο τομής των ευθειών. Επιλύεται με μεθόδους όπως η αντικατάσταση ή η αντίθετων συντελεστών.",
            en: "A system of linear equations consists of two or more linear equations. The solution is the intersection point of the lines.",
            fr: "Un système d'équations linéaires se compose de deux ou plusieurs équations linéaires.",
            es: "Un sistema de ecuaciones lineales consta de dos o más ecuaciones lineales.",
            it: "Un sistema di equazioni lineari è costituito da due o più equazioni lineari.",
            tr: "Doğrusal bir denklem sistemi, iki veya daha fazla doğrusal denklemden oluşur.",
            ar: "يتكون نظام المعادلات الخطية من معادلتين خطيتين أو أكثر."
        },
        catAdvice: {
            el: "Προσπάθησε να λύσεις τη μία εξίσωση ως προς x και βάλε το αποτέλεσμα στην άλλη (μέθοδος αντικατάστασης)! 🐾",
            en: "Try solving one equation for x and plug it into the other (substitution method)! 🐾",
            fr: "Essaie de résoudre une équation pour x et remplace-la dans l'autre ! 🐾",
            es: "¡Intenta resolver una ecuación para x y reemplázala en la otra! 🐾",
            it: "Prova a risolvere un'equazione per x e sostituiscila nell'altra! 🐾",
            tr: "Bir denklemi x için çözmeyi dene ve diğerine yerleştir! 🐾",
            ar: "حاول حل معادلة واحدة لـ x وضعها في الأخرى! 🐾"
        }
    },
    {
        id: "polynomials",
        category: "algebra",
        title: {
            el: "Πολυώνυμα",
            en: "Polynomials",
            fr: "Polynômes",
            es: "Polinomios",
            it: "Polinomi",
            tr: "Polinomlar",
            ar: "كثيرات الحدود"
        },
        formula: "P(x) = a_n x^n + ... + a_0",
        latex: "y = x^3 - 2x^2 + x - 5",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Πολυώνυμο",
        definition: {
            el: "Πολυώνυμο είναι μια αλγεβρική παράσταση που αποτελείται από μεταβλητές και συντελεστές, με πράξεις πρόσθεσης, αφαίρεσης, πολλαπλασιασμού και μη-αρνητικές ακέραιες δυνάμεις μεταβλητών.",
            en: "A polynomial is an expression consisting of variables and coefficients, involving only the operations of addition, subtraction, multiplication, and non-negative integer exponentiation.",
            fr: "Un polynôme est une expression constituée de variables et de coefficients.",
            es: "Un polinomio es una expresión constituida por variables y coeficientes.",
            it: "Un polinomio è un'espressione costituita da variabili e coefficienti.",
            tr: "Polinom, değişkenler ve katsayılardan oluşan bir cebirsel ifadedir.",
            ar: "كثيرة الحدود هي تعبير يتكون من متغيرات ومعاملات."
        },
        catAdvice: {
            el: "Πρόσεχε τις δυνάμεις! Μπορείς να προσθέσεις μόνο τους όρους που έχουν το ίδιο x στην ίδια δύναμη! 🐈",
            en: "Watch the exponents! You can only add terms that have the same variable raised to the same power! 🐈",
            fr: "Fais attention aux exposants ! 🐈",
            es: "¡Cuidado con los exponentes! 🐈",
            it: "Fai attenzione agli esponenti! 🐈",
            tr: "Üslere dikkat et! Sadece benzer terimleri toplayabilirsin! 🐈",
            ar: "انتبه للأسس! يمكنك فقط إضافة الحدود المتشابهة! 🐈"
        }
    },
    {
        id: "pythagorean_theorem",
        category: "geometry",
        title: {
            el: "Πυθαγόρειο Θεώρημα",
            en: "Pythagorean Theorem",
            fr: "Théorème de Pythagore",
            es: "Teorema de Pitágoras",
            it: "Teorema di Pitagora",
            tr: "Pisagor Teoremi",
            ar: "مبرهنة فيثاغورس"
        },
        formula: "a² + b² = c²",
        latex: "x^2 + y^2 = 25",
        grade: "gym_b",
        source: "https://el.wikipedia.org/wiki/Πυθαγόρειο_θεώρημα",
        definition: {
            el: "Σε κάθε ορθογώνιο τρίγωνο, το τετράγωνο της υποτείνουσας (c) ισούται με το άθροισμα των τετραγώνων των δύο κάθετων πλευρών (a και b).",
            en: "In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.",
            fr: "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.",
            es: "En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los otros dos lados.",
            it: "In un triangolo rettangolo, il quadrato dell'ipotenusa è uguale alla somma dei quadrati degli altri due lati.",
            tr: "Bir dik üçgende, hipotenüsün karesi diğer iki kenarın kareleri toplamına eşittir.",
            ar: "في المثلث القائم الزاوية، مربع الوتر يساوي مجموع مربعي الضلعين الآخرين."
        },
        catAdvice: {
            el: "Η μεγαλύτερη πλευρά είναι πάντα η υποτείνουσα και βρίσκεται απέναντι από την ορθή γωνία! Μιάου! 🐾",
            en: "The longest side is always the hypotenuse, and it's opposite the right angle! Meow! 🐾",
            fr: "Le côté le plus long est toujours l'hypoténuse ! 🐾",
            es: "¡El lado más largo es siempre la hipotenusa! 🐾",
            it: "Il lato più lungo è sempre l'ipotenusa! 🐾",
            tr: "En uzun kenar her zaman hipotenüstür! 🐾",
            ar: "أطول ضلع هو دائمًا الوتر! 🐾"
        }
    },
    {
        id: "circle_area",
        category: "geometry",
        title: {
            el: "Εμβαδόν και Περίμετρος Κύκλου",
            en: "Circle Area & Perimeter",
            fr: "Aire et Périmètre du Cercle",
            es: "Área y Perímetro del Círculo",
            it: "Area e Perimetro del Cerchio",
            tr: "Daire Alanı ve Çevresi",
            ar: "مساحة ومحيط الدائرة"
        },
        formula: "A = πr², C = 2πr",
        latex: "x^2 + y^2 = 9",
        grade: "gym_a",
        source: "https://el.wikipedia.org/wiki/Κύκλος",
        definition: {
            el: "Το εμβαδόν ενός κύκλου δίνεται από τον τύπο A = π·r² και το μήκος της περιφέρειάς του (περίμετρος) δίνεται από τον τύπο C = 2·π·r, όπου r είναι η ακτίνα.",
            en: "The area of a circle is A = πr² and its circumference is C = 2πr, where r is the radius.",
            fr: "L'aire d'un cercle est A = πr² et sa circonférence est C = 2πr.",
            es: "El área de un círculo es A = πr² y su circunferencia es C = 2πr.",
            it: "L'area di un cerchio è A = πr² e la sua circonferenza è C = 2πr.",
            tr: "Bir dairenin alanı A = πr² ve çevresi C = 2πr'dir.",
            ar: "مساحة الدائرة هي A = πr² ومحيطها C = 2πr."
        },
        catAdvice: {
            el: "Το π είναι περίπου 3.14159! Μην το μπερδεύεις με την πίτα που τρώμε, αν και τα δύο είναι τέλεια! 🥧🐈",
            en: "Pi is approximately 3.14159! Don't confuse it with the pie we eat, although both are great! 🥧🐈",
            fr: "Pi est environ 3.14159 ! 🥧🐈",
            es: "¡Pi es aproximadamente 3.14159! 🥧🐈",
            it: "Pi è circa 3.14159! 🥧🐈",
            tr: "Pi yaklaşık 3.14159'dur! 🥧🐈",
            ar: "باي هو تقريباً 3.14159! 🥧🐈"
        }
    },
    {
        id: "trigonometric_identities",
        category: "geometry",
        title: {
            el: "Βασική Τριγωνομετρική Ταυτότητα",
            en: "Pythagorean Trigonometric Identity",
            fr: "Identité Trigonométrique",
            es: "Identidad Trigonométrica",
            it: "Identità Trigonometrica",
            tr: "Temel Trigonometrik Özdeşlik",
            ar: "المتطابقة المثلثية"
        },
        formula: "sin²(θ) + cos²(θ) = 1",
        latex: "(\\sin(x))^2 + (\\cos(x))^2 = 1",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Τριγωνομετρικές_ταυτότητες",
        definition: {
            el: "Η βασική τριγωνομετρική ταυτότητα δηλώνει ότι για κάθε γωνία θ, το άθροισμα των τετραγώνων του ημιτόνου και του συνημιτόνου ισούται πάντα με 1. Προκύπτει από το Πυθαγόρειο θεώρημα.",
            en: "The Pythagorean trigonometric identity states that for any angle, the square of the sine plus the square of the cosine is always equal to 1.",
            fr: "L'identité trigonométrique fondamentale stipule que la somme des carrés du sinus et du cosinus est 1.",
            es: "La identidad trigonométrica fundamental establece que la suma de los cuadrados del seno y el coseno es 1.",
            it: "L'identità trigonometrica fondamentale afferma che la somma dei quadrati del seno e del coseno è 1.",
            tr: "Temel trigonometrik özdeşlik, herhangi bir açının sinüs karesi ile kosinüs karesinin toplamının her zaman 1'e eşit olduğunu belirtir.",
            ar: "تنص المتطابقة المثلثية الأساسية على أن مجموع مربعي الجيب وجيب التمام لأي زاوية يساوي دائمًا 1."
        },
        catAdvice: {
            el: "Αυτός ο τύπος θα σε σώσει σε άπειρες ασκήσεις τριγωνομετρίας! Μάθε τον σαν το όνομά σου! 😻",
            en: "This formula will save you in endless trigonometry problems! Memorize it well! 😻",
            fr: "Mémorise bien cette formule ! 😻",
            es: "¡Memoriza bien esta fórmula! 😻",
            it: "Memorizza bene questa formula! 😻",
            tr: "Bu formülü iyi ezberle! 😻",
            ar: "احفظ هذه الصيغة جيداً! 😻"
        }
    },
    {
        id: "thales_theorem",
        category: "geometry",
        title: {
            el: "Θεώρημα του Θαλή",
            en: "Thales's Theorem",
            fr: "Théorème de Thalès",
            es: "Teorema de Tales",
            it: "Teorema di Talete",
            tr: "Tales Teoremi",
            ar: "مبرهنة طاليس"
        },
        formula: "A/B = C/D",
        latex: "y = 0.5x",
        grade: "gym_g",
        source: "https://el.wikipedia.org/wiki/Θεώρημα_του_Θαλή",
        definition: {
            el: "Αν παράλληλες ευθείες τέμνουν δύο άλλες ευθείες, τότε τα τμήματα που ορίζονται στη μία είναι ανάλογα προς τα αντίστοιχα τμήματα που ορίζονται στην άλλη.",
            en: "If parallel lines intersect two distinct lines, then they cut off segments whose lengths are proportional.",
            fr: "Si des droites parallèles coupent deux autres droites, alors les segments déterminés sont proportionnels.",
            es: "Si rectas paralelas cortan a dos rectas cualesquiera, los segmentos determinados en una de las rectas son proporcionales a los correspondientes de la otra.",
            it: "Un fascio di rette parallele tagliato da due trasversali determina su di esse segmenti proporzionali.",
            tr: "Paralel doğrular iki kesen doğruyu kestiğinde, oluşturdukları doğru parçaları orantılıdır.",
            ar: "إذا تقاطعت خطوط متوازية مع خطين آخرين، فإن القطع المحددة متناسبة."
        },
        catAdvice: {
            el: "Σκέψου τις αναλογίες σαν κλάσματα που είναι ίσα μεταξύ τους! 🐾",
            en: "Think of the proportions as fractions that equal each other! 🐾",
            fr: "Pense aux proportions comme des fractions égales ! 🐾",
            es: "¡Piensa en las proporciones como fracciones iguales! 🐾",
            it: "Pensa alle proporzioni come frazioni uguali! 🐾",
            tr: "Oranları birbirine eşit kesirler olarak düşün! 🐾",
            ar: "فكر في النسب ككسور متساوية! 🐾"
        }
    },
    {
        id: "derivative",
        category: "analysis",
        title: {
            el: "Παράγωγος",
            en: "Derivative",
            fr: "Dérivée",
            es: "Derivada",
            it: "Derivata",
            tr: "Türev",
            ar: "مشتقة"
        },
        formula: "f'(x) = lim(h->0) [f(x+h) - f(x)] / h",
        latex: "y' = \\frac{d}{dx}(x^2) = 2x",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Παράγωγος",
        definition: {
            el: "Η παράγωγος εκφράζει τον ρυθμό μεταβολής μιας συνάρτησης σε ένα συγκεκριμένο σημείο. Γεωμετρικά, ισούται με την κλίση της εφαπτομένης της γραφικής παράστασης της συνάρτησης στο σημείο αυτό.",
            en: "The derivative measures the sensitivity to change of the function value with respect to a change in its argument. Geometrically, it is the slope of the tangent line.",
            fr: "La dérivée exprime le taux de variation d'une fonction en un point donné.",
            es: "La derivada expresa la tasa de cambio de una función en un punto específico.",
            it: "La derivata esprime il tasso di variazione di una funzione in un punto specifico.",
            tr: "Türev, bir fonksiyonun belirli bir noktadaki değişim oranını ifade eder.",
            ar: "تعبر المشتقة عن معدل تغير الدالة عند نقطة معينة."
        },
        catAdvice: {
            el: "Η παράγωγος σου λέει πόσο γρήγορα αλλάζει κάτι! Όπως όταν τρέχω να πιάσω το ποντίκι! 🐈💨",
            en: "The derivative tells you how fast something is changing! Like when I run to catch a mouse! 🐈💨",
            fr: "La dérivée indique à quelle vitesse quelque chose change ! 🐈💨",
            es: "¡La derivada te dice qué tan rápido cambia algo! 🐈💨",
            it: "La derivata ti dice quanto velocemente cambia qualcosa! 🐈💨",
            tr: "Türev, bir şeyin ne kadar hızlı değiştiğini söyler! 🐈💨",
            ar: "تخبرك المشتقة بمدى سرعة تغير شيء ما! 🐈💨"
        }
    },
    {
        id: "integrals",
        category: "analysis",
        title: {
            el: "Ολοκλήρωμα",
            en: "Integral",
            fr: "Intégrale",
            es: "Integral",
            it: "Integrale",
            tr: "İntegral",
            ar: "تكامل"
        },
        formula: "∫ f(x) dx = F(x) + C",
        latex: "\\int_{0}^{x} t^2 dt",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Ολοκλήρωμα",
        definition: {
            el: "Το ολοκλήρωμα είναι η αντίστροφη πράξη της παραγώγισης. Το ορισμένο ολοκλήρωμα εκφράζει γεωμετρικά το εμβαδόν της περιοχής κάτω από τη γραφική παράσταση μιας συνάρτησης.",
            en: "The integral is the reverse operation of the derivative. The definite integral geometrically represents the area under the curve of a function.",
            fr: "L'intégrale est l'opération inverse de la dérivée. L'intégrale définie représente l'aire sous la courbe.",
            es: "La integral es la operación inversa de la derivada. La integral definida representa el área bajo la curva.",
            it: "L'integrale è l'operazione inversa della derivata. L'integrale definito rappresenta l'area sotto la curva.",
            tr: "İntegral, türevin ters işlemidir. Belirli integral, eğrinin altındaki alanı temsil eder.",
            ar: "التكامل هو العملية العكسية للاشتقاق. يمثل التكامل المحدد هندسياً المساحة تحت المنحنى."
        },
        catAdvice: {
            el: "Μην ξεχνάς ποτέ τη σταθερά C στο αόριστο ολοκλήρωμα! Είναι σημαντικό! 😺",
            en: "Never forget the constant C in an indefinite integral! It's important! 😺",
            fr: "N'oublie jamais la constante C dans une intégrale indéfinie ! 😺",
            es: "¡Nunca olvides la constante C en una integral indefinida! 😺",
            it: "Non dimenticare mai la costante C in un integrale indefinito! 😺",
            tr: "Belirsiz integralde C sabitini asla unutma! 😺",
            ar: "لا تنس أبدًا الثابت C في التكامل غير المحدد! 😺"
        }
    },
    {
        id: "logarithms",
        category: "algebra",
        title: {
            el: "Λογάριθμοι",
            en: "Logarithms",
            fr: "Logarithmes",
            es: "Logaritmos",
            it: "Logaritmi",
            tr: "Logaritmalar",
            ar: "اللوغاريتمات"
        },
        formula: "log_b(x) = y ⇔ b^y = x",
        latex: "y = \\log_2(x)",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Λογάριθμος",
        definition: {
            el: "Ο λογάριθμος ενός αριθμού είναι ο εκθέτης στον οποίο πρέπει να υψωθεί η βάση για να παραχθεί αυτός ο αριθμός. Για παράδειγμα, ο λογάριθμος του 1000 με βάση το 10 είναι 3, επειδή 10³ = 1000.",
            en: "The logarithm is the inverse function to exponentiation. That means the logarithm of a given number x is the exponent to which another fixed number, the base b, must be raised, to produce that number x.",
            fr: "Le logarithme d'un nombre est l'exposant auquel il faut élever la base pour obtenir ce nombre.",
            es: "El logaritmo de un número es el exponente al que hay que elevar la base para obtener dicho número.",
            it: "Il logaritmo di un numero è l'esponente a cui deve essere elevata la base per ottenere tale numero.",
            tr: "Bir sayının logaritması, o sayıyı elde etmek için tabanın yükseltilmesi gereken üstür.",
            ar: "لوغاريتم عدد هو الأس الذي يجب رفع الأساس إليه لإنتاج ذلك العدد."
        },
        catAdvice: {
            el: "Σκέψου τον λογάριθμο σαν την ερώτηση: «Σε ποια δύναμη πρέπει να υψώσω τη βάση για να βρω το x;» 🐱",
            en: "Think of the logarithm as the question: 'To what power must I raise the base to get x?' 🐱",
            fr: "Pense au logarithme comme une question d'exposant ! 🐱",
            es: "Piensa en el logaritmo como una pregunta de exponente. 🐱",
            it: "Pensa al logaritmo come a una domanda sull'esponente! 🐱",
            tr: "Logaritmayı bir üs sorusu olarak düşün! 🐱",
            ar: "فكر في اللوغاريتم كسؤال عن الأس! 🐱"
        }
    },
    {
        id: "inequalities",
        category: "algebra",
        title: {
            el: "Ανισότητες",
            en: "Inequalities",
            fr: "Inégalités",
            es: "Desigualdades",
            it: "Disuguaglianze",
            tr: "Eşitsizlikler",
            ar: "المتباينات"
        },
        formula: "ax + b > 0",
        latex: "y > 2x - 1",
        grade: "gym_g",
        source: "https://el.wikipedia.org/wiki/Ανισότητα",
        definition: {
            el: "Η ανισότητα είναι μια σχέση που συγκρίνει δύο αριθμούς ή παραστάσεις χρησιμοποιώντας σύμβολα όπως > (μεγαλύτερο), < (μικρότερο), ≥, ≤. Η επίλυσή της μοιάζει με τις εξισώσεις, αλλά θέλει προσοχή στο πρόσημο.",
            en: "An inequality compares two values, showing if one is less than, greater than, or simply not equal to another value.",
            fr: "Une inégalité compare deux valeurs.",
            es: "Una desigualdad compara dos valores.",
            it: "Una disuguaglianza confronta due valori.",
            tr: "Bir eşitsizlik iki değeri karşılaştırır.",
            ar: "تقارن المتباينة بين قيمتين."
        },
        catAdvice: {
            el: "Ο χρυσός κανόνας: Όταν πολλαπλασιάζεις ή διαιρείς μια ανισότητα με ΑΡΝΗΤΙΚΟ αριθμό, πρέπει να αλλάξεις τη φορά της ανισότητας! 🐈🆘",
            en: "The golden rule: When multiplying or dividing an inequality by a NEGATIVE number, flip the inequality sign! 🐈🆘",
            fr: "N'oublie pas d'inverser le signe lors de la multiplication par un nombre négatif ! 🐈🆘",
            es: "¡Invierte el signo al multiplicar por un número negativo! 🐈🆘",
            it: "Inverti il segno quando moltiplichi per un numero negativo! 🐈🆘",
            tr: "Negatif bir sayıyla çarparken eşitsizliğin yönünü değiştirmeyi unutma! 🐈🆘",
            ar: "اعكس علامة المتباينة عند الضرب بعدد سالب! 🐈🆘"
        }
    },
    {
        id: "absolute_value",
        category: "algebra",
        title: {
            el: "Απόλυτη Τιμή",
            en: "Absolute Value",
            fr: "Valeur Absolue",
            es: "Valor Absoluto",
            it: "Valore Assoluto",
            tr: "Mutlak Değer",
            ar: "القيمة المطلقة"
        },
        formula: "|x| = x (αν x≥0) ή -x (αν x<0)",
        latex: "y = \\left|x\\right|",
        grade: "gym_a",
        source: "https://el.wikipedia.org/wiki/Απόλυτη_τιμή",
        definition: {
            el: "Η απόλυτη τιμή ενός πραγματικού αριθμού είναι η απόστασή του από το μηδέν στον άξονα των πραγματικών αριθμών. Είναι πάντα μη-αρνητικός αριθμός.",
            en: "The absolute value of a real number is its distance from zero on the number line. It is always non-negative.",
            fr: "La valeur absolue d'un nombre réel est sa distance par rapport à zéro sur la droite numérique.",
            es: "El valor absoluto de un número real es su distancia desde cero en la recta numérica.",
            it: "Il valore assoluto di un numero reale è la sua distanza da zero sulla retta numerica.",
            tr: "Bir reel sayının mutlak değeri, onun sayı doğrusunda sıfıra olan uzaklığıdır.",
            ar: "القيمة المطلقة لعدد حقيقي هي المسافة بينه وبين الصفر على خط الأعداد."
        },
        catAdvice: {
            el: "Η απόλυτη τιμή κάνει όλους τους αριθμούς θετικούς! Είναι σαν το χαμόγελο της γάτας! 😺",
            en: "Absolute value makes all numbers positive! It's like a cat's smile! 😺",
            fr: "La valeur absolue rend tous les nombres positifs ! 😺",
            es: "¡El valor absoluto hace que todos los números sean positivos! 😺",
            it: "Il valore assoluto rende positivi tutti i numeri! 😺",
            tr: "Mutlak değer tüm sayıları pozitif yapar! 😺",
            ar: "القيمة المطلقة تجعل جميع الأرقام موجبة! 😺"
        }
    },
    {
        id: "law_of_sines",
        category: "geometry",
        title: {
            el: "Νόμος των Ημιτόνων",
            en: "Law of Sines",
            fr: "Loi des Sinus",
            es: "Ley de los Senos",
            it: "Teorema dei Seni",
            tr: "Sinüs Teoremi",
            ar: "قانون الجيوب"
        },
        formula: "a/sin(A) = b/sin(B) = c/sin(C) = 2R",
        latex: "y = \\sin(x)",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Νόμος_των_ημιτόνων",
        definition: {
            el: "Σε κάθε τρίγωνο, ο λόγος του μήκους κάθε πλευράς προς το ημίτονο της απέναντι γωνίας είναι σταθερός και ισούται με τη διάμετρο του περιγεγραμμένου κύκλου (2R).",
            en: "In trigonometry, the law of sines is an equation relating the lengths of the sides of a triangle to the sines of its angles.",
            fr: "En trigonométrie, la loi des sinus est une équation reliant les longueurs des côtés d'un triangle aux sinus de ses angles.",
            es: "En trigonometría, la ley de los senos es una ecuación que relaciona las longitudes de los lados de un triángulo con los senos de sus ángulos.",
            it: "In trigonometria, il teorema dei seni è un'equazione che mette in relazione le lunghezze dei lati di un triangolo con i seni dei suoi angoli.",
            tr: "Trigonometride sinüs teoremi, bir üçgenin kenar uzunluklarını açılarının sinüsleri ile ilişkilendiren bir denklemdir.",
            ar: "في حساب المثلثات، قانون الجيوب هو معادلة تربط بين أطوال أضلاع المثلث وجيوب زواياه."
        },
        catAdvice: {
            el: "Χρησιμοποίησέ τον όταν ξέρεις δύο γωνίες και μία πλευρά, ή δύο πλευρές και μία απέναντι γωνία! 🐾",
            en: "Use it when you know two angles and one side, or two sides and an opposite angle! 🐾",
            fr: "Utilise-le quand tu connais deux angles et un côté ! 🐾",
            es: "¡Úsalo cuando conozcas dos ángulos y un lado! 🐾",
            it: "Usalo quando conosci due angoli e un lato! 🐾",
            tr: "İki açı ve bir kenar bildiğinde kullan! 🐾",
            ar: "استخدمه عندما تعرف زاويتين وضلعًا! 🐾"
        }
    },
    {
        id: "law_of_cosines",
        category: "geometry",
        title: {
            el: "Νόμος των Συνημιτόνων",
            en: "Law of Cosines",
            fr: "Loi des Cosinus",
            es: "Ley de los Cosenos",
            it: "Teorema del Coseno",
            tr: "Kosinüs Teoremi",
            ar: "قانون جيب التمام"
        },
        formula: "c² = a² + b² - 2ab·cos(C)",
        latex: "y = \\cos(x)",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Νόμος_των_συνημιτόνων",
        definition: {
            el: "Ο νόμος των συνημιτόνων (ή γενικευμένο Πυθαγόρειο θεώρημα) συνδέει τα μήκη των πλευρών ενός τριγώνου με το συνημίτονο μίας από τις γωνίες του.",
            en: "The law of cosines relates the lengths of the sides of a triangle to the cosine of one of its angles.",
            fr: "La loi des cosinus relie les longueurs des côtés d'un triangle au cosinus de l'un de ses angles.",
            es: "La ley de los cosenos relaciona las longitudes de los lados de un triángulo con el coseno de uno de sus ángulos.",
            it: "Il teorema del coseno mette in relazione le lunghezze dei lati di un triangolo con il coseno di uno dei suoi angoli.",
            tr: "Kosinüs teoremi, bir üçgenin kenar uzunluklarını açılarından birinin kosinüsü ile ilişkilendirir.",
            ar: "يربط قانون جيب التمام أطوال أضلاع المثلث بجيب تمام إحدى زواياه."
        },
        catAdvice: {
            el: "Είναι το Πυθαγόρειο θεώρημα, αλλά με μια έξτρα «ουρίτσα» στο τέλος (-2ab·cosC) για τα μη-ορθογώνια τρίγωνα! 🐈",
            en: "It's the Pythagorean theorem, but with an extra 'tail' at the end for non-right triangles! 🐈",
            fr: "C'est le théorème de Pythagore avec une 'queue' supplémentaire ! 🐈",
            es: "¡Es el teorema de Pitágoras con una 'cola' extra! 🐈",
            it: "È il teorema di Pitagora con una 'coda' in più! 🐈",
            tr: "Pisagor teoremine benzer, ancak ekstra bir kısmı var! 🐈",
            ar: "إنه مثل مبرهنة فيثاغورس مع جزء إضافي! 🐈"
        }
    }
];

const fileContent = 'const encyclopediaEntries = ' + JSON.stringify(data, null, 4) + ';\n';
fs.writeFileSync('src/encyclopediaData.js', fileContent);

