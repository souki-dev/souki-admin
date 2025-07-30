# 🔧 Firebase Permission Error Fix Guide

This guide will help you resolve the "Missing or insufficient permissions" error you're encountering.

## Quick Fix Steps

### 1. **Deploy Security Rules** (Most Important)
The main cause of your error is that Firebase Firestore doesn't have proper security rules set up.

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy the security rules
./deploy-rules.sh
```

### 2. **Verify Your Admin Email**
Make sure you're signed in with the admin email specified in your environment:

- **Admin Email in Environment**: `souki.app@gmail.com`
- **Current User**: Check what email you're signed in with

### 3. **Check Firebase Configuration**
Your current Firebase config in `.env.local`:
- Project ID: `souki-app`
- Auth Domain: `souki-app.firebaseapp.com`
- Admin Email: `souki.app@gmail.com`

## Detailed Troubleshooting

### Issue: Permission Denied Error
**Symptoms**: `FirebaseError: [code=permission-denied]: Missing or insufficient permissions`

**Causes**:
1. No security rules deployed to Firestore
2. User not authenticated with admin privileges
3. Security rules too restrictive

**Solutions**:

#### Option A: Deploy Proper Security Rules (Recommended)
```bash
# Deploy the security rules we created
firebase deploy --only firestore:rules,storage
```

#### Option B: Temporary Development Rules (NOT for production)
If you need to test quickly, you can temporarily use development rules:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project `souki-app`
3. Go to Firestore Database → Rules
4. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
5. **⚠️ IMPORTANT**: Change back to secure rules before production!

### Issue: Authentication Problems
**Symptoms**: User appears to be null or undefined

**Solutions**:
1. Clear browser cache and cookies
2. Sign out and sign back in
3. Check browser developer tools for auth errors

### Issue: Environment Variables
**Symptoms**: Firebase config appears to be invalid

**Solutions**:
1. Verify `.env.local` file exists and has correct values
2. Restart your development server after changing env variables
3. Check that all required Firebase environment variables are set

## Security Rules Explanation

The security rules we created:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email in ['souki.app@gmail.com'];
    }
    
    // Only admin can access any collection
    match /{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

This ensures:
- ✅ Only authenticated users can access data
- ✅ Only users with `souki.app@gmail.com` email have admin access
- ✅ All other users are denied access

## Testing the Fix

1. **Deploy the rules**: `./deploy-rules.sh`
2. **Sign in with admin email**: Use `souki.app@gmail.com`
3. **Test the application**: Try accessing articles, photos, etc.
4. **Check browser console**: Should see no more permission errors

## Still Having Issues?

1. **Check Firebase Console Logs**:
   - Go to Firebase Console → Project → Logs
   - Look for authentication or permission errors

2. **Verify User Token**:
   - Open browser developer tools
   - Go to Application/Storage → IndexedDB → firebaseLocalStorageDb
   - Check if user token contains correct email

3. **Force Refresh Authentication**:
   ```javascript
   // In browser console, run:
   firebase.auth().currentUser.getIdToken(true)
   ```

4. **Contact Support**:
   - If none of these steps work, the issue might be with your Firebase project configuration
   - Check Firebase project settings and IAM permissions

## Next Steps After Fix

1. **Set up proper user management**: Consider creating an admin user management system
2. **Implement role-based access**: Add different permission levels if needed
3. **Monitor security**: Set up Firebase alerts for unauthorized access attempts
4. **Backup your data**: Regular backups of Firestore collections

---

**Remember**: The security rules we created are production-ready and secure. They only allow access to users with the specific admin email address.
