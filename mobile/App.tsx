import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LearnScreen from './src/screens/LearnScreen';
import WalletScreen from './src/screens/WalletScreen';
import MoreScreen from './src/screens/MoreScreen';

// Navigation
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#09090b" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#09090b',
              borderTopColor: '#27272a',
              paddingBottom: 8,
              paddingTop: 8,
              height: 80,
            },
            tabBarActiveTintColor: '#f97316',
            tabBarInactiveTintColor: '#71717a',
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '500',
            },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>🏠</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="Learn" 
            component={LearnScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>📚</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="Wallet" 
            component={WalletScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>💰</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="More" 
            component={MoreScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>⋯</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
});