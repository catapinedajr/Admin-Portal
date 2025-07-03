import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA functionality
// Temporarily disabled to prevent runtime errors
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('HODLearn: Service Worker registered successfully:', registration.scope);
//       })
//       .catch((error) => {
//         console.log('HODLearn: Service Worker registration failed:', error);
//       });
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);
