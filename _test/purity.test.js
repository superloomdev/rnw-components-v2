// Info: Purity gate over the shipped source, and the declared-requirement
// reconciliation. Presence is asserted before every scan so a scan over an
// empty tree cannot pass vacuously.
//
// 1. No color literal, unit string, vendor name, framework import, platform
//    read (outside component/platform.js), banned accessibility prop,
//    createPortal, LayoutAnimation, useWindowDimensions, __DEV__, JSX.
// 2. Every component folder is complete: factory, api, spec, sample, notes;
//    the factory carries `.spec`; `all.js` exports exactly the discovered
//    components and only roster rows that are not `not_applicable`.
// 3. REQUIRED_TOKENS = context tokens + every spec token + every `api.tokens`;
//    SUPPORTED_TOKENS adds `color.<leaf>` for every `api.colors`; every name
//    is in the contract; REQUIRED_ICONS names icons the contract carries.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { relative } from 'node:path';

import * as factories from 'rnw-components/all';
import { REQUIRED_ICONS, REQUIRED_TOKENS, SUPPORTED_TOKENS } from 'rnw-components';
import { REPO_ROOT, discoverComponents, listShippedFiles, getRoster } from '../scripts/lib/components.js';
import { Lib } from './harness/system.js';

const CONTEXT_TOKENS = ['feedback.focus_trigger'];

const FORBIDDEN = [
  { name: 'color literal', pattern: /#[0-9a-fA-F]{3,8}([^0-9a-zA-Z]|$)|rgba?\(|hsla?\(/ },
  { name: 'unit string', pattern: /['"][0-9.]+(rem|em|px|vw|vh|ms|%)['"]/ },
  { name: 'vendor name', pattern: /carbon|material|ibm/i },
  { name: 'framework import', pattern: /(require\(|from )['"](react|react-dom|react-native|react-native-web|react-native-svg)['"]/ },
  { name: 'platform read', pattern: /\bPlatform\s*\.\s*(OS|select)\b/, except: /component\/platform\.js$/ },
  { name: 'banned accessibility prop', pattern: /accessibilityState|accessibilityValue|accessibilityHint|accessibilityViewIsModal|importantForAccessibility/ },
  { name: 'banned mechanism', pattern: /createPortal|LayoutAnimation|useWindowDimensions|__DEV__/ },
  { name: 'JSX', pattern: /^\s*<[A-Z][A-Za-z.]*[\s>/]/ },
  { name: 'raw emptiness or membership check', pattern: /\.length (===|!==|>) 0|(===|!==) ''|Object\.keys\([^)]+\)\.length|indexOf\([^)]*\) *(===|!==|>) *-1/ }
];


/********************************************************************
Blank comments so a pattern matches code and string literals only.

@param {String} source - File contents

@return {String} - Code with comments blanked
*********************************************************************/
function codeOnly (source) {

  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

}


describe('purity: shipped source', function () {

  const files = listShippedFiles();

  test('there is shipped source to scan', function () {
    assert.ok(files.length >= 20, 'expected at least the behaviors, the seam and one component; found ' + files.length);
    assert.ok(files.some(function (file) {
      return file.endsWith('components.js');
    }));
  });

  test('no forbidden construct in any shipped file', function () {
    const violations = [];
    for (const file of files) {
      const rel = relative(REPO_ROOT, file);
      const lines = codeOnly(readFileSync(file, 'utf8')).split('\n');
      lines.forEach(function (line, index) {
        for (const rule of FORBIDDEN) {
          if (rule.except && rule.except.test(file)) {
            continue;
          }
          if (rule.pattern.test(line)) {
            violations.push(rel + ':' + (index + 1) + ' ' + rule.name + ': ' + line.trim());
          }
        }
      });
    }
    assert.deepEqual(violations, []);
  });

});


describe('purity: component folders and all.js', function () {

  test('every component folder is complete and all.js exports exactly the discovered set', async function () {
    const components = await discoverComponents();
    assert.ok(components.length >= 1, 'no component folders found');
    const roster = getRoster();
    const rows = {};
    for (const row of roster.rows) {
      rows[row.name] = row;
    }
    for (const component of components) {
      for (const key of ['factory', 'api', 'spec', 'sample', 'notes']) {
        assert.ok(existsSync(component.files[key]), component.name + ' is missing ' + key);
      }
      assert.equal(typeof factories[component.name], 'function', component.name + ' is not exported from all.js');
      assert.equal(factories[component.name].spec, component.spec, component.name + ' factory does not carry its spec sheet');
      assert.ok(rows[component.name], component.name + ' has no roster row');
      assert.notEqual(rows[component.name].status, 'not_applicable', component.name + ' is not_applicable in the roster');
      assert.equal(rows[component.name].tier, component.tier, component.name + ' tier disagrees with the roster');
      assert.ok(Array.isArray(component.sample) && component.sample.length >= 1, component.name + ' sample.js is empty');
      if (rows[component.name].reference.kind !== 'none') {
        assert.ok(existsSync(component.files.reference), component.name + ' has a reference in the roster but no reference.js');
      }
    }
    assert.deepEqual(Object.keys(factories).sort(), components.map(function (component) {
      return component.name;
    }), 'all.js exports and component folders disagree');
  });

});


describe('purity: declared requirements equal what the components read', function () {

  test('REQUIRED_TOKENS, SUPPORTED_TOKENS and REQUIRED_ICONS reconcile with spec.js and api.js', async function () {
    const components = await discoverComponents();
    const required = new Set(CONTEXT_TOKENS);
    const supported = new Set(CONTEXT_TOKENS);
    for (const component of components) {
      for (const metric of Object.keys(component.spec)) {
        const entry = component.spec[metric];
        const tokens = typeof entry === 'string' ? [entry] : Array.isArray(entry.tokens) ? entry.tokens : [];
        for (const token of tokens) {
          required.add(token);
          supported.add(token);
        }
      }
      for (const token of component.api.tokens || []) {
        required.add(token);
        supported.add(token);
      }
      for (const leaf of component.api.colors || []) {
        supported.add('color.' + leaf);
      }
    }
    assert.deepEqual([...REQUIRED_TOKENS].sort(), [...required].sort(), 'REQUIRED_TOKENS must equal the union of spec.js and api.tokens');
    assert.deepEqual([...SUPPORTED_TOKENS].sort(), [...supported].sort(), 'SUPPORTED_TOKENS must equal REQUIRED_TOKENS plus every api.colors leaf');
  });

  test('every declared token and icon is in the contract', function () {
    const contract = Lib.Themer.getContract();
    for (const name of [...REQUIRED_TOKENS, ...SUPPORTED_TOKENS]) {
      assert.ok(contract.tokens[name], name + ' is not a contract token');
    }
    for (const icon of REQUIRED_ICONS) {
      assert.ok(contract.tokens['icon.' + icon], 'icon.' + icon + ' is not a contract token');
    }
  });

});
