// Info: Playwright owns and cleans only its attachment directory. The batch
// needs the Node TAP and browser JSON after that cleanup to report evidence.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import config from './playwright.config.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const output = resolve(ROOT, config.outputDir || 'test-results');

function insideOutput (file) {
  const path = relative(output, file);
  return path === '' || (!path.startsWith('..') && !isAbsolute(path));
}

test('browser attachment cleanup cannot erase the Node TAP evidence', function () {
  assert.equal(insideOutput(resolve(ROOT, 'test-results/node.tap')), false);
});

test('browser JSON evidence is outside the cleaned attachment directory', function () {
  const reporter = config.reporter.find(entry => entry[0] === 'json');
  assert.ok(reporter, 'a machine-readable browser reporter is required');
  assert.equal(insideOutput(resolve(ROOT, reporter[1].outputFile)), false);
});
