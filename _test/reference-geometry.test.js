// Info: The geometry of a compared part. A reference part with a
// `compare` list is compared on that list only: its box is measured and
// the `x`, `y`, `width` and `height` the list leaves out are dropped, so
// a part can stand in another place, or be another size, and pass. A box
// part therefore names all four in `compare`, or names the ones it leaves
// out in `except` beside the reason. The parts that did neither when this
// gate was written are listed in `fixtures/reference-geometry-legacy.json`;
// the list only shrinks: a part that now names its geometry leaves it, and
// no part joins it.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const GEOMETRY = Object.freeze(['x', 'y', 'width', 'height']);
const LEGACY = JSON.parse(readFileSync(join(HERE, 'fixtures', 'reference-geometry-legacy.json'), 'utf8'));

// The ceiling of the legacy list: lower it with every repair, never raise it
const LEGACY_CEILING = 89;


/********************************************************************
Every reference file under the component folder.

@param {String} folder - Folder to walk

@return {Array} - Absolute paths
*********************************************************************/
function referenceFiles (folder) {

  const found = [];
  for (const name of readdirSync(folder).sort()) {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) {
      found.push(...referenceFiles(path));
    } else if (/^reference\..*\.js$/.test(name)) {
      found.push(path);
    }
  }
  return found;

}


/********************************************************************
The box parts of every reference whose `compare` list leaves out a
geometry key that `except` does not name, as `<reference>/<part>`.

@return {Promise<Array>} - Sorted ids
*********************************************************************/
async function partsWithoutGeometry () {

  const ids = [];
  for (const file of referenceFiles(join(HERE, '..', 'component'))) {
    const reference = (await import(pathToFileURL(file).href)).default;
    if (reference === undefined || reference === null || reference.parts === undefined) {
      continue;
    }
    const row = file.split('/').pop().replace(/^reference\./, '').replace(/\.js$/, '');
    for (const name of Object.keys(reference.parts)) {
      const part = reference.parts[name];
      if (part.measure !== 'box' || !Array.isArray(part.compare)) {
        continue;
      }
      const left = GEOMETRY.filter(function (key) {
        return !part.compare.includes(key) && !(part.except || []).includes(key);
      });
      if (left.length > 0) {
        ids.push(row + '/' + name);
      }
    }
  }
  return ids.sort();

}


describe('reference geometry: a compared box part names its geometry', function () {

  test('no part outside the legacy list leaves out x, y, width or height', async function () {
    const found = await partsWithoutGeometry();
    const fresh = found.filter(function (id) {
      return !LEGACY.parts.includes(id);
    });
    assert.deepEqual(fresh, [], 'name x, y, width and height in `compare`, or the ones left out in `except` with the reason');
  });

  test('the legacy list only shrinks', async function () {
    const found = await partsWithoutGeometry();
    const stale = LEGACY.parts.filter(function (id) {
      return !found.includes(id);
    });
    assert.deepEqual(stale, [], 'a part that names its geometry leaves the legacy list');
    assert.equal(LEGACY.parts.length <= LEGACY_CEILING, true, 'the legacy list is over its ceiling of ' + LEGACY_CEILING);
  });

});
