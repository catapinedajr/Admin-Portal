# HODLearn Mobile App

This directory contains the React Native mobile app that connects to the same backend as the web app.

## Quick Start

1. **Install dependencies:**
```bash
cd mobile
npm install
```

2. **Start development server:**
```bash
npx expo start
```

3. **Test on device:**
   - Install Expo Go app on your iPhone
   - Scan QR code from terminal
   - App will load with your HODLearn content

## What's Built

✅ **Complete app structure** with bottom tab navigation
✅ **Home screen** with streak tracking, Bitcoin price, and daily content
✅ **Learn screen** with setup questions, lessons, and quizzes  
✅ **Wallet screen** with satoshi balance and earnings tracking
✅ **More screen** with features, store preview, and app info
✅ **API integration** connects to your existing backend
✅ **HODLearn design system** with orange theme and dark mode

## Key Features

- **Same data as web app** - wallet, progress, content all synced
- **Native mobile experience** - optimized for iPhone screens
- **Real-time updates** - Bitcoin prices and user progress
- **Educational wallet** - tracks learning rewards in satoshis
- **Offline-ready structure** - prepared for production features

## iOS App Store Deployment

1. **Install EAS CLI:**
```bash
npm install -g @expo/eas-cli
```

2. **Configure iOS build:**
```bash
cd mobile
eas build:configure
```

3. **Build for iOS:**
```bash
eas build --platform ios
```

4. **Submit to App Store:**
```bash
eas submit --platform ios
```

## Architecture

The mobile app is **completely separate** from your web app:
- ✅ Web app continues working exactly as before
- ✅ Mobile app connects to same PostgreSQL database  
- ✅ Same Express.js API endpoints serve both apps
- ✅ Content updates apply to both automatically
- ✅ Zero risk to existing functionality

## Next Steps

1. Test the app on your iPhone using Expo Go
2. Customize styling and add missing features
3. Set up Apple Developer account for App Store
4. Deploy to TestFlight for beta testing
5. Submit to App Store for review

Your web app remains untouched while you now have a native iOS app path!