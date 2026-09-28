// Candidate roster generator for Plan 0160 Step 0.5.
// Discovers real exports from installed @carbon/react, @carbon/react-native,
// and @carbon/ibm-products artifacts. Emits data/roster.candidate.json.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const fixturesDir = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.resolve(fixturesDir, '..');
const repoRoot = path.resolve(testDir, '..');
const outFile = path.join(repoRoot, 'data', 'roster.candidate.json');

const PINS = {
  '@carbon/react': '1.115.0',
  '@carbon/react-native': '9.0.7',
  '@carbon/ibm-products': '2.99.0',
  '@material/web': '2.5.0',
};

const PRODUCT_FAMILIES = [
  ['Tearsheet', 'Tearsheet'],
  ['Card', 'ProductiveCard'],
  ['PageHeader', 'PageHeader'],
  ['EmptyState', 'EmptyState'],
  ['FullPageError', 'FullPageError'],
  ['NotificationsPanel', 'NotificationsPanel'],
  ['EditInPlace', 'EditInPlace'],
  ['ActionBar', 'ActionBar'],
  ['TagSet', 'TagSet'],
  ['TagOverflow', 'TagOverflow'],
  ['RemoveModal', 'RemoveModal'],
  ['Saving', 'Saving'],
  ['ScrollGradient', 'ScrollGradient'],
];

const ADDITION_ROWS = [
  ['Divider', { package: '@material/web', version: '2.5.0', export: 'MdDivider' }],
  ['FloatingActionButton', { package: '@material/web', version: '2.5.0', export: 'MdFab' }],
  ['Carousel', { package: 'local', version: '1.0.0', export: 'Carousel' }],
];
const ADDITIONS = 4; // 3 new families + Button kinds augmentation (reuses Button row)

function fail(msg) {
  console.error(`generate-roster: ${msg}`);
  process.exit(1);
}

function makeRow(name, source) {
  return {
    name,
    family: null,
    tier: null,
    source,
    description: null,
    platform: null,
    enums: null,
    behaviors: null,
    parent: null,
    reference: null,
    carbon_twin: null,
    material_twin: null,
    diff_budget: null,
    flags: null,
    status: null,
  };
}

// --- @carbon/react: real export keys ---------------------------------------
let carbonReact;
try {
  carbonReact = await import('@carbon/react');
} catch (err) {
  fail(`import('@carbon/react') failed: ${err.message}`);
}
// Node adds these CommonJS namespace wrappers; neither is a package export.
const carbonWebNames = Object.keys(carbonReact)
  .filter((name) => name !== 'default' && name !== 'module.exports')
  .sort();
if (carbonWebNames.length < 200) {
  fail(`@carbon/react raw exports ${carbonWebNames.length} < 200`);
}

// --- @carbon/react-native: recursive export-graph parse --------------------
const rnEntry = path.join(
  path.dirname(require.resolve('@carbon/react-native/package.json')),
  'lib/module/index.js'
);
const TOP_EXCLUDE = ['./styles', './helpers', './constants', './types'];

function resolveRelative(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const candidate of [base, `${base}.js`, path.join(base, 'index.js')]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  fail(`unresolved relative re-export '${spec}' from ${fromFile}`);
}

const rnNames = new Set();
const visited = new Set();
const STMT = /export\s+(\*\s+from|\{[^}]*\}\s*from|type\s*\{[^}]*\}\s*from|\{[^}]*\}|type\s*\{[^}]*\}|(const|let|var|class|function)\s+([A-Za-z_$][\w$]*)|default\b)\s*(?:'([^']+)'|"([^"]+)")?/g;

function collectAliases(inner) {
  for (const part of inner.split(',')) {
    const t = part.trim();
    if (!t || t.startsWith('type ')) continue;
    const m = t.match(/(?:\bas\s+)?([A-Za-z_$][\w$]*)$/);
    if (m) rnNames.add(m[1]);
  }
}

function parseFile(file, isTop = false) {
  const resolved = path.resolve(file);
  if (visited.has(resolved)) return;
  visited.add(resolved);
  const src = fs.readFileSync(resolved, 'utf8');
  for (const m of src.matchAll(STMT)) {
    const [full, kind, declKw, declName, sq, dq] = m;
    const spec = sq ?? dq ?? null;
    const k = kind.trim();
    if (k.startsWith('type')) continue; // type-only export
    if (k === 'default') continue;
    if (k.startsWith('*')) {
      if (!spec) fail(`'export *' without from in ${resolved}`);
      if (isTop && TOP_EXCLUDE.some((p) => spec === p || spec.startsWith(`${p}/`))) continue;
      parseFile(resolveRelative(resolved, spec));
      continue;
    }
    if (k.startsWith('{')) {
      collectAliases(k.slice(1, k.lastIndexOf('}')));
      if (spec) parseFile(resolveRelative(resolved, spec));
      continue;
    }
    if (declKw && declName) rnNames.add(declName);
  }
}

if (!fs.existsSync(rnEntry)) fail(`missing ${rnEntry}`);
parseFile(rnEntry, true);
const rnComponentNames = [...rnNames].sort();
if (rnComponentNames.length < 25) {
  fail(`@carbon/react-native component exports ${rnComponentNames.length} < 25`);
}
const webSet = new Set(carbonWebNames);
const rnUnique = rnComponentNames.filter((n) => !webSet.has(n));

// --- @carbon/ibm-products: assert primary exports --------------------------
let ibmProducts;
try {
  ibmProducts = await import('@carbon/ibm-products');
} catch (err) {
  fail(`import('@carbon/ibm-products') failed: ${err.message}`);
}
for (const [family, exportName] of PRODUCT_FAMILIES) {
  if (!(exportName in ibmProducts)) {
    fail(`@carbon/ibm-products missing export '${exportName}' for family '${family}'`);
  }
}
if (!('ExpressiveCard' in ibmProducts)) {
  fail(`@carbon/ibm-products missing secondary Card reference 'ExpressiveCard'`);
}
if (PRODUCT_FAMILIES.length !== 13) fail('product families != 13');
if (ADDITIONS !== 4) fail('additions != 4');
if (ADDITION_ROWS.length !== 3) fail('addition rows != 3');

// --- Build rows -------------------------------------------------------------
const rows = new Map();
for (const name of carbonWebNames) {
  rows.set(name, makeRow(name, { package: '@carbon/react', version: PINS['@carbon/react'], export: name }));
}
for (const name of rnUnique) {
  rows.set(name, makeRow(name, { package: '@carbon/react-native', version: PINS['@carbon/react-native'], export: name }));
}
for (const [family, exportName] of PRODUCT_FAMILIES) {
  if (rows.has(family)) fail(`product family name collision: '${family}' already present`);
  rows.set(family, makeRow(family, { package: '@carbon/ibm-products', version: PINS['@carbon/ibm-products'], export: exportName }));
}
for (const [name, source] of ADDITION_ROWS) {
  if (rows.has(name)) fail(`addition name collision: '${name}' already present`);
  rows.set(name, makeRow(name, source));
}

const sortedRows = [...rows.values()].sort((a, b) => a.name.localeCompare(b.name));
const roster = {
  schema: 1,
  generatedFrom: { ...PINS },
  counts: {
    carbonReactExports: carbonWebNames.length,
    carbonReactNativeExports: rnComponentNames.length,
    carbonReactNativeUnique: rnUnique.length,
    ibmProductFamilies: 13,
    additions: ADDITIONS,
    additionRows: ADDITION_ROWS.length,
    total: sortedRows.length,
  },
  rows: sortedRows,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(roster, null, 2)}\n`);

console.log(`@carbon/react = ${carbonWebNames.length}`);
console.log(`@carbon/react-native = ${rnComponentNames.length}`);
console.log(`@carbon/react-native unique = ${rnUnique.length}`);
console.log(`ibm-products = ${PRODUCT_FAMILIES.length}`);
console.log(`additions = ${ADDITIONS}`);
console.log(`addition rows = ${ADDITION_ROWS.length}`);
console.log(`candidate rows = ${sortedRows.length}`);
