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
    }
};
