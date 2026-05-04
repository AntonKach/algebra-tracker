export default async function handler(req, res) {
    // Δεχόμαστε μόνο μηνύματα τύπου POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const userText = req.body.text;

    // Αν το πρόχειρο είναι άδειο
    if (!userText) {
        return res.status(400).json({ reply: 'Γράψε κάτι στο πρόχειρο πρώτα! 🐾' });
    }

    // Η κρυφή οδηγία που δίνουμε στο Gemini (Το System Prompt)
    const prompt = `Είσαι ο έξυπνος βοηθός της εφαρμογής Catgebra. Ένας μαθητής έγραψε το εξής στο πρόχειρό του προσπαθώντας να λύσει μια άσκηση: "${userText}". 
    Αν δεις λάθος, διόρθωσέ τον ευγενικά. Αν δεις σωστή σκέψη, ενθάρρυνέ τον. Αν γράφει κάτι άσχετο, πες του να συγκεντρωθεί στα μαθηματικά!
    Απάντησε στα Ελληνικά, κράτα το ΠΟΛΥ σύντομο (1-3 προτάσεις το πολύ) και βάλε ένα emoji γατούλας στο τέλος.`;

    // Παίρνουμε το κλειδί από το Χρηματοκιβώτιο του Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        // Η επικοινωνία με την Google
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const aiMessage = data.candidates[0].content.parts[0].text;

        // Στέλνουμε την απάντηση πίσω στην οθόνη του μαθητή
        res.status(200).json({ reply: aiMessage });
    } catch (error) {
        console.error("Σφάλμα Gemini:", error);
        res.status(500).json({ reply: 'Ουπς! Το μυαλό μου μπερδεύτηκε. Ξαναδοκίμασε σε λίγο! 🙀' });
    }
}
