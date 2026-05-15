/**
 * CryptoEngine - End-to-End Encryption (E2EE) Utility
 * Χρησιμοποιεί το window.crypto.subtle (Web Crypto API) με RSA-OAEP
 */
const CryptoEngine = {
    /**
     * Δημιουργία Public και Private keys για τον χρήστη.
     * @returns {Promise<CryptoKeyPair>} Το ζεύγος κλειδιών
     */
    generateKeyPair: async function() {
        return await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true, // Εξαγώγιμο (ώστε να μπορούμε να το αποθηκεύσουμε αν χρειαστεί)
            ["encrypt", "decrypt"]
        );
    },

    /**
     * Κρυπτογράφηση κειμένου πριν την αποστολή.
     * @param {string} message Το μήνυμα προς κρυπτογράφηση
     * @param {CryptoKey} recipientPublicKey Το δημόσιο κλειδί του παραλήπτη
     * @returns {Promise<ArrayBuffer>} Τα κρυπτογραφημένα δεδομένα
     */
    encryptMessage: async function(message, recipientPublicKey) {
        const encoder = new TextEncoder();
        const encodedMessage = encoder.encode(message);

        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            recipientPublicKey,
            encodedMessage
        );

        return encryptedData;
    },

    /**
     * Αποκρυπτογράφηση κατά τη λήψη.
     * @param {ArrayBuffer} encryptedData Τα κρυπτογραφημένα δεδομένα
     * @param {CryptoKey} privateKey Το ιδιωτικό κλειδί του παραλήπτη
     * @returns {Promise<string>} Το αποκρυπτογραφημένο μήνυμα
     */
    decryptMessage: async function(encryptedData, privateKey) {
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedData
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    },

    /**
     * Μετατροπή ArrayBuffer σε Base64 String
     */
    arrayBufferToBase64: function(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    },

    /**
     * Μετατροπή Base64 String σε ArrayBuffer
     */
    base64ToArrayBuffer: function(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
};

// Εξαγωγή στο window object για πρόσβαση από το app
window.CryptoEngine = CryptoEngine;
