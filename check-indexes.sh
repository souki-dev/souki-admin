#!/bin/bash

# Check Firebase Index Status
# This script helps you check the status of your Firestore indexes

echo "🔍 Checking Firebase Firestore Index Status..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ You are not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

echo ""
echo "📊 Current Firestore indexes status:"
echo "Project: souki-app"
echo ""

# Try to get index information
firebase firestore:indexes

echo ""
echo "🌐 You can also check index status in the Firebase Console:"
echo "👉 https://console.firebase.google.com/project/souki-app/firestore/indexes"
echo ""
echo "⏳ If indexes are still building:"
echo "   - This can take several minutes to hours depending on data size"
echo "   - You can use the temporary workaround queries in the meantime"
echo "   - The app will work normally once indexes finish building"
echo ""
echo "🔧 To deploy indexes manually:"
echo "   firebase deploy --only firestore:indexes"
