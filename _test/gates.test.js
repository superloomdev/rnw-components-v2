// Info: Census of the browser gates. The gate definition lists clauses; a
// clause that no test enforces is a hole every batch passes through (the
// contrast clause stood unbuilt through the first milestone). Each listed
// clause names the test title that enforces it; this checks the title is a
// test() in its spec and that the spec declares exactly as many tests as
// the census lists for it, so a test cannot be added or removed unlisted.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT } from '../scripts/lib/components.js';

const CENSUS = JSON.parse(readFileSync(join(REPO_ROOT, '_test', 'fixtures', 'gates.json'), 'utf8')).gates;
// A test declaration: `test(` at the start of a line, inside or outside a describe
const DECLARATION = /^\s*test\(/gm;


describe('gates census', function () {

  test('every listed clause names a layer, a spec and a title', function () {
    for (const gate of CENSUS) {
      assert.ok([1, 2, 3].includes(gate.layer), gate.clause + ': layer');
      assert.match(gate.spec, /\.spec\.js$/, gate.clause + ': spec');
      assert.ok(gate.title.length > 0, gate.clause + ': title');
    }
  });

  const specs = {};
  for (const gate of CENSUS) {
    specs[gate.spec] = (specs[gate.spec] || []).concat(gate);
  }

  for (const spec of Object.keys(specs)) {
    test(spec + ': every listed title is a declared test, and every declared test is listed', function () {
      const source = readFileSync(join(REPO_ROOT, '_test', spec), 'utf8');
      for (const gate of specs[spec]) {
        assert.ok(source.includes(gate.title), spec + ' has no test titled ' + JSON.stringify(gate.title) + ' (clause: ' + gate.clause + ')');
      }
      const declared = (source.match(DECLARATION) || []).length;
      assert.equal(declared, specs[spec].length, spec + ' declares ' + declared + ' test(s), the census lists ' + specs[spec].length);
    });
  }

});
