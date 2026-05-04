const educationData = {
    gym_a: { 
        title: { el: "Α' Γυμνασίου", en: "Grade 7", fr: "5ème", tr: "7. Sınıf" }, 
        type: "static", // Το αλλάξαμε σε static για να βάλουμε πιο σύνθετες ασκήσεις με το χέρι
        problems: [
            { equation: "2x + 5 = 15", answer: "5", steps: { 
                el: ["2x = 15 - 5", "2x = 10", "x = 5"], 
                en: ["2x = 15 - 5", "2x = 10", "x = 5"], 
                fr: ["2x = 15 - 5", "2x = 10", "x = 5"], 
                tr: ["2x = 15 - 5", "2x = 10", "x = 5"] 
            }},
            { equation: "3(x - 2) = 9", answer: "5", steps: { 
                el: ["Επιμεριστική: 3x - 6 = 9", "3x = 9 + 6", "3x = 15", "x = 5"], 
                en: ["Distribute: 3x - 6 = 9", "3x = 9 + 6", "3x = 15", "x = 5"], 
                fr: ["Distribuer: 3x - 6 = 9", "3x = 9 + 6", "3x = 15", "x = 5"], 
                tr: ["Dağıt: 3x - 6 = 9", "3x = 9 + 6", "3x = 15", "x = 5"] 
            }},
            { equation: "5x - 3 = 2x + 12", answer: "5", steps: { 
                el: ["Χωρίζουμε γνωστούς από αγνώστους", "5x - 2x = 12 + 3", "3x = 15", "x = 5"], 
                en: ["Group variables and constants", "5x - 2x = 12 + 3", "3x = 15", "x = 5"], 
                fr: ["Regrouper les termes", "5x - 2x = 12 + 3", "3x = 15", "x = 5"], 
                tr: ["Değişkenleri ve sabitleri grupla", "5x - 2x = 12 + 3", "3x = 15", "x = 5"] 
            }}
        ] 
    },
    gym_b: { 
        title: { el: "Β' Γυμνασίου", en: "Grade 8", fr: "4ème", tr: "8. Sınıf" }, 
        type: "static", 
        problems: [
            { equation: "x/2 + 4 = 10", answer: "12", steps: { 
                el: ["x/2 = 10 - 4", "x/2 = 6", "x = 6 * 2", "x = 12"], 
                en: ["x/2 = 10 - 4", "x/2 = 6", "x = 6 * 2", "x = 12"], 
                fr: ["x/2 = 10 - 4", "x/2 = 6", "x = 6 * 2", "x = 12"], 
                tr: ["x/2 = 10 - 4", "x/2 = 6", "x = 6 * 2", "x = 12"] 
            }},
            { equation: "2(x + 1)/3 = 4", answer: "5", steps: { 
                el: ["Πολλαπλασιάζουμε με το 3: 2(x + 1) = 12", "x + 1 = 6", "x = 5"], 
                en: ["Multiply by 3: 2(x + 1) = 12", "x + 1 = 6", "x = 5"], 
                fr: ["Multiplier par 3: 2(x + 1) = 12", "x + 1 = 6", "x = 5"], 
                tr: ["3 ile çarp: 2(x + 1) = 12", "x + 1 = 6", "x = 5"] 
            }},
            { equation: "√x = 7", answer: "49", steps: { 
                el: ["Υψώνουμε στο τετράγωνο", "(√x)² = 7²", "x = 49"], 
                en: ["Square both sides", "(√x)² = 7²", "x = 49"], 
                fr: ["Mettre au carré", "(√x)² = 7²", "x = 49"], 
                tr: ["İki tarafın karesini al", "(√x)² = 7²", "x = 49"] 
            }}
        ] 
    },
    gym_g: { 
        title: { el: "Γ' Γυμνασίου", en: "Grade 9", fr: "3ème", tr: "9. Sınıf" }, 
        type: "static", 
        problems: [
            { equation: "x² = 81", answer: "9", steps: { 
                el: ["x = √81 ή x = -√81", "Άρα x = 9 (θετική ρίζα)"], 
                en: ["x = √81 or x = -√81", "So x = 9 (positive root)"], 
                fr: ["x = √81 ou x = -√81", "Donc x = 9 (racine positive)"], 
                tr: ["x = √81 veya x = -√81", "Yani x = 9 (pozitif kök)"] 
            }},
            { equation: "x² - 7x + 10 = 0", answer: "2,5", steps: { 
                el: ["Δ = b² - 4ac = 49 - 40 = 9", "√Δ = 3", "x = (7 ± 3)/2", "x1=5, x2=2"], 
                en: ["Δ = b² - 4ac = 49 - 40 = 9", "√Δ = 3", "x = (7 ± 3)/2", "x1=5, x2=2"], 
                fr: ["Δ = b² - 4ac = 49 - 40 = 9", "√Δ = 3", "x = (7 ± 3)/2", "x1=5, x2=2"], 
                tr: ["Δ = b² - 4ac = 49 - 40 = 9", "√Δ = 3", "x = (7 ± 3)/2", "x1=5, x2=2"] 
            }},
            { equation: "|x - 3| = 5", answer: "8,-2", steps: { 
                el: ["Δύο περιπτώσεις:", "x - 3 = 5 => x = 8", "x - 3 = -5 => x = -2"], 
                en: ["Two cases:", "x - 3 = 5 => x = 8", "x - 3 = -5 => x = -2"], 
                fr: ["Deux cas :", "x - 3 = 5 => x = 8", "x - 3 = -5 => x = -2"], 
                tr: ["İki durum:", "x - 3 = 5 => x = 8", "x - 3 = -5 => x = -2"] 
            }}
        ] 
    },
    lyc_a: { 
        title: { el: "Α' Λυκείου", en: "Grade 10", fr: "2nde", tr: "10. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "x³ - 8 = 0", answer: "2", steps: { 
                el: ["x³ = 8", "x = ∛8", "x = 2"], 
                en: ["x³ = 8", "x = ∛8", "x = 2"], 
                fr: ["x³ = 8", "x = ∛8", "x = 2"], 
                tr: ["x³ = 8", "x = ∛8", "x = 2"] 
            }},
            { equation: "2x² - 18 = 0", answer: "3,-3", steps: { 
                el: ["2x² = 18", "x² = 9", "x = ±3"], 
                en: ["2x² = 18", "x² = 9", "x = ±3"], 
                fr: ["2x² = 18", "x² = 9", "x = ±3"], 
                tr: ["2x² = 18", "x² = 9", "x = ±3"] 
            }}
        ] 
    },
    lyc_b: { 
        title: { el: "Β' Λυκείου", en: "Grade 11", fr: "1ère", tr: "11. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "3^x = 81", answer: "4", steps: { 
                el: ["Αναλύουμε το 81 σε δυνάμεις", "3^x = 3^4", "Άρα x = 4"], 
                en: ["Factor 81 into powers", "3^x = 3^4", "So x = 4"], 
                fr: ["Décomposer 81 en puissances", "3^x = 3^4", "Donc x = 4"], 
                tr: ["81'i üslere ayır", "3^x = 3^4", "Yani x = 4"] 
            }},
            { equation: "log₂(x) = 3", answer: "8", steps: { 
                el: ["Μετατροπή σε εκθετική μορφή", "x = 2^3", "x = 8"], 
                en: ["Convert to exponential form", "x = 2^3", "x = 8"], 
                fr: ["Convertir en forme exponentielle", "x = 2^3", "x = 8"], 
                tr: ["Üstel forma dönüştür", "x = 2^3", "x = 8"] 
            }}
        ] 
    },
    lyc_g: { 
        title: { el: "Γ' Λυκείου", en: "Grade 12", fr: "Terminale", tr: "12. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "ln(e^x) = 7", answer: "7", steps: { 
                el: ["Ιδιότητα λογαρίθμων: x * ln(e) = 7", "Εφόσον ln(e) = 1...", "x = 7"], 
                en: ["Logarithm property: x * ln(e) = 7", "Since ln(e) = 1...", "x = 7"], 
                fr: ["Propriété des logarithmes : x * ln(e) = 7", "Puisque ln(e) = 1...", "x = 7"], 
                tr: ["Logaritma özelliği: x * ln(e) = 7", "ln(e) = 1 olduğundan...", "x = 7"] 
            }},
            { equation: "lim(x→2) (x²-4)/(x-2)", answer: "4", steps: { 
                el: ["Αναλύουμε τον αριθμητή: (x-2)(x+2)/(x-2)", "Διαγράφουμε το (x-2)", "Οριο: 2 + 2 = 4"], 
                en: ["Factor numerator: (x-2)(x+2)/(x-2)", "Cancel (x-2)", "Limit: 2 + 2 = 4"], 
                fr: ["Factoriser le numérateur : (x-2)(x+2)/(x-2)", "Annuler (x-2)", "Limite : 2 + 2 = 4"], 
                tr: ["Payı çarpanlarına ayır: (x-2)(x+2)/(x-2)", "(x-2)'yi sadeleştir", "Limit: 2 + 2 = 4"] 
            }},
            { equation: "∫ 2x dx", answer: "x²", steps: { 
                el: ["Κανόνας δύναμης:", "2 * (x² / 2)", "x² + C (σταθερά)"], 
                en: ["Power rule:", "2 * (x² / 2)", "x² + C (constant)"], 
                fr: ["Règle de puissance :", "2 * (x² / 2)", "x² + C (constante)"], 
                tr: ["Kuvvet kuralı:", "2 * (x² / 2)", "x² + C (sabit)"] 
            }}
        ] 
    }
};
