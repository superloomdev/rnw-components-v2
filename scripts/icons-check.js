import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modulesRoot = path.join(repoRoot, '_test', 'node_modules');
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data', 'icons.json'), 'utf8'));
const imports = JSON.parse(fs.readFileSync(
  path.join(repoRoot, 'data', 'icon-imports.candidate.json'),
  'utf8',
));
const metadata = JSON.parse(fs.readFileSync(
  path.join(modulesRoot, '@carbon/icons/metadata.json'),
  'utf8',
));

const oldSemanticNames = [
  'calendar', 'checkmark', 'chevron_down', 'chevron_up', 'chevron_right',
  'close', 'copy', 'eye', 'eye_off', 'info', 'overflow', 'search', 'time',
  'warning', 'error', 'success', 'loading', 'visibility', 'visibility_off',
  'home', 'user', 'trash', 'add', 'favorite', 'settings', 'menu',
  'notification', 'share', 'download', 'edit', 'checkmark_filled',
  'information_filled', 'warning_filled', 'document', 'checkbox',
  'checkbox_unchecked', 'tools', 'accessibility', 'task_complete', 'group',
  'grid', 'layers', 'cube',
];
const sizes = [16, 20, 24, 32];
const failures = [];
const fail = (message) => failures.push(message);
const carbonByName = new Map(metadata.icons.map((icon) => [icon.name, icon]));
const mappedCarbon = new Set();

if (manifest.schema !== 1 || !manifest.icons || typeof manifest.icons !== 'object') {
  fail('invalid icon manifest envelope');
}
if (manifest.sources.carbon.version !== imports.sources['@carbon/icons']) {
  fail('Carbon source version differs from scanned package');
}
if (manifest.sources.material.style !== 'outlined') fail('Material style is not outlined');

const names = Object.keys(manifest.icons);
if (JSON.stringify(names) !== JSON.stringify([...names].sort())) {
  fail('semantic icon names are not sorted');
}

for (const semantic of names) {
  const mapping = manifest.icons[semantic];
  if (!/^[a-z][a-z0-9_]*$/.test(semantic)) fail(`${semantic}: invalid semantic name`);
  if (!mapping || Object.keys(mapping).join(',') !== 'carbon,material') {
    fail(`${semantic}: mapping must contain carbon then material`);
    continue;
  }
  if (typeof mapping.carbon !== 'string' || mapping.carbon.length === 0
      || typeof mapping.material !== 'string' || mapping.material.length === 0) {
    fail(`${semantic}: empty mapping`);
    continue;
  }

  const carbon = carbonByName.get(mapping.carbon);
  if (!carbon) {
    fail(`${semantic}: Carbon icon '${mapping.carbon}' does not exist`);
  } else {
    mappedCarbon.add(mapping.carbon);
    const available = new Set(carbon.output.map((output) => output.size));
    const fallback = available.has(32) ? 32 : [...available][0];
    for (const size of sizes) {
      if (!available.has(size) && !fallback) fail(`${semantic}: no Carbon fallback at ${size}`);
    }
    for (const asset of carbon.assets) {
      if (/<switch\b|<foreignObject\b/i.test(asset.source)) {
        fail(`${semantic}: Carbon icon needs switch or foreignObject`);
      }
    }
  }

  const materialFile = path.join(
    modulesRoot,
    '@material-symbols/svg-400/outlined',
    `${mapping.material}.svg`,
  );
  if (!fs.existsSync(materialFile)) {
    fail(`${semantic}: Material icon '${mapping.material}' does not exist`);
  }
}

for (const name of oldSemanticNames) {
  if (!manifest.icons[name]) fail(`old semantic name missing: ${name}`);
}
for (const carbon of imports.carbonNames) {
  if (!mappedCarbon.has(carbon)) fail(`scanned Carbon icon unmapped: ${carbon}`);
}

if (failures.length > 0) {
  failures.forEach((message) => process.stderr.write(`FAIL ${message}\n`));
  process.exit(1);
}

const count = names.length;
process.stdout.write(
  `OK ${count} names; carbon resolves ${count}/${count} at sizes 16,20,24,32; `
  + `material resolves ${count}/${count}; no switch elements\n`,
);
