// Source: _test/harness/serve.js (Material parts, verbatim from 7f2bd93)

// --- _test/harness/serve.js:39-41 ---
  ['Roboto', 400, '/fonts/roboto/roboto-latin-400-normal.woff2'],
  ['Roboto', 500, '/fonts/roboto/roboto-latin-500-normal.woff2'],
  ['Roboto', 700, '/fonts/roboto/roboto-latin-700-normal.woff2'],

// --- _test/harness/serve.js:94-97 ---
// The second reference draws self-styled components: the primary's
// stylesheet carries a global box-sizing reset that reaches into the
// upstream shadow trees and beats their own rules, so its page loads none
const REFERENCE_SECOND = page('rnw-components reference', '/reference-bundle.js', '');

// --- _test/harness/serve.js:177-177 ---
  res.end(path === '/reference' ? (/[?&]set=second\b/.test(req.url) ? REFERENCE_SECOND : REFERENCE) : SHOWCASE);
