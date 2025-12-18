# iOS Build Troubleshooting Guide

## Common EAS Build Failures & Solutions

### **Error: "Project not configured"**
**Solution:**
```bash
eas build:configure
```
Run this first, then try `eas build --platform ios` again.

### **Error: "Missing bundle identifier"**
**Solution:** Update app.json with your Apple Team ID:
```json
"ios": {
  "bundleIdentifier": "com.hodlearn.app",
  "appleTeamId": "YOUR_TEAM_ID_HERE"
}
```

### **Error: "Authentication failed"**
**Solution:**
```bash
eas logout
eas login
```
Re-login and try again.

### **Error: "Apple Developer account required"**
**Solution:** You need active Apple Developer membership ($99/year):
1. Sign up at developer.apple.com
2. Get Team ID from Membership section
3. Add Team ID to app.json

### **Error: "Bundle ID already exists"**
**Solution:** Change bundle ID in app.json:
```json
"bundleIdentifier": "com.yourname.hodlearn"
```

### **Error: "Expo account required"**
**Solution:**
1. Sign up free at expo.dev
2. Login: `eas login`
3. Try build again

### **Error: "Command not found: eas"**
**Solution:**
```bash
npm install -g @expo/eas-cli@latest
```

### **Error: Node.js version issues**
**Solution:** Update Node.js to latest LTS version from nodejs.org

## Quick Fix Commands

**Reset everything:**
```bash
eas logout
eas login
eas build:configure
eas build --platform ios
```

**Check status:**
```bash
eas build:list
```

**View detailed logs:**
```bash
eas build:view [BUILD_ID]
```

## What Error Did You Get?

Please share the exact error message so I can provide the specific solution!