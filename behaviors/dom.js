// Info: DOM reach helpers - the only file in the library that touches
// `document`, `window`, or a node's own DOM methods.
//
// A native host has no document or window and a native ref has no
// `contains`, `querySelector*` or `getBoundingClientRect`, so each helper
// duck-types its capability and answers a no-op or a neutral value where
// the API is absent: a walk on a React Native host must find no DOM
// error at all. Behavior on a DOM host is a pass-through of the same
// calls the callers made before.


/********************************************************************
Build the DOM reach helpers for one component system.

@param {Object} deps - { Utils }

@return {Object} - { getActiveElement, focusNode, blurNode, nodeContains, queryNode, queryNodes, measureRect, getViewportSize, getComputedStyleOf, onWindowEvent, onDocumentEvent, requestFrame }
*********************************************************************/
export default function createDomBehaviors (deps) {

  const Utils = deps.Utils;


  /********************************************************************
  The focused element of the document, or `null` where there is none.

  @return {Object|null} - `document.activeElement`, or `null` without a document
  *********************************************************************/
  function getActiveElement () {

    return typeof document === 'undefined' ? null : (document.activeElement || null);

  }


  /********************************************************************
  Focus a node that can take focus.

  @param {Object} node - DOM element or native ref

  @return {Boolean} - Whether `focus` was called
  *********************************************************************/
  function focusNode (node) {

    if (Utils.isNullOrUndefined(node) || typeof node.focus !== 'function') {
      return false;
    }
    node.focus();
    return true;

  }


  /********************************************************************
  Blur a node that can lose focus.

  @param {Object} node - DOM element or native ref

  @return {Boolean} - Whether `blur` was called
  *********************************************************************/
  function blurNode (node) {

    if (Utils.isNullOrUndefined(node) || typeof node.blur !== 'function') {
      return false;
    }
    node.blur();
    return true;

  }


  /********************************************************************
  Whether a node contains another.

  @param {Object} root - The candidate ancestor
  @param {Object} node - The candidate descendant

  @return {Boolean} - `false` without `contains` or a null node
  *********************************************************************/
  function nodeContains (root, node) {

    if (Utils.isNullOrUndefined(root) || Utils.isNullOrUndefined(node) || typeof root.contains !== 'function') {
      return false;
    }
    return root.contains(node);

  }


  /********************************************************************
  The first descendant matching a selector, or `null`.

  @param {Object} root - Node to query under
  @param {String} selector - CSS selector

  @return {Object|null} - The match, or `null` without `querySelector` or a match
  *********************************************************************/
  function queryNode (root, selector) {

    if (Utils.isNullOrUndefined(root) || typeof root.querySelector !== 'function') {
      return null;
    }
    return root.querySelector(selector);

  }


  /********************************************************************
  Every descendant matching a selector, as a real Array.

  @param {Object} root - Node to query under
  @param {String} selector - CSS selector

  @return {Array} - The matches, empty without `querySelectorAll`
  *********************************************************************/
  function queryNodes (root, selector) {

    if (Utils.isNullOrUndefined(root) || typeof root.querySelectorAll !== 'function') {
      return [];
    }
    return Array.prototype.slice.call(root.querySelectorAll(selector));

  }


  /********************************************************************
  A node's viewport-space rectangle, or `null` where it cannot be read.

  @param {Object} node - DOM element

  @return {Object|null} - `{ x, y, width, height }`, or `null` without `getBoundingClientRect`
  *********************************************************************/
  function measureRect (node) {

    if (Utils.isNullOrUndefined(node) || typeof node.getBoundingClientRect !== 'function') {
      return null;
    }
    const rect = node.getBoundingClientRect();
    return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };

  }


  /********************************************************************
  The viewport's size, zeros where there is no window.

  @return {Object} - `{ width, height }`
  *********************************************************************/
  function getViewportSize () {

    return {
      width: typeof window === 'undefined' ? 0 : window.innerWidth,
      height: typeof window === 'undefined' ? 0 : window.innerHeight
    };

  }


  /********************************************************************
  A node's computed style, or `null` where computed styles do not exist.

  @param {Object} node - DOM element

  @return {Object|null} - The style, or `null` without `window.getComputedStyle`
  *********************************************************************/
  function getComputedStyleOf (node) {

    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
      return null;
    }
    return window.getComputedStyle(node);

  }


  /********************************************************************
  Listen for a window event.

  @param {String} name - Event name
  @param {Function} handler - Listener
  @param {Boolean} [capture] - Capture phase

  @return {Function} - Unsubscribe; a no-op where there is no window
  *********************************************************************/
  function onWindowEvent (name, handler, capture) {

    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function' ||
        typeof window.removeEventListener !== 'function') {
      return function () {};
    }
    window.addEventListener(name, handler, capture);
    return function () {
      window.removeEventListener(name, handler, capture);
    };

  }


  /********************************************************************
  Listen for a document event.

  @param {String} name - Event name
  @param {Function} handler - Listener

  @return {Function} - Unsubscribe; a no-op where there is no document
  *********************************************************************/
  function onDocumentEvent (name, handler) {

    if (typeof document === 'undefined' || typeof document.addEventListener !== 'function' ||
        typeof document.removeEventListener !== 'function') {
      return function () {};
    }
    document.addEventListener(name, handler);
    return function () {
      document.removeEventListener(name, handler);
    };

  }


  /********************************************************************
  Run a callback on the next animation frame.

  @param {Function} callback - Frame callback

  @return {Function} - Cancel; a no-op where there is no animation frame
  *********************************************************************/
  function requestFrame (callback) {

    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function' ||
        typeof window.cancelAnimationFrame !== 'function') {
      return function () {};
    }
    const frame = window.requestAnimationFrame(callback);
    return function () {
      window.cancelAnimationFrame(frame);
    };

  }


  return {
    getActiveElement: getActiveElement,
    focusNode: focusNode,
    blurNode: blurNode,
    nodeContains: nodeContains,
    queryNode: queryNode,
    queryNodes: queryNodes,
    measureRect: measureRect,
    getViewportSize: getViewportSize,
    getComputedStyleOf: getComputedStyleOf,
    onWindowEvent: onWindowEvent,
    onDocumentEvent: onDocumentEvent,
    requestFrame: requestFrame
  };

}
