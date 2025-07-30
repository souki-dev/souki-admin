#!/bin/bash

# Deploy Firebase Indexes
# This script deploys the Firestore indexes to resolve composite index requirements

echo "🚀 Deploying Firebase Firestore Indexes..."

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

echo "📊 Deploying Firestore indexes for project: souki-app"
echo ""

# Deploy the indexes
firebase deploy --only firestore:indexes

echo ""
echo "✅ Index deployment initiated!"
echo ""
echo "⏳ Important Notes:"
echo "   - Indexes can take several minutes to hours to build"
echo "   - You can check progress at: https://console.firebase.google.com/project/souki-app/firestore/indexes"
echo "   - The app will use temporary workarounds until indexes are ready"
echo ""
echo "🔍 To check index status later, run:"
echo "   ./check-indexes.sh"
