# Security Guidelines

## Firebase Credentials

### ⚠️ CRITICAL: Exposed API Key
Your Firebase API key was previously exposed in the `auth.js` file on GitHub. **This key has been compromised and must be rotated immediately.**

### Steps to Regenerate Credentials

1. **Go to Firebase Console**
   - Navigate to https://console.firebase.google.com
   - Select your project "catgebra"

2. **Regenerate API Key**
   - Go to Settings → Service Accounts
   - Click "Regenerate Private Key"
   - This invalidates the exposed key

3. **Set Up Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your new Firebase credentials:
     ```
     VITE_FIREBASE_API_KEY=your_new_api_key
     VITE_FIREBASE_AUTH_DOMAIN=catgebra.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=catgebra
     VITE_FIREBASE_STORAGE_BUCKET=catgebra.firebasestorage.app
     VITE_FIREBASE_MESSAGING_SENDER_ID=921114748837
     VITE_FIREBASE_APP_ID=1:921114748837:web:...
     ```

4. **Update .gitignore** (Already included)
   - Ensure `.env.local` is in your `.gitignore`
   - Never commit environment files with secrets

5. **Use the Updated Code**
   - This branch uses `import.meta.env` (Vite) to load credentials
   - Environment variables are **never exposed** in the built code

### Configure Vite

If you're using **Vite**, your `vite.config.js` should look like:
```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  // Vite automatically loads .env files
  // VITE_* variables are exposed to the client safely
})
```

If you're using **plain HTML/JS** without Vite:
- You'll need to refactor to use a build process (recommended: use Vite)
- Or use a backend API to serve config securely

## Encryption & Key Management

### E2EE Private Keys
- ⚠️ **WARNING**: Private keys stored in localStorage are vulnerable to XSS
- **Current**: RSA keys in localStorage (per-browser security)
- **Recommended**: Implement secure server-side key management

### Future Improvements
1. [ ] Implement IndexedDB with encryption for key storage
2. [ ] Add Content Security Policy (CSP) headers
3. [ ] Implement rate limiting on API endpoints
4. [ ] Add comprehensive error handling for Firebase operations
5. [ ] Set up Firebase Security Rules for Firestore

## Firebase Security Rules

Apply these rules to your Firestore to restrict unauthorized access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Messages can be read by authenticated users
    match /messages/{document=**} {
      allow read: if request.auth.uid != null;
      allow create: if request.auth.uid != null;
    }
    
    // Private messages can only be read/written by participants
    match /private_messages/{messageId} {
      allow read, write: if request.auth.uid in resource.data.participants;
      allow create: if request.auth.uid in request.resource.data.participants;
    }
  }
}
```

## Deployment Checklist

- [ ] Regenerate Firebase API key
- [ ] Set up `.env.local` with new credentials
- [ ] Review Firebase Security Rules
- [ ] Enable HTTPS only (required for auth)
- [ ] Set HSTS headers
- [ ] Implement CSP headers
- [ ] Test with new credentials
- [ ] Deploy updated code

## Reporting Security Issues

If you discover a security vulnerability, please email us instead of using the issue tracker.

---
Last Updated: 2024
