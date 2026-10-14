// Info: InlineLoading molecule. Every sample state renders the status row:
// the mark seat (the small Loading while active, the success or error
// glyph once settled, nothing while inactive), the status text in the
// inline-loading type and color, the row on the small size's height.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/progress/sample.inline-loading.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one InlineLoading and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Props

@return {Promise<Object>} - { root, mark, text, svg }
*********************************************************************/
async function renderInline (Registry, props) {

  const container = await render(React.createElement(Registry.InlineLoading, props));
  const root = container.firstElementChild;

  return {
    root: root,
    mark: root.querySelector('[data-testid="inline-loading-mark"]'),
    text: root.querySelector('[dir="auto"]'),
    svg: root.querySelector('svg')
  };

}


describe('InlineLoading: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the mark, the gap and the text come from the theme', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const status = state.props.status;
        const parts = await renderInline(Registry, state.props);

        // The row on the small size's height, announcing at the upstream's
        // live politeness (off while inactive)
        assert.equal(parts.root.style.minHeight, t['size.size_small'] + 'px');
        assert.equal(parts.root.getAttribute('aria-live'), status === 'inactive' ? 'off' : 'assertive');

        // The mark seat: mounted only when the status draws a mark
        assert.equal(parts.mark !== null, status !== 'inactive');
        if (status === 'active') {
          // The small Loading turns in place: a 100-viewBox svg under
          // `spin`, the img seat holding the masked halves under `arc`
          if (t['anatomy.loading_motion'] === 'arc') {
            assert.ok(parts.mark.querySelector('[role="img"]') !== null);
          } else {
            assert.ok(parts.svg !== null);
            assert.equal(parts.svg.getAttribute('viewBox'), '0 0 100 100');
          }
        }
        if (status === 'finished' || status === 'error') {
          assert.ok(parts.svg !== null);
          assert.equal(parts.mark.style.marginInlineEnd || parts.mark.style.marginRight, t['control.inline_loading_gap'] + 'px');
          const color = status === 'finished' ? t['color.inline_loading_success'] : t['color.inline_loading_error'];
          assert.equal(parts.svg.getAttribute('fill'), color);
          assert.equal(parts.svg.getAttribute('aria-label'), state.props.iconDescription || status);
        }

        // The status text in the family's type and color
        assert.equal(parts.text.textContent, state.props.description);
        assert.equal(parts.text.style.color, cssValue('color', t['color.inline_loading_label']));
        assert.equal(parts.text.style.fontSize, t['type.inline_loading_label'].fontSize + 'px');
      });
    }
  }

});


describe('InlineLoading: a finished status reports success once', function () {

  test('onSuccess fires after successDelay, not before', async function () {
    const Registry = buildSystem('carbon', factories);
    let calls = 0;
    await renderInline(Registry, { description: 'Done', onSuccess: function () {
      calls += 1;
    }, status: 'finished', successDelay: 20 });
    assert.equal(calls, 0);
    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, 40);
      });
    });
    assert.equal(calls, 1);
  });

  test('the default delay is the upstream\'s 1500ms', async function () {
    const Registry = buildSystem('carbon', factories);
    let calls = 0;
    await renderInline(Registry, { onSuccess: function () {
      calls += 1;
    }, status: 'finished' });
    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, 60);
      });
    });
    assert.equal(calls, 0);
  });

});
