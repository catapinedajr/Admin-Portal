// Ultra-minimal production test
import { useState } from "react";

export default function MinimalApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid #333'
      }}>
        <h1 style={{
          fontSize: '36px',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          HODLearn
        </h1>
        
        <p style={{ fontSize: '18px', marginBottom: '24px', color: '#cccccc' }}>
          Production deployment is working correctly!
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              margin: '0 8px'
            }}
          >
            Count: {count}
          </button>
        </div>
        
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#1a1a1a', 
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ margin: '0', color: '#22c55e', fontSize: '14px' }}>
            ✅ React state management working
          </p>
          <p style={{ margin: '8px 0 0 0', color: '#22c55e', fontSize: '14px' }}>
            ✅ CSS styling rendering properly  
          </p>
          <p style={{ margin: '8px 0 0 0', color: '#22c55e', fontSize: '14px' }}>
            ✅ JavaScript bundle loading successfully
          </p>
        </div>
        
        <p style={{ 
          marginTop: '24px', 
          fontSize: '14px', 
          color: '#888',
          fontStyle: 'italic'
        }}>
          Minimal production test - ready for full deployment
        </p>
      </div>
    </div>
  );
}