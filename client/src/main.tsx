import { createRoot } from "react-dom/client";
import "./index.css";

// Emergency minimal test
function EmergencyApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#18181b', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ color: '#f97316', fontSize: '2rem', marginBottom: '1rem' }}>
        🟢 HODLearn - App is Working!
      </h1>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>
        Emergency recovery mode activated. Your app and data are safe.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/about" 
          style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            fontSize: '1.1rem',
            display: 'block',
            marginBottom: '1rem'
          }}
        >
          → Test About Page
        </a>
        <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
          If you can see this, React is working. Will restore full app next.
        </p>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<EmergencyApp />);
} else {
  console.error("Root element not found!");
}
