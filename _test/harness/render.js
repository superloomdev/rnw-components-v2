// Info: Rendering helpers for the Node gates: mount an element into a fresh
// jsdom container, serialize the accessibility-relevant shape of a subtree,
// and tear everything down between tests.

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const mounted = [];

// Attributes whose value is a list of element ids
const ID_REFERENCES = ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-activedescendant'];


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
Normalize a style value the way the DOM stores it, so a token value
(`#0f62fe`, `IBM Plex Sans`) compares equal to what a rendered element's
inline style reports (`rgb(15, 98, 254)`, `"IBM Plex Sans"`).

@param {String} property - Camel-case style property
@param {*}      value    - Token value

@return {String} - The DOM's serialization
*********************************************************************/
export function cssValue (property, value) {

  const probe = document.createElement('div');
  probe.style[property] = typeof value === 'number' ? value + 'px' : value;

  return probe.style[property];

}


/********************************************************************
Serialize the accessibility tree of a subtree: for every element, its tag,
role, every aria-* attribute, tabindex, disabled and text, in document
order. Styling attributes are excluded on purpose: a theme may change
how a thing looks, never what it is. An id reference (`aria-labelledby`,
`aria-controls`, ...) is serialized as the position of the element it
points at (`@3`, or `@missing`), because generated ids differ between
renders while the relation they express must not.

@param {HTMLElement} root - Subtree root

@return {Array} - One line per element
*********************************************************************/
export function a11yTree (root) {

  // Position of every element in document order, for id references
  const order = Array.from(root.querySelectorAll('*'));
  const refer = function (value) {
    return value.split(/\s+/).map(function (id) {
      const index = order.findIndex(function (element) {
        return element.id === id;
      });
      return index === -1 ? '@missing' : '@' + index;
    }).join(' ');
  };

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
      const value = node.getAttribute(name);
      parts.push(name + '=' + (ID_REFERENCES.includes(name) ? refer(value) : value));
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
