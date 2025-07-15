const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable React Native Web for better compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add support for SVG files
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Better error handling
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;