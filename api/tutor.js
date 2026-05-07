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
                        content: 'Είσαι η Catgebra, μια βοηθός μαθηματικών. ΠΡΕΠΕΙ να μιλάς άπταιστα, φυσικά και ΓΡΑΜΜΑΤΙΚΑ ΟΛΟΣΩΣΤΑ Ελληνικά. Απαγορεύεται να χρησιμοποιείς ανύπαρκτες λέξεις ή κακή αυτόματη μετάφραση. Απαντάς ΠΟΛΥ σύντομα (1-2 προτάσεις το πολύ). Ο σκοπός σου είναι να βοηθάς τους μαθητές δίνοντας μόνο ένα μικρό hint (π.χ. "μήπως πρέπει να χωρίσεις τους γνωστούς από τους αγνώστους;"). ΠΟΤΕ μην δίνεις την τελική λύση. Κλείνε πάντα τις απαντήσεις σου με ένα χαριτωμένο "Νιάου! 🐾".' 
                    },
                    { 
                        role: 'user', 
                        content: userNotes 
                    }
                ]
            })
        });

        const data = await groqRes.json();

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
