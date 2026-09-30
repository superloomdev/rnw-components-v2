// Info: Shared Playwright helpers: open the showcase for one template, wait
// for readiness, and collect console and page errors. Every spec asserts the
// page rendered its cells before measuring anything, so a blank page never
// passes.

export const TEMPLATE_NAMES = ['default', 'carbon', 'material'];


/********************************************************************
Open the showcase for a template and wait until it reports ready.

@param {Object} page       - Playwright page
@param {String} template   - Template name
@param {String} [component] - Restrict to one component
@param {Object} [options]   - { measure }: lay cell bodies out as the reference page does

@return {Promise<Object>} - { status, consoleErrors, pageErrors }
*********************************************************************/
export async function openShowcase (page, template, component, options) {

  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', function (message) {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', function (error) {
    pageErrors.push(String(error.message || error));
  });

  const query = '?template=' + template + (component ? '&component=' + component : '') +
    (options && options.measure ? '&measure=1' : '');
  await page.goto('/' + query);
  await page.waitForFunction(function () {
    return window.__showcase && window.__showcase.ready === true;
  }, null, { timeout: 30000 });

  const status = await page.evaluate(function () {
    return window.__showcase;
  });

  return { status: status, consoleErrors: consoleErrors, pageErrors: pageErrors };

}


/********************************************************************
Open the reference page for one component and wait until it reports
ready.

@param {Object} page      - Playwright page
@param {String} component - Component name

@return {Promise<Object>} - The page status ({ cells, unmeasured, errors })
*********************************************************************/
export async function openReference (page, component) {

  await page.goto('/reference?component=' + component + '&measure=1');
  await page.waitForFunction(function () {
    return window.__reference && window.__reference.ready === true;
  }, null, { timeout: 30000 });

  return page.evaluate(function () {
    return window.__reference;
  });

}


/********************************************************************
Measure the named parts of every cell of one component, on either page.
A part is found by its selector for that side within the cell body. A
`box` part reports its rect relative to the body, border widths, corner
radius, fill, border color and any drawn outline; a `text` part reports the rect of its own
text nodes and the text style of its element; a `type` part reports the
text style only. An upstream part drawn on a pseudo-element reads that
pseudo-element's computed box.

@param {Object} page  - Playwright page
@param {String} name  - Component name
@param {Object} parts - `reference.parts`
@param {String} side  - 'ours' | 'upstream'

@return {Promise<Object>} - state label -> part name -> measurement | null
*********************************************************************/
export async function readParts (page, name, parts, side) {

  return page.evaluate(function (input) {
    const TYPE = ['color', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
    const BOX = ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'backgroundColor', 'borderBottomColor'];
    const out = {};
    for (const cell of document.querySelectorAll('.cell[data-component="' + input.name + '"]')) {
      const body = cell.querySelector('[data-part="body"]');
      const origin = body.getBoundingClientRect();
      const state = {};
      for (const partName of Object.keys(input.parts)) {
        const part = input.parts[partName];
        const element = body.querySelector(part[input.side]);
        if (element === null) {
          state[partName] = null;
          continue;
        }
        const pseudo = input.side === 'upstream' && part.pseudo ? part.pseudo : null;
        const style = getComputedStyle(element, pseudo);
        const rect = element.getBoundingClientRect();
        const measured = {};
        if (part.measure === 'box') {
          measured.x = rect.x - origin.x + (pseudo ? parseFloat(style.left) : 0);
          measured.y = rect.y - origin.y + (pseudo ? parseFloat(style.top) : 0);
          measured.width = pseudo ? parseFloat(style.width) : rect.width;
          measured.height = pseudo ? parseFloat(style.height) : rect.height;
          for (const property of BOX) {
            measured[property] = style[property];
          }
          // A drawn outline (a ring) as one value; none when not drawn or transparent
          const ring = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0 && style.outlineColor !== 'rgba(0, 0, 0, 0)';
          measured.outline = ring ? style.outlineWidth + ' ' + style.outlineColor + ' offset ' + style.outlineOffset : 'none';
        }
        if (part.measure === 'text') {
          const nodes = Array.from(element.childNodes).filter(function (node) {
            return node.nodeType === 3 && node.textContent.trim() !== '';
          });
          if (nodes.length === 0) {
            state[partName] = null;
            continue;
          }
          const range = document.createRange();
          range.setStartBefore(nodes[0]);
          range.setEndAfter(nodes[nodes.length - 1]);
          const box = range.getBoundingClientRect();
          measured.x = box.x - origin.x;
          measured.y = box.y - origin.y;
          measured.width = box.width;
          measured.height = box.height;
          measured.fontFamily = style.fontFamily.split(',')[0].replace(/["']/g, '').trim();
        }
        for (const property of part.measure === 'box' ? [] : TYPE) {
          measured[property] = style[property];
        }
        // A visually hidden part (1px clip) or an undisplayed one draws nothing
        measured.visible = style.display !== 'none' && (pseudo ? true : rect.width > 1 && rect.height > 1);
        state[partName] = measured;
      }
      out[cell.getAttribute('data-state')] = state;
    }
    return out;
  }, { name: name, parts: parts, side: side });

}


/********************************************************************
Read every cell's identity and geometry.

@param {Object} page - Playwright page

@return {Promise<Array>} - [{ component, family, state, rect, children }]; each child
  carries `undrawn` when nothing of it is painted
*********************************************************************/
export async function readCells (page) {

  return page.evaluate(function () {
    return Array.from(document.querySelectorAll('.cell')).map(function (cell) {
      const body = cell.querySelector('[data-part="body"]');
      const rect = body.getBoundingClientRect();
      // An element draws nothing when it or an ancestor in the cell is fully
      // transparent or hidden, or sits in a zero-height aria-hidden sizer
      const isUndrawn = function (node) {
        for (let current = node; current !== null && current !== body; current = current.parentElement) {
          const style = getComputedStyle(current);
          if (style.opacity === '0' || style.visibility === 'hidden') {
            return true;
          }
          if (current.getAttribute('aria-hidden') === 'true' && current.getBoundingClientRect().height === 0) {
            return true;
          }
        }
        return false;
      };
      const children = Array.from(body.querySelectorAll('*')).map(function (node) {
        const r = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          undrawn: isUndrawn(node),
          tag: node.tagName.toLowerCase(),
          role: node.getAttribute('role'),
          rect: { x: r.x, y: r.y, width: r.width, height: r.height },
          text: node.children.length === 0 ? (node.textContent || '').trim() : '',
          overflow: style.overflow,
          textOverflow: style.textOverflow,
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth,
          scrollHeight: node.scrollHeight,
          clientHeight: node.clientHeight,
          units: Array.from(node.style).map(function (prop) {
            return prop + ':' + node.style.getPropertyValue(prop);
          })
        };
      });
      return {
        component: cell.getAttribute('data-component'),
        family: cell.getAttribute('data-family'),
        state: cell.getAttribute('data-state'),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        children: children
      };
    });
  });

}


/********************************************************************
Serialize the accessibility tree of every cell body: tag, role, aria-*,
tabindex, disabled and text per element, svg as a leaf. An id reference
is serialized as the position of the element it points at (`@3`, or
`@missing`): generated ids differ between renders, the relation must not.

@param {Object} page - Playwright page

@return {Promise<Object>} - component/state -> lines
*********************************************************************/
export async function readA11yTrees (page) {

  return page.evaluate(function () {
    const out = {};
    const REFERENCES = ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-activedescendant'];
    for (const cell of document.querySelectorAll('.cell')) {
      const body = cell.querySelector('[data-part="body"]');
      const order = Array.from(body.querySelectorAll('*'));
      const refer = function (value) {
        return value.split(/\s+/).map(function (id) {
          const index = order.findIndex(function (element) {
            return element.id === id;
          });
          return index === -1 ? '@missing' : '@' + index;
        }).join(' ');
      };
      const lines = [];
      const walk = function (node, depth) {
        const parts = [node.tagName.toLowerCase()];
        const names = Array.from(node.attributes).map(function (a) {
          return a.name;
        }).filter(function (name) {
          return name === 'role' || name.indexOf('aria-') === 0 || name === 'tabindex' || name === 'disabled' || name === 'type';
        }).sort();
        for (const name of names) {
          const value = node.getAttribute(name);
          parts.push(name + '=' + (REFERENCES.includes(name) ? refer(value) : value));
        }
        const text = Array.from(node.childNodes).filter(function (c) {
          return c.nodeType === 3;
        }).map(function (c) {
          return c.textContent.trim();
        }).filter(Boolean).join(' ');
        if (text) {
          parts.push('text=' + JSON.stringify(text));
        }
        lines.push('  '.repeat(depth) + parts.join(' '));
        if (node.tagName.toLowerCase() === 'svg') {
          return;
        }
        for (const child of node.children) {
          walk(child, depth + 1);
        }
      };
      for (const child of body.children) {
        walk(child, 0);
      }
      out[cell.getAttribute('data-component') + '/' + cell.getAttribute('data-state')] = lines;
    }
    return out;
  });

}
