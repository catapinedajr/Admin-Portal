# HODLearn iOS Project Files

## Download These Individual Files

Instead of dealing with the compressed archive, download these key files individually:

### Essential Configuration Files:
1. `capacitor.config.ts` - Main iOS configuration
2. `package.json` - Dependencies
3. `ios-deploy.sh` - Deployment script

### iOS Project:
4. `hodlearn-ios-native.tar.gz` - Just the iOS native project (much smaller)

### Source Code:
5. Download the entire `client/` folder
6. Download the entire `server/` folder
7. Download the `shared/` folder

## Setup Steps:
1. Create a new folder on your Mac called `hodlearn-ios`
2. Download all files above into that folder
3. Open Terminal and navigate to the folder
4. Run: `npm install`
5. Run: `./ios-deploy.sh`

This approach avoids the compression issues and gets you the same result.