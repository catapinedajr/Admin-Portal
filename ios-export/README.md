# HODLearn iOS App Export

This is a standalone iOS project that loads your HODLearn app from the deployment URL.

## Files Included:
- `ContentView.swift` - Main app view with web loading
- `Info.plist` - iOS app configuration
- `HODLearnApp.swift` - App entry point

## Setup Instructions:

1. **Create New iOS Project in Xcode:**
   - Open Xcode
   - File → New → Project
   - iOS → App
   - Product Name: "HODLearn"
   - Bundle Identifier: "com.hodlearn.app"
   - Language: Swift
   - Interface: SwiftUI

2. **Replace Files:**
   - Replace ContentView.swift with the provided ContentView.swift
   - Replace Info.plist with the provided Info.plist
   - Replace HODLearnApp.swift with the provided HODLearnApp.swift

3. **Build and Run:**
   - Select iPhone simulator
   - Click Play button
   - App will load https://hodlearnbeta.replit.app

This approach bypasses Capacitor entirely and gives you a clean, native iOS app.