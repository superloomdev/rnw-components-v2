// Info: ProgressIndicator molecule. Every sample state mounts the steps in
// order as a list, each with its state from `currentIndex` - before it
// complete, at it current, after it incomplete - and the indicator's
// vertical, spaceEqually and onChange injected.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/progress/sample.progress-indicator.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one ProgressIndicator and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Props

@return {Promise<Object>} - { root, steps }
*********************************************************************/
async function renderIndicator (Registry, props) {

  const container = await render(React.createElement(Registry.ProgressIndicator, props));
  const root = container.firstElementChild;

  return {
    root: root,
    steps: Array.from(root.children)
  };

}


describe('ProgressIndicator: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the index math mounts each step in its state', async function () {
        const Registry = buildSystem(template, factories);
        const parts = await renderIndicator(Registry, state.props);
        const index = state.props.currentIndex === undefined ? 0 : state.props.currentIndex;

        // The list, row or column by `vertical`
        assert.equal(parts.root.tagName.toLowerCase(), 'ul');
        assert.equal(parts.root.style.flexDirection, state.props.vertical === true ? 'column' : 'row');

        // Each step's state sentence: complete before the index, current
        // at it, incomplete after it
        assert.equal(parts.steps.length, state.props.items.length);
        for (let i = 0; i < parts.steps.length; i++) {
          const step = parts.steps[i];
          const pressable = step.querySelector('[role="button"]');
          const name = state.props.items[i].invalid === true ? 'Invalid'
            : i < index ? 'Complete' : i === index ? 'Current' : 'Incomplete';
          assert.equal(pressable.getAttribute('aria-label'), state.props.items[i].label + ' ' + name);
          // The spread form grows each step
          if (state.props.spaceEqually === true && state.props.vertical !== true) {
            assert.equal(step.style.flexGrow, '1');
          }
        }
      });
    }
  }

});


describe('ProgressIndicator: onChange reaches a step\'s press with its index', function () {

  test('pressing a step calls onChange with its index; the current step stays unpressable', async function () {
    const Registry = buildSystem('carbon', factories);
    const changes = [];
    const parts = await renderIndicator(Registry, {
      currentIndex: 1,
      onChange: function (index) {
        changes.push(index);
      },
      items: [{ label: 'First step' }, { label: 'Second step' }, { label: 'Third step' }]
    });

    const pressableOf = function (i) {
      return parts.steps[i].querySelector('[role="button"]');
    };
    await act(async function () {
      pressableOf(0).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.deepEqual(changes, [0]);

    // The current step's press is dropped, as upstream's clone does
    await act(async function () {
      pressableOf(1).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.deepEqual(changes, [0]);

    await act(async function () {
      pressableOf(2).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.deepEqual(changes, [0, 2]);
  });

});


describe('ProgressIndicator: steps shrink to their minimum in a narrow host', function () {

  test('a horizontal step is a shrinkable flex item floored at the step minimum', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = buildSystem('carbon', factories);
    const parts = await renderIndicator(Registry, {
      items: [{ label: 'First step' }, { label: 'Second step' }, { label: 'Third step' }]
    });
    // Upstream steps are CSS flex items - inline-size 128px, min-inline-size
    // 7rem, the default shrink 1 - so three steps are 112 each in a 336-wide
    // host and hold 128 in a 400-wide one. jsdom does not lay out; assert the
    // style contract that produces it.
    for (const step of parts.steps) {
      assert.equal(step.style.flexShrink, '1');
      assert.equal(step.style.width, t['control.progress_step_width'] + 'px');
      assert.equal(step.style.minWidth, t['control.progress_step_min_width'] + 'px');
    }
  });

});
