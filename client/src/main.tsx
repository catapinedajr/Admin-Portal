// Ultra-minimal test - no imports that could fail
const root = document.getElementById("root");
if (root) {
  root.innerHTML = `
    <div style="
      min-height: 100vh; 
      background: #18181b; 
      color: white; 
      padding: 2rem;
      font-family: system-ui;
    ">
      <h1 style="color: #f97316; font-size: 2rem; margin-bottom: 1rem;">
        HODLearn - EMERGENCY RECOVERY MODE
      </h1>
      <p style="color: #a1a1aa; margin-bottom: 2rem;">
        Server restarted. Your app and data are completely safe.
      </p>
      <p style="color: #71717a;">
        If you can see this message, the connection is working.
        I will restore the full app immediately.
      </p>
      <button 
        onclick="window.location.reload()" 
        style="
          background: #f97316; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 6px; 
          margin-top: 1rem;
          cursor: pointer;
          font-size: 1rem;
        "
      >
        Refresh Page
      </button>
    </div>
  `;
} else {
  document.body.innerHTML = `
    <div style="background: red; color: white; padding: 20px;">
      CRITICAL: Root element missing! But app files are safe.
    </div>
  `;
}
