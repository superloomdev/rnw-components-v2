// Info: The M5 reference probe. For each row name it bundles a probe page
// that mounts the row's upstream per `recipes/probe/<Row>.mount.js`,
// serves it with the pinned upstream stylesheet, applies the recipe's
// interactions, and writes `__dev__/evidence/0160/recipes/probe/<Row>.json`:
// per state, per recipe part, the box and computed styles the recipe reads.
// A mount may frame its cell body (`bodyHeight`, `stage`), export `prepare`
// to settle a state before each read (to re-open a menu the probe's Escape
// closed), override the probe target and interactions per state (`$target`,
// `$interactions`), and declare `cells` so the probe also writes
// `<Row>.cells.txt` checking each upstream read against the three built
// templates; `--contract-check <cell> ...` prints that same resolution and
// exits without a browser. Not product code; run once before the build
// freezes a recipe.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { buildSync } from 'esbuild';
import { chromium } from 'playwright';
import { enterInteraction, leaveInteraction } from '../harness/page.js';
import { buildNative } from '../harness/system.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEST = resolve(HERE, '..');
const REPO = resolve(TEST, '..');
const RECIPES = resolve(REPO, '..', '__dev__', 'evidence', '0160', 'recipes');
const MODULES = join(TEST, 'node_modules');
const PORT = 5301;

const CHECK = process.argv.indexOf('--contract-check') !== -1;
const ROWS = process.argv.slice(2).filter(function (arg) { return arg.indexOf('--') !== 0; });

// The fields every part reports: its box, the computed properties the recipe
// measures, and the trimmed text
const PART_FIELDS = ['backgroundColor', 'borderColor', 'borderWidth', 'borderRadius', 'borderTopWidth', 'borderTopColor', 'borderBottomWidth', 'borderBottomColor', 'color', 'fill', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'boxShadow', 'outlineColor', 'outlineWidth', 'outlineStyle', 'outlineOffset', 'marginTop', 'marginBottom', 'minWidth', 'maxWidth', 'zIndex', 'transform', 'opacity', 'fontFamily', 'display', 'visibility'];

const FONT_ROOTS = {
  '/fonts/plex-sans/': join(MODULES, '@ibm', 'plex-sans', 'fonts'),
  '/fonts/plex-mono/': join(MODULES, '@ibm', 'plex-mono', 'fonts'),
  '/fonts/roboto/': join(MODULES, '@fontsource', 'roboto', 'files')
};
const FACES = [
  ['IBM Plex Sans', 300, '/fonts/plex-sans/complete/woff2/IBMPlexSans-Light.woff2'],
  ['IBM Plex Sans', 400, '/fonts/plex-sans/complete/woff2/IBMPlexSans-Regular.woff2'],
  ['IBM Plex Sans', 500, '/fonts/plex-sans/complete/woff2/IBMPlexSans-Medium.woff2'],
  ['IBM Plex Sans', 600, '/fonts/plex-sans/complete/woff2/IBMPlexSans-SemiBold.woff2'],
  ['IBM Plex Sans', 700, '/fonts/plex-sans/complete/woff2/IBMPlexSans-Bold.woff2'],
  ['IBM Plex Mono', 400, '/fonts/plex-mono/complete/woff2/IBMPlexMono-Regular.woff2'],
  ['IBM Plex Mono', 600, '/fonts/plex-mono/complete/woff2/IBMPlexMono-SemiBold.woff2'],
  ['Roboto', 400, '/fonts/roboto/roboto-latin-400-normal.woff2'],
  ['Roboto', 500, '/fonts/roboto/roboto-latin-500-normal.woff2'],
  ['Roboto', 700, '/fonts/roboto/roboto-latin-700-normal.woff2']
];
const FONT_CSS = FACES.map(function (face) {
  return '@font-face{font-family:"' + face[0] + '";font-style:normal;font-weight:' + face[1] + ';src:url(' + face[2] + ') format("woff2")}';
}).join('');
const LAYOUT_CSS = 'body{margin:0;padding:24px;background:#fff;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}' +
  '.grid{display:grid;grid-template-columns:max-content;grid-auto-rows:minmax(160px,max-content)}' +
  '.cell{display:inline-flex;flex-direction:column;gap:8px;padding:12px;box-sizing:border-box}' +
  '.cell-label{font:11px/16px system-ui;color:#666}.cell-body{display:inline-flex}';

// The upstream stylesheet with its CDN font URLs pointed at the pinned files,
// as serve.js serves it
function readUpstreamCss () {

  const css = readFileSync(join(MODULES, '@carbon', 'styles', 'css', 'styles.min.css'), 'utf8');
  const products = readFileSync(join(MODULES, '@carbon', 'ibm-products', 'css', 'index-without-carbon.min.css'), 'utf8');
  return (css + products).replace(/https:\/\/1\.www\.s81c\.com\/common\/carbon\/plex\/fonts\/IBM-Plex-([A-Za-z-]+)\/fonts\//g, function (match, family) {
    return '/fonts/plex-' + family.toLowerCase() + '/complete/woff2/';
  });

}


/********************************************************************
The generated probe page's entry: each row's mount file rendered as one
cell per recipe state, in the reference page's cell shape. A mount may
fix the body's height (`bodyHeight`) or stage it (`stage`: the body
becomes the containing block for the fixed or absolute layers inside
it), and `window.__probePrepare(row, state)` lets the driver call the
mount's `prepare(body, props)` for one cell.

@param {Array} rows - Row names

@return {String} - Entry source
*********************************************************************/
function probeEntry (rows) {

  const imports = rows.map(function (row) {
    return 'import ' + row + 'Mount from ' + JSON.stringify(join(RECIPES, 'probe', row + '.mount.js')) + ';';
  }).join('\n');
  const mounts = rows.map(function (row) {
    return '  ' + row + ': ' + row + 'Mount';
  }).join(',\n');
  return `import React from 'react';
import { createRoot } from 'react-dom/client';
import * as WebUpstream from '@carbon/react';
import * as UpstreamIcons from '@carbon/icons-react';
import { bodyCompact01, bodyCompact02, fontFamilies } from '@carbon/type';
import ICONS from ${JSON.stringify(join(REPO, 'data', 'icons.json'))};
${imports}
const MOUNTS = {
${mounts}
};
function icon (name) {
  const upstreamName = ICONS.icons[name].carbon.split('-').filter(Boolean).map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
  return UpstreamIcons[upstreamName];
}
const FIXTURE_TYPES = { bodyCompact01: bodyCompact01, bodyCompact02: bodyCompact02 };
function fixtureTextStyle (name) {
  const set = FIXTURE_TYPES[name];
  return {
    fontFamily: fontFamilies.sans,
    fontSize: set.fontSize,
    fontWeight: set.fontWeight,
    letterSpacing: set.letterSpacing,
    lineHeight: set.lineHeight
  };
}
const upstream = Object.assign({}, WebUpstream, { icon: icon, fixtureTextStyle: fixtureTextStyle });
window.__probePrepare = function (row, state) {
  const mount = MOUNTS[row];
  if (mount === undefined || typeof mount.prepare !== 'function') {
    return;
  }
  const body = document.querySelector('.cell[data-component="' + row + '"][data-state="' + state + '"] [data-part="body"]');
  if (body !== null) {
    mount.prepare(body, mount.states[state]);
  }
};
const root = document.getElementById('root');
document.body.classList.add('measure');
const grid = document.createElement('div');
grid.className = 'grid';
const cells = [];
Object.keys(MOUNTS).forEach(function (row) {
  const mount = MOUNTS[row];
  Object.keys(mount.states).forEach(function (state) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.component = row;
    cell.dataset.state = state;
    const label = document.createElement('div');
    label.className = 'cell-label';
    label.textContent = state;
    const body = document.createElement('div');
    body.className = 'cell-body';
    body.dataset.part = 'body';
    body.style.display = 'block';
    body.style.width = (mount.bodyWidth || 320) + 'px';
    if (typeof mount.bodyHeight === 'number') {
      body.style.height = mount.bodyHeight + 'px';
    }
    if (mount.stage === true) {
      body.style.transform = 'translateZ(0)';
    }
    const element = mount.mount(React, upstream, mount.states[state]);
    cell.appendChild(label);
    cell.appendChild(body);
    grid.appendChild(cell);
    cells.push(createRoot(body).render(element));
  });
});
root.appendChild(grid);
document.fonts.ready.then(function () {
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      window.__probe = { ready: true };
    });
  });
});
`;

}

const app = createServer(function (req, res) {

  const path = req.url.split('?')[0];
  if (path === '/probe-bundle.js') {
    res.writeHead(200, { 'content-type': 'text/javascript' });
    res.end(readFileSync(join(HERE, 'probe-bundle.js'), 'utf8'));
    return;
  }
  if (path === '/upstream.css') {
    res.writeHead(200, { 'content-type': 'text/css' });
    res.end(readUpstreamCss());
    return;
  }
  for (const prefix of Object.keys(FONT_ROOTS)) {
    if (path.indexOf(prefix) === 0) {
      const file = normalize(join(FONT_ROOTS[prefix], path.slice(prefix.length)));
      if (file.indexOf(FONT_ROOTS[prefix]) !== 0) {
        res.writeHead(403);
        res.end();
        return;
      }
      const data = readFileSync(file);
      res.writeHead(200, { 'content-type': 'font/woff2' });
      res.end(data);
      return;
    }
  }
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<!doctype html><html><head><meta charset="utf-8"><title>rnw-components reference probe</title>' +
    '<link rel="stylesheet" href="/upstream.css"><style>' + FONT_CSS + LAYOUT_CSS + '</style></head>' +
    '<body><div id="root"></div><script type="module" src="/probe-bundle.js"></script></body></html>');

});


/********************************************************************
Read one part of one state's cell: the box and the recipe's computed
fields, plus the pseudo-element the part names. A `pseudo` part has no
box of its own, so it is reported even when its host has no rect, keeping
the host's box fields; its own box reads through `cssWidth`, `cssHeight`,
`cssTop` and `cssLeft`.

@param {Object} page   - Playwright page
@param {String} row    - Row name
@param {String} state  - State name
@param {String} part   - Part name
@param {Object} spec   - { selector, all, optional, pseudo }

@return {Object|null} - The reading, or an array of readings for `all`
*********************************************************************/
async function readPart (page, row, state, part, spec) {

  return page.evaluate(function (input) {
    const body = document.querySelector('.cell[data-component="' + input.row + '"][data-state="' + input.state + '"] [data-part="body"]');
    if (body === null) {
      return null;
    }
    const nodes = input.all === true ? Array.from(body.querySelectorAll(input.selector)) : [body.querySelector(input.selector)];
    const reads = [];
    for (const element of nodes) {
      if (element === null) {
        if (input.optional !== true) {
          reads.push({ missing: true });
        }
        continue;
      }
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0 && input.optional === true && input.pseudo === null) {
        continue;
      }
      const style = getComputedStyle(element, input.pseudo || null);
      const out = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      for (const field of input.fields) {
        out[field] = style[field];
      }
      out.cssWidth = style.width;
      out.cssHeight = style.height;
      out.cssTop = style.top;
      out.cssLeft = style.left;
      out.text = element.textContent.trim();
      reads.push(out);
    }
    return input.all === true ? (reads.length > 0 ? reads : null) : (reads.length > 0 ? reads[0] : null);
  }, { row: row, state: state, selector: spec.selector, all: spec.all === true, optional: spec.optional === true, pseudo: spec.pseudo || null, fields: PART_FIELDS });

}


/********************************************************************
Call the mount's `prepare` for one cell, then wait for the opened layer
to settle. `leaveInteraction` presses Escape, which closes a menu a
state opened, so `prepare` runs before the rest read and again before
every interaction.

@param {Object} page   - Playwright page
@param {String} row    - Row name
@param {String} state  - State name
@param {Object} mount  - The mount file's export

@return {Promise<void>}
*********************************************************************/
async function prepare (page, row, state, mount) {

  if (typeof mount.prepare !== 'function') {
    return;
  }
  await page.evaluate(function (input) {
    window.__probePrepare(input.row, input.state);
  }, { row: row, state: state });
  await page.waitForTimeout(400);

}


/********************************************************************
Report any part reading that lies outside its cell's body box: a fixed
or absolute layer that did not stay inside the cell means a portal
escaped to the document. The body's box is read in the same scroll
position as the readings: `enterInteraction` scrolls the cell into view,
so a box read after `leaveInteraction` would sit in another frame.

@param {Object} page        - Playwright page
@param {String} row         - Row name
@param {String} state       - State name
@param {String} interaction - The bucket's interaction ('rest' or a name)
@param {Object} bucket      - The state's readings for that interaction

@return {Promise<void>}
*********************************************************************/
async function checkInsideBody (page, row, state, interaction, bucket) {

  const box = await page.evaluate(function (input) {
    const body = document.querySelector('.cell[data-component="' + input.row + '"][data-state="' + input.state + '"] [data-part="body"]');
    if (body === null) {
      return null;
    }
    const rect = body.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }, { row: row, state: state });
  if (box === null) {
    return;
  }
  for (const part of Object.keys(bucket)) {
    const reading = bucket[part];
    const list = Array.isArray(reading) ? reading : [reading];
    for (let i = 0; i < list.length; i = i + 1) {
      const r = list[i];
      if (r === null || r === undefined || typeof r !== 'object' || typeof r.x !== 'number' || (r.width === 0 && r.height === 0)) {
        continue;
      }
      if (r.x < box.x - 1 || r.y < box.y - 1 || r.x + r.width > box.x + box.width + 1 || r.y + r.height > box.y + box.height + 1) {
        process.stdout.write('note: ' + row + '/' + state + '/' + interaction + ' ' + part + (Array.isArray(reading) ? '[' + i + ']' : '') +
          ' lies outside its cell body ' + JSON.stringify(box) + ': ' + JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height }) + '\n');
        break;
      }
    }
  }

}


/********************************************************************
Probe one row: every state at rest, then each declared interaction, one
read of every recipe part per state. A state may replace the mount's
target and interactions (`$target`, `$interactions`; `[]` reads rest
only).

@param {Object} page     - Playwright page
@param {String} row      - Row name
@param {Object} mount    - The mount file's export

@return {Object} - { states: { name: { rest, <interaction> } } }
*********************************************************************/
async function probeRow (page, row, mount) {

  const out = { states: {} };
  for (const state of Object.keys(mount.states)) {
    const props = mount.states[state];
    const target = typeof props.$target === 'string' ? props.$target : mount.target;
    const interactions = Array.isArray(props.$interactions) ? props.$interactions : (mount.interactions || []);
    const reads = {};
    reads.rest = {};
    await prepare(page, row, state, mount);
    for (const part of Object.keys(mount.parts)) {
      reads.rest[part] = await readPart(page, row, state, part, mount.parts[part]);
    }
    await checkInsideBody(page, row, state, 'rest', reads.rest);
    if (target !== null && target !== undefined) {
      for (const interaction of interactions) {
        await prepare(page, row, state, mount);
        const ok = await enterInteraction(page, row, state, target, interaction, {});
        if (ok === false) {
          reads[interaction] = { targetMissing: true };
          continue;
        }
        await page.waitForTimeout(300);
        reads[interaction] = {};
        for (const part of Object.keys(mount.parts)) {
          reads[interaction][part] = await readPart(page, row, state, part, mount.parts[part]);
        }
        await checkInsideBody(page, row, state, interaction, reads[interaction]);
        await leaveInteraction(page, {});
      }
    }
    out.states[state] = reads;
  }
  return out;

}


/********************************************************************
Normalise a colour to lowercase `#rrggbb`, or `rgba(r,g,b,a)` with the
alpha to 3 places when it is under 1.

@param {*} value - A computed style or token value

@return {String|null} - The normalised colour, or null
*********************************************************************/
function toColour (value) {

  if (typeof value !== 'string') {
    return null;
  }
  const s = value.trim().toLowerCase();
  const hex = s.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  const channel = function (n) {
    const c = Math.round(n).toString(16);
    return c.length === 1 ? '0' + c : c;
  };
  if (hex !== null) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) {
      h = h.split('').map(function (c) { return c + c; }).join('');
    }
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return a >= 1 ? '#' + channel(r) + channel(g) + channel(b) : 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(3) + ')';
  }
  const rgb = s.match(/^rgba?\(([^)]*)\)$/);
  if (rgb !== null) {
    const parts = rgb[1].split(',').map(function (p) { return parseFloat(p); });
    const a = parts.length > 3 ? parts[3] : 1;
    return a >= 1 ? '#' + channel(parts[0]) + channel(parts[1]) + channel(parts[2]) : 'rgba(' + parts[0] + ',' + parts[1] + ',' + parts[2] + ',' + a.toFixed(3) + ')';
  }
  return null;

}


/********************************************************************
Normalise a length to a number: `40px` -> 40, `normal` -> 0 (the
letterSpacing keyword), a bare number passes through.

@param {*} value - A computed style or token value

@return {Number|null} - The length, or null
*********************************************************************/
function toLength (value) {

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const s = value.trim().toLowerCase();
  if (s === 'normal') {
    return 0;
  }
  const m = s.match(/^(-?\d+(?:\.\d+)?)(px|rem|em|pt|%)?$/);
  return m === null ? null : parseFloat(m[1]);

}


/********************************************************************
Whether a value is a shadow or other compound string that a single-token
check cannot compare - it is read, not matched.

@param {*} value - A computed style or token value

@return {Boolean}
*********************************************************************/
function isCompound (value) {

  if (value !== null && typeof value === 'object') {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  if (toColour(value) !== null || toLength(value) !== null) {
    return false;
  }
  return value.indexOf(' ') !== -1 || value.indexOf(',') !== -1 || value.indexOf('(') !== -1;

}


/********************************************************************
A value as one printable token: colours and lengths normalised, a type
token as `size/line/weight/tracking`, a shadow token as its string, an
icon token as `icon`.

@param {*} value - A computed style or token value

@return {String}
*********************************************************************/
function display (value) {

  if (value === undefined || value === null) {
    return '<missing>';
  }
  const colour = toColour(value);
  if (colour !== null) {
    return colour;
  }
  const length = toLength(value);
  if (length !== null) {
    return String(Math.round(length * 1000) / 1000);
  }
  if (typeof value === 'object') {
    if (typeof value.boxShadow === 'string') {
      return value.boxShadow;
    }
    if (typeof value.fontSize === 'number') {
      return displayType(value);
    }
    if (value.icon === true) {
      return 'icon';
    }
    return JSON.stringify(value);
  }
  return String(value);

}


/********************************************************************
A type reading or token as `size/line/weight/tracking`.

@param {Object} type - { fontSize, lineHeight, fontWeight, letterSpacing }

@return {String}
*********************************************************************/
function displayType (type) {

  const n = function (v) {
    const length = toLength(v);
    return length === null ? String(v) : String(Math.round(length * 1000) / 1000);
  };
  return n(type.fontSize) + '/' + n(type.lineHeight) + '/' + n(type.fontWeight) + '/' + n(type.letterSpacing);

}


/********************************************************************
Compare an upstream read with the carbon built value: MATCH (lengths
within 0.5, colours equal), MISMATCH, or READ when the value is a shadow
or other compound string a single-token check cannot compare.

@param {*} upstream - The probe reading's field value
@param {*} built    - The carbon token value

@return {String} - 'MATCH' | 'MISMATCH' | 'READ'
*********************************************************************/
function verdict (upstream, built) {

  const uc = toColour(upstream);
  const cc = toColour(built);
  if (uc !== null || cc !== null) {
    return uc !== null && cc !== null && uc === cc ? 'MATCH' : 'MISMATCH';
  }
  const ul = toLength(upstream);
  const cl = toLength(built);
  if (ul !== null && cl !== null) {
    return Math.abs(ul - cl) <= 0.5 ? 'MATCH' : 'MISMATCH';
  }
  if (isCompound(upstream) || isCompound(built)) {
    return 'READ';
  }
  if (ul !== null || cl !== null) {
    return 'MISMATCH';
  }
  return String(upstream) === String(built) ? 'MATCH' : 'MISMATCH';

}


/********************************************************************
Compare an upstream type read (fontSize/lineHeight/fontWeight/
letterSpacing) with a type cell: size, line and tracking within 0.5,
weight equal.

@param {Object} upstream - { fontSize, lineHeight, fontWeight, letterSpacing } numbers
@param {*}      built    - The carbon type token

@return {String} - 'MATCH' | 'MISMATCH'
*********************************************************************/
function typeVerdict (upstream, built) {

  if (built === null || built === undefined || typeof built !== 'object') {
    return 'MISMATCH';
  }
  const close = function (u, c) {
    return u !== null && c !== null && c !== undefined && Math.abs(u - toLength(c)) <= 0.5;
  };
  const uw = toLength(upstream.fontWeight);
  const cw = toLength(built.fontWeight);
  return close(upstream.fontSize, built.fontSize) && close(upstream.lineHeight, built.lineHeight) &&
    close(upstream.letterSpacing, built.letterSpacing) && uw !== null && cw !== null && uw === cw ? 'MATCH' : 'MISMATCH';

}


/********************************************************************
The cells check: for each of the mount's `cells` entries, read the
upstream value out of the row's probe result and the built value out of
the three templates, and print one verdict line.

@param {Object} mount  - The mount file's export
@param {Object} result - The row's probe result

@return {String} - The `.cells.txt` content
*********************************************************************/
function cellsCheck (mount, result) {

  const built = {
    carbon: buildNative('carbon').tokens,
    default: buildNative('default').tokens,
    material: buildNative('material').tokens
  };
  const counts = { MATCH: 0, MISMATCH: 0, READ: 0, ABSENT: 0 };
  const lines = [];
  for (const entry of mount.cells) {
    const state = entry.state || Object.keys(mount.states)[0];
    const interaction = entry.interaction || 'rest';
    const spec = mount.parts[entry.part] || {};
    const index = spec.all === true ? (entry.index || 0) : undefined;
    const bucket = result.states[state] === undefined ? undefined : result.states[state][interaction];
    let reading = bucket === undefined || bucket === null || typeof bucket !== 'object' ? undefined : bucket[entry.part];
    if (Array.isArray(reading)) {
      reading = reading[index === undefined ? 0 : index];
    }
    const carbon = built.carbon[entry.cell];
    const fallback = built['default'][entry.cell];
    const material = built.material[entry.cell];
    let mark;
    let upstream;
    if (reading === undefined || reading === null || reading.missing === true) {
      mark = 'ABSENT';
      upstream = '<absent>';
    } else if (entry.read === true) {
      mark = 'READ';
      upstream = entry.prop === 'type'
        ? displayType({ fontSize: reading.fontSize, lineHeight: reading.lineHeight, fontWeight: reading.fontWeight, letterSpacing: reading.letterSpacing })
        : display(reading[entry.prop]);
    } else if (entry.prop === 'type') {
      const type = {
        fontSize: toLength(reading.fontSize),
        lineHeight: toLength(reading.lineHeight),
        fontWeight: toLength(reading.fontWeight),
        letterSpacing: toLength(reading.letterSpacing)
      };
      mark = typeVerdict(type, carbon);
      upstream = displayType(type);
    } else {
      mark = verdict(reading[entry.prop], carbon);
      upstream = display(reading[entry.prop]);
    }
    counts[mark] = counts[mark] + 1;
    const label = entry.part + (index === undefined ? '' : '[' + index + ']') + '.' + entry.prop;
    lines.push(mark + '  ' + label + '  ' + state + '/' + interaction + '  ' + entry.cell +
      '  upstream=' + upstream + '  carbon=' + display(carbon) + '  default=' + display(fallback) + '  material=' + display(material) +
      (display(fallback) !== display(carbon) ? '  default!=carbon' : ''));
  }
  lines.push('MATCH ' + counts.MATCH + '  MISMATCH ' + counts.MISMATCH + '  READ ' + counts.READ + '  ABSENT ' + counts.ABSENT);
  return lines.join('\n') + '\n';

}


/********************************************************************
`--contract-check`: resolve each named cell in the three built
templates and print one line per name, without a browser.

@param {Array} names - Cell names

@return {void}
*********************************************************************/
function contractCheck (names) {

  const built = {
    carbon: buildNative('carbon').tokens,
    default: buildNative('default').tokens,
    material: buildNative('material').tokens
  };
  for (const name of names) {
    const carbon = built.carbon[name];
    const fallback = built['default'][name];
    const material = built.material[name];
    const ok = carbon !== undefined && carbon !== null && fallback !== undefined && fallback !== null && material !== undefined && material !== null;
    process.stdout.write((ok ? 'OK' : 'MISSING') + ' ' + name + '  carbon=' + display(carbon) + '  default=' + display(fallback) + '  material=' + display(material) + '\n');
  }

}


async function main () {

  if (CHECK === true) {
    contractCheck(ROWS);
    return;
  }
  mkdirSync(join(RECIPES, 'probe'), { recursive: true });
  const entry = probeEntry(ROWS);
  writeFileSync(join(HERE, 'probe-entry.generated.js'), entry);
  buildSync({
    entryPoints: [join(HERE, 'probe-entry.generated.js')],
    bundle: true,
    format: 'esm',
    outfile: join(HERE, 'probe-bundle.js'),
    platform: 'browser',
    alias: {
      'react-native': 'react-native-web',
      'node:module': './harness/node-module-stub.js',
      '@react-native/assets-registry/registry': 'react-native-web/dist/modules/AssetRegistry/index.js'
    },
    resolveExtensions: ['.web.js', '.js', '.json'],
    define: {
      'process.env.NODE_ENV': '"development"',
      'global': 'globalThis',
      '__DEV__': 'true'
    },
    logLevel: 'warning'
  });
  await new Promise(function (done) { app.listen(PORT, done); });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 2400 } });
  const mounts = {};
  for (const row of ROWS) {
    mounts[row] = (await import(join(RECIPES, 'probe', row + '.mount.js'))).default;
  }
  await page.goto('http://localhost:' + PORT + '/');
  await page.waitForFunction(function () { return window.__probe && window.__probe.ready === true; }, null, { timeout: 30000 });
  await page.waitForTimeout(400);
  for (const row of ROWS) {
    const result = await probeRow(page, row, mounts[row]);
    const file = join(RECIPES, 'probe', row + '.json');
    writeFileSync(file, JSON.stringify(result, null, 2) + '\n');
    process.stdout.write('wrote ' + file + '\n');
    if (Array.isArray(mounts[row].cells)) {
      const cellsFile = join(RECIPES, 'probe', row + '.cells.txt');
      writeFileSync(cellsFile, cellsCheck(mounts[row], result));
      process.stdout.write('wrote ' + cellsFile + '\n');
    }
  }
  await browser.close();
  app.close();
  process.exit(0);

}

main().catch(function (error) {
  process.stderr.write(String(error && error.stack || error) + '\n');
  process.exit(1);
});
