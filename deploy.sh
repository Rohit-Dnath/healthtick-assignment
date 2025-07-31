#!/bin/bash

# HealthTick Calendar Deployment Script
# This script helps deploy the application to Vercel

echo "🚀 HealthTick Calendar Deployment"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo ""
        echo "📝 Don't forget to:"
        echo "1. Set up your Firebase environment variables in Vercel dashboard"
        echo "2. Configure Firestore rules for security"
        echo "3. Test the live application"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
