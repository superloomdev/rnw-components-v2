// Info: Content composite. Every sample state under every template: the
// `main` landmark with `control.content_padding` on every side, a string
// child in `type.body01` and `color.content_label`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/header/sample.content.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('Content: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the region comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'Content', state);
        const main = container.querySelector('main, [role="main"]');
        assert.equal(main !== null, true, 'the main landmark');
        for (const side of ['Top', 'Bottom', 'Left', 'Right']) {
          assert.equal(main.style['padding' + side], t['control.content_padding'] + 'px', side);
        }
        const text = main.querySelector('[dir="auto"]');
        assert.equal(text.textContent, 'Main content');
        assert.equal(text.style.fontSize, t['type.body01'].fontSize + 'px');
        assert.equal(text.style.color, cssValue('color', t['color.content_label']));
      });
    }
  }

  test('element children are drawn as given', async function () {
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.Content, null, React.createElement(Registry.Text, null, 'Given')));
    const main = container.querySelector('main, [role="main"]');
    assert.equal(main.children.length, 1);
    assert.equal(main.textContent, 'Given');
  });

});
