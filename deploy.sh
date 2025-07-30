#!/bin/bash

# Souki Admin Panel - Quick Deploy Script
echo "🚀 Deploying Souki Admin Panel..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Firebase configuration."
    exit 1
fi

# Build the application
echo "📦 Building application..."
yarn build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "✅ Build successful!"

# Check if Vercel CLI is available
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
elif command -v netlify &> /dev/null; then
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=.next
elif command -v firebase &> /dev/null; then
    echo "🌐 Deploying to Firebase Hosting..."
    firebase deploy
else
    echo "📋 Manual deployment required:"
    echo "1. Upload the .next folder to your hosting provider"
    echo "2. Set the environment variables on your hosting platform"
    echo "3. Configure your hosting to run 'yarn start'"
    echo ""
    echo "Or install a deployment CLI:"
    echo "- Vercel: npm i -g vercel"
    echo "- Netlify: npm i -g netlify-cli"
    echo "- Firebase: npm i -g firebase-tools"
fi

echo "🎉 Deployment process completed!"
