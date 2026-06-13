# Secure Algebra Tracker App & Configure Environment Variables

This plan outlines the steps to rotate the compromised Firebase API key, configure local environment variables, and resolve the runtime support for environment variables in the frontend.

## User Review Required

> [!WARNING]
> The current changes on `security-fix/remove-exposed-credentials` use `import.meta.env` (Vite syntax) to load Firebase configuration. Since the app is currently a static HTML page without a bundler, **this syntax will fail at runtime in the browser** unless we set up a build process or a backend API.

Please choose one of the following approaches to support environment variables:

### Option A: Set Up Vite (Recommended)
Add a modern, lightweight build tool (Vite) to compile and build the app.
- **Pros**: Matches standard Vite setup, supports `import.meta.env` out of the box, prepares project for future optimizations/bundling.
- **Cons**: Adds a build step (`npm run build`) and requires deploying the build folder (e.g. `dist/`) instead of the root directory.

### Option B: Backend Configuration API
Create a new serverless function `/api/config.js` (Vercel-compatible) to serve the configuration at runtime.
- **Pros**: Simple, does not require a bundler/build tool or changes to the hosting folder layout.
- **Cons**: Requires a network fetch on startup before initializing Firebase, which slightly delays load.

---

## Open Questions

> [!IMPORTANT]
> 1. Which option do you prefer: **Option A (Vite Setup)** or **Option B (Backend API)**?
> 2. Have you already rotated the Firebase API key in the Firebase Console? If yes, please provide the new API key so we can update `.env.local`. If not, we will set up `.env.local` with placeholders.

---

## Proposed Changes

### Configuration
#### [NEW] [.env.local](file:///Users/antonioskachrimanis/algebra-tracker/.env.local)
- Create local environment file containing the Firebase configurations (based on `.env.example`).

---

### Option A: Vite Build System (If Selected)

#### [NEW] [package.json](file:///Users/antonioskachrimanis/algebra-tracker/package.json)
- Initialize project and add `vite` dev dependency.
- Define scripts: `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`.

#### [NEW] [vite.config.js](file:///Users/antonioskachrimanis/algebra-tracker/vite.config.js)
- Configure Vite for static site hosting.

#### [MODIFY] [firebase.json](file:///Users/antonioskachrimanis/algebra-tracker/firebase.json)
- Update public directory from `.` to `dist` so Firebase Hosting serves the compiled bundle.

---

### Option B: Backend API (If Selected)

#### [NEW] [config.js](file:///Users/antonioskachrimanis/algebra-tracker/api/config.js)
- Create a Vercel-compatible serverless endpoint that returns the Firebase environment variables securely at runtime.

#### [MODIFY] [auth.js](file:///Users/antonioskachrimanis/algebra-tracker/auth.js)
- Refactor Firebase initialization to dynamically fetch the configuration from `/api/config` before initializing the app.

---

## Verification Plan

### Automated/Manual Tests
- Copy `.env.example` to `.env.local` and configure variables.
- Run local server (depending on selected option) and verify no console errors regarding undefined `import.meta` or missing credentials.
- Test Firebase Authentication (Google Sign-In, Email login) and ensure they connect successfully.
- Verify security rule guidelines match `/SECURITY.md`.
