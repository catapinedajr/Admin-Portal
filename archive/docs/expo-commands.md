# Expo Commands Reference

## Quick Commands for iOS Development

### Development
```bash
# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on physical iOS device
npx expo run:ios --device
```

### Building
```bash
# Build for iOS (development)
npx eas build --platform ios --profile development

# Build for iOS (production/App Store)
npx eas build --platform ios --profile production

# Build preview for TestFlight
npx eas build --platform ios --profile preview
```

### App Store Submission
```bash
# Submit to App Store Connect
npx eas submit --platform ios

# Submit specific build
npx eas submit --platform ios --latest
```

### Project Management
```bash
# Initialize Expo project (if needed)
npx expo init

# Install dependencies
npx expo install

# Check project status
npx expo doctor
```

## Configuration Files Created

- `app.json` - Main Expo configuration
- `eas.json` - Build and submission settings
- `metro.config.js` - Bundler configuration
- `babel.config.js` - JavaScript compilation settings

## Next Steps

1. Install React Native dependencies (if going hybrid route)
2. Test with `npx expo start`
3. Build for iOS with `npx eas build --platform ios`
4. Submit to App Store with `npx eas submit --platform ios`