// Info: Rendering helpers for the Node gates: mount an element into a fresh
// jsdom container, serialize the accessibility-relevant shape of a subtree,
// and tear everything down between tests.

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const mounted = [];

// Update-loop tripwire (D43): every commit inside a render() act is counted
// through a Profiler, and past LIMIT the loop is aborted instead of running
// until the guard or Jetsam kills the process
let commits = 0;
const LIMIT = 2000;

// Attributes whose value is a list of element ids
const ID_REFERENCES = ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-activedescendant'];


/********************************************************************
Abort the current act when the commit counter is past the limit. The
count is reset as the error is raised so a caught failure does not keep
tripping later renders and cleanups.
*********************************************************************/
function checkCommits () {

  if (commits > LIMIT) {
    const count = commits;
    commits = 0;
    throw new Error('update loop: ' + count + ' commits in one render');
  }

}


/********************************************************************
Profiler onRender: one call per commit inside the wrapped tree. Throwing
past the limit breaks an effect-update loop inside a single act; because
the throw fires on every subsequent commit too, a React retry cannot
revive the loop.
*********************************************************************/
function onRender () {

  commits += 1;
  if (commits > LIMIT) {
    throw new Error('update loop: ' + commits + ' commits in one render');
  }

}


/********************************************************************
Render one element into a fresh container.

@param {Object} element - React element

@return {Promise<HTMLElement>} - The container
*********************************************************************/
export async function render (element) {

  commits = 0;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  mounted.push({ container: container, root: root });
  try {
    await act(async function () {
      root.render(React.createElement(React.Profiler, { id: 'harness', onRender: onRender }, element));
    });
  } finally {
    if (commits > LIMIT) {
      const index = mounted.findIndex(function (item) {
        return item.root === root;
      });
      if (index !== -1) {
        mounted.splice(index, 1);
      }
      root.unmount();
      container.remove();
    }
  }
  checkCommits();

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
    checkCommits();
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
      // Whitespace is compared empty-handed: a theme's format choice may
      // space a run ('4 / 100' vs '4/100') without changing what it says
      parts.push('text=' + JSON.stringify(ownText.replace(/\s/g, '')));
    }
    lines.push('  '.repeat(depth) + parts.join(' '));
    // An svg or an img-role node is one accessible node; its children are
    // drawing (ARIA marks an img's descendants presentational), and a set
    // may draw the same picture with a different number of them
    if (node.tagName.toLowerCase() === 'svg' || node.getAttribute('role') === 'img') {
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


/********************************************************************
Commit count of the in-flight (or last) render() act, for tests.

@return {Number} - Commits counted so far
*********************************************************************/
export function commitCount () {

  return commits;

}


export { React };
