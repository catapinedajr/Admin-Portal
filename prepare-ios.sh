#!/bin/bash
set -e

echo "🏗️  Building HODLearn for iOS..."

# Build the web app
echo "📦 Building web application..."
npm run build

# Initialize Capacitor (if not already done)
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️  Initializing Capacitor..."
    npx cap init "HODLearn" "com.hodlearn.app"
fi

# Add iOS platform (if not already added)
if [ ! -d "ios" ]; then
    echo "📱 Adding iOS platform..."
    npx cap add ios
fi

# Sync web assets to iOS project
echo "🔄 Syncing assets to iOS..."
npx cap sync ios

echo "✅ iOS preparation complete!"
echo ""
echo "Next steps:"
echo "1. Open Xcode: npx cap open ios"
echo "2. Connect your iOS device or use simulator"
echo "3. Select your development team in Xcode"
echo "4. Build and run: Product → Run"
echo ""
echo "For TestFlight deployment:"
echo "1. Archive: Product → Archive"
echo "2. Distribute: Window → Organizer → Distribute App"
echo "3. Upload to App Store Connect"