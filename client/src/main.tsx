import { createRoot } from "react-dom/client";
import App from "./App";
import SimpleApp from "./App-backup";
import "./index.css";

// Test mode - render simple app first to isolate issue
const TEST_MODE = true;

// Register service worker for PWA functionality (Safari-compatible)
if ('serviceWorker' in navigator && typeof navigator.serviceWorker !== 'undefined') {
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

createRoot(document.getElementById("root")!).render(TEST_MODE ? <SimpleApp /> : <App />);
