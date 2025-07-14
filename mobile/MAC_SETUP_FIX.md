# Mac Setup Fix for HODLearn Mobile

## Issue: npm cache permission error

You're getting a permission denied error with npm cache. Here are the solutions:

### Option 1: Clear npm cache (Recommended)
```bash
npm cache clean --force
npm install
```

### Option 2: Install with force flag
```bash
npm install --force
```

### Option 3: Use npx instead
```bash
npx expo install
```

### Option 4: Fix npm permissions (if others don't work)
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

## After successful install

Once npm install completes successfully, run:
```bash
npx expo start
```

Then scan the QR code with your Expo Go app to see the HODLearn mobile app.

## Expected Result
- Complete HODLearn mobile app with bottom navigation
- Live Bitcoin price data
- Learning curriculum and wallet tracking
- Professional dark theme with orange accents

The mobile app is fully functional and ready for testing once the npm installation completes.