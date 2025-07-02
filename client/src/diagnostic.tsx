// Minimal diagnostic component to test production deployment
import { useState, useEffect } from "react";

export default function DiagnosticApp() {
  const [status, setStatus] = useState("Loading...");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const testSteps = async () => {
      try {
        setStatus("Testing localStorage...");
        localStorage.setItem('test', 'ok');
        localStorage.removeItem('test');
        
        setStatus("Testing API connection...");
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error(`API failed: ${response.status}`);
        }
        
        setStatus("Testing React state...");
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setStatus("✅ All tests passed - Production working!");
      } catch (error) {
        setErrors(prev => [...prev, `Error: ${error}`]);
        setStatus("❌ Found issues");
      }
    };

    testSteps();
  }, []);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1a1a1a',
      color: '#white',
      minHeight: '100vh'
    }}>
      <h1>HODLearn Production Diagnostic</h1>
      <div style={{ marginTop: '20px' }}>
        <strong>Status:</strong> {status}
      </div>
      
      {errors.length > 0 && (
        <div style={{ marginTop: '20px', color: '#ff6b6b' }}>
          <strong>Errors:</strong>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '10px', border: '1px solid #444' }}>
        <p>If you see this page, the basic React app is working.</p>
        <p>Any errors above will help identify the production issue.</p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Try Main App
        </button>
      </div>
    </div>
  );
}