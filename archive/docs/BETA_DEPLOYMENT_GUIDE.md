# HODLearn iOS Beta Deployment Guide

## Quick Beta Setup (Personal Testing)

### Prerequisites
1. **Apple Developer Account** ($99/year) - Sign up at developer.apple.com
2. **EAS CLI** - Install globally: `npm install -g @expo/eas-cli`

### Step 1: Apple Developer Setup
1. **Create Apple ID** at appleid.apple.com (if needed)
2. **Join Apple Developer Program** at developer.apple.com ($99/year)
3. **Create App Store Connect record:**
   - Go to appstoreconnect.apple.com
   - Click "My Apps" → "+" → "New App"
   - Name: "HODLearn"
   - Bundle ID: "com.hodlearn.app"
   - Language: English
   - SKU: "hodlearn-ios"

### Step 2: Build Configuration
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project (run from mobile directory)
cd mobile
eas build:configure
```

### Step 3: Build iOS App
```bash
# Build for TestFlight
eas build --platform ios --profile production
```

This creates an `.ipa` file ready for App Store submission.

### Step 4: TestFlight Beta Distribution
```bash
# Submit to TestFlight
eas submit --platform ios
```

### Step 5: Personal Testing
1. **Download TestFlight** app from App Store
2. **Add yourself as beta tester** in App Store Connect
3. **Install HODLearn beta** via TestFlight
4. **Test all functionality** on your iPhone

## What You'll Test

✅ **Home Screen:** Bitcoin price, streak tracking, daily content  
✅ **Learn Screen:** Setup questions, lessons, quiz system  
✅ **Wallet Screen:** Satoshi balance, earnings tracking  
✅ **More Screen:** Features overview, app info  
✅ **API Connection:** Real data from hodlearnbeta.replit.app  
✅ **Native Experience:** Smooth performance, proper notifications  

## Beta Testing Checklist

- [ ] App launches successfully
- [ ] Bitcoin price updates correctly
- [ ] Wallet shows real satoshi balance
- [ ] Learn content loads from backend
- [ ] Navigation between screens works
- [ ] Data syncs with web app
- [ ] No crashes or performance issues

## Production Deployment (After Beta)

Once you're satisfied with beta testing:

1. **App Store Review:**
   ```bash
   eas submit --platform ios --profile production
   ```

2. **App Store Connect:**
   - Add app description, screenshots, keywords
   - Set pricing (Free)
   - Submit for review

3. **Review Timeline:**
   - Apple review: 1-7 days
   - Auto-publish after approval

## Architecture Benefits

- **Zero risk to web app** - continues working unchanged
- **Shared backend** - same database, API, content
- **Independent deployment** - mobile updates don't affect web
- **Content sync** - Bitcoin education content stays current

## Support

- **Build issues:** Check EAS Build logs
- **Apple Developer:** developer.apple.com/support
- **TestFlight:** help.apple.com/app-store-connect

Your native iOS app is ready for beta testing!