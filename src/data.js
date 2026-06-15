const educationData = {
    gym_a: { 
        title: { el: "Α' Γυμνασίου", en: "Grade 7", fr: "5ème", tr: "7. Sınıf" }, 
        type: "dynamic_linear" 
    },
    gym_b: { 
        title: { el: "Β' Γυμνασίου", en: "Grade 8", fr: "4ème", tr: "8. Sınıf" }, 
        type: "dynamic_fraction" 
    },
    gym_g: { 
        title: { el: "Γ' Γυμνασίου", en: "Grade 9", fr: "3ème", tr: "9. Sınıf" }, 
        type: "static", 
        problems: [
            { equation: "x<sup>2</sup> = 64", answer: "8", steps: { el: ["x = √64", "x = 8"], en: ["x = √64", "x = 8"], fr: ["x = √64", "x = 8"], tr: ["x = √64", "x = 8"] } },
            { equation: "x<sup>2</sup> - 36 = 0", answer: "6,-6", steps: { el: ["x<sup>2</sup> = 36", "Δύο λύσεις: x = 6 ή x = -6"], en: ["x<sup>2</sup> = 36", "Two roots: x = 6 or x = -6"], fr: ["x<sup>2</sup> = 36", "x = 6 ou x = -6"], tr: ["x<sup>2</sup> = 36", "x = 6 veya x = -6"] } },
            { equation: "x<sup>2</sup> - 5x + 6 = 0", answer: "2,3", steps: { el: ["Δ = 25 - 24 = 1", "x = (5±1)/2", "x=3, x=2"], en: ["Δ = 1", "x = (5±1)/2", "x=3, x=2"], fr: ["Δ = 1", "x = (5±1)/2", "x=3, x=2"], tr: ["Δ = 1", "x = (5±1)/2", "x=3, x=2"] } },
            { equation: "|x - 4| = 6", answer: "10,-2", steps: { el: ["x - 4 = 6 => x = 10", "x - 4 = -6 => x = -2"], en: ["x - 4 = 6 => x = 10", "x - 4 = -6 => x = -2"], fr: ["x - 4 = 6 => x = 10", "x - 4 = -6 => x = -2"], tr: ["x - 4 = 6 => x = 10", "x - 4 = -6 => x = -2"] } },
            { equation: "2x<sup>2</sup> = 18", answer: "3,-3", steps: { el: ["x<sup>2</sup> = 9", "x = 3 ή x = -3"], en: ["x<sup>2</sup> = 9", "x = 3 or x = -3"], fr: ["x<sup>2</sup> = 9", "x = 3 ou x = -3"], tr: ["x<sup>2</sup> = 9", "x = 3 veya x = -3"] } },
            { equation: "|2x| = 8", answer: "4,-4", steps: { el: ["2x = 8 => x = 4", "2x = -8 => x = -4"], en: ["2x = 8 => x = 4", "2x = -8 => x = -4"], fr: ["2x = 8 => x = 4", "2x = -8 => x = -4"], tr: ["2x = 8 => x = 4", "2x = -8 => x = -4"] } },
            { equation: "(x-1)(x-5) = 0", answer: "1,5", steps: { el: ["x-1 = 0 => x=1", "x-5 = 0 => x=5"], en: ["x-1 = 0 => x=1", "x-5 = 0 => x=5"], fr: ["x-1 = 0 => x=1", "x-5 = 0 => x=5"], tr: ["x-1 = 0 => x=1", "x-5 = 0 => x=5"] } },
            { equation: "x<sup>2</sup> = 100", answer: "10,-10", steps: { el: ["x = √100 ή -√100", "x = 10 ή -10"], en: ["x = √100 or -√100", "x = 10 or -10"], fr: ["x = √100 ou -√100", "x = 10 ou -10"], tr: ["x = √100 veya -√100", "x = 10 veya -10"] } }
        ] 
    },
    lyc_a: { 
        title: { el: "Α' Λυκείου", en: "Grade 10", fr: "2nde", tr: "10. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "x<sup>3</sup> = 64", answer: "4", steps: { el: ["x = ∛64", "x = 4"], en: ["x = ∛64", "x = 4"], fr: ["x = ∛64", "x = 4"], tr: ["x = ∛64", "x = 4"] } },
            { equation: "x<sup>2</sup> - x - 2 = 0", answer: "2,-1", steps: { el: ["Δ = 1 - 4(-2) = 9", "x = (1±3)/2", "x1=2, x2=-1"], en: ["Δ = 9", "x = (1±3)/2", "x1=2, x2=-1"], fr: ["Δ = 9", "x = (1±3)/2", "x1=2, x2=-1"], tr: ["Δ = 9", "x = (1±3)/2", "x1=2, x2=-1"] } },
            { equation: "x<sup>4</sup> = 16", answer: "2,-2", steps: { el: ["x = 2 ή x = -2", "Διότι 2<sup>4</sup> = 16 και (-2)<sup>4</sup> = 16"], en: ["x = 2 or -2", "(2<sup>4</sup> = 16)"], fr: ["x = 2 ou -2", "(2<sup>4</sup> = 16)"], tr: ["x = 2 veya -2", "(2<sup>4</sup> = 16)"] } },
            { equation: "|3x| = 15", answer: "5,-5", steps: { el: ["3x = 15 => x = 5", "3x = -15 => x = -5"], en: ["3x = 15 => x = 5", "3x = -15 => x = -5"], fr: ["3x = 15 => x = 5", "3x = -15 => x = -5"], tr: ["3x = 15 => x = 5", "3x = -15 => x = -5"] } },
            { equation: "5x<sup>2</sup> = 20", answer: "2,-2", steps: { el: ["x<sup>2</sup> = 4", "x = 2 ή x = -2"], en: ["x<sup>2</sup> = 4", "x = 2, -2"], fr: ["x<sup>2</sup> = 4", "x = 2, -2"], tr: ["x<sup>2</sup> = 4", "x = 2, -2"] } },
            { equation: "(2x - 4)(x + 3) = 0", answer: "2,-3", steps: { el: ["2x - 4 = 0 => x = 2", "x + 3 = 0 => x = -3"], en: ["2x - 4 = 0 => x = 2", "x + 3 = 0 => x = -3"], fr: ["2x - 4 = 0 => x = 2", "x + 3 = 0 => x = -3"], tr: ["2x - 4 = 0 => x = 2", "x + 3 = 0 => x = -3"] } },
            { equation: "x<sup>2</sup> + 6x + 9 = 0", answer: "-3", steps: { el: ["Τέλειο τετράγωνο: (x+3)<sup>2</sup> = 0", "x = -3"], en: ["(x+3)<sup>2</sup> = 0", "x = -3"], fr: ["(x+3)<sup>2</sup> = 0", "x = -3"], tr: ["(x+3)<sup>2</sup> = 0", "x = -3"] } }
        ] 
    },
    lyc_b: { 
        title: { el: "Β' Λυκείου", en: "Grade 11", fr: "1ère", tr: "11. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "2<sup>x</sup> = 32", answer: "5", steps: { el: ["2<sup>x</sup> = 2<sup>5</sup>", "x = 5"], en: ["2<sup>x</sup> = 2<sup>5</sup>", "x = 5"], fr: ["2<sup>x</sup> = 2<sup>5</sup>", "x = 5"], tr: ["2<sup>x</sup> = 2<sup>5</sup>", "x = 5"] } },
            { equation: "3<sup>x</sup> = 27", answer: "3", steps: { el: ["3<sup>x</sup> = 3<sup>3</sup>", "x = 3"], en: ["3<sup>x</sup> = 3<sup>3</sup>", "x = 3"], fr: ["3<sup>x</sup> = 3<sup>3</sup>", "x = 3"], tr: ["3<sup>x</sup> = 3<sup>3</sup>", "x = 3"] } },
            { equation: "log₂(x) = 4", answer: "16", steps: { el: ["Ορισμός λογαρίθμου:", "x = 2<sup>4</sup>", "x = 16"], en: ["x = 2<sup>4</sup>", "x = 16"], fr: ["x = 2<sup>4</sup>", "x = 16"], tr: ["x = 2<sup>4</sup>", "x = 16"] } },
            { equation: "log₁₀(x) = 2", answer: "100", steps: { el: ["x = 10<sup>2</sup>", "x = 100"], en: ["x = 10<sup>2</sup>", "x = 100"], fr: ["x = 10<sup>2</sup>", "x = 100"], tr: ["x = 10<sup>2</sup>", "x = 100"] } },
            { equation: "e<sup>x</sup> = 1", answer: "0", steps: { el: ["Οποιοσδήποτε αριθμός εις την μηδέν = 1", "Άρα x = 0"], en: ["Any number to power of 0 = 1", "So x = 0"], fr: ["Tout nombre à la puissance 0 = 1", "Donc x = 0"], tr: ["Herhangi bir sayının 0. kuvveti 1'dir", "Yani x = 0"] } },
            { equation: "5<sup>x-1</sup> = 25", answer: "3", steps: { el: ["5<sup>x-1</sup> = 5<sup>2</sup>", "x - 1 = 2", "x = 3"], en: ["5<sup>x-1</sup> = 5<sup>2</sup>", "x - 1 = 2", "x = 3"], fr: ["5<sup>x-1</sup> = 5<sup>2</sup>", "x - 1 = 2", "x = 3"], tr: ["5<sup>x-1</sup> = 5<sup>2</sup>", "x - 1 = 2", "x = 3"] } }
        ] 
    },
    lyc_g: { 
        title: { el: "Γ' Λυκείου", en: "Grade 12", fr: "Terminale", tr: "12. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "ln(e<sup>x</sup>) = 10", answer: "10", steps: { 
                el: ["Ιδιότητα: x * ln(e) = 10", "Επειδή ln(e) = 1, x = 10"], 
                en: ["x * ln(e) = 10", "x * 1 = 10", "x = 10"], 
                fr: ["x * ln(e) = 10", "x * 1 = 10", "x = 10"], 
                tr: ["x * ln(e) = 10", "x * 1 = 10", "x = 10"] 
            } },
            { equation: "lim(x→3) (x<sup>2</sup>-9)/(x-3)", answer: "6", steps: { 
                el: ["Αναλύουμε: (x-3)(x+3)/(x-3)", "Διαγράφουμε το (x-3)", "Όριο για x=3: 3 + 3 = 6"], 
                en: ["Factor: (x-3)(x+3)/(x-3)", "Cancel (x-3)", "Limit at x=3: 3 + 3 = 6"], 
                fr: ["Factoriser : (x-3)(x+3)/(x-3)", "Annuler (x-3)", "Limite à x=3 : 3 + 3 = 6"], 
                tr: ["Çarpanlara ayır: (x-3)(x+3)/(x-3)", "(x-3)'ü iptal et", "x=3 için limit: 3 + 3 = 6"] 
            } },
            { equation: "lim(x→∞) 5/x", answer: "0", steps: { 
                el: ["Όσο ο παρονομαστής τείνει στο άπειρο...", "...το κλάσμα τείνει στο 0."], 
                en: ["As denominator approaches infinity...", "...the fraction approaches 0."], 
                fr: ["Quand le dénominateur tend vers l'infini...", "...la fraction tend vers 0."], 
                tr: ["Payda sonsuza yaklaşırken...", "...kesir 0'a yaklaşır."] 
            } },
            { equation: "e<sup>ln(x)</sup> = 5", answer: "5", steps: { 
                el: ["Ιδιότητα: e<sup>ln(a)</sup> = a", "Άρα x = 5"], 
                en: ["Property: e<sup>ln(a)</sup> = a", "So x = 5"], 
                fr: ["Propriété : e<sup>ln(a)</sup> = a", "Donc x = 5"], 
                tr: ["Özellik: e<sup>ln(a)</sup> = a", "Yani x = 5"] 
            } },
            { equation: "f'(x)=0, f(x)=x<sup>2</sup>-4x", answer: "2", steps: { 
                el: ["Παράγωγος: f'(x) = 2x - 4", "2x - 4 = 0", "2x = 4 => x = 2"], 
                en: ["Derivative: f'(x) = 2x - 4", "2x - 4 = 0", "2x = 4 => x = 2"], 
                fr: ["Dérivée : f'(x) = 2x - 4", "2x - 4 = 0", "2x = 4 => x = 2"], 
                tr: ["Türev: f'(x) = 2x - 4", "2x - 4 = 0", "2x = 4 => x = 2"] 
            } }
        ] 
    }
};

window.educationData = educationData;
