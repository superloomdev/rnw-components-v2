// Info: The M5 pilot's reference probe. For each row name it bundles a probe
// page that mounts the row's upstream per `recipes/probe/<Row>.mount.js`,
// serves it with the pinned upstream stylesheet, applies the recipe's
// interactions, and writes `__dev__/evidence/0160/recipes/probe/<Row>.json`:
// per state, per recipe part, the box and computed styles the recipe reads.
// Not product code; run once before the build freezes a recipe.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { buildSync } from 'esbuild';
import { chromium } from 'playwright';
import { enterInteraction, leaveInteraction } from '../harness/page.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEST = resolve(HERE, '..');
const REPO = resolve(TEST, '..');
const RECIPES = resolve(REPO, '..', '__dev__', 'evidence', '0160', 'recipes');
const MODULES = join(TEST, 'node_modules');
const PORT = 5301;

const ROWS = process.argv.slice(2).filter(function (arg) { return arg.indexOf('--') !== 0; });

// The fields every part reports: its box, the computed properties the recipe
// measures, and the trimmed text
const PART_FIELDS = ['backgroundColor', 'borderColor', 'borderWidth', 'borderRadius', 'borderTopWidth', 'borderTopColor', 'borderBottomWidth', 'borderBottomColor', 'color', 'fill', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];

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
cell per recipe state, in the reference page's cell shape.

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
    body.style.width = (mount.bodyWidth || 320) + 'px';
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
fields, plus the pseudo-element the part names.

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
      if (rect.width === 0 && rect.height === 0 && input.optional === true) {
        continue;
      }
      const style = getComputedStyle(element, input.pseudo || null);
      const out = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      for (const field of input.fields) {
        out[field] = style[field];
      }
      out.text = element.textContent.trim();
      reads.push(out);
    }
    return input.all === true ? (reads.length > 0 ? reads : null) : (reads.length > 0 ? reads[0] : null);
  }, { row: row, state: state, selector: spec.selector, all: spec.all === true, optional: spec.optional === true, pseudo: spec.pseudo || null, fields: PART_FIELDS });

}


/********************************************************************
Probe one row: every state at rest, then each declared interaction, one
read of every recipe part per state.

@param {Object} page     - Playwright page
@param {String} row      - Row name
@param {Object} mount    - The mount file's export

@return {Object} - { states: { name: { rest, <interaction> } } }
*********************************************************************/
async function probeRow (page, row, mount) {

  const out = { states: {} };
  for (const state of Object.keys(mount.states)) {
    const reads = {};
    reads.rest = {};
    for (const part of Object.keys(mount.parts)) {
      reads.rest[part] = await readPart(page, row, state, part, mount.parts[part]);
    }
    if (mount.target !== null && mount.target !== undefined) {
      for (const interaction of mount.interactions) {
        const ok = await enterInteraction(page, row, state, mount.target, interaction, {});
        if (ok === false) {
          reads[interaction] = { targetMissing: true };
          continue;
        }
        await page.waitForTimeout(300);
        reads[interaction] = {};
        for (const part of Object.keys(mount.parts)) {
          reads[interaction][part] = await readPart(page, row, state, part, mount.parts[part]);
        }
        await leaveInteraction(page, {});
      }
    }
    out.states[state] = reads;
  }
  return out;

}


async function main () {

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
  }
  await browser.close();
  app.close();
  process.exit(0);

}

main().catch(function (error) {
  process.stderr.write(String(error && error.stack || error) + '\n');
  process.exit(1);
});
