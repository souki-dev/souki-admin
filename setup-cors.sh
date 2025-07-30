#!/bin/bash

# Configure Firebase Storage CORS
# This script sets up CORS configuration for Firebase Storage to allow local development

echo "🌐 Configuring Firebase Storage CORS..."

# Check if gsutil is installed
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil is not installed. Installing Google Cloud SDK..."
    echo ""
    echo "Please install Google Cloud SDK:"
    echo "https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "Or on macOS with Homebrew:"
    echo "brew install --cask google-cloud-sdk"
    echo ""
    echo "After installation, run:"
    echo "gcloud auth login"
    echo "gcloud config set project souki-app"
    exit 1
fi

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud. Please run:"
    echo "gcloud auth login"
    exit 1
fi

# Set project if not already set
gcloud config set project souki-app

echo "📝 Applying CORS configuration to Firebase Storage bucket..."

# Apply CORS configuration
gsutil cors set cors.json gs://souki-app.firebasestorage.app

if [ $? -eq 0 ]; then
    echo "✅ CORS configuration applied successfully!"
    echo ""
    echo "🔧 CORS now allows:"
    echo "   - http://localhost:3000 (default Next.js port)"
    echo "   - http://localhost:3001 (your current port)"
    echo "   - https://*.vercel.app (production)"
    echo "   - https://*.firebaseapp.com (Firebase hosting)"
    echo ""
    echo "🔄 You may need to restart your development server for changes to take effect."
else
    echo "❌ Failed to apply CORS configuration."
    echo "Please check your permissions and project settings."
fi

echo ""
echo "📋 To verify CORS configuration:"
echo "gsutil cors get gs://souki-app.firebasestorage.app"
