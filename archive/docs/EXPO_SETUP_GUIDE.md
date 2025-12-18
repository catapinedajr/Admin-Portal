# HODLearn Expo Setup Guide

## Overview
This guide sets up Expo for native iOS deployment while keeping your existing web app intact.

## What We've Configured

### 1. Expo Configuration (`app.json`)
- App name: "HODLearn"
- Bundle identifier: `com.hodlearn.app`
- Dark UI theme
- iOS and Android settings
- Splash screen configuration

### 2. EAS Build Configuration (`eas.json`)
- Development builds for testing
- Preview builds for internal distribution
- Production builds for App Store

### 3. Metro Configuration (`metro.config.js`)
- Support for web, iOS, and Android platforms
- Asset handling for your existing images
- Source directory configuration

### 4. Babel Configuration (`babel.config.js`)
- Expo preset configuration
- Plugin support for React Native

## Next Steps for iOS Deployment

### Option A: Hybrid Approach (Recommended)
Keep your existing web app and create a companion React Native app:

1. **Install React Native dependencies:**
   ```bash
   npm install react-native expo-router babel-preset-expo
   ```

2. **Create app directory structure:**
   ```
   app/
     _layout.tsx    # Root layout
     index.tsx      # Home screen
     learn.tsx      # Learn screen
     wallet.tsx     # Wallet screen
   ```

3. **Build for iOS:**
   ```bash
   npx expo run:ios
   ```

### Option B: Web-to-Native Wrapper
Use your existing React components in a React Native shell:

1. **Install web compatibility:**
   ```bash
   npm install react-native-web react-native-web-hooks
   ```

2. **Configure shared components between web and native**

3. **Build and deploy:**
   ```bash
   npx eas build --platform ios
   ```

## iOS App Store Deployment

1. **Build for production:**
   ```bash
   npx eas build --platform ios --profile production
   ```

2. **Submit to App Store:**
   ```bash
   npx eas submit --platform ios
   ```

## Apple Developer Requirements

- Apple Developer account ($99/year)
- macOS for final testing (optional with EAS Build)
- App Store Connect setup

## Benefits of This Approach

- ✅ Keep existing web app unchanged
- ✅ Native iOS app through Expo
- ✅ Shared backend API
- ✅ Independent deployment cycles
- ✅ EAS Build for cloud building (no macOS required)

Your web app continues working exactly as before, while you gain native iOS capability through Expo.