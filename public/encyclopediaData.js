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
        definition: {
            el: "Μια πρωτοβάθμια εξίσωση (ή γραμμική εξίσωση) περιγράφει μια σχέση όπου η άγνωστη μεταβλητή x έχει δύναμη 1. Η γραφική της παράσταση είναι μια ευθεία γραμμή. Η λύση της εξίσωσης ax + b = 0 δίνεται από τον τύπο x = -b/a (όταν το a δεν είναι μηδέν).",
            en: "A linear equation describes a relationship where the unknown variable x has a power of 1. Its graphical representation is a straight line. The solution to the equation ax + b = 0 is given by the formula x = -b/a (provided a is not zero).",
            fr: "Une équation linéaire décrit une relation où la variable inconnue x est à la puissance 1. Sa représentation graphique est une ligne droite. La solution de l'équation ax + b = 0 est donnée par la formule x = -b/a (pourvu que a ne soit pas nul).",
            es: "Una ecuación lineal describe una relación donde la variable desconocida x tiene una potencia de 1. Su representación gráfica es una línea recta. La solución a la ecuación ax + b = 0 viene dada por la fórmula x = -b/a (siempre que a no sea cero).",
            it: "Un'equazione lineare descrive una relazione in cui la variabile incognita x ha potenza pari a 1. La sua rappresentazione grafica è una linea retta. La soluzione dell'equazione ax + b = 0 è data dalla formula x = -b/a (purché a non sia zero).",
            tr: "Birinci dereceden (veya doğrusal) bir denklem, bilinmeyen değişken x'in 1. kuvvete sahip olduğu bir ilişkiyi tanımlar. Grafiksel gösterimi düz bir doğrudur. ax + b = 0 denkleminin çözümü x = -b/a formülü ile verilir (a sıfır olmamak kaydıyla).",
            ar: "تصف المعادلة الخطية العلاقة حيث يكون للمتغير المجهول x القوة 1. تمثيلها البياني هو خط مستقيم. حل المعادلة ax + b = 0 يعطى بالصيغة x = -b/a (بشرط ألا يكون a صفرًا)."
        },
        catAdvice: {
            el: "Φέρε όλα τα x από τη μια πλευρά και τους αριθμούς από την άλλη! Και μην ξεχνάς να αλλάζεις πρόσημο (+ σε -) όταν αλλάζεις πλευρά! Νιάου! 🐾",
            en: "Keep all the x's on one side and the numbers on the other! And don't forget to change the sign (+ to -) when crossing the equals sign! Meow! 🐾",
            fr: "Garde tous les x d'un côté et les nombres de l'autre ! Et n'oublie pas de changer le signe (+ en -) en traversant le signe égal ! Miaou ! 🐾",
            es: "¡Mantén todas las x de un lado και los números del otro! ¡Y no olvides cambiar el signo (+ a -) al cruzar el signo igual! ¡Miau! 🐾",
            it: "Tieni tutte le x da un lato e i numeri dall'altro! E non dimenticare di cambiare segno (+ in -) quando attraversi il segno uguale! Miao! 🐾",
            tr: "Tüm x'leri bir tarafta, sayıları diğer tarafta topla! Eşittir işaretinin diğer tarafına geçerken işareti (+ ise -) değiştirmeyi unutma! Miyav! 🐾",
            ar: "ضع كل مجاهيل x في جانب والأرقام في الجانب الآخر! ولا تنس تغيير الإشارة (+ إلى -) عند عبور علامة اليساوي! ميام! 🐾"
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
        definition: {
            el: "Μια δευτεροβάθμια εξίσωση περιέχει τη μεταβλητή x υψωμένη στο τετράγωνο. Η γραφική της παράσταση είναι μια καμπύλη που ονομάζεται παραβολή. Για να τη λύσουμε, υπολογίζουμε τη Διακρίνουσα Δ = b² - 4ac. Οι λύσεις δίνονται από τον τύπο x = (-b ± √Δ) / 2a.",
            en: "A quadratic equation contains the variable x raised to the power of 2. Its graphical representation is a curve called a parabola. To solve it, we compute the Discriminant Δ = b² - 4ac. The solutions are given by the formula x = (-b ± √Δ) / 2a.",
            fr: "Une équation du second degré contient la variable x élevée au carré. Sa représentation graphique est une courbe appelée parabole. Pour la résoudre, on calcule le Discriminant Δ = b² - 4ac. Les solutions sont données par la formule x = (-b ± √Δ) / 2a.",
            es: "Una ecuación cuadrática contiene la variable x elevada a la potencia de 2. Su representación gráfica es una curva llamada parábola. Para resolverla, calculamos el Discriminante Δ = b² - 4ac. Las soluciones se obtienen mediante la fórmula x = (-b ± √Δ) / 2a.",
            it: "Un'equazione di secondo grado contiene la variabile x elevata al quadrato. La sua rappresentazione grafica è una curva chiamata parabola. Per risolverla, calcoliamo il Discriminante Δ = b² - 4ac. Le soluzioni sono date dalla formula x = (-b ± √Δ) / 2a.",
            tr: "İkinci dereceden bir denklem, 2. kuvvete yükseltilmiş x değişkenini içerir. Grafiksel gösterimi parabol adı verilen bir eğridir. Çözmek için Diskriminantı Δ = b² - 4ac hesaplarız. Çözümler x = (-b ± √Δ) / 2a formülü ile verilir.",
            ar: "تحتوي المعادلة التربيعية على المتغير x مرفوعًا للقوة 2. تمثيلها البياني هو منحنى يسمى القطع المكافئ. لحلها، نحسب المميز Δ = b² - 4ac. وتكون الحلول بالصيغة x = (-b ± √Δ) / 2a."
        },
        catAdvice: {
            el: "Η διακρίνουσα Δ είναι το κλειδί! Αν Δ > 0 έχεις δύο λύσεις, αν Δ = 0 μία, κι αν Δ < 0 καμία πραγματική λύση (μόνο φανταστικά ποντίκια!). 😼",
            en: "The discriminant Δ is key! If Δ > 0 you have two real roots, if Δ = 0 one root, and if Δ < 0 no real roots (only imaginary mice!). 😼",
            fr: "Le discriminant Δ est la clé ! Si Δ > 0 tu as deux solutions, si Δ = 0 une, et si Δ < 0 aucune solution réelle (que des souris imaginaires !). 😼",
            es: "¡El discriminante Δ es clave! Si Δ > 0 tienes dos raíces reales, si Δ = 0 una raíz, y si Δ < 0 no hay raíces reales (¡solo ratones imaginarios!). 😼",
            it: "Il discriminante Δ è fondamentale! Se Δ > 0 hai due soluzioni, se Δ = 0 una, e se Δ < 0 nessuna soluzione reale (solo topi immaginari!). 😼",
            tr: "Diskriminant Δ anahtardır! Δ > 0 ise iki gerçek kök, Δ = 0 ise tek kök, Δ < 0 ise gerçek kök yoktur (sadece hayali fareler!). 😼",
            ar: "المميز Δ هو المفتاح! إذا كان Δ > 0 فلديك حلان حقيقيان، وإذا كان Δ = 0 فلديك حل واحد، وإذا كان Δ < 0 فلا توجد حلول حقيقية (فقط فئران خيالية!). 😼"
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
            ar: "نظرية فيثاغورس"
        },
        formula: "a² + b² = c²",
        latex: "x^2 + y^2 = 25",
        grade: "gym_b",
        definition: {
            el: "Ένα από τα πιο διάσημα θεωρήματα της Γεωμετρίας. Σε κάθε ορθογώνιο τρίγωνο, το άθροισμα των τετραγώνων των δύο κάθετων πλευρών (a και b) ισούται με το τετράγωνο της υποτείνουσας (c, η μεγαλύτερη πλευρά απέναντι από την ορθή γωνία).",
            en: "One of the most famous theorems in Geometry. In any right-angled triangle, the sum of the squares of the lengths of the two shorter sides (a and b) is equal to the square of the length of the hypotenuse (c, the longest side opposite the right angle).",
            fr: "L'un des théorèmes les plus célèbres de la géométrie. Dans un triangle rectangle, la somme des carrés des longueurs des deux côtés de l'angle droit (a et b) est égale au carré de la longueur de l'hypoténuse (c, le côté le plus long opposé à l'angle droit).",
            es: "Uno de los teoremas más famosos de la Geometría. En cualquier triángulo rectángulo, la suma των cuadrados de las longitudes de los dos lados más cortos (a y b) es igual al cuadrado de la longitud de la hipotenusa (c, el lado más largo opuesto al ángulo recto).",
            it: "Uno dei teoremi più famosi della Geometria. In ogni triangolo rettangolo, la somma dei quadrati delle lunghezze dei due lati più corti (a e b) è uguale al quadrato della lunghezza dell'ipotenusa (c, il lato più lungo opposto all'angolo retto).",
            tr: "Geometrinin en ünlü teoremlerinden biri. Herhangi bir dik üçgende, iki dik kenarın (a ve b) uzunluklarının karelerinin toplamı, hipotenüsün (c, dik açının karşısındaki en uzun kenar) uzunluğunun karesine eşittir.",
            ar: "من أشهر النظريات في الهندسة. في أي مثلث قائم الزاوية، مجموع مربعي طولي الضلعين الأقصر (a و b) يساوي مربع طول الوتر (c، الضلع الأطول المقابل للزاوية القائمة)."
        },
        catAdvice: {
            el: "Χρησιμοποίησέ το για να βρεις την απόσταση! Στο γράφημα, η εξίσωση x² + y² = 25 περιγράφει έναν τέλειο κύκλο με ακτίνα 5 (αφού 3² + 4² = 5²)! 📐🐾",
            en: "Use it to find distances! On the graph, the equation x² + y² = 25 describes a perfect circle with radius 5 (since 3² + 4² = 5²)! 📐🐾",
            fr: "Utilise-le pour trouver des distances ! Sur le graphe, l'équation x² + y² = 25 décrit un cercle parfait de rayon 5 (car 3² + 4² = 5²) ! 📐🐾",
            es: "¡Úsalo para encontrar distancias! En el gráfico, la ecuación x² + y² = 25 describe un círculo perfecto con radio 5 (¡ya que 3² + 4² = 5²)! 📐🐾",
            it: "Usalo per trovare le distanze! Sul grafico, l'equazione x² + y² = 25 descrive un cerchio perfetto con raggio 5 (poiché 3² + 4² = 5²)! 📐🐾",
            tr: "Mesafe bulmak için kullan! Grafikte x² + y² = 25 denklemi, yarıçapı 5 olan mükemmel bir çemberi tanımlar (çünkü 3² + 4² = 5²)! 📐🐾",
            ar: "استخدمها للعثور على المسافات! على الرسم البياني، تصف المعادلة x² + y² = 25 دائرة مثالية بنصف قطر 5 (بما أن 3² + 4² = 5²)! 📐🐾"
        }
    },
    {
        id: "trigonometry",
        category: "geometry",
        title: {
            el: "Τριγωνομετρία & Ημίτονο",
            en: "Trigonometry & Sine",
            fr: "Trigonométrie & Sinus",
            es: "Trigonometría y Seno",
            it: "Trigonometria e Seno",
            tr: "Trigonometri & Sinüs",
            ar: "علم المثلثات والجيب"
        },
        formula: "sin²(θ) + cos²(θ) = 1",
        latex: "y = \\sin(x)",
        grade: "lyc_b",
        definition: {
            el: "Η τριγωνομετρία μελετά τις σχέσεις μεταξύ των γωνιών και των πλευρών των τριγώνων. Οι βασικές συναρτήσεις είναι το Ημίτονο (sin), το Συνημίτονο (cos) και η Εφαπτομένη (tan). Ορίζονται εύκολα στον Τριγωνομετρικό Κύκλο που έχει ακτίνα 1.",
            en: "Trigonometry studies the relationships between the angles and sides of triangles. The fundamental functions are Sine (sin), Cosine (cos), and Tangent (tan). They are easily defined on the Unit Circle, which has a radius of 1.",
            fr: "La trigonométrie étudie les relations entre les angles et les côtés des triangles. Les fonctions fondamentales sont le Sinus (sin), le Cosinus (cos) et la Tangente (tan). Elles se définissent facilement sur le cercle trigonométrique de rayon 1.",
            es: "La trigonometría estudia las relaciones entre los ángulos y los lados de los triángulos. Las funciones fundamentales son el Seno (sin), el Coseno (cos) y la Tangente (tan). Se definen fácilmente en el Círculo Unitario, que tiene un radio de 1.",
            it: "La trigonometria studia le relazioni tra gli angoli e i lati dei triangoli. Le funzioni fondamentali sono il Seno (sin), il Coseno (cos) e la Tangente (tan). Sono facilmente definite sul Cerchio Unitario, che ha un raggio pari a 1.",
            tr: "Trigonometri, üçgenlerin açıları ve kenarları arasındaki ilişkileri inceler. Temel fonksiyonlar Sinüs (sin), Kosinüs (cos) ve Tanjanttır (tan). Yarıçapı 1 olan Birim Çember üzerinde kolayca tanımlanırlar.",
            ar: "يدرس علم المثلثات العلاقات بين زوايا المثلثات وأضلاعها. الدوال الأساسية هي الجيب (sin)، جيب التمام (cos)، والظل (tan). يتم تعريفها بسهولة على دائرة الوحدة، التي يبلغ نصف قطرها 1."
        },
        catAdvice: {
            el: "Ημίτονο στο y, συνημίτονο στο x! Οι τιμές τους κυμαίνονται πάντα μεταξύ -1 και 1, σαν μια γάτα που κάνει πέρα-δώθε στο δωμάτιο! 🐈🌊",
            en: "Sine is on the y-axis, cosine is on the x-axis! Their values always wave between -1 and 1, like a cat pacing back and forth in a room! 🐈🌊",
            fr: "Sinus sur l'axe y, cosinus sur l'axe x ! Leurs valeurs oscillent toujours entre -1 et 1, comme un chat qui fait des allers-retours dans la pièce ! 🐈🌊",
            es: "¡El Seno está en el eje y, el Coseno en el eje x! ¡Sus valores siempre fluctúan entre -1 y 1, como un gato que va de un lado a otro en la habitación! 🐈🌊",
            it: "Il seno è sull'asse y, il coseno sull'asse x! I loro valori oscillano sempre tra -1 e 1, come un gatto che cammina avanti e indietro in una stanza! 🐈🌊",
            tr: "y ekseninde Sinüs, x ekseninde Kosinüs! Değerleri her zaman -1 ile 1 arasında salınır, tıpkı odada bir ileri bir geri yürüyen bir kedi gibi! 🐈🌊",
            ar: "الجيب على محور y، وجيب التمام على محور x! تتقلب قيمها دائمًا بين -1 و 1، مثل قطة تمشي ذهابًا وإيابًا في الغرفة! 🐈🌊"
        }
    },
    {
        id: "logarithms",
        category: "analysis",
        title: {
            el: "Λογάριθμοι",
            en: "Logarithms",
            fr: "Logarithmes",
            es: "Logaritmos",
            it: "Logaritmi",
            tr: "Logaritmalar",
            ar: "اللوغاريتمات"
        },
        formula: "log_b(x) = y <=> b^y = x",
        latex: "y = \\ln(x)",
        grade: "lyc_b",
        definition: {
            el: "Ο λογάριθμος είναι η αντίστροφη πράξη της ύψωσης σε δύναμη. Μας λέει σε ποιον εκθέτη πρέπει να υψώσουμε μια βάση b για να πάρουμε τον αριθμό x. Ο φυσικός λογάριθμος ln(x) έχει ως βάση τον μαγικό αριθμό του Euler e (≈ 2.718).",
            en: "A logarithm is the inverse operation of exponentiation. It tells us to what exponent we must raise a base b to obtain the number x. The natural logarithm ln(x) uses Euler's magic number e (≈ 2.718) as its base.",
            fr: "Un logarithme est l'opération inverse de l'exponentiation. Il nous indique à quel exposant élever une base b pour obtenir le nombre x. Le logarithme naturel ln(x) utilise le nombre magique d'Euler e (≈ 2,718) comme base.",
            es: "Un logaritmo es la operación inversa de la exponenciación. Nos indica a qué exponente debemos elevar una base b para obtener el número x. El logaritmo natural ln(x) utiliza como base el número mágico de Euler e (≈ 2.718).",
            it: "Il logaritmo è l'operazione inversa dell'elevamento a potenza. Ci dice a quale esponente dobbiamo elevare una base b per ottenere il numero x. Il logaritmo naturale ln(x) ha come base il numero magico di Eulero e (≈ 2.718).",
            tr: "Logaritma, üs alma işleminin tersidir. Bize, x sayısını elde etmek için bir b tabanını hangi üsse yükseltmemiz gerektiğini söyler. Doğal logaritma ln(x), taban olarak Euler'in sihirli sayısı e'yi (≈ 2.718) kullanır.",
            ar: "اللوغاريتم هو العملية العكسية للرفع إلى أس. يخبرنا بالأس الذي يجب أن نرفع إليه الأساس b للحصول على الرقم x. اللوغاريتم الطبيعي ln(x) أساسه عدد Euler السحري e (≈ 2.718)."
        },
        catAdvice: {
            el: "Θυμήσου: δεν μπορείς να πάρεις λογάριθμο μηδενικού ή αρνητικού αριθμού! Το x πρέπει να είναι πάντα αυστηρά θετικό (x > 0), όπως η αγάπη μου για τις κονσέρβες! 🐾🥫",
            en: "Remember: you can't take the logarithm of zero or a negative number! The value x must always be strictly positive (x > 0), just like my love for cat food! 🐾🥫",
            fr: "Rappelle-toi : tu ne peux pas prendre le logarithme de zéro ou d'un nombre négatif ! La valeur x doit toujours être strictement positive (x > 0), tout comme mon amour pour le pâté ! 🐾🥫",
            es: "¡Recuerda: no puedes tomar el logaritmo de cero ni de un número negativo! El valor x debe ser siempre estrictamente positivo (x > 0), ¡al igual que mi amor por la comida para gatos! 🐾🥫",
            it: "Ricorda: non puoi calcolare il logaritmo di zero o di un numero negativo! Il valore x deve essere sempre strettamente positivo (x > 0), proprio come il mio amore per le scatolette! 🐾🥫",
            tr: "Unutma: sıfırın veya negatif bir sayının logaritmasını alamazsın! x değeri, tıpkı konserve mamaya olan aşkım gibi, her zaman kesinlikle pozitif (x > 0) olmalıdır! 🐾🥫",
            ar: "تذكر: لا يمكنك أخذ لوغاريتم الصفر أو رقم سالب! يجب أن يكون المتغير x موجبًا تمامًا دائمًا (x > 0)، تمامًا مثل حبي لطعام القطط المعلب! 🐾🥫"
        }
    },
    {
        id: "limits",
        category: "analysis",
        title: {
            el: "Όρια",
            en: "Limits",
            fr: "Limites",
            es: "Límites",
            it: "Limiti",
            tr: "Limitler",
            ar: "النهايات"
        },
        formula: "log_b(x) = y <=> b^y = x", // fallback, limits use typical expressions
        latex: "y = 1/x",
        grade: "lyc_g",
        definition: {
            el: "Το όριο περιγράφει τη συμπεριφορά μιας συνάρτησης καθώς η μεταβλητή x πλησιάζει πολύ κοντά σε μια τιμή (ή στο άπειρο). Είναι η θεμελιώδης έννοια πάνω στην οποία χτίστηκε ολόκληρος ο Απειροστικός Λογισμός.",
            en: "A limit describes the behavior of a function as the input variable x approaches a specific value (or infinity). It is the fundamental concept upon which all of Calculus is built.",
            fr: "La limite décrit le comportement d'une fonction lorsque la variable d'entrée x se rapproche d'une valeur spécifique (ou de l'infini). C'est le concept fondamental sur lequel repose tout le Calcul infinitésimal.",
            es: "Un límite describe el comportamiento de una función a medida que la variable de entrada x se acerca a un valor específico (o al infinito). Es el concepto fundamental sobre el cual se construye todo el Cálculo.",
            it: "Il limite descrive il comportamento di una funzione quando la variabile di input x si avvicina a un valore specifico (o all'infinito). È il concetto fondamentale su cui si basa tutta l'Analisi Matematica.",
            tr: "Limit, girdi değişkeni x belirli bir değere (veya sonsuza) yaklaşırken bir fonksiyonun davranışını tanımlar. Tüm Analizin (Calculus) üzerine inşa edildiği temel kavramdır.",
            ar: "تصف النهاية سلوك دالة عندما يقترب متغير الإدخال x من قيمة معينة (أو إلى ما لا نهاية). إنه المفهوم الأساسي الذي بني عليه كل التفاضل والتكامل."
        },
        catAdvice: {
            el: "Όταν το x τείνει στο άπειρο, το 1/x τείνει στο 0! Πλησιάζει όλο και πιο κοντά, αλλά δεν το ακουμπάει ποτέ... σαν να κυνηγάω την κόκκινη κουκκίδα του λέιζερ! 🔴🐈",
            en: "As x approaches infinity, 1/x approaches 0! It gets closer and closer, but never quite touches... just like me chasing the red laser dot! 🔴🐈",
            fr: "Quand x tend vers l'infini, 1/x tend vers 0 ! Il se rapproche de plus en plus, sans jamais y toucher... tout comme moi poursuivant le point laser rouge ! 🔴🐈",
            es: "¡Cuando x tiende al infinito, 1/x tiende a 0! Se acerca cada vez más, pero nunca llega a tocar... ¡al igual que yo persiguiendo el punto láser rojo! 🔴🐈",
            it: "Quando x tende all'infinito, 1/x tende a 0! Si avvicina sempre di più, ma non lo tocca mai... proprio come me che inseguo il puntino del laser rosso! 🔴🐈",
            tr: "x sonsuza yaklaşırken, 1/x sıfıra yaklaşır! Gittikçe yaklaşır ama asla tam olarak değmez... tıpkı kırmızı lazer noktasını kovalamam gibi! 🔴🐈",
            ar: "عندما يقترب x من المالانهاية، يقترب 1/x من الصفر! يقترب أكثر فأكثر ولكنه لا يلمسه أبدًا... تمامًا مثل مطاردتي لنقطة الليزر الحمراء! 🔴🐈"
        }
    },
    {
        id: "derivatives",
        category: "analysis",
        title: {
            el: "Παράγωγοι",
            en: "Derivatives",
            fr: "Dérivées",
            es: "Derivadas",
            it: "Derivate",
            tr: "Türevler",
            ar: "المشتقات"
        },
        formula: "f'(x) = dy/dx",
        latex: "y = x^2",
        grade: "lyc_g",
        definition: {
            el: "Η παράγωγος μιας συνάρτησης μετρά τον στιγμιαίο ρυθμό μεταβολής της. Γεωμετρικά, η παράγωγος f'(x₀) σε ένα σημείο x₀ ισούται με την κλίση (εφαπτομένη) της γραφικής παράστασης της συνάρτησης σε αυτό το σημείο.",
            en: "The derivative of a function measures its instantaneous rate of change. Geometrically, the derivative f'(x₀) at a point x₀ is equal to the slope of the tangent line to the function's graph at that point.",
            fr: "La dérivée d'une fonction mesure son taux de variation instantané. Géométriquement, la dérivée f'(x₀) en un point x₀ est égale à la pente de la droite tangente au graphe de la fonction en ce point.",
            es: "La derivada de una función mide su tasa instantánea de cambio. Geométricamente, la derivada f'(x₀) en un punto x₀ es igual a la pendiente de la línea tangente al gráfico de la función en ese punto.",
            it: "La derivata di una funzione misura il suo tasso di variazione istantaneo. Geometricamente, la derivata f'(x₀) in un punto x₀ è uguale alla pendenza della retta tangente al grafico della funzione in quel punto.",
            tr: "Bir fonksiyonun türevi, onun anlık değişim oranını ölçer. Geometrik olarak, bir x₀ noktasındaki f'(x₀) türevi, fonksiyonun o noktadaki grafiğine teğet olan doğrunun eğimine eşittir.",
            ar: "تقيس مشتقة دالة معدل تغيرها اللحظي. هندسياً، المشتقة f'(x₀) عند نقطة x₀ تساوي ميل خط المماس للمنحنى البياني للدالة عند تلك النقطة."
        },
        catAdvice: {
            el: "Αν τρέχω με σταθερή ταχύτητα, η παράγωγος της απόστασής μου ως προς τον χρόνο είναι η ταχύτητά μου! Αν επιταχύνω για να πιάσω ένα ποντίκι, έχουμε δεύτερη παράγωγο! 🐆💨",
            en: "If I run at a constant speed, the derivative of my distance with respect to time is my velocity! If I accelerate to catch a mouse, that's a second derivative! 🐆💨",
            fr: "Si je cours à vitesse constante, la dérivée de ma distance par rapport au temps est ma vitesse ! Si j'accélère pour attraper une souris, c'est une dérivée seconde ! 🐆💨",
            es: "¡Si corro a velocidad constante, la derivada de mi distancia con respecto al tiempo es mi velocidad! Si acelero para atrapar un ratón, ¡es la segunda derivada! 🐆💨",
            it: "Se corro a velocità costante, la derivata dello spazio rispetto al tempo è la mia velocità! Se accelero per prendere un topo, abbiamo la derivata seconda! 🐆💨",
            tr: "Sabit bir hızla koşarsam, mesafemin zamana göre türevi hızımdır! Bir fareyi yakalamak için hızlanırsam, bu ikinci türevdir! 🐆💨",
            ar: "إذا ركضت بسرعة ثابتة، فإن مشتقة المسافة بالنسبة للزمن هي سرعتي! وإذا تسارعت لالتقاط فأر، فهذا يعني المشتقة الثانية! 🐆💨"
        }
    }
];
