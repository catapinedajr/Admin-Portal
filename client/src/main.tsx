import { createRoot } from "react-dom/client";
import App from "./App";
import MinimalApp from "./minimal";
import "./index.css";

// Always use full app - let's test if the issue is the conditional loading
const AppToRender = App;

// Global error handling for production debugging
window.addEventListener('error', (event) => {
  console.error('HODLearn Global Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('HODLearn Unhandled Promise Rejection:', event.reason);
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('HODLearn: Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('HODLearn: Service Worker registration failed:', error);
      });
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('HODLearn: Root element not found!');
} else {
  try {
    createRoot(rootElement).render(<AppToRender />);
    console.log('HODLearn: App rendered successfully');
  } catch (error) {
    console.error('HODLearn: Failed to render app:', error);
  }
}
