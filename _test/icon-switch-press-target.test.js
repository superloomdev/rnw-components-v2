// Info: the icon segment's press layer meets control.target_min on both axes
// while the painted face keeps the segment's fixed box.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, '..', 'component', 'molecule', 'content-switcher', 'icon-switch.js'), 'utf8');

describe('IconSwitch: the press layer meets the target floor', function () {

  test('the icon segment press layer carries the target floor on both axes', function () {
    assert.equal(source.includes('style: ctx.pressTarget(faceSize)'), true,
      'the icon segment lost its press-target floor - the layer must cover the face on both axes');
  });

});
