import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize React app with error boundary
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  
  try {
    root.render(<App />);
  } catch (error) {
    console.error("Failed to render HODLearn app:", error);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: #18181b; color: white; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
        <div style="text-align: center;">
          <h1 style="color: #f97316; margin-bottom: 1rem;">HODLearn</h1>
          <p>Unable to load the application. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="background: #f97316; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}

// Register service worker for PWA functionality - with error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('HODLearn: Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('HODLearn: Service Worker registration failed:', error);
        // Don't throw error - allow app to continue functioning
      });
  });
}
