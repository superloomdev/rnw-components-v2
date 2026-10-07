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
@param {Object} [options]   - { measure }: lay cell bodies out as the reference page does;
                              { scheme }: 'light' (default) or 'dark'

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
    (options && options.measure ? '&measure=1' : '') + (options && options.scheme === 'dark' ? '&scheme=dark' : '');
  await page.goto('/' + query);
  await page.waitForFunction(function () {
    return window.__showcase && window.__showcase.ready === true;
  }, null, { timeout: 30000 });

  const status = await page.evaluate(function () {
    return window.__showcase;
  });

  return { status: status, theme: status.theme, consoleErrors: consoleErrors, pageErrors: pageErrors };

}


/********************************************************************
Open the reference page for one component and wait until it reports
ready.

@param {Object} page      - Playwright page
@param {String} component - Component name
@param {String} set       - 'primary' (default) | 'second': which reference set the page mounts
@param {String} [scheme]  - 'light' (default) | 'dark'

@return {Promise<Object>} - The page status ({ cells, unmeasured, errors })
*********************************************************************/
export async function openReference (page, component, set, scheme) {

  // The mobile upstream follows the platform's colour scheme, so a dark reference asks for it
  await page.emulateMedia({ colorScheme: scheme === 'dark' ? 'dark' : 'light' });
  await page.goto('/reference?component=' + component + '&measure=1&set=' + (set || 'primary') + (scheme === 'dark' ? '&scheme=dark' : ''));
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
pseudo-element's computed box; an upstream part whose text is styled by
another element (slotted text) names it in `styleOf`. A selector crosses
shadow roots with ' >>> '.

@param {Object} page   - Playwright page
@param {String} name   - Component name
@param {Object} parts  - `reference.parts`
@param {String} side   - 'ours' | 'upstream'
@param {String} origin - Optional part name coordinates are measured from
                         (default: the cell body)
@param {Object} [options] - { only }: measure the cell of this state label only;
                         { extended }: also read each box part's shadow, and the
                         ink of text and drawn paths (their colour with the
                         opacity of every element above them, shadow hosts
                         included), plus the part's box relative to the body
                         (`_bodyX`, `_bodyY`) for pixel sampling

@return {Promise<Object>} - state label -> part name -> measurement | null
*********************************************************************/
export async function readParts (page, name, parts, side, origin, options) {

  return page.evaluate(function (input) {
    const TYPE = ['color', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
    const BOX = ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'backgroundColor', 'borderBottomColor'];
    // A selector may cross shadow roots: segments joined by ' >>> ' are
    // resolved one at a time, each inside the previous match's shadow root
    const query = function (root, selector) {
      // Alternatives separated by a comma are tried in order
      for (const alternative of selector.split(/,\s*(?=[^)]*(?:\(|$))/)) {
        let current = root;
        const segments = alternative.split(' >>> ');
        for (let i = 0; i < segments.length; i++) {
          if (current === null) {
            break;
          }
          const scope = i === 0 ? current : (current.shadowRoot || current);
          current = scope.querySelector(segments[i]);
        }
        if (current !== null && current !== undefined) {
          return current;
        }
      }
      return null;
    };
    // The opacity an element is painted with: its own times every ancestor's, across shadow hosts
    const opacityOf = function (element, stop) {
      let value = 1;
      let node = element;
      while (node && node !== stop) {
        if (node.nodeType === 1) {
          value = value * parseFloat(getComputedStyle(node).opacity);
        }
        node = node.parentNode || node.host || null;
      }
      return value;
    };
    // A colour with an extra opacity folded into its alpha
    const withOpacity = function (color, opacity) {
      const match = /rgba?\(([^)]+)\)/.exec(color);
      if (!match) {
        return color;
      }
      const channels = match[1].split(',').map(function (value) {
        return parseFloat(value);
      });
      const alpha = Math.round((channels.length === 4 ? channels[3] : 1) * opacity * 100) / 100;
      return alpha >= 1 ? 'rgb(' + channels.slice(0, 3).join(', ') + ')' : 'rgba(' + channels.slice(0, 3).join(', ') + ', ' + alpha + ')';
    };
    const out = {};
    for (const cell of document.querySelectorAll('.cell[data-component="' + input.name + '"]')) {
      if (input.only && cell.getAttribute('data-state') !== input.only) {
        continue;
      }
      const body = cell.querySelector('[data-part="body"]');
      const bodyRect = body.getBoundingClientRect();
      const originElement = input.origin ? query(body, input.parts[input.origin][input.side]) : body;
      const origin = (originElement || body).getBoundingClientRect();
      const state = {};
      for (const partName of Object.keys(input.parts)) {
        const part = input.parts[partName];
        const element = query(body, part[input.side]);
        if (element === null) {
          state[partName] = null;
          continue;
        }
        const pseudo = input.side === 'upstream' && part.pseudo ? part.pseudo : null;
        // The text style may come from another element (the shadow element that styles slotted text)
        const styleSource = input.side === 'upstream' && part.styleOf ? query(body, part.styleOf) : element;
        const style = getComputedStyle(styleSource === null ? element : styleSource, pseudo);
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
          measured.characters = nodes.map(function (node) {
            return node.textContent;
          }).join('').trim().length;
        }
        for (const property of part.measure === 'box' ? [] : TYPE) {
          measured[property] = style[property];
        }
        // A visually hidden part (1px clip), an undisplayed or a transparent one draws nothing
        measured.visible = style.display !== 'none' && parseFloat(style.opacity) > 0 && (pseudo ? true : rect.width > 1 && rect.height > 1);
        if (input.extended) {
          const opacity = opacityOf(element, body);
          if (part.measure === 'box') {
            measured.boxShadow = style.boxShadow;
          }
          // A drawn path inks with its fill, text with its colour
          const ink = element instanceof SVGElement ? getComputedStyle(element).fill : part.measure === 'box' ? null : style.color;
          if (ink !== null) {
            measured.ink = withOpacity(ink, opacity);
          }
          measured._bodyX = (pseudo ? rect.x + parseFloat(style.left) : rect.x) - bodyRect.x;
          measured._bodyY = (pseudo ? rect.y + parseFloat(style.top) : rect.y) - bodyRect.y;
        }
        state[partName] = measured;
      }
      out[cell.getAttribute('data-state')] = state;
    }
    return out;
  }, { name: name, parts: parts, side: side, origin: origin || null, only: options && options.only ? options.only : null, extended: Boolean(options && options.extended) });

}


/********************************************************************
Put one cell's interactive element in an interaction state, the way a
person would: `hover` moves the pointer over it, `focus` focuses it from
the keyboard (so a keyboard-only focus ring shows), `pressed` holds the
pointer down on it. Wait for transitions and state layers to settle.

@param {Object} page        - Playwright page
@param {String} name        - Component name
@param {String} state       - The cell's state label
@param {String} selector    - The interactive element, relative to the cell body (' >>> ' not used here)
@param {String} interaction - 'hover' | 'focus' | 'pressed'

@return {Promise<Boolean>} - False when the cell or its element is not on the page
*********************************************************************/
export async function enterInteraction (page, name, state, selector, interaction) {

  const target = page.locator('.cell[data-component="' + name + '"][data-state="' + state + '"] [data-part="body"]').locator(selector).first();
  if (await target.count() === 0) {
    return false;
  }
  if (interaction === 'focus') {
    await page.keyboard.press('Shift');
    await target.focus();
  } else {
    await target.hover();
    if (interaction === 'pressed') {
      await page.mouse.down();
    }
  }
  await page.waitForTimeout(400);

  return true;

}


/********************************************************************
Leave an interaction state without completing a click: the pointer moves
off the element before it is released (so nothing toggles or opens),
focus leaves, and an opened popup is dismissed.

@param {Object} page - Playwright page

@return {Promise<void>}
*********************************************************************/
export async function leaveInteraction (page) {

  await page.mouse.move(0, 0);
  await page.mouse.up();
  await page.keyboard.press('Escape');
  await page.evaluate(function () {
    let active = document.activeElement;
    while (active && active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    if (active && active.blur) {
      active.blur();
    }
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  });
  await page.waitForTimeout(250);

}


/********************************************************************
Screenshot one cell's body with a margin, so a focus ring drawn outside
the element is in the picture.

@param {Object} page   - Playwright page
@param {String} name   - Component name
@param {String} state  - The cell's state label
@param {Number} margin - Pixels around the body

@return {Promise<Buffer|null>} - PNG, or null when the cell is absent
*********************************************************************/
export async function shootCell (page, name, state, margin) {

  const body = page.locator('.cell[data-component="' + name + '"][data-state="' + state + '"] [data-part="body"]').first();
  if (await body.count() === 0) {
    return null;
  }
  await body.scrollIntoViewIfNeeded();
  const box = await body.boundingBox();

  return page.screenshot({ clip: { x: Math.max(0, box.x - margin), y: Math.max(0, box.y - margin), width: box.width + 2 * margin, height: box.height + 2 * margin }, animations: 'disabled', scale: 'css' });

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


/********************************************************************
Read every drawn text run of every cell with its contrast against the
backdrop it is painted on: the text color (with the element's opacity)
composited over the nearest opaque fill behind it, as WCAG 1.4.3 reads
it. An input reports its value, or its placeholder through the
`::placeholder` style. A run inside a hidden or transparent subtree is
not drawn and is not reported.

@param {Object} page - Playwright page

@return {Promise<Array>} - [{ component, state, kind, text, color, fontSize,
  fontWeight, ratio, disabled }]; `kind` is text | value | placeholder;
  `color` is the computed color before compositing, for matching a token
*********************************************************************/
export async function readTextContrast (page) {

  return page.evaluate(function () {
    const parse = function (value) {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (match === null) {
        return null;
      }
      const parts = match[1].split(',').map(parseFloat);
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
    };
    const over = function (top, bottom) {
      const a = top.a;
      return { r: top.r * a + bottom.r * (1 - a), g: top.g * a + bottom.g * (1 - a), b: top.b * a + bottom.b * (1 - a), a: 1 };
    };
    const luminance = function (c) {
      const channel = function (v) {
        v = v / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
    };
    // The fills behind a node, nearest first, composited onto white (the page)
    const backdrop = function (node) {
      const layers = [];
      for (let current = node; current !== null; current = current.parentElement) {
        const fill = parse(getComputedStyle(current).backgroundColor);
        if (fill !== null && fill.a > 0) {
          layers.push(fill);
          if (fill.a === 1) {
            break;
          }
        }
      }
      let color = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = layers.length - 1; i >= 0; i--) {
        color = over(layers[i], color);
      }
      return color;
    };
    const undrawn = function (node, body) {
      for (let current = node; current !== null && current !== body; current = current.parentElement) {
        const style = getComputedStyle(current);
        if (style.opacity === '0' || style.visibility === 'hidden' || style.display === 'none') {
          return true;
        }
        if (current.getAttribute('aria-hidden') === 'true' && current.getBoundingClientRect().height === 0) {
          return true;
        }
      }
      return false;
    };
    const rows = [];
    for (const cell of document.querySelectorAll('.cell')) {
      const body = cell.querySelector('[data-part="body"]');
      const disabled = body.querySelector('[aria-disabled="true"], [disabled]') !== null;
      const runs = [];
      for (const node of body.querySelectorAll('*')) {
        if (undrawn(node, body)) {
          continue;
        }
        const own = Array.from(node.childNodes).some(function (child) {
          return child.nodeType === 3 && child.textContent.trim() !== '';
        });
        if (own) {
          runs.push({ node: node, text: node.textContent.trim(), kind: 'text' });
        }
        if (node.tagName === 'INPUT') {
          if (node.value) {
            runs.push({ node: node, text: node.value, kind: 'value' });
          } else if (node.placeholder) {
            runs.push({ node: node, text: node.placeholder, kind: 'placeholder' });
          }
        }
      }
      for (const run of runs) {
        const style = getComputedStyle(run.node, run.kind === 'placeholder' ? '::placeholder' : null);
        const raw = parse(style.color);
        const fill = backdrop(run.node);
        const opacity = parseFloat(getComputedStyle(run.node).opacity);
        const text = over({ r: raw.r, g: raw.g, b: raw.b, a: raw.a * opacity }, fill);
        const l1 = luminance(text);
        const l2 = luminance(fill);
        rows.push({
          component: cell.getAttribute('data-component'),
          state: cell.getAttribute('data-state'),
          kind: run.kind,
          text: run.text.slice(0, 40),
          color: style.color,
          fontSize: parseFloat(style.fontSize),
          fontWeight: parseInt(style.fontWeight, 10),
          ratio: Math.round((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) * 100) / 100,
          disabled: disabled
        });
      }
    }
    return rows;
  });

}


/********************************************************************
Read the paint of every cell's control: the fill, border color and text
color of its first interactive element, plus whether the cell is
disabled. Two cells of one component whose paint is identical cannot be
told apart; an enabled state must differ from every disabled one.

@param {Object} page - Playwright page

@return {Promise<Array>} - [{ component, state, disabled, paint }] for cells
  with an interactive element; `paint` is "fill | border | text"
*********************************************************************/
export async function readControlPaint (page) {

  return page.evaluate(function () {
    const ROLES = ['button', 'checkbox', 'combobox', 'link', 'menuitem', 'option', 'radio', 'slider', 'switch', 'tab', 'textbox'];
    const out = [];
    for (const cell of document.querySelectorAll('.cell')) {
      const body = cell.querySelector('[data-part="body"]');
      const control = Array.from(body.querySelectorAll('*')).find(function (node) {
        return ROLES.includes(node.getAttribute('role'));
      });
      if (control === undefined) {
        continue;
      }
      const style = getComputedStyle(control);
      // The first drawn text inside the control, or the control's own color
      const textNode = Array.from(control.querySelectorAll('*')).find(function (node) {
        return Array.from(node.childNodes).some(function (child) {
          return child.nodeType === 3 && child.textContent.trim() !== '';
        });
      });
      const text = getComputedStyle(textNode || control).color;
      // A border in the fill's own color, or transparent, is not seen
      const border = style.borderTopColor === style.backgroundColor || style.borderTopColor === 'rgba(0, 0, 0, 0)' || parseFloat(style.borderTopWidth) === 0 ? 'none' : style.borderTopColor;
      out.push({
        component: cell.getAttribute('data-component'),
        state: cell.getAttribute('data-state'),
        disabled: body.querySelector('[aria-disabled="true"], [disabled]') !== null,
        paint: style.backgroundColor + ' | ' + border + ' | ' + text
      });
    }
    return out;
  });

}
