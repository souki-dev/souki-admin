#!/bin/bash

# Deploy Firebase Security Rules
# This script deploys Firestore and Storage security rules to your Firebase project

echo "🚀 Deploying Firebase Security Rules..."

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

# Deploy Firestore rules
echo "📝 Deploying Firestore security rules..."
firebase deploy --only firestore:rules

# Deploy Storage rules
echo "🗄️ Deploying Storage security rules..."
firebase deploy --only storage

# Deploy indexes (optional)
echo "📊 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

echo "✅ Security rules deployed successfully!"
echo ""
echo "🔒 Important: Make sure your admin email (souki.app@gmail.com) is correctly set in the rules."
echo "📧 Admin email in rules: souki.app@gmail.com"
echo "📧 Admin email in env: ${NEXT_PUBLIC_ADMIN_EMAILS:-'Not set'}"
echo ""
echo "🛠️ If you're still getting permission errors:"
echo "1. Make sure you're signed in with the admin email"
echo "2. Wait a few minutes for the rules to propagate"
echo "3. Try clearing your browser cache"
