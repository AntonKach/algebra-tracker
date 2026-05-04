module.exports = async function(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const userText = req.body.text;
    if (!userText) {
        return res.status(400).json({ reply: 'Γράψε κάτι στο πρόχειρο πρώτα! 🐾' });
    }

    const prompt = `Είσαι ο έξυπνος βοηθός της εφαρμογής Catgebra. Ένας μαθητής έγραψε το εξής στο πρόχειρό του προσπαθώντας να λύσει μια άσκηση: "${userText}". 
    Αν δεις λάθος, διόρθωσέ τον ευγενικά. Αν δεις σωστή σκέψη, ενθάρρυνέ τον.
    Απάντησε στα Ελληνικά, κράτα το ΠΟΛΥ σύντομο (1-3 προτάσεις) και βάλε ένα emoji γατούλας στο τέλος.`;

    const apiKey = process.env.GEMINI_API_KEY;
    // Εδώ είναι η διόρθωση στο URL:
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("Σφάλμα από Google:", data.error.message);
            // Αν δούμε ξανά limit 0, φταίει ο κανόνας της Ευρώπης!
            return res.status(500).json({ reply: 'Η Google με μπλόκαρε! Μάλλον φταίει ο κανόνας δωρεάν χρήσης στην Ευρώπη. 😿' });
        }

        const aiMessage = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiMessage });

    } catch (error) {
        console.error("Σφάλμα Server:", error);
        res.status(500).json({ reply: 'Ουπς! Το μυαλό μου μπερδεύτηκε. 🙀' });
    }
};
