# HODLearn Mobile App - Expo Go Testing Guide

## Quick Start (5 minutes)

### Step 1: Download Expo Go
- **iPhone**: Search "Expo Go" in App Store
- **Android**: Search "Expo Go" in Google Play Store
- Install the free app

### Step 2: Start the Mobile App
```bash
cd mobile
./start-expo.sh
```

### Step 3: Connect Your Phone
1. A QR code will appear in your terminal
2. Open Expo Go app on your phone
3. Tap "Scan QR Code"
4. Point camera at the QR code
5. Your HODLearn app opens immediately!

## What You'll Experience

### 📱 Native Mobile Experience
- **Bottom Tab Navigation**: Home, Learn, Wallet, More
- **Live Bitcoin Price**: Real-time updates from your backend
- **Authentic Content**: Days 1-14 curriculum from your database
- **Working Features**: Quizzes, progress tracking, wallet earnings

### 🔄 Real-Time Development
- **Live Reload**: Code changes instantly appear on your phone
- **Hot Reloading**: State preservation during development
- **Error Overlay**: Development errors shown directly on phone

### 🌐 Backend Integration
- **API Connection**: `https://hodlearnbeta.replit.app`
- **Live Data**: Same database as your web app
- **User Sync**: Progress tracks across web and mobile

## Testing Features

### Home Screen
- Time-based greeting ("Good morning, [Name]!")
- Live Bitcoin price display
- Streak achievement tracking
- Daily content cards
- Progress milestones

### Learn Screen
- Access to all 14 days of content
- Setup questions with Bitcoin curiosity building
- Comprehensive lessons
- Interactive quiz system
- Progress tracking

### Wallet Screen
- Satoshi earnings display
- Transaction history
- USD value calculations
- Achievement badges
- Earning statistics

### More Screen
- Feature overview
- App information
- Settings access

## Troubleshooting

### QR Code Won't Scan
1. Ensure phone and computer on same WiFi
2. Try using tunnel mode: `npx expo start --tunnel`
3. Check firewall settings

### App Won't Load
1. Verify backend is running: `https://hodlearnbeta.replit.app`
2. Check internet connection
3. Restart Expo Go app

### Features Not Working
1. API endpoints may need authentication
2. Check console for error messages
3. Verify database connection

## Development Benefits

### ✅ Real Device Testing
- Touch interactions
- Native performance
- Screen size compatibility
- iOS/Android differences

### ✅ Rapid Iteration
- Instant feedback on changes
- No rebuild required
- Live debugging

### ✅ Production Preview
- Exact app store experience
- Native navigation
- Performance testing

## Next Steps

### For Production Deployment
1. **Apple Developer Account** ($99/year)
2. **Google Play Developer Account** ($25 one-time)
3. **EAS Build**: `npx eas build`
4. **Store Submission**: TestFlight → App Store

### Current Status
- ✅ Mobile app complete and functional
- ✅ Backend integration working
- ✅ All screens implemented
- ✅ Ready for Expo Go testing
- ✅ Prepared for store deployment

## Tips for Best Testing

1. **Test on multiple devices** if available
2. **Try different screen sizes** (phone vs tablet)
3. **Test network conditions** (WiFi vs cellular)
4. **Verify all features** work as expected
5. **Check performance** and responsiveness

Your mobile app is production-ready and provides the same robust experience as your web app, optimized for native mobile interaction.