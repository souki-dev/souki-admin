#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this script after installing Vercel CLI and logging in

echo "🚀 Setting up environment variables for Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Set environment variables using Vercel CLI
echo "📝 Setting environment variables..."

vercel env add NEXT_PUBLIC_FIREBASE_API_KEY AIzaSyAZSq22ji3_hoZzLoMWkfVN8IjJpGbHKGw production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN souki-app.firebaseapp.com production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID souki-app production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET souki-app.firebasestorage.app production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID 277212644563 production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID 1:277212644563:web:48ff795c3aac3fefb74026 production
vercel env add NEXT_PUBLIC_ADMIN_EMAILS souki.app@gmail.com production

echo "✅ Environment variables set successfully!"
echo "🚀 You can now deploy with: vercel --prod"
