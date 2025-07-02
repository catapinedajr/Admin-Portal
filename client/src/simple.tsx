// Minimal test app for production deployment
export default function SimpleApp() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1a1a1a',
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>HODLearn</h1>
      <p>Production deployment working!</p>
      <p style={{ color: '#f97316' }}>App is loading successfully.</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => alert('React is working!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}