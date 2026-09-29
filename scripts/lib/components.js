// Info: Component folder discovery, shared by the docs generator, the browser
// manifest generator, the purity test and `npm run check`. A component is a
// folder under `component/<tier>/<family>/` that holds `api.js`; its name is
// `api.name`, its factory file is the kebab-case of that name. Everything the
// tooling knows about a component comes from these files and the roster.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const COMPONENT_ROOT = join(REPO_ROOT, 'component');
export const TIERS = Object.freeze(['atom', 'molecule', 'composite', 'provider']);
export const SHIPPED_SOURCE = Object.freeze(['component', 'behaviors', 'components.js', 'all.js', 'catalog.js']);


/********************************************************************
Kebab-case a PascalCase component name (`IconButton` -> `icon-button`).

@param {String} name - Component name

@return {String} - File stem
*********************************************************************/
export function toFileStem (name) {

  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

}


/********************************************************************
Read the roster.

@return {Object} - Parsed `data/roster.json`
*********************************************************************/
export function getRoster () {

  return JSON.parse(readFileSync(join(REPO_ROOT, 'data', 'roster.json'), 'utf8'));

}


/********************************************************************
List every `.js` file under the shipped source, sorted.

@return {Array} - Absolute paths
*********************************************************************/
export function listShippedFiles () {

  const out = [];

  function walk (path) {
    if (!existsSync(path)) {
      return;
    }
    if (statSync(path).isDirectory()) {
      for (const name of readdirSync(path).sort()) {
        walk(join(path, name));
      }
      return;
    }
    if (path.endsWith('.js')) {
      out.push(path);
    }
  }

  for (const entry of SHIPPED_SOURCE) {
    walk(join(REPO_ROOT, entry));
  }

  return out;

}


/********************************************************************
Discover every component folder: each `api.js` under `component/`.

@return {Promise<Array>} - Sorted by name: { name, tier, family, dir,
  files: { factory, api, spec, sample, reference, notes }, api, spec, sample, reference }
*********************************************************************/
export async function discoverComponents () {

  const found = [];

  for (const tier of TIERS) {
    const tierDir = join(COMPONENT_ROOT, tier);
    if (!existsSync(tierDir)) {
      continue;
    }
    for (const family of readdirSync(tierDir).sort()) {
      const familyDir = join(tierDir, family);
      if (!statSync(familyDir).isDirectory()) {
        continue;
      }
      // One api.js per component; a family folder with several components
      // names them api.<stem>.js
      const apiFiles = readdirSync(familyDir).filter(function (file) {
        return /^api(\.[a-z0-9-]+)?\.js$/.test(file);
      }).sort();
      for (const apiFile of apiFiles) {
        const suffix = apiFile.replace(/^api/, '').replace(/\.js$/, '');
        const api = (await import(pathToFileURL(join(familyDir, apiFile)).href)).default;
        const stem = toFileStem(api.name);
        const files = {
          factory: join(familyDir, stem + '.js'),
          api: join(familyDir, apiFile),
          spec: join(familyDir, 'spec' + suffix + '.js'),
          sample: join(familyDir, 'sample' + suffix + '.js'),
          reference: join(familyDir, 'reference' + suffix + '.js'),
          notes: join(familyDir, 'notes.md')
        };
        const spec = existsSync(files.spec) ? (await import(pathToFileURL(files.spec).href)).default : null;
        const sample = existsSync(files.sample) ? (await import(pathToFileURL(files.sample).href)).default : null;
        const reference = existsSync(files.reference) ? (await import(pathToFileURL(files.reference).href)).default : null;
        found.push({ name: api.name, tier: tier, family: family, dir: familyDir, files: files, api: api, spec: spec, sample: sample, reference: reference });
      }
    }
  }

  found.sort(function (a, b) {
    return a.name < b.name ? -1 : 1;
  });

  return found;

}
