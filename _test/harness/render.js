// Info: Rendering helpers for the Node gates: mount an element into a fresh
// jsdom container, serialize the accessibility-relevant shape of a subtree,
// and tear everything down between tests.

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const mounted = [];


/********************************************************************
Render one element into a fresh container.

@param {Object} element - React element

@return {Promise<HTMLElement>} - The container
*********************************************************************/
export async function render (element) {

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  mounted.push({ container: container, root: root });
  await act(async function () {
    root.render(element);
  });

  return container;

}


/********************************************************************
Unmount everything rendered so far.

@return {Promise<undefined>}
*********************************************************************/
export async function cleanup () {

  while (mounted.length > 0) {
    const item = mounted.pop();
    await act(async function () {
      item.root.unmount();
    });
    item.container.remove();
  }

}


/********************************************************************
Serialize the accessibility tree of a subtree: for every element, its tag,
role, every aria-* attribute, tabindex, disabled and text, in document
order. Styling attributes are excluded on purpose: a theme may change
how a thing looks, never what it is.

@param {HTMLElement} root - Subtree root

@return {Array} - One line per element
*********************************************************************/
export function a11yTree (root) {

  const lines = [];
  const walker = function (node, depth) {
    if (node.nodeType !== 1) {
      return;
    }
    const parts = [node.tagName.toLowerCase()];
    const names = Array.from(node.attributes).map(function (attribute) {
      return attribute.name;
    }).filter(function (name) {
      return name === 'role' || name.indexOf('aria-') === 0 || name === 'tabindex' || name === 'disabled' || name === 'type';
    }).sort();
    for (const name of names) {
      parts.push(name + '=' + node.getAttribute(name));
    }
    const ownText = Array.from(node.childNodes).filter(function (child) {
      return child.nodeType === 3;
    }).map(function (child) {
      return child.textContent.trim();
    }).filter(Boolean).join(' ');
    if (ownText) {
      parts.push('text=' + JSON.stringify(ownText));
    }
    lines.push('  '.repeat(depth) + parts.join(' '));
    // An svg is one accessible node; its paths are drawing, and a set may
    // draw the same glyph with a different number of them
    if (node.tagName.toLowerCase() === 'svg') {
      return;
    }
    for (const child of node.children) {
      walker(child, depth + 1);
    }
  };
  for (const child of root.children) {
    walker(child, 0);
  }

  return lines;

}


export { React };
