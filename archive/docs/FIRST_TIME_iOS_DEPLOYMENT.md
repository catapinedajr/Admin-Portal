# Your First iOS Beta Deployment - Step by Step

## Prerequisites (You Have These ✅)
- Xcode 16.4 installed
- Apple Developer account with license
- HODLearn app configured for iOS

## Step 1: Build and Open in Xcode

In your terminal, run:
```bash
./ios-deploy.sh
```

This will:
- Build your web app
- Sync with iOS project
- Automatically open Xcode 16.4

## Step 2: Configure Signing in Xcode

When Xcode opens:

1. **Select your project** (HODLearn in the left sidebar)
2. **Click on "App" target** (under TARGETS)
3. **Go to "Signing & Capabilities" tab**
4. **Team dropdown**: Select your Apple Developer account
5. **Bundle Identifier**: Verify it shows `com.hodlearn.app`

If you see any red errors, they'll likely resolve once you select your team.

## Step 3: Create App in App Store Connect (First Time Only)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill out:
   - **Platform**: iOS
   - **Name**: HODLearn
   - **Primary Language**: English
   - **Bundle ID**: Select `com.hodlearn.app` from dropdown
   - **SKU**: hodlearn-ios (or any unique identifier)

## Step 4: Archive Your App

Back in Xcode:
1. **Select "Any iOS Device" or your connected iPhone** in the device dropdown (top toolbar)
2. **Product menu** → **Archive**
3. Wait for build to complete (2-5 minutes)

## Step 5: Upload to App Store Connect

After archiving:
1. **Organizer window** opens automatically
2. Click **"Distribute App"**
3. Select **"App Store Connect"**
4. Click **"Upload"**
5. Click **"Next"** through the following screens (defaults are fine)
6. Click **"Upload"**

## Step 6: Configure TestFlight

1. Return to [App Store Connect](https://appstoreconnect.apple.com)
2. Go to your HODLearn app
3. Click **"TestFlight"** tab
4. Wait for "Processing" to complete (24-48 hours max, usually faster)
5. Once processed, click **"External Testing"**
6. Create a test group and add beta testers

## What You'll See

- **App Name**: HODLearn™ 
- **Clean Interface**: No premium indicators (as we just removed)
- **Professional Headers**: Only logo, wallet, and account buttons
- **Native iOS Experience**: Smooth animations and native feel

## If You Get Stuck

Common first-time issues:
- **"No signing certificate"**: Select your team in Signing & Capabilities
- **"Bundle ID not found"**: Create the app in App Store Connect first
- **Build errors**: Make sure the deployment script completed successfully

Your app will be distributed to beta testers through TestFlight links.