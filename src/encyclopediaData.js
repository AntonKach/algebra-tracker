const encyclopediaEntries = [
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
            el: "Μια πρωτοβάθμια εξίσωση (ή γραμμική εξίσωση) περιγράφει μια σχέση όπου η άγνωστη μεταβλητή x έχει δύναμη 1. Η γραφική της παράσταση είναι μια ευθεία γραμμή. Η λύση της εξίσωσης ax + b = 0 δίνεται από τον τύπο x = -b/a (όταν το a δεν είναι μηδέν).",
            en: "A linear equation describes a relationship where the unknown variable x has a power of 1. Its graphical representation is a straight line.",
            fr: "Une équation linéaire décrit une relation où la variable inconnue x est à la puissance 1.",
            es: "Una ecuación lineal describe una relación donde la variable desconocida x tiene una potencia de 1.",
            it: "Un'equazione lineare descrive una relazione in cui la variabile incognita x ha potenza pari a 1.",
            tr: "Birinci dereceden (veya doğrusal) bir denklem, bilinmeyen değişken x'in 1. kuvvete sahip olduğu bir ilişkiyi tanımlar.",
            ar: "تصف المعادلة الخطية العلاقة حيث يكون للمتغير المجهول x القوة 1."
        },
        catAdvice: {
            el: "Φέρε όλα τα x από τη μια πλευρά και τους αριθμούς από την άλλη! Και μην ξεχνάς να αλλάζεις πρόσημο (+ σε -) όταν αλλάζεις πλευρά! Νιάου! 🐾",
            en: "Keep all the x's on one side and the numbers on the other! And don't forget to change the sign (+ to -) when crossing the equals sign! 🐾",
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
            fr: "Systèmes d'équations",
            es: "Sistemas de ecuaciones",
            it: "Sistemi di equazioni",
            tr: "Denklem Sistemleri",
            ar: "أنظمة المعادلات"
        },
        formula: "ax+by=c, dx+ey=f",
        latex: "x+y=5; x-y=1",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Σύστημα_γραμμικών_εξισώσεων",
        definition: {
            el: "Ένα σύστημα γραμμικών εξισώσεων αποτελείται από δύο ή περισσότερες γραμμικές εξισώσεις. Η λύση του είναι το σημείο τομής των ευθειών.",
            en: "A system of linear equations consists of two or more linear equations. The solution is the intersection point of the lines.",
            fr: "Un système d'équations linéaires se compose de deux ou plusieurs équations.",
            es: "Un sistema de ecuaciones lineales consta de dos o más ecuaciones.",
            it: "Un sistema di equazioni lineari è costituito da due o più equazioni.",
            tr: "Doğrusal bir denklem sistemi, iki veya daha fazla doğrusal denklemden oluşur.",
            ar: "يتكون نظام المعادلات الخطية من معادلتين خطيتين أو أكثر."
        },
        catAdvice: {
            el: "Λύσε τη μία εξίσωση ως προς x και βάλε το αποτέλεσμα στην άλλη (μέθοδος αντικατάστασης)! 🐾",
            en: "Solve one equation for x and plug it into the other! 🐾",
            fr: "Résous une équation pour x et remplace-la dans l'autre ! 🐾",
            es: "¡Resuelve una ecuación para x y reemplázala en la otra! 🐾",
            it: "Risolvi un'equazione per x e sostituiscila nell'altra! 🐾",
            tr: "Bir denklemi x için çöz ve diğerine yerleştir! 🐾",
            ar: "حل معادلة واحدة لـ x وضعها في الأخرى! 🐾"
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
            en: "A polynomial is an expression consisting of variables and coefficients.",
            fr: "Un polynôme est une expression constituée de variables et de coefficients.",
            es: "Un polinomio es una expresión constituida por variables y coeficientes.",
            it: "Un polinomio è un'espressione costituita da variabili e coefficienti.",
            tr: "Polinom, değişkenler ve katsayılardan oluşan bir cebirsel ifadedir.",
            ar: "كثيرة الحدود هي تعبير يتكون من متغيرات ومعاملات."
        },
        catAdvice: {
            el: "Πρόσεχε τις δυνάμεις! Μπορείς να προσθέσεις μόνο τους όρους που έχουν το ίδιο x στην ίδια δύναμη! 🐈",
            en: "Watch the exponents! You can only add terms with the same power! 🐈",
            fr: "Fais attention aux exposants ! 🐈",
            es: "¡Cuidado con los exponentes! 🐈",
            it: "Fai attenzione agli esponenti! 🐈",
            tr: "Üslere dikkat et! 🐈",
            ar: "انتبه للأسس! 🐈"
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
            el: "Σε κάθε ορθογώνιο τρίγωνο, το τετράγωνο της υποτείνουσας ισούται με το άθροισμα των τετραγώνων των δύο κάθετων πλευρών.",
            en: "In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.",
            fr: "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.",
            es: "En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los otros dos lados.",
            it: "In un triangolo rettangolo, il quadrato dell'ipotenusa è uguale alla somma dei quadrati degli altri due lati.",
            tr: "Bir dik üçgende, hipotenüsün karesi diğer iki kenarın kareleri toplamına eşittir.",
            ar: "في المثلث القائم الزاوية، مربع الوتر يساوي مجموع مربعي الضلعين الآخرين."
        },
        catAdvice: {
            el: "Η υποτείνουσα (το c) είναι πάντα η μεγαλύτερη πλευρά και βρίσκεται απέναντι από την ορθή γωνία! 🐾",
            en: "The hypotenuse is always the longest side, opposite the right angle! 🐾",
            fr: "L'hypoténuse est le côté le plus long ! 🐾",
            es: "¡La hipotenusa es el lado más largo! 🐾",
            it: "L'ipotenusa è il lato più lungo! 🐾",
            tr: "Hipotenüs her zaman en uzun kenardır! 🐾",
            ar: "الوتر هو دائمًا أطول ضلع! 🐾"
        }
    },
    {
        id: "circle_area",
        category: "geometry",
        title: {
            el: "Εμβαδόν & Περίμετρος Κύκλου",
            en: "Circle Area & Perimeter",
            fr: "Cercle",
            es: "Círculo",
            it: "Cerchio",
            tr: "Daire",
            ar: "دائرة"
        },
        formula: "A = πr², C = 2πr",
        latex: "x^2 + y^2 = 9",
        grade: "gym_a",
        source: "https://el.wikipedia.org/wiki/Κύκλος",
        definition: {
            el: "Το εμβαδόν ενός κύκλου είναι A = π·r² και το μήκος της περιφέρειάς του C = 2·π·r, όπου r είναι η ακτίνα.",
            en: "The area of a circle is A = πr² and its circumference is C = 2πr.",
            fr: "L'aire d'un cercle est A = πr².",
            es: "El área de un círculo es A = πr².",
            it: "L'area di un cerchio è A = πr².",
            tr: "Bir dairenin alanı A = πr²'dir.",
            ar: "مساحة الدائرة هي A = πr²."
        },
        catAdvice: {
            el: "Το π είναι περίπου 3.14159! Μην το μπερδεύεις με την πίτα που τρώμε! 🥧🐈",
            en: "Pi is approximately 3.14159! Don't confuse it with pie! 🥧🐈",
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
            en: "Trig Identity",
            fr: "Identité Trigonométrique",
            es: "Identidad Trigonométrica",
            it: "Identità Trigonometrica",
            tr: "Trigonometrik Özdeşlik",
            ar: "المتطابقة المثلثية"
        },
        formula: "sin²(θ) + cos²(θ) = 1",
        latex: "(\\sin(x))^2 + (\\cos(x))^2 = 1",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Τριγωνομετρικές_ταυτότητες",
        definition: {
            el: "Το άθροισμα των τετραγώνων του ημιτόνου και του συνημιτόνου οποιασδήποτε γωνίας ισούται πάντα με 1. Προκύπτει από το Πυθαγόρειο θεώρημα.",
            en: "The sum of the squares of sine and cosine is always 1.",
            fr: "La somme des carrés du sinus et du cosinus est 1.",
            es: "La suma de los cuadrados del seno y el coseno es 1.",
            it: "La somma dei quadrati del seno e del coseno è 1.",
            tr: "Sinüs ve kosinüsün kareleri toplamı her zaman 1'dir.",
            ar: "مجموع مربعي الجيب وجيب التمام يساوي دائمًا 1."
        },
        catAdvice: {
            el: "Μάθε αυτόν τον τύπο σαν το όνομά σου, θα σε σώσει πολλές φορές! 😻",
            en: "Memorize this formula well, it will save you! 😻",
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
            en: "If parallel lines intersect two distinct lines, then they cut off proportional segments.",
            fr: "Si des droites parallèles coupent deux autres droites, les segments sont proportionnels.",
            es: "Si rectas paralelas cortan a dos rectas, los segmentos son proporcionales.",
            it: "Un fascio di rette parallele tagliato da due trasversali determina segmenti proporzionali.",
            tr: "Paralel doğrular iki kesen doğruyu kestiğinde, oluşturdukları parçalar orantılıdır.",
            ar: "إذا تقاطعت خطوط متوازية مع خطين آخرين، فإن القطع المحددة متناسبة."
        },
        catAdvice: {
            el: "Σκέψου τις αναλογίες σαν κλάσματα που είναι ίσα μεταξύ τους! 🐾",
            en: "Think of proportions as equal fractions! 🐾",
            fr: "Pense aux proportions comme des fractions égales ! 🐾",
            es: "¡Piensa en proporciones como fracciones iguales! 🐾",
            it: "Pensa alle proporzioni come frazioni uguali! 🐾",
            tr: "Oranları eşit kesirler olarak düşün! 🐾",
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
        latex: "y = 2x",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Παράγωγος",
        definition: {
            el: "Η παράγωγος εκφράζει τον ρυθμό μεταβολής μιας συνάρτησης σε ένα σημείο (την κλίση της εφαπτομένης).",
            en: "The derivative measures the sensitivity to change of the function value.",
            fr: "La dérivée exprime le taux de variation d'une fonction.",
            es: "La derivada expresa la tasa de cambio de una función.",
            it: "La derivata esprime il tasso di variazione di una funzione.",
            tr: "Türev, fonksiyonun değişim oranını ifade eder.",
            ar: "تعبر المشتقة عن معدل تغير الدالة."
        },
        catAdvice: {
            el: "Η παράγωγος σου δείχνει πόσο γρήγορα αλλάζει κάτι, όπως όταν τρέχω να πιάσω το ποντίκι! 🐈💨",
            en: "The derivative tells you how fast something changes! 🐈💨",
            fr: "La dérivée indique la vitesse de changement ! 🐈💨",
            es: "¡La derivada te dice qué tan rápido cambia algo! 🐈💨",
            it: "La derivata ti dice quanto velocemente cambia qualcosa! 🐈💨",
            tr: "Türev bir şeyin ne kadar hızlı değiştiğini gösterir! 🐈💨",
            ar: "تخبرك المشتقة بمدى سرعة التغير! 🐈💨"
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
        latex: "\\int_{0}^{x} t dt",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Ολοκλήρωμα",
        definition: {
            el: "Το ορισμένο ολοκλήρωμα εκφράζει γεωμετρικά το εμβαδόν της περιοχής κάτω από τη γραφική παράσταση μιας συνάρτησης.",
            en: "The definite integral represents the area under the curve of a function.",
            fr: "L'intégrale représente l'aire sous la courbe.",
            es: "La integral representa el área bajo la curva.",
            it: "L'integrale rappresenta l'area sotto la curva.",
            tr: "İntegral, eğrinin altındaki alanı temsil eder.",
            ar: "يمثل التكامل المساحة تحت المنحنى."
        },
        catAdvice: {
            el: "Μην ξεχνάς ποτέ τη σταθερά C στο αόριστο ολοκλήρωμα! 😺",
            en: "Never forget the constant C in an indefinite integral! 😺",
            fr: "N'oublie jamais la constante C ! 😺",
            es: "¡Nunca olvides la constante C! 😺",
            it: "Non dimenticare mai la costante C! 😺",
            tr: "Belirsiz integralde C sabitini unutma! 😺",
            ar: "لا تنس أبدًا الثابت C! 😺"
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
            el: "Ο λογάριθμος του x με βάση το b είναι ο εκθέτης y στον οποίο πρέπει να υψωθεί το b για να πάρουμε x.",
            en: "The logarithm of x to base b is the exponent to which b must be raised to produce x.",
            fr: "Le logarithme est l'exposant auquel il faut élever la base.",
            es: "El logaritmo es el exponente al que hay que elevar la base.",
            it: "Il logaritmo è l'esponente a cui deve essere elevata la base.",
            tr: "Logaritma, tabanın yükseltilmesi gereken üstür.",
            ar: "اللوغاريتم هو الأس الذي يجب رفع الأساس إليه."
        },
        catAdvice: {
            el: "Σκέψου: «Σε ποια δύναμη πρέπει να υψώσω τη βάση για να βρω το x;» 🐱",
            en: "Think: 'To what power must I raise the base?' 🐱",
            fr: "Pense : 'À quelle puissance dois-je élever la base ?' 🐱",
            es: "Piensa: '¿A qué potencia debo elevar la base?' 🐱",
            it: "Pensa: 'A quale potenza devo elevare la base?' 🐱",
            tr: "Düşün: 'Tabanı hangi kuvvete yükseltmeliyim?' 🐱",
            ar: "فكر: 'إلى أي قوة يجب أن أرفع الأساس؟' 🐱"
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
            el: "Η ανισότητα συγκρίνει δύο παραστάσεις χρησιμοποιώντας σύμβολα όπως > ή <. Προσοχή όταν διαιρείς με αρνητικό αριθμό!",
            en: "An inequality compares two values using > or <.",
            fr: "Une inégalité compare deux valeurs.",
            es: "Una desigualdad compara dos valores.",
            it: "Una disuguaglianza confronta due valori.",
            tr: "Bir eşitsizlik iki değeri karşılaştırır.",
            ar: "تقارن المتباينة بين قيمتين."
        },
        catAdvice: {
            el: "Όταν πολλαπλασιάζεις ή διαιρείς με ΑΡΝΗΤΙΚΟ αριθμό, αλλάζεις τη φορά της ανισότητας! 🐈🆘",
            en: "When multiplying by a NEGATIVE number, flip the sign! 🐈🆘",
            fr: "Inverse le signe si tu multiplies par un négatif ! 🐈🆘",
            es: "¡Invierte el signo al multiplicar por negativo! 🐈🆘",
            it: "Inverti il segno se moltiplichi per un negativo! 🐈🆘",
            tr: "Negatif sayıyla çarparken işareti ters çevir! 🐈🆘",
            ar: "اقلب الإشارة عند الضرب بسالب! 🐈🆘"
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
        formula: "|x| = x (x≥0) ή -x (x<0)",
        latex: "y = \\left|x\\right|",
        grade: "gym_a",
        source: "https://el.wikipedia.org/wiki/Απόλυτη_τιμή",
        definition: {
            el: "Η απόλυτη τιμή είναι η απόσταση ενός αριθμού από το μηδέν. Είναι πάντα θετικός αριθμός (ή μηδέν).",
            en: "Absolute value is the distance of a number from zero.",
            fr: "La valeur absolue est la distance par rapport à zéro.",
            es: "El valor absoluto es la distancia desde cero.",
            it: "Il valore assoluto è la distanza da zero.",
            tr: "Mutlak değer, sıfıra olan uzaklıktır.",
            ar: "القيمة المطلقة هي المسافة من الصفر."
        },
        catAdvice: {
            el: "Η απόλυτη τιμή κάνει όλους τους αριθμούς θετικούς! Σαν το χαμόγελο της γάτας! 😺",
            en: "Absolute value makes all numbers positive! 😺",
            fr: "Rend tous les nombres positifs ! 😺",
            es: "¡Hace todos los números positivos! 😺",
            it: "Rende tutti i numeri positivi! 😺",
            tr: "Tüm sayıları pozitif yapar! 😺",
            ar: "يجعل جميع الأرقام موجبة! 😺"
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
        formula: "a/sin(A) = b/sin(B) = c/sin(C)",
        latex: "y = \\sin(x)",
        grade: "lyc_a",
        source: "https://el.wikipedia.org/wiki/Νόμος_των_ημιτόνων",
        definition: {
            el: "Σε κάθε τρίγωνο, ο λόγος κάθε πλευράς προς το ημίτονο της απέναντι γωνίας είναι σταθερός.",
            en: "The ratio of a side to the sine of its opposite angle is constant.",
            fr: "Le rapport d'un côté au sinus de son angle opposé est constant.",
            es: "La razón de un lado al seno de su ángulo opuesto es constante.",
            it: "Il rapporto tra un lato e il seno dell'angolo opposto è costante.",
            tr: "Bir kenarın karşı açısının sinüsüne oranı sabittir.",
            ar: "نسبة الضلع إلى جيب الزاوية المقابلة ثابتة."
        },
        catAdvice: {
            el: "Χρησιμοποίησέ τον όταν ξέρεις δύο γωνίες και μία πλευρά! 🐾",
            en: "Use it when you know two angles and one side! 🐾",
            fr: "Utilise-le avec deux angles et un côté ! 🐾",
            es: "¡Úsalo con dos ángulos y un lado! 🐾",
            it: "Usalo con due angoli e un lato! 🐾",
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
            el: "Ο νόμος των συνημιτόνων συνδέει τα μήκη των πλευρών με το συνημίτονο μίας γωνίας (Γενικευμένο Πυθαγόρειο).",
            en: "Relates the lengths of the sides of a triangle to the cosine of one angle.",
            fr: "Relie les longueurs des côtés au cosinus d'un angle.",
            es: "Relacioniona las longitudes con el coseno de un ángulo.",
            it: "Collega le lunghezze al coseno di un angolo.",
            tr: "Kenar uzunluklarını bir açının kosinüsü ile ilişkilendirir.",
            ar: "يربط الأطوال بجيب تمام الزاوية."
        },
        catAdvice: {
            el: "Είναι το Πυθαγόρειο θεώρημα, αλλά με μια έξτρα «ουρίτσα» για τα μη-ορθογώνια τρίγωνα! 🐈",
            en: "Pythagorean theorem with an extra 'tail' for non-right triangles! 🐈",
            fr: "Théorème de Pythagore pour triangles non rectangles ! 🐈",
            es: "¡Pitagoras para triángulos no rectángulos! 🐈",
            it: "Pitagora per triangoli non rettangoli! 🐈",
            tr: "Dik olmayan üçgenler için Pisagor! 🐈",
            ar: "فيثاغورس للمثلثات غير القائمة! 🐈"
        }
    }
];

if (typeof window !== 'undefined') {
    window.encyclopediaEntries = encyclopediaEntries;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = encyclopediaEntries;
}
