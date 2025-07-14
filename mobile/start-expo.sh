#!/bin/bash

echo "🚀 Starting HODLearn Mobile App for Expo Go Testing..."
echo ""
echo "📱 To test on your phone:"
echo "1. Download 'Expo Go' app from App Store or Google Play"
echo "2. Scan the QR code below with your phone camera"
echo "3. The app will open in Expo Go"
echo ""
echo "🌐 Backend API: https://hodlearnbeta.replit.app"
echo ""

# Start Expo development server with tunnel for external access
npx expo start --tunnel --clear