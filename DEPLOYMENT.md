# Deployment Guide: HealthTick Calendar on Vercel

This guide explains how to deploy the HealthTick Calendar app to Vercel for production use.

---

## Prerequisites
- Vercel account ([https://vercel.com/signup](https://vercel.com/signup))
- GitHub repository with your project code
- Firebase project with Firestore enabled

---

## 1. Prepare Your Project
- Ensure your app builds locally:
  ```bash
  npm install
  npm run build
  ```
- Commit and push all changes to your GitHub repository.

---

## 2. Connect to Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository.
3. Vercel will auto-detect the framework (Vite + React).

---

## 3. Set Environment Variables
**Important:** Vercel does NOT use your local `.env` file. You must add all Firebase config variables in the Vercel dashboard.

1. In your Vercel project, go to **Settings > Environment Variables**.
2. Add the following variables (use your actual Firebase config values):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
3. Click **Save** after adding all variables.

---

## 4. Configure Build Settings (Optional)
- Vercel auto-detects build settings for Vite projects.
- If needed, set:
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`

---

## 5. Deploy
- Click **Deploy** in the Vercel dashboard.
- Wait for the build to complete.
- Your app will be live at the provided Vercel URL.

---

## 6. Troubleshooting
- **White Screen After Deploy?**
  - Double-check all environment variables are set and correct in Vercel.
  - Check the browser console for errors.
  - Review Vercel build logs for issues.
- **Environment Variables Not Working?**
  - Make sure all `VITE_FIREBASE_*` variables are set in the Vercel dashboard (not just in `.env`).
- **Firestore Errors?**
  - Ensure your Firebase project has Firestore enabled and rules allow access.

---

## 7. Redeploy After Changes
- Any time you update environment variables or push new code, trigger a redeploy in Vercel.

---

## References
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Tip:** For local testing, use `.env` with your Firebase config. For production, always set environment variables in Vercel dashboard.
