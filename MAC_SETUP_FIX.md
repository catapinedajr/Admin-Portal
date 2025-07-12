# Mac Setup Fix - Node.js Missing

## The Problem
"command not found" for both `npm` and `eas` means Node.js isn't installed on your Mac.

## The Solution

### **Step 1: Install Node.js**
1. **Go to:** https://nodejs.org
2. **Download:** LTS version (green button)
3. **Install:** Run the downloaded .pkg file
4. **Restart Terminal** completely

### **Step 2: Verify Installation**
```bash
node --version
npm --version
```
Both should show version numbers.

### **Step 3: Install EAS CLI**
```bash
npm install -g @expo/eas-cli
```

### **Step 4: Build Your App**
```bash
cd Downloads/mobile
eas login
eas build:configure
eas build --platform ios
```

## Alternative: Use Homebrew (If You Have It)

If you have Homebrew installed:
```bash
brew install node
npm install -g @expo/eas-cli
```

## Quick Check
After installing Node.js, open **new Terminal** and type:
```bash
node --version
```

If you see something like "v20.11.0" you're ready to continue with EAS CLI installation.

## Next Steps
Once Node.js is working:
1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Navigate to mobile folder: `cd Downloads/mobile`
3. Login: `eas login`
4. Build: `eas build --platform ios`

The mobile app is complete and ready - we just need to get the build tools working on your Mac!