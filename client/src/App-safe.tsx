export default function AppSafe() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#18181b', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '2rem',
        borderBottom: '1px solid #374151',
        paddingBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            color: '#f97316', 
            fontWeight: 'bold', 
            fontSize: '1.5rem' 
          }}>HL</div>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            How-to-learn BTC
          </span>
        </div>
        <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          HODLearn Platform
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #f97316, #ea580c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome to HODLearn
          </h1>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your Bitcoin education journey starts here. Learn at your own pace through 
            structured daily lessons and interactive content.
          </p>
        </div>

        <div style={{ 
          textAlign: 'center',
          backgroundColor: '#27272a', 
          border: '1px solid #3f3f46',
          borderRadius: '12px',
          padding: '3rem'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            marginBottom: '1rem' 
          }}>
            System Restored Successfully
          </h2>
          <p style={{ 
            color: '#9ca3af', 
            marginBottom: '2rem',
            fontSize: '1.125rem'
          }}>
            The application is now working. The full authentication and learning system will be restored shortly.
          </p>
          <div style={{
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '1rem 2rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            ✓ HODLearn is Operational
          </div>
        </div>
      </main>
    </div>
  );
}