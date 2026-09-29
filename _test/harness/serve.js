// Info: Static server for the browser gates. Serves the esbuild bundle and
// one page; the query string selects the template and, optionally, one
// component. Not product code; a local test harness.

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const PORT = 5299;

const PAGE = '<!doctype html><html><head><meta charset="utf-8">' +
  '<title>rnw-components showcase</title>' +
  '<style>' +
  'body{margin:0;padding:24px;background:#fff;font:14px system-ui}' +
  '.family{margin-bottom:32px}.grid{display:flex;flex-wrap:wrap;gap:24px}' +
  '.cell{display:inline-flex;flex-direction:column;gap:8px;padding:12px;border:1px dashed #ccc}' +
  '.cell-label{font-size:11px;color:#666}.cell-body{display:inline-flex}' +
  '</style></head><body><div id="root"></div>' +
  '<script type="module" src="/bundle.js"></script></body></html>';

const server = createServer(function (req, res) {

  const path = req.url.split('?')[0];

  if (path === '/bundle.js') {
    let body;
    try {
      body = readFileSync(join(HERE, 'bundle.js'));
    } catch {
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end('harness/bundle.js is missing; run `npm run bundle` first');
      return;
    }
    res.writeHead(200, { 'content-type': 'text/javascript' });
    res.end(body);
    return;
  }

  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(PAGE);

});

server.listen(PORT, function () {
  process.stdout.write('showcase listening on http://localhost:' + PORT + '\n');
});
