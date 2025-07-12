const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure for web and native
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add support for your existing web assets
config.resolver.assetExts.push('svg', 'png', 'jpg', 'jpeg', 'gif', 'webp');

// Support your existing source structure
config.watchFolders = [__dirname];

module.exports = config;