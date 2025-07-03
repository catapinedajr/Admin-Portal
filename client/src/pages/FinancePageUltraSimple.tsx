export default function FinancePageUltraSimple() {
  console.log("FinancePageUltraSimple component is rendering!");
  console.error("DEBUG: Component mounted on /money route");
  
  return (
    <div style={{ 
      backgroundColor: 'red', 
      color: 'white', 
      padding: '20px', 
      minHeight: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      overflow: 'auto'
    }}>
      <h1 style={{ fontSize: '48px', margin: '20px 0' }}>ULTRA SIMPLE FINANCE PAGE</h1>
      <p style={{ fontSize: '24px' }}>If you can see this, the route works but there's an issue with the complex component.</p>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>Current URL: {window.location.pathname}</p>
    </div>
  );
}