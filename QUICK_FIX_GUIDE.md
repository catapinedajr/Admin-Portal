# Quick Fix: EAS Command Not Found

## The Problem
Terminal says "command not found: eas" - this means the installation didn't work properly.

## The Solution (Run These in Order)

### **1. Check Node.js Version**
```bash
node --version
```
Should show v18+ or v20+. If not, download latest from nodejs.org

### **2. Install EAS CLI with Sudo**
```bash
sudo npm install -g @expo/eas-cli
```
(You'll need to enter your Mac password)

### **3. Verify Installation**
```bash
eas --version
```
Should show version number like "7.8.4"

### **4. If Still Not Working, Try Alternative Install**
```bash
npm install -g @expo/eas-cli@latest --force
```

### **5. Restart Terminal**
- Close Terminal completely
- Open new Terminal window
- Try `eas --version` again

## Then Continue With Build

Once `eas --version` works:

```bash
cd Downloads/mobile
eas login
eas build:configure
eas build --platform ios
```

## Alternative: Use NPX (No Install Required)

If installation keeps failing, use npx instead:
```bash
npx @expo/eas-cli@latest login
npx @expo/eas-cli@latest build:configure
npx @expo/eas-cli@latest build --platform ios
```

Try the sudo install first - that usually fixes the "not found" error!