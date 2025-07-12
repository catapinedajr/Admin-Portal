# HODLearn Mobile App - Setup Instructions

Since you're working in Replit, here's how to test the mobile app on your local machine:

## Quick Setup (5 minutes)

### Step 1: Download the Mobile App Code
1. Download this entire `mobile` folder to your computer
2. Or copy all files from the mobile directory

### Step 2: Install Dependencies on Your Computer
Open terminal/command prompt and run:
```bash
cd mobile
npm install
```

### Step 3: Start the Development Server
```bash
npx expo start
```

### Step 4: Test on Your iPhone
1. Install "Expo Go" app from App Store
2. Scan the QR code that appears in your terminal
3. HODLearn mobile app will load on your phone

## What You'll See Working

✅ **Home Screen:** Bitcoin price, streak tracking, daily content  
✅ **Learn Screen:** Setup questions, lessons, quiz system  
✅ **Wallet Screen:** Satoshi balance, earnings tracking  
✅ **More Screen:** Features overview, app info  

## The API Connection

The mobile app connects to your live backend:
- **API URL:** `https://hodlearnbeta.replit.app`
- **Same database:** All content syncs with web app
- **Real data:** Bitcoin prices, user progress, wallet balance

## Alternative: Test in Browser

If you want to test without downloading, you can also run:
```bash
npx expo start --web
```

This opens the mobile app in your web browser to preview the design.

## Ready for App Store

Once tested, the app is ready for iOS deployment:
1. Set up Apple Developer account ($99/year)
2. Run `eas build --platform ios`
3. Submit to App Store via `eas submit`

Your web app continues working exactly as before while you now have a native mobile path!