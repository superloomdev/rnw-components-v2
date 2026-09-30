// Info: Static server for the browser gates. Serves two pages and what they
// load, all from this directory and the pinned packages in node_modules:
//
//   /             the showcase: our components under ?template=, built from bundle.js
//   /reference    the upstream components the measurement gates compare against,
//                 built from reference-bundle.js with the upstream stylesheet
//   /fonts/...    the font files both pages declare, so text is drawn in the
//                 family the theme names and never falls back to a browser default
//
// The upstream stylesheet loads its fonts from a CDN; it is served with those
// URLs pointed at the same pinned files, so the gates never touch the network.
// Not product code; a local test harness.

import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULES = join(HERE, '..', 'node_modules');
export const PORT = 5299;

// URL prefix -> directory of font files
const FONT_ROOTS = {
  '/fonts/plex-sans/': join(MODULES, '@ibm', 'plex-sans', 'fonts'),
  '/fonts/plex-mono/': join(MODULES, '@ibm', 'plex-mono', 'fonts'),
  '/fonts/roboto/': join(MODULES, '@fontsource', 'roboto', 'files')
};

// The families the three templates name, declared once for both pages
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
  ['Roboto', 700, '/fonts/roboto/roboto-latin-700-normal.woff2'],
  // The mobile upstream names each weight as its own family, as native font files do
  ['IBMPlexSans-Light', 300, '/fonts/plex-sans/complete/woff2/IBMPlexSans-Light.woff2'],
  ['IBMPlexSans-Regular', 400, '/fonts/plex-sans/complete/woff2/IBMPlexSans-Regular.woff2'],
  ['IBMPlexSans-SemiBold', 600, '/fonts/plex-sans/complete/woff2/IBMPlexSans-SemiBold.woff2'],
  ['IBMPlexMono', 400, '/fonts/plex-mono/complete/woff2/IBMPlexMono-Regular.woff2']
];
const FONT_CSS = FACES.map(function (face) {
  return '@font-face{font-family:"' + face[0] + '";font-style:normal;font-weight:' + face[1] + ';src:url(' + face[2] + ') format("woff2")}';
}).join('');

// The body sets no font: the upstream stylesheet sets its own on the body,
// and our components set theirs on every text element. Both pages render
// text with the same smoothing the upstream stylesheet asks for, and every
// layout box around a cell has an explicit whole-pixel size (the upstream
// stylesheet resets margins and line heights), so a cell sits on the same
// pixel grid on both pages and a pixel comparison sees the component only
const LAYOUT_CSS = 'body{margin:0;padding:24px;background:#fff;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}' +
  'h2{margin:0 0 12px;font:600 16px/24px system-ui}' +
  '.family{margin:0 0 32px}.grid{display:flex;flex-wrap:wrap;gap:24px}' +
  '.cell{display:inline-flex;flex-direction:column;gap:8px;padding:12px;border:1px dashed #ccc;box-sizing:border-box}' +
  '.cell-label{font:11px/16px system-ui;color:#666}.cell-body{display:inline-flex}' +
  // Measurement layout: one cell per row on a fixed row pitch, so every cell
  // body starts on a whole pixel whatever the fractional sizes before it
  '.measure .grid{display:grid;grid-template-columns:max-content;grid-auto-rows:160px}';


/********************************************************************
Build one page.

@param {String} title  - Page title
@param {String} script - Bundle path
@param {String} head   - Extra head markup

@return {String} - HTML
*********************************************************************/
function page (title, script, head) {

  return '<!doctype html><html><head><meta charset="utf-8"><title>' + title + '</title>' + head +
    '<style>' + FONT_CSS + LAYOUT_CSS + '</style></head><body><div id="root"></div>' +
    '<script type="module" src="' + script + '"></script></body></html>';

}

const SHOWCASE = page('rnw-components showcase', '/bundle.js', '');
const REFERENCE = page('rnw-components reference', '/reference-bundle.js', '<link rel="stylesheet" href="/upstream.css">');


/********************************************************************
The upstream stylesheet with its CDN font URLs pointed at the pinned
files (`.../IBM-Plex-Sans/fonts/` -> `/fonts/plex-sans/`).

@return {String} - CSS
*********************************************************************/
function readUpstreamCss () {

  const css = readFileSync(join(MODULES, '@carbon', 'styles', 'css', 'styles.min.css'), 'utf8');

  return css.replace(/https:\/\/1\.www\.s81c\.com\/common\/carbon\/plex\/fonts\/IBM-Plex-([A-Za-z-]+)\/fonts\//g, function (match, family) {
    return '/fonts/plex-' + family.toLowerCase() + '/';
  });

}


/********************************************************************
Send a file, or 404.

@param {Object} res  - Response
@param {String} file - Absolute path
@param {String} type - Content type
*********************************************************************/
function send (res, file, type) {

  if (!existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': type });
  res.end(readFileSync(file));

}


const server = createServer(function (req, res) {

  const path = req.url.split('?')[0];

  // Bundles, built by `npm run bundle`
  if (path === '/bundle.js' || path === '/reference-bundle.js') {
    const file = join(HERE, path.slice(1));
    if (!existsSync(file)) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end('harness' + path + ' is missing; run `npm run bundle` first');
      return;
    }
    send(res, file, 'text/javascript');
    return;
  }

  // Fonts from the pinned packages; the path may not climb out of its root
  for (const prefix of Object.keys(FONT_ROOTS)) {
    if (path.indexOf(prefix) === 0) {
      const file = normalize(join(FONT_ROOTS[prefix], path.slice(prefix.length)));
      if (file.indexOf(FONT_ROOTS[prefix]) !== 0) {
        res.writeHead(403);
        res.end();
        return;
      }
      send(res, file, 'font/woff2');
      return;
    }
  }

  // The upstream stylesheet
  if (path === '/upstream.css') {
    res.writeHead(200, { 'content-type': 'text/css' });
    res.end(readUpstreamCss());
    return;
  }

  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(path === '/reference' ? REFERENCE : SHOWCASE);

});

server.listen(PORT, function () {
  process.stdout.write('showcase listening on http://localhost:' + PORT + '\n');
});
