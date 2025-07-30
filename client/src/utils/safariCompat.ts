// Safari compatibility utilities for external preview access

declare global {
  interface Window {
    $RefreshSig$?: any;
    $RefreshReg$?: any;
    $RefreshRuntime$?: any;
  }
}

// Initialize React Refresh polyfills immediately
export function initSafariCompat() {
  if (typeof window === 'undefined') return;
  
  // Detect if we're in Safari separate tab (not embedded Replit preview)
  const isExternalAccess = window.parent === window;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isExternalAccess || isSafari) {
    // Override all React Refresh functions with no-ops
    window.$RefreshSig$ = function() { 
      return function(type: any) { return type; }; 
    };
    
    window.$RefreshReg$ = function() {};
    
    window.$RefreshRuntime$ = {
      register: function() {},
      createSignatureFunctionForTransform: function() { 
        return function() { return function(type: any) { return type; }; }; 
      },
      injectIntoGlobalHook: function() {},
      scheduleUpdate: function() {},
      performReactRefresh: function() {}
    };
    
  }
}

// Call immediately when module loads
initSafariCompat();