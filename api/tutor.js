module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Μόνο POST requests επιτρέπονται!' });
    }

    const userNotes = req.body.text;

    if (!userNotes) {
        return res.status(400).json({ reply: 'Δεν έγραψες κάτι για να διαβάσω! 🐾' });
    }

    try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant', 
                messages: [
                    { 
                        role: 'system', 
                        content: 'Είσαι η Catgebra, μια έξυπνη, φιλική και αστεία γάτα-καθηγήτρια μαθηματικών. Απαντάς στα ελληνικά, ΠΟΛΥ σύντομα (έως 2-3 προτάσεις) και βοηθάς τους μαθητές με τις σκέψεις τους στο πρόχειρο. Μην δίνεις κατευθείαν την τελική λύση (π.χ. x=5), δώσε ένα μικρό hint (π.χ. "σκέψου να χωρίσεις τους γνωστούς από τους αγνώστους")! Νιαούρισε και λίγο!' 
                    },
                    { 
                        role: 'user', 
                        content: userNotes 
                    }
                ]
            })
        });

        const data = await groqRes.json();

        // ΕΛΕΓΧΟΣ: Αν το Groq μας ρίξει «άκυρο» (π.χ. λάθος κλειδί)
        if (data.error) {
            console.error("Σφάλμα Groq:", data.error);
            return res.status(500).json({ reply: `Ουπς! Σφάλμα από το Groq: ${data.error.message}` });
        }

        const reply = data.choices[0].message.content;
        res.status(200).json({ reply: reply });
        
    } catch (error) {
        console.error("Σφάλμα Συστήματος:", error);
        res.status(500).json({ reply: `Σφάλμα κώδικα: ${error.message}` });
    }
};
