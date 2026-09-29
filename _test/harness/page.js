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

@return {Promise<Object>} - { status, consoleErrors, pageErrors }
*********************************************************************/
export async function openShowcase (page, template, component) {

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

  const query = '?template=' + template + (component ? '&component=' + component : '');
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
Read every cell's identity and geometry.

@param {Object} page - Playwright page

@return {Promise<Array>} - [{ component, family, state, rect, bodyRect, children }]
*********************************************************************/
export async function readCells (page) {

  return page.evaluate(function () {
    return Array.from(document.querySelectorAll('.cell')).map(function (cell) {
      const body = cell.querySelector('[data-part="body"]');
      const rect = body.getBoundingClientRect();
      const children = Array.from(body.querySelectorAll('*')).map(function (node) {
        const r = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          tag: node.tagName.toLowerCase(),
          role: node.getAttribute('role'),
          rect: { x: r.x, y: r.y, width: r.width, height: r.height },
          text: node.children.length === 0 ? (node.textContent || '').trim() : '',
          overflow: style.overflow,
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
tabindex, disabled and text per element, svg as a leaf.

@param {Object} page - Playwright page

@return {Promise<Object>} - component/state -> lines
*********************************************************************/
export async function readA11yTrees (page) {

  return page.evaluate(function () {
    const out = {};
    for (const cell of document.querySelectorAll('.cell')) {
      const lines = [];
      const walk = function (node, depth) {
        const parts = [node.tagName.toLowerCase()];
        const names = Array.from(node.attributes).map(function (a) {
          return a.name;
        }).filter(function (name) {
          return name === 'role' || name.indexOf('aria-') === 0 || name === 'tabindex' || name === 'disabled' || name === 'type';
        }).sort();
        for (const name of names) {
          parts.push(name + '=' + node.getAttribute(name));
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
      for (const child of cell.querySelector('[data-part="body"]').children) {
        walk(child, 0);
      }
      out[cell.getAttribute('data-component') + '/' + cell.getAttribute('data-state')] = lines;
    }
    return out;
  });

}
