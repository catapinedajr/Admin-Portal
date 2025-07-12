# HODLearn iOS Beta - Quick Start

## 3-Step Beta Deployment

### 1. Apple Developer Account
- Sign up at developer.apple.com ($99/year)
- Get your Team ID from Membership section

### 2. Download & Configure
- Download this mobile folder to your Mac
- Install EAS CLI: `npm install -g @expo/eas-cli`
- Run from mobile folder:
  ```bash
  npm install
  eas login
  eas build:configure
  ```

### 3. Build & Test
- Build iOS app: `eas build --platform ios`
- Submit to TestFlight: `eas submit --platform ios`
- Download TestFlight app and test your beta

## Ready for Personal Testing

Your mobile app will:
- Connect to live backend at hodlearnbeta.replit.app
- Show real Bitcoin prices and wallet data
- Sync with your existing web app
- Work as native iOS app with proper performance

## Next Steps After Beta

Once you confirm the beta works perfectly:
1. Submit to App Store for review
2. App goes live in 1-7 days after approval
3. Users can download from App Store

Your web app continues working unchanged throughout this process.