import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testRoot = path.join(repoRoot, '_test');
const modulesRoot = path.join(testRoot, 'node_modules');
const roster = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data', 'roster.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(
  path.join(modulesRoot, '@carbon/icons/metadata.json'),
  'utf8',
));

const moduleToName = new Map();
for (const icon of metadata.icons) {
  moduleToName.set(icon.moduleInfo.global, icon.name);
}

const roots = [
  path.join(modulesRoot, '@carbon/react/es'),
  path.join(modulesRoot, '@carbon/react-native/lib/module/components'),
];
const productRoot = path.join(modulesRoot, '@carbon/ibm-products/es/components');
const productExports = new Set(
  roster.rows
    .filter((row) => row.source.package === '@carbon/ibm-products')
    .map((row) => row.source.export)
    .concat('ExpressiveCard'),
);
for (const exportName of productExports) {
  const sourceDirectory = exportName === 'EmptyState' ? 'EmptyStates' : exportName;
  const componentRoot = path.join(productRoot, sourceDirectory);
  if (!fs.existsSync(componentRoot)) {
    throw new Error(`missing product component source for ${exportName}`);
  }
  roots.push(componentRoot);
}

const symbols = new Set();
const directNames = new Set();
const files = [];

function scan(root) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const location = path.join(root, entry.name);
    if (entry.isDirectory()) {
      scan(location);
      continue;
    }
    if (!/\.(js|jsx|ts|tsx)$/.test(entry.name)) continue;
    files.push(location);
    const source = fs.readFileSync(location, 'utf8');
    for (const match of source.matchAll(
      /import\s*\{([^;]+)\}\s*from\s*['"]@carbon\/icons-react['"]/g,
    )) {
      for (const imported of match[1].split(',')) {
        const symbol = imported.trim().replace(/\s+as\s+.*/, '');
        if (symbol) symbols.add(symbol);
      }
    }
    for (const match of source.matchAll(
      /from\s*['"]@carbon\/icons\/es\/([^'"]+)\/(?:16|20|24|32)['"]/g,
    )) {
      directNames.add(match[1]);
    }
  }
}

roots.forEach(scan);

const unresolved = [...symbols].filter((symbol) => !moduleToName.has(symbol)).sort();
if (unresolved.length > 0) {
  throw new Error(`unresolved Carbon icon symbols: ${unresolved.join(', ')}`);
}

const carbonNames = new Set(directNames);
for (const symbol of symbols) carbonNames.add(moduleToName.get(symbol));

const output = {
  schema: 1,
  sources: {
    '@carbon/icons': require(path.join(modulesRoot, '@carbon/icons/package.json')).version,
    '@carbon/icons-react': require(path.join(modulesRoot, '@carbon/icons-react/package.json')).version,
  },
  scannedFiles: files.length,
  importedSymbols: [...symbols].sort(),
  directNames: [...directNames].sort(),
  carbonNames: [...carbonNames].sort(),
};

fs.writeFileSync(
  path.join(repoRoot, 'data', 'icon-imports.candidate.json'),
  `${JSON.stringify(output, null, 2)}\n`,
);
process.stdout.write(
  `scanned ${output.scannedFiles} files; `
  + `${output.importedSymbols.length} symbols; `
  + `${output.directNames.length} direct names; `
  + `${output.carbonNames.length} Carbon icons\n`,
);
