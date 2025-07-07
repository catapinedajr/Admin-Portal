# HODLearn iOS Beta - Capacitor Setup (Fastest Path)

## Why Capacitor?
- Wraps your existing PWA as a native iOS app
- Keeps all your current code and functionality
- Can be in TestFlight within days, not weeks
- Maintains web-native performance

## Step-by-Step Setup

### 1. Install Capacitor
```bash
# Install Capacitor CLI and core
npm install @capacitor/core @capacitor/cli @capacitor/ios

# Initialize Capacitor project
npx cap init "HODLearn" "com.hodlearn.app"
```

### 2. Configure capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.hodlearn.app',
  appName: 'HODLearn',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'HODLearn'
  }
};

export default config;
```

### 3. Add iOS Platform
```bash
# Build your web app first
npm run build

# Add iOS platform
npx cap add ios

# Sync web assets to native project
npx cap sync
```

### 4. Open in Xcode
```bash
npx cap open ios
```

### 5. Configure iOS Settings in Xcode

#### App Identity
- Bundle Identifier: `com.hodlearn.app`
- Display Name: `HODLearn`
- Version: `1.0.0`
- Build: `1`

#### App Icons
- Add 1024x1024 App Store icon
- Xcode will generate all required sizes

#### Signing & Capabilities
- Select your Apple Developer Team
- Enable automatic signing
- Add capabilities if needed:
  - Push Notifications (for future)
  - Background Modes (if needed)

### 6. Build and Test
```bash
# Build for device
npx cap run ios --target="Your iPhone"

# Or build for simulator
npx cap run ios --target="iPhone 14 Pro"
```

## App Store Connect Setup

### 1. Create App Record
1. Go to appstoreconnect.apple.com
2. My Apps → + → New App
3. Fill in:
   - Name: "HODLearn"
   - Bundle ID: `com.hodlearn.app`
   - Category: Education
   - Subcategory: Reference

### 2. App Information
- Description: "Learn Bitcoin through bite-sized daily lessons and build lasting conviction"
- Keywords: bitcoin, crypto, education, learn, hodl
- Screenshots: Take from iOS simulator
- App Preview: Optional video

### 3. TestFlight Beta Testing
1. Go to TestFlight tab
2. Add Internal Testers (your team)
3. Add External Testers (beta users)
4. Set Beta App Review Information

## Deployment Script

Create `deploy-ios.sh`:
```bash
#!/bin/bash
set -e

echo "Building web app..."
npm run build

echo "Syncing Capacitor..."
npx cap sync ios

echo "Opening Xcode..."
npx cap open ios

echo "Manual steps in Xcode:"
echo "1. Select 'Any iOS Device' as target"
echo "2. Product → Archive"
echo "3. Distribute App → App Store Connect"
echo "4. Upload to TestFlight"
```

## Auto-Update Strategy

Since this wraps your web app, you can update content without App Store reviews:

### 1. Server-Side Updates
- All your curriculum content is already server-side
- New lessons, quizzes, and features deploy instantly
- No app store approval needed for content

### 2. App Store Updates Only For:
- New native features
- iOS-specific improvements
- Major version changes

## Pre-Launch Checklist

### Technical
- [ ] App builds successfully in Xcode
- [ ] All screens work on iOS
- [ ] Authentication works
- [ ] Quiz submission works
- [ ] Simulators function properly
- [ ] PWA install prompts are hidden in native app

### App Store
- [ ] App Store Connect record created
- [ ] Screenshots uploaded (all required sizes)
- [ ] App description written
- [ ] Keywords optimized
- [ ] Privacy policy URL added
- [ ] Support URL added

### TestFlight
- [ ] Internal testers added
- [ ] Beta app review information complete
- [ ] Testing instructions written
- [ ] First build uploaded and approved

## Expected Timeline
- **Day 1**: Setup Capacitor and build locally
- **Day 2**: Configure Xcode and create App Store record
- **Day 3**: Upload first TestFlight build
- **Day 4-7**: Beta testing and refinements
- **Week 2**: Submit for App Store review (if ready)

## Next Steps
1. Run the Capacitor setup commands
2. Test locally on iOS simulator
3. Set up Apple Developer account if not done
4. Create App Store Connect record
5. Upload first TestFlight build

This approach leverages all your existing work while getting you to iOS App Store quickly!