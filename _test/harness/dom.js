// Info: Bootstrap jsdom globals so react-native-web can render in Node.
//
// RNW's createCSSStyleSheet needs ShadowRoot; navigator must be set
// via defineProperty because it is getter-only on modern Node.

import { JSDOM } from 'jsdom';


const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true
});

const GLOBALS = [
  'window', 'document', 'HTMLElement', 'Event', 'MouseEvent',
  'KeyboardEvent', 'getComputedStyle', 'ShadowRoot', 'Node',
  'Element', 'CSSStyleSheet', 'requestAnimationFrame',
  'cancelAnimationFrame', 'MutationObserver', 'CustomEvent',
  'HTMLDivElement', 'HTMLSpanElement', 'HTMLInputElement',
  'HTMLTextAreaElement', 'HTMLButtonElement', 'HTMLAnchorElement',
  'HTMLImageElement', 'HTMLLabelElement', 'HTMLFormElement',
  'ResizeObserver', 'IntersectionObserver', 'matchMedia',
  'DOMRect', 'Range', 'Selection', 'SVGElement'
];

for (let i = 0; i < GLOBALS.length; i++) {
  const name = GLOBALS[i];

  // Node 24 defines its own Event and CustomEvent classes. They are not
  // instances of jsdom's window.Event, so jsdom dispatchEvent rejects them
  // before React or the behavior under test runs. DOM constructors must come
  // from the same realm as the document even when Node has a global with the
  // same standardized name.
  const requiresDomRealm = name === 'Event' || name === 'CustomEvent';
  if (dom.window[name] !== undefined && (global[name] === undefined || requiresDomRealm)) {
    global[name] = dom.window[name];
  }
}

// navigator is getter-only on modern Node - must use defineProperty
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
  writable: true
});

// Stubs for APIs jsdom does not implement but RNW may reference
// React needs this flag to treat act() as an act scope. Without it React warns
// "The current testing environment is not configured to support act(...)" and
// act() does not reliably flush effects and their state updates - so a snapshot
// taken right after act() can show a pre-effect render. Every assertion that
// reads a tree after act() depends on this, so it belongs in the harness rather
// than in individual tests.
global.IS_REACT_ACT_ENVIRONMENT = true;

if (typeof global.requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = function (cb) { return setTimeout(cb, 0); };
  global.cancelAnimationFrame = function (id) { clearTimeout(id); };
}

if (typeof global.matchMedia === 'undefined') {
  global.matchMedia = function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {}
    };
  };
}

if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = function () {
    return { observe: function () {}, unobserve: function () {}, disconnect: function () {} };
  };
  dom.window.ResizeObserver = global.ResizeObserver;
}

if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = function () {
    return { observe: function () {}, unobserve: function () {}, disconnect: function () {} };
  };
}


export { dom };
export const window = dom.window;
export const document = dom.window.document;
