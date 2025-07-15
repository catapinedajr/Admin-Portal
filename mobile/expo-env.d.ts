/// <reference types="expo/types" />

// Environment variables for React Native
declare module '@env' {
  export const API_URL: string;
}

// Global type extensions for React Native
declare global {
  namespace ReactNative {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}