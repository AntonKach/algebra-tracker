// Το νέο μας αρχείο μόνο για τα δεδομένα των ασκήσεων
const educationData = {
    gym_a: { 
        title: "Α' Γυμνασίου", 
        type: "dynamic_linear" // Παράγει άπειρες εξισώσεις τύπου ax + b = c
    },
    gym_b: { 
        title: "Β' Γυμνασίου", 
        type: "dynamic_fraction" // Παράγει άπειρες εξισώσεις με κλάσματα
    },
    gym_g: { 
        title: "Γ' Γυμνασίου", 
        type: "static", 
        problems: [
            { equation: "x² = 16", answer: "4", steps: ["Παίρνουμε ρίζα: x = √16", "x = 4"] },
            { equation: "x² - 25 = 0", answer: "5", steps: ["Μεταφέρουμε το 25: x² = 25", "x = 5"] }
        ] 
    },
    lyc_a: { 
        title: "Α' Λυκείου", 
        type: "static",
        problems: [
            { equation: "x² - 5x + 6 = 0", answer: "2,3", steps: ["Δ = 25 - 24 = 1", "x = (5±1)/2", "x1=2, x2=3"] }
        ] 
    },
    lyc_b: { 
        title: "Β' Λυκείου", 
        type: "static",
        problems: [
            { equation: "ημ(x) = 1", answer: "90", steps: ["Το ημίτονο είναι 1 στις 90 μοίρες."] }
        ] 
    },
    lyc_g: { 
        title: "Γ' Λυκείου", 
        type: "static",
        problems: [
            { equation: "∫ 2x dx", answer: "x²", steps: ["Κανόνας δύναμης: (2x²)/2", "x²"] }
        ] 
    }
};
