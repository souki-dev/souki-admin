# 🌐 Firebase Storage CORS Error Fix Guide

This error occurs when your development server can't access Firebase Storage due to CORS (Cross-Origin Resource Sharing) policy restrictions.

## Understanding the Error

**Error**: `Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:3001' has been blocked by CORS policy`

**Cause**: Firebase Storage doesn't allow requests from your localhost by default for security reasons.

## Quick Fix Solutions

### Solution 1: Configure CORS (Recommended)

1. **Install Google Cloud SDK** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install --cask google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate with Google Cloud**:
   ```bash
   gcloud auth login
   gcloud config set project souki-app
   ```

3. **Apply CORS configuration**:
   ```bash
   ./setup-cors.sh
   ```

### Solution 2: Use Default Port (Quick Fix)

Your dev server is running on port 3001, but Firebase expects 3000:

1. **Stop your current dev server** (Ctrl+C)
2. **Start on port 3000**:
   ```bash
   yarn dev
   # Now runs on http://localhost:3000
   ```

### Solution 3: Deploy Storage Rules

Make sure your Storage rules are deployed:

```bash
firebase deploy --only storage
```

## Detailed CORS Configuration

### Manual CORS Setup (if script fails)

1. **Create CORS configuration** (already done - see `cors.json`)
2. **Apply manually**:
   ```bash
   gsutil cors set cors.json gs://souki-app.firebasestorage.app
   ```
3. **Verify CORS settings**:
   ```bash
   gsutil cors get gs://souki-app.firebasestorage.app
   ```

### CORS Configuration Explained

The `cors.json` file allows:
- ✅ `http://localhost:3000` (default Next.js)
- ✅ `http://localhost:3001` (your current port)
- ✅ `https://*.vercel.app` (production)
- ✅ `https://*.firebaseapp.com` (Firebase hosting)

Methods allowed: GET, POST, PUT, DELETE, OPTIONS

## Alternative Upload Method

I've created an improved upload utility in `src/lib/storage.ts` with better error handling:

```typescript
import { uploadFileToStorage } from '@/lib/storage';

// Instead of direct uploadBytes, use:
const result = await uploadFileToStorage(file, 'photos/');
if (result.success) {
  console.log('File uploaded:', result.url);
} else {
  console.error('Upload failed:', result.error);
}
```

## Troubleshooting Steps

### 1. Check Current Port
Your error shows `localhost:3001`. Check your dev server:
```bash
# Should show port 3000 now
yarn dev
```

### 2. Verify Firebase Configuration
Check if Firebase config is loaded:
```javascript
// In browser console:
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
// Should show: souki-app
```

### 3. Check Authentication
Make sure you're signed in:
```javascript
// In browser console:
firebase.auth().currentUser?.email
// Should show: souki.app@gmail.com
```

### 4. Test Storage Rules
Go to Firebase Console → Storage → Rules and ensure they're deployed.

### 5. Clear Browser Cache
- Clear cache and cookies
- Try in incognito/private mode
- Restart your browser

## Production Considerations

### Vercel Deployment
When deploying to Vercel, CORS is automatically handled for:
- `https://your-app.vercel.app`
- `https://your-app-git-main.vercel.app`

### Firebase Hosting
If using Firebase Hosting, CORS is handled automatically.

### Custom Domain
Add your custom domain to the CORS configuration:

```json
{
  "origin": ["https://yourdomain.com"],
  "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "maxAgeSeconds": 3600
}
```

## Testing the Fix

1. **Apply CORS configuration**:
   ```bash
   ./setup-cors.sh
   ```

2. **Restart development server**:
   ```bash
   yarn dev
   ```

3. **Test file upload**:
   - Go to Photos page
   - Try uploading an image
   - Should work without CORS errors

## Still Having Issues?

### Check Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project "souki-app"
3. Go to Storage → Browser
4. Check bucket permissions

### Check Firebase Storage Rules
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select "souki-app" project
3. Go to Storage → Rules
4. Verify rules are deployed

### Network Issues
- Check if you're behind a corporate firewall
- Try using a different network
- Check if VPN is interfering

---

**Status**: 🔧 CORS configuration files created
**Next**: Run `./setup-cors.sh` to apply CORS settings
