# HODLearn iOS Beta Release Setup Guide

## Prerequisites

### 1. Apple Developer Account
- Sign up for Apple Developer Program ($99/year)
- Get your Team ID from developer.apple.com

### 2. macOS Development Machine
- Xcode 14+ installed from Mac App Store
- Command Line Tools: `xcode-select --install`
- CocoaPods: `sudo gem install cocoapods`

### 3. React Native Development Environment
```bash
# Install React Native CLI
npm install -g react-native-cli

# Install iOS Simulator
# Already included with Xcode
```

## Step-by-Step iOS App Creation

### Phase 1: Create React Native App Structure

1. **Initialize React Native Project**
```bash
npx react-native init HODLearnNative --template typescript
cd HODLearnNative
```

2. **Install Required Dependencies**
```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# HTTP Client
npm install axios @tanstack/react-query

# Forms
npm install react-hook-form @hookform/resolvers zod

# UI Components
npm install react-native-svg react-native-vector-icons

# Secure Storage
npm install react-native-keychain

# Authentication
npm install @react-native-async-storage/async-storage

# iOS specific
cd ios && pod install && cd ..
```

### Phase 2: Port Core Components

1. **Create Shared API Client**
```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'https://your-backend-url.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
```

2. **Port Authentication Logic**
```typescript
// src/hooks/useAuth.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

3. **Create Native Components**
```typescript
// src/components/LearnScreen.tsx
// src/components/SimulatorsScreen.tsx
// src/components/CommunityScreen.tsx
```

### Phase 3: iOS Configuration

1. **Update Info.plist**
```xml
<!-- ios/HODLearnNative/Info.plist -->
<key>CFBundleDisplayName</key>
<string>HODLearn</string>
<key>CFBundleIdentifier</key>
<string>com.hodlearn.app</string>
<key>CFBundleName</key>
<string>HODLearn</string>
```

2. **Configure App Icons**
- Create app icon set (1024x1024 base)
- Use Xcode to generate all required sizes
- Place in `ios/HODLearnNative/Images.xcassets/AppIcon.appiconset/`

3. **Set Bundle Identifier**
- Open `ios/HODLearnNative.xcworkspace` in Xcode
- Set unique Bundle Identifier: `com.hodlearn.app`
- Configure signing with your Apple Developer account

### Phase 4: TestFlight Setup

1. **Create App in App Store Connect**
- Go to appstoreconnect.apple.com
- Create new app with Bundle ID: `com.hodlearn.app`
- Set app name: "HODLearn"
- Choose category: Education

2. **Configure Beta Testing**
- Add beta testers (up to 100 internal, 10,000 external)
- Set up TestFlight beta information
- Add app description and testing notes

3. **Build and Upload**
```bash
# Build for iOS
npx react-native build-ios --mode=Release

# Archive and upload using Xcode
# Or use fastlane for automation
```

## Alternative: Capacitor Approach (Faster)

If you want to ship faster, use Capacitor to wrap your existing PWA:

### 1. Install Capacitor
```bash
npm install @capacitor/core @capacitor/ios @capacitor/cli
npx cap init HODLearn com.hodlearn.app
```

### 2. Build and Add iOS Platform
```bash
npm run build
npx cap add ios
npx cap sync
```

### 3. Open in Xcode
```bash
npx cap open ios
```

### 4. Configure and Build
- Set up signing in Xcode
- Configure app icons and splash screens
- Build and archive for TestFlight

## Current PWA Optimization for iOS

Before going native, optimize your current PWA:

### 1. Add iOS-specific meta tags
```html
<!-- Apple-specific tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="HODLearn">
<link rel="apple-touch-icon" href="/icon-180x180.png">
```

### 2. Improve manifest.json
```json
{
  "display": "standalone",
  "start_url": "/?source=pwa",
  "background_color": "#09090b",
  "theme_color": "#f97316"
}
```

## Recommendation

For fastest beta release:
1. **Immediate**: Optimize current PWA for iOS Safari
2. **Short-term**: Use Capacitor to wrap PWA as native app
3. **Long-term**: Consider React Native for full native experience

The Capacitor approach will get you to TestFlight fastest while maintaining your current codebase.