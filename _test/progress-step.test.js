// Info: ProgressStep molecule. Every sample state renders the step on the
// progress-step cells: the state glyph and its fill, the label in the
// family's type, the connector line by state, the secondary line, the
// disabled cells and the column form.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/progress/sample.progress-step.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one ProgressStep and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Props

@return {Promise<Object>} - { root, pressable, icon, label, secondary, line }
*********************************************************************/
async function renderStep (Registry, props) {

  const container = await render(React.createElement(Registry.ProgressStep, props));
  const root = container.firstElementChild;
  const pressable = root.querySelector('[role="button"]');

  return {
    root: root,
    pressable: pressable,
    icon: pressable === null ? null : pressable.querySelector(':scope > svg'),
    label: pressable === null ? null : pressable.querySelector('[dir="auto"]'),
    secondary: pressable === null ? null : pressable.querySelector('[data-testid="progress-step-secondary"]'),
    line: pressable === null ? null : pressable.children[pressable.children.length - 1]
  };

}


/********************************************************************
Dispatch one DOM event on an element inside act.

@param {HTMLElement} element - Target
@param {Event}       event   - Event
*********************************************************************/
async function fire (element, event) {

  await act(async function () {
    element.dispatchEvent(event);
  });

}


describe('ProgressStep: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the step\'s glyph, label and line read the cells', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const props = state.props;
        const current = props.current === true;
        const complete = props.complete === true;
        const invalid = props.invalid === true;
        const disabled = props.disabled === true;
        const vertical = props.vertical === true;
        const parts = await renderStep(Registry, props);

        // The list item and its pressable
        assert.equal(parts.root.tagName.toLowerCase(), 'li');
        assert.ok(parts.pressable !== null);
        assert.equal(parts.pressable.getAttribute('role'), 'button');
        const stateName = invalid ? 'Invalid' : complete ? 'Complete' : current ? 'Current' : 'Incomplete';
        assert.equal(parts.pressable.getAttribute('aria-label'), props.label + ' ' + stateName);

        // The step's bounds: the row's width and floor, the column's
        // minimum height when vertical
        if (vertical) {
          assert.equal(parts.root.style.minHeight, t['control.progress_step_vertical_min_height'] + 'px');
        } else {
          assert.equal(parts.root.style.width, t['control.progress_step_width'] + 'px');
          assert.equal(parts.root.style.minWidth, (props.spaceEqually === true ? t['control.progress_step_width'] : t['control.progress_step_min_width']) + 'px');
        }

        // The state glyph: the icon the state draws, filled by its cell
        assert.ok(parts.icon !== null);
        const iconLeaf = disabled ? 'progress_step_icon_disabled' : invalid ? 'progress_step_icon_invalid' : complete || current ? 'progress_step_icon' : 'progress_step_icon_incomplete';
        assert.equal(parts.icon.getAttribute('fill'), t['color.' + iconLeaf]);
        assert.equal(parts.icon.getAttribute('width'), String(t['size.icon_01']));
        assert.equal(parts.icon.style.marginTop, (vertical ? t['control.progress_step_vertical_icon_top'] : t['control.progress_step_icon_top']) + 'px');

        // The label: the family's type at the reference's own line-height
        // ratio, in the resting or disabled cell
        assert.equal(parts.label.textContent, props.label);
        assert.equal(parts.label.style.color, cssValue('color', t[disabled ? 'color.progress_step_label_disabled' : 'color.progress_step_label']));
        assert.equal(parts.label.style.fontSize, t['type.progress_step_label'].fontSize + 'px');
        assert.equal(parts.label.style.lineHeight, Math.round(t['type.progress_step_label'].fontSize * 1.45 * 100) / 100 + 'px');
        assert.equal(parts.label.style.marginTop, (vertical ? 0 : t['control.progress_step_label_gap']) + 'px');
        // The space-equal spread drops the label's max width, as upstream
        assert.equal(parts.label.style.maxWidth, props.spaceEqually === true && !vertical ? '' : (vertical ? t['control.progress_step_label_max_width_vertical'] : t['control.progress_step_label_max_width']) + 'px');

        // The secondary line: the offsets only in the row form, in flow
        // under the label in the column form
        const hasSecondary = typeof props.secondaryLabel === 'string';
        assert.equal(parts.secondary !== null, hasSecondary);
        if (hasSecondary) {
          assert.equal(parts.secondary.textContent, props.secondaryLabel);
          assert.equal(parts.secondary.style.color, cssValue('color', t['color.progress_step_secondary_label']));
          assert.equal(parts.secondary.style.fontSize, t['type.progress_step_secondary_label'].fontSize + 'px');
          if (!vertical) {
            assert.equal(parts.secondary.style.top, t['control.progress_step_secondary_label_top'] + 'px');
            assert.equal(parts.secondary.style.left, t['control.progress_step_secondary_label_start'] + 'px');
          }
        }

        // The connector line: filled with the complete cell once the step
        // is reached, the resting cell before
        assert.ok(parts.line !== null);
        assert.equal(parts.line.style.backgroundColor, cssValue('backgroundColor', t[complete || current ? 'color.progress_step_line_complete' : 'color.progress_step_line']));
        if (vertical) {
          assert.equal(parseFloat(parts.line.style.width), Math.max(t['control.progress_step_vertical_line_width'], 2));
        } else {
          assert.equal(parseFloat(parts.line.style.height), Math.max(t['control.progress_step_line_width'], 2));
          assert.equal(parts.line.style.width, props.spaceEqually === true ? '100%' : t['control.progress_step_width'] + 'px');
        }
      });
    }
  }

});


describe('ProgressStep: the press and the disabled step', function () {

  test('a clickable step fires onPress; a current step does not', async function () {
    const Registry = buildSystem('carbon', factories);
    const clicks = [];
    const parts = await renderStep(Registry, { label: 'A step', onPress: function () {
      clicks.push('fired');
    } });
    await fire(parts.pressable, new MouseEvent('click', { bubbles: true }));
    assert.deepEqual(clicks, ['fired']);

    const current = await renderStep(Registry, { current: true, label: 'B step', onPress: function () {
      clicks.push('current');
    } });
    await fire(current.pressable, new MouseEvent('click', { bubbles: true }));
    assert.deepEqual(clicks, ['fired']);
  });

  test('a disabled step draws the disabled cells and reports disabled', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderStep(buildSystem('carbon', factories), { disabled: true, label: 'Disabled step' });
    assert.equal(parts.pressable.getAttribute('aria-disabled'), 'true');
    assert.equal(parts.icon.getAttribute('fill'), t['color.progress_step_icon_disabled']);
    assert.equal(parts.label.style.color, cssValue('color', t['color.progress_step_label_disabled']));
  });

});
