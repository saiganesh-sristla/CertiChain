// Create this as polyfills.js in your project

// Polyfill global
if (typeof window !== 'undefined') {
    window.global = window;
  }
  
  // Polyfill Buffer
  import { Buffer } from 'buffer';
  window.Buffer = Buffer;
  
  // Polyfill process
  window.process = window.process || {
    env: { NODE_ENV: 'production' },
    version: '',
    nextTick: function(cb) { setTimeout(cb, 0); }
  };