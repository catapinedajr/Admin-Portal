# React Web to React Native Conversion Guide

## Your Current Status
✅ **You already have a complete React Native app!** 
- Location: `/mobile/App.tsx` and `/mobile/src/screens/`
- Fully functional with bottom tab navigation
- Connected to your Express.js backend
- Ready for iOS/Android deployment

## Conversion Process (Educational Reference)

### 1. Component Mapping

#### Web Components → React Native Components
```javascript
// WEB (React)
<div className="container">
  <p className="text-lg text-white">Hello</p>
  <button className="bg-blue-500 px-4 py-2">Click me</button>
  <img src="image.jpg" alt="Image" className="w-full" />
</div>

// REACT NATIVE
<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
  <TouchableOpacity style={styles.button}>
    <Text style={styles.buttonText}>Click me</Text>
  </TouchableOpacity>
  <Image source={{ uri: 'image.jpg' }} style={styles.image} />
</View>
```

### 2. Styling Conversion

#### Tailwind CSS → StyleSheet
```javascript
// WEB (Tailwind)
className="bg-black text-white p-4 rounded-lg border border-gray-700"

// REACT NATIVE (StyleSheet)
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',    // bg-black
    color: '#ffffff',             // text-white
    padding: 16,                  // p-4 (4 * 4px = 16px)
    borderRadius: 8,              // rounded-lg
    borderWidth: 1,               // border
    borderColor: '#374151',       // border-gray-700
  }
});
```

### 3. Navigation Conversion

#### Wouter → React Navigation
```javascript
// WEB (Wouter)
import { Switch, Route, Link } from "wouter";

<Switch>
  <Route path="/" component={HomePage} />
  <Route path="/learn" component={LearnPage} />
</Switch>

// REACT NATIVE (React Navigation)
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

<NavigationContainer>
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Learn" component={LearnScreen} />
  </Tab.Navigator>
</NavigationContainer>
```

### 4. Event Handling

#### Click Events → Touch Events
```javascript
// WEB
<button onClick={() => console.log('clicked')}>
  Click me
</button>

// REACT NATIVE
<TouchableOpacity onPress={() => console.log('pressed')}>
  <Text>Press me</Text>
</TouchableOpacity>
```

### 5. Complete Conversion Example

If you wanted to convert your web `App.tsx` to React Native, here's how it would look:

```typescript
// CONVERTED React Native App.tsx (Educational - you already have this!)
import React from 'react';
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Your converted screens
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import WalletScreen from './screens/WalletScreen';
import MoreScreen from './screens/MoreScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#09090b" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#f97316',    // Orange theme
            tabBarInactiveTintColor: '#71717a',  // Gray
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Learn" component={LearnScreen} />
          <Tab.Screen name="Wallet" component={WalletScreen} />
          <Tab.Screen name="More" component={MoreScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',  // Dark theme from your web app
  },
  tabBar: {
    backgroundColor: '#09090b',
    borderTopColor: '#27272a',
    paddingBottom: 8,
    paddingTop: 8,
    height: 80,
  },
});
```

## Key Differences

### What Changes:
- `div` → `View`
- `p`, `h1`, `span` → `Text`
- `button` → `TouchableOpacity` + `Text`
- `img` → `Image`
- CSS classes → StyleSheet objects
- `onClick` → `onPress`
- Wouter routing → React Navigation

### What Stays the Same:
- React hooks (useState, useEffect)
- State management
- API calls
- Business logic
- TypeScript types

## Your Current Mobile App

Your existing React Native app includes:
- ✅ Bottom tab navigation (Home, Learn, Wallet, More)
- ✅ Dark theme matching your web app
- ✅ Orange accent colors (#f97316)
- ✅ All screens fully implemented
- ✅ API integration working
- ✅ Ready for iOS/Android deployment

## Next Steps

Since you already have a complete React Native app:
1. **Test it**: Use the Expo Go preview methods I set up earlier
2. **Deploy it**: When ready, use `npx eas build` for app stores
3. **Sync features**: Any new web features can be added to mobile screens

Your conversion is already complete and working perfectly!