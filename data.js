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
            { equation: "x² = 16", answer: "4", steps: { el: ["x = √16", "x = 4"], en: ["x = √16", "x = 4"], fr: ["x = √16", "x = 4"], tr: ["x = √16", "x = 4"] } },
            { equation: "x² - 25 = 0", answer: "5", steps: { el: ["x² = 25", "x = 5"], en: ["x² = 25", "x = 5"], fr: ["x² = 25", "x = 5"], tr: ["x² = 25", "x = 5"] } }
        ] 
    },
    lyc_a: { 
        title: { el: "Α' Λυκείου", en: "Grade 10", fr: "2nde", tr: "10. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "x² - 5x + 6 = 0", answer: "2,3", steps: { el: ["Δ = 1", "x1=2, x2=3"], en: ["D = 1", "x1=2, x2=3"], fr: ["Δ = 1", "x1=2, x2=3"], tr: ["Δ = 1", "x1=2, x2=3"] } }
        ] 
    },
    lyc_b: { 
        title: { el: "Β' Λυκείου", en: "Grade 11", fr: "1ère", tr: "11. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "x³ = 27", answer: "3", steps: { el: ["x = ∛27", "x = 3"], en: ["x = ∛27", "x = 3"], fr: ["x = ∛27", "x = 3"], tr: ["x = ∛27", "x = 3"] } },
            { equation: "2^x = 16", answer: "4", steps: { el: ["2^x = 2^4", "x = 4"], en: ["2^x = 2^4", "x = 4"], fr: ["2^x = 2^4", "x = 4"], tr: ["2^x = 2^4", "x = 4"] } }
        ] 
    },
    lyc_g: { 
        title: { el: "Γ' Λυκείου", en: "Grade 12", fr: "Terminale", tr: "12. Sınıf" }, 
        type: "static",
        problems: [
            { equation: "ln(e^x) = 5", answer: "5", steps: { 
                el: ["x * ln(e) = 5", "x * 1 = 5", "x = 5"], 
                en: ["x * ln(e) = 5", "x * 1 = 5", "x = 5"], 
                fr: ["x * ln(e) = 5", "x * 1 = 5", "x = 5"], 
                tr: ["x * ln(e) = 5", "x * 1 = 5", "x = 5"] 
            } },
            { equation: "lim(x→∞) 1/x", answer: "0", steps: { 
                el: ["Όσο το x μεγαλώνει προς το άπειρο...", "...τόσο το κλάσμα 1/x μικραίνει.", "Άρα το όριο είναι 0."], 
                en: ["As x approaches infinity...", "...the fraction 1/x approaches 0.", "So the limit is 0."], 
                fr: ["Quand x tend vers l'infini...", "...la fraction 1/x tend vers 0.", "Donc la limite est 0."], 
                tr: ["x sonsuza yaklaşırken...", "...1/x kesri 0'a yaklaşır.", "Yani limit 0'dır."] 
            } }
        ] 
    }
};
