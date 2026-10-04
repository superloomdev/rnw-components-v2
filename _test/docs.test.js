// Info: Docs gate. The committed docs/components pages equal a fresh
// regeneration into a temp directory, byte for byte; every roster flag that
// demands an explanation on a built component is explained in notes.md.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { REPO_ROOT, discoverComponents, getRoster } from '../scripts/lib/components.js';

const COMMITTED = join(REPO_ROOT, 'docs', 'components');
const EXPLAINED_FLAGS = ['deferred_gap', 'no_reference', 'superloom_decision', 'web_only', 'requires_parent'];


describe('docs: generated pages', function () {

  test('committed docs/components equals a fresh regeneration', function () {
    const temp = mkdtempSync(join(tmpdir(), 'rnw-docs-'));
    try {
      execFileSync('node', [join(REPO_ROOT, 'scripts', 'docs-generate.js'), temp], { stdio: 'pipe' });
      const fresh = readdirSync(temp).sort();
      assert.ok(fresh.length >= 1, 'the generator wrote nothing');
      assert.ok(existsSync(COMMITTED), 'docs/components is missing; run node scripts/docs-generate.js');
      assert.deepEqual(readdirSync(COMMITTED).sort(), fresh, 'the set of family pages differs');
      for (const file of fresh) {
        assert.equal(readFileSync(join(COMMITTED, file), 'utf8'), readFileSync(join(temp, file), 'utf8'),
          file + ' is stale; run node scripts/docs-generate.js and commit');
      }
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });

  test('committed catalog.js equals a fresh regeneration', function () {
    const temp = mkdtempSync(join(tmpdir(), 'rnw-catalog-'));
    try {
      const file = join(temp, 'catalog.js');
      execFileSync('node', [join(REPO_ROOT, 'scripts', 'catalog-generate.js'), file], { stdio: 'pipe' });
      assert.equal(readFileSync(join(REPO_ROOT, 'catalog.js'), 'utf8'), readFileSync(file, 'utf8'),
        'catalog.js is stale; run node scripts/catalog-generate.js and commit');
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });

  test('the catalog carries each sample\'s frame: a width for a component that fills its container, else null', async function () {
    const { catalog } = await import(pathToFileURL(join(REPO_ROOT, 'catalog.js')).href);
    const components = await discoverComponents();
    for (const entry of catalog) {
      const sample = await import(pathToFileURL(components.find(function (component) {
        return component.name === entry.name;
      }).files.sample).href);
      assert.deepEqual(entry.frame, sample.FRAME || null, entry.name);
    }
    assert.deepEqual(catalog.filter(function (entry) {
      return entry.frame !== null;
    }).map(function (entry) {
      return entry.name + ':' + entry.frame.width;
    }), ['TextInput:320', 'Select:320']);
  });

  test('every flag that demands an explanation is explained in notes.md', async function () {
    const components = await discoverComponents();
    const rows = {};
    for (const row of getRoster().rows) {
      rows[row.name] = row;
    }
    for (const component of components) {
      const flags = rows[component.name].flags.filter(function (flag) {
        return EXPLAINED_FLAGS.includes(flag);
      });
      if (flags.length === 0) {
        continue;
      }
      const notes = readFileSync(component.files.notes, 'utf8');
      for (const flag of flags) {
        assert.ok(notes.includes(flag), component.name + ': notes.md does not mention the flag `' + flag + '`');
      }
    }
  });

});
