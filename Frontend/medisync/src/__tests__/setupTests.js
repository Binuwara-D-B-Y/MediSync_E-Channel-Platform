import { JSDOM } from 'jsdom';

// Ensure a DOM exists for tests when the environment didn't provide one
if (typeof global.document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  try {
    // some environments expose navigator as a read-only getter; try to define or set safely
    if (typeof global.navigator === 'undefined') {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'node.js' },
        writable: true,
        configurable: true,
        enumerable: true
      });
    } else {
      // attempt to set property if writable
      try { global.navigator.userAgent = 'node.js'; } catch { /* ignore */ }
    }
  } catch {
    /* ignore failures when environment restricts globals */
  }
  // copy properties from window to global
  Object.getOwnPropertyNames(dom.window).forEach((prop) => {
    if (typeof global[prop] === 'undefined') {
      try { global[prop] = dom.window[prop]; } catch { /* ignore */ }
    }
  });
}

// Minimal matchMedia shim
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  });
}

// Note: we intentionally avoid importing '@testing-library/jest-dom' here to prevent
// timing issues where that module expects the test runner to have already injected
// the `expect` global. Tests use standard assertions and DOM queries instead.
