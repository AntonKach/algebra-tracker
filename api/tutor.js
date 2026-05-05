module.exports = async function(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const userText = req.body.text;
    if (!userText) {
        return res.status(400).json({ reply: 'Γράψε κάτι στο πρόχειρο πρώτα! 🐾' });
    }

    // Παίρνουμε το νέο κλειδί της Groq από το χρηματοκιβώτιο
    const apiKey = process.env.GROQ_API_KEY;
    
    // Το URL επικοινωνίας της Groq
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Έτσι δέχεται το κλειδί η Groq
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Το αστραπιαίο μοντέλο της Meta
                messages: [
                    {
                        role: "system",
                        content: "Είσαι ο έξυπνος βοηθός της εφαρμογής Catgebra. Ένας μαθητής έγραψε το εξής στο πρόχειρό του: '" + userText + "'. Αν δεις λάθος στα μαθηματικά του, διόρθωσέ τον ευγενικά. Αν δεις σωστή σκέψη, ενθάρρυνέ τον. Απάντησε στα Ελληνικά, κράτα το ΠΟΛΥ σύντομο (1-3 προτάσεις) και βάλε ένα emoji γατούλας στο τέλος."
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("Σφάλμα από Groq:", data.error);
            return res.status(500).json({ reply: 'Ο Σεφ μας αντιμετωπίζει ένα μικρό πρόβλημα... 😿' });
        }

        // Στην Groq (και στο ChatGPT) η απάντηση κρύβεται σε αυτό το σημείο:
        const aiMessage = data.choices[0].message.content;
        res.status(200).json({ reply: aiMessage });

    } catch (error) {
        console.error("Σφάλμα Server:", error);
        res.status(500).json({ reply: 'Ουπς! Το μυαλό μου μπερδεύτηκε. 🙀' });
    }
};
