const { execSync } = require('child_process');

const dependencies = [
  'expo@~51.0.0',
  'expo-status-bar@~1.12.0', 
  'react@18.3.1',
  'react-native@0.74.5',
  'react-native-safe-area-context@4.10.5',
  '@react-navigation/native@^6.1.0',
  '@react-navigation/bottom-tabs@^6.6.0',
  'react-native-screens@~3.31.1',
  'react-native-gesture-handler@~2.16.1',
  '@expo/vector-icons@^14.0.2',
  '@react-native-async-storage/async-storage@1.23.1',
  'expo-linear-gradient@~13.0.0',
  'expo-constants@~16.0.0',
  'expo-linking@~6.3.1',
  'expo-secure-store@~13.0.2',
  '@react-native-community/netinfo@11.3.1',
  'react-native-svg@15.2.0'
];

console.log('Installing React Native dependencies...');
try {
  execSync(`npm install ${dependencies.join(' ')} --legacy-peer-deps`, { 
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}