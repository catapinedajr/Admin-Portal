#!/bin/bash

# HODLearn iOS Deployment Script
echo "🚀 Building HODLearn for iOS Beta Release..."

# Step 1: Build the web application
echo "📱 Building web application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix any build errors and try again."
    exit 1
fi

# Step 2: Sync with iOS project
echo "🔄 Syncing with iOS project..."
npx cap sync ios

if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed."
    exit 1
fi

# Step 3: Open in Xcode
echo "📱 Opening in Xcode..."
npx cap open ios

echo "✅ iOS project ready!"
echo ""
echo "Next steps in Xcode:"
echo "1. Select your Team in Signing & Capabilities"
echo "2. Set Bundle Identifier: com.hodlearn.app"
echo "3. Archive > Distribute App > App Store Connect"
echo "4. Upload to TestFlight for Beta testing"
echo ""
echo "Your Bundle ID: com.hodlearn.app"
echo "App Name: HODLearn™"