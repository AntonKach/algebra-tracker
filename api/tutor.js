module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Μόνο POST requests επιτρέπονται!' });
    }

    const userNotes = req.body.text;
    const type = req.body.type || 'tutor';

    if (!userNotes) {
        return res.status(400).json({ reply: 'Δεν έγραψες κάτι για να διαβάσω! 🐾' });
    }

    let systemContent = 'You are Catgebra, a smart, friendly, and funny math tutor cat. You MUST respond ONLY in English. Be extremely brief (1-2 sentences maximum). Your goal is to give a small helpful hint to the student (e.g., "try isolating the x"), but NEVER give the final answer. Meow occasionally!';

    if (type === 'moderate') {
        systemContent = 'You are a moderation assistant. Analyze the user message. If it contains offensive language, insults, hate speech, inappropriate words for children, or dangerous content, you MUST reply ONLY with the word "ΝΑΙ". If it is completely safe and appropriate, reply ONLY with the word "ΟΧΙ". Do not include any punctuation, quotes, or other text.';
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
                        content: systemContent 
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
