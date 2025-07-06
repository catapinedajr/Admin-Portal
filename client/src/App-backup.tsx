import { createRoot } from "react-dom/client";

function SimpleApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>HODLearn App Test</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert("React interactions work!")}>
        Test Button
      </button>
    </div>
  );
}

export default SimpleApp;