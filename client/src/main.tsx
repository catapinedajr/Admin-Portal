import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Clear service worker cache in development to prevent conflicts
if ('serviceWorker' in navigator && typeof navigator.serviceWorker !== 'undefined' && import.meta.env.DEV) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('HODLearn: Cleared service worker for development');
    }
  });
}

// Register service worker for PWA functionality (production only)
if ('serviceWorker' in navigator && typeof navigator.serviceWorker !== 'undefined' && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('HODLearn: Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.log('HODLearn: Service Worker registration failed (Safari may not support):', error);
        });
    } catch (error) {
      console.log('HODLearn: Service Worker not available in Safari:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
