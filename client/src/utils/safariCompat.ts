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
  
  // Enhanced detection for desktop vs mobile Safari
  const isExternalAccess = window.parent === window;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isDesktopSafari = isSafari && !('ontouchstart' in window);
  const isMacSafari = isSafari && navigator.platform.indexOf('Mac') > -1;
  
  if (isExternalAccess || isSafari || isDesktopSafari || isMacSafari) {
    // More comprehensive React Refresh override
    window.$RefreshSig$ = function() { 
      return function(type: any, key?: string, forceReset?: boolean, getCustomHooks?: () => Array<any>) { 
        return type; 
      }; 
    };
    
    window.$RefreshReg$ = function(type: any, id: string) {};
    
    window.$RefreshRuntime$ = {
      register: function() {},
      createSignatureFunctionForTransform: function() { 
        return function() { 
          return function(type: any, key?: string, forceReset?: boolean, getCustomHooks?: () => Array<any>) { 
            return type; 
          }; 
        }; 
      },
      injectIntoGlobalHook: function() {},
      scheduleUpdate: function() {},
      performReactRefresh: function() {},
      setSignature: function() {},
      collectCustomHooksForSignature: function() { return []; }
    };
    
    // Force override any existing refresh globals
    Object.defineProperty(window, '$RefreshSig$', {
      value: window.$RefreshSig$,
      writable: false,
      configurable: false
    });
    
    if (isDesktopSafari || isMacSafari) {
      console.log('HODLearn: Desktop Safari compatibility mode enabled');
    } else {
      console.log('HODLearn: Safari compatibility mode enabled');
    }
  }
}

// Call immediately when module loads
initSafariCompat();