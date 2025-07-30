// Safari compatibility MUST be first import
import "./utils/safariCompat";

import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Clear service worker cache in development to prevent conflicts
if ('serviceWorker' in navigator && typeof navigator.serviceWorker !== 'undefined' && import.meta.env.DEV) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

// Register service worker for PWA functionality (production only)
if ('serviceWorker' in navigator && typeof navigator.serviceWorker !== 'undefined' && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
        })
        .catch((error) => {
        });
    } catch (error) {
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
