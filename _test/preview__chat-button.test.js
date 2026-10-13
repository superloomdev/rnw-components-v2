// Info: preview__ChatButton molecule. A pill-shaped Button in the small,
// medium or large size - or, with `isQuickAction`, a small `quick_action`
// button that fills while `isSelected`. An icon-free chat button ends with
// the button's own start padding.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render a chat button and return its root and label.

@param {Object} Registry - Registry
@param {Object} props    - ChatButton props

@return {Promise<Object>} - { root, label }
*********************************************************************/
async function renderButton (Registry, props) {

  const container = await render(React.createElement(Registry.preview__ChatButton, props));
  const root = container.querySelector('[role="button"]');

  // children[0] is the state layer, children[1] the label, as Button's
  return { root: root, label: root.children[1] };

}


for (const template of TEMPLATE_NAMES) {

  describe('preview__ChatButton / ' + template, function () {

    test('draws the pill: the corner is half the button\'s height at every size', async function () {
      const t = buildNative(template).tokens;
      const heights = { sm: 'size.size_small', md: 'size.size_medium', lg: 'control.button_height' };
      for (const size of Object.keys(heights)) {
        const parts = await renderButton(buildSystem(template, factories), { children: 'Chat', size: size });
        assert.equal(parts.root.style.height, t[heights[size]] + 'px', size + ' height, ' + template);
        assert.equal(parts.root.style.borderTopLeftRadius, t[heights[size]] / 2 + 'px', size + ' pill, ' + template);
        assert.equal(parts.root.style.borderBottomRightRadius, t[heights[size]] / 2 + 'px', size + ' pill, ' + template);
      }
    });

    test('a size outside sm/md/lg draws the large', async function () {
      const t = buildNative(template).tokens;
      const root = (await renderButton(buildSystem(template, factories), { children: 'Chat', size: 'xl' })).root;
      assert.equal(root.style.height, t['control.button_height'] + 'px', template);
      const missing = (await renderButton(buildSystem(template, factories), { children: 'Chat' })).root;
      assert.equal(missing.style.height, t['control.button_height'] + 'px', template);
    });

    test('an icon-free chat button ends with the button\'s own start padding', async function () {
      const t = buildNative(template).tokens;
      const start = t['control.button_padding_start'] - t['border.width_01'];
      const parts = await renderButton(buildSystem(template, factories), { children: 'Chat' });
      assert.equal(parts.root.style.paddingRight, start + 'px', template);
      assert.equal(parts.root.style.paddingLeft, start + 'px', template);
      const withIcon = (await renderButton(buildSystem(template, factories), { children: 'Chat', icon: 'add' })).root;
      assert.notEqual(withIcon.style.paddingRight, start + 'px', 'an icon keeps the icon slot\'s end, ' + template);
    });

    test('isQuickAction forces the quick-action kind and the small size', async function () {
      const t = buildNative(template).tokens;
      const parts = await renderButton(buildSystem(template, factories), {
        children: 'Quick action',
        isQuickAction: true,
        size: 'lg'
      });
      assert.equal(parts.root.style.height, t['size.size_small'] + 'px', 'forced small, ' + template);
      // The quick action is a ghost-style kind: the ghost paddings and the
      // quick-action cells
      assert.equal(parts.root.style.paddingLeft, t['control.button_ghost_padding_start'] - t['border.width_01'] + 'px', template);
      assert.equal(parts.label.style.color, cssValue('color', t['color.button_quick_action_label']), template);
      assert.equal(parts.root.style.backgroundColor, cssValue('backgroundColor', t['color.button_quick_action_container']), template);
    });

    test('isSelected draws the quick action\'s selected cells', async function () {
      const t = buildNative(template).tokens;
      const parts = await renderButton(buildSystem(template, factories), {
        children: 'Quick action',
        isQuickAction: true,
        isSelected: true
      });
      assert.equal(parts.root.style.backgroundColor, cssValue('backgroundColor', t['color.button_quick_action_container_selected']), template);
      assert.equal(parts.label.style.color, cssValue('color', t['color.button_quick_action_label_selected']), template);
    });

    test('a disabled quick action draws the disabled cells', async function () {
      const t = buildNative(template).tokens;
      const parts = await renderButton(buildSystem(template, factories), {
        children: 'Quick action',
        disabled: true,
        isQuickAction: true
      });
      assert.equal(parts.label.style.color, cssValue('color', t['color.button_quick_action_label_disabled']), template);
      assert.equal(parts.root.getAttribute('aria-disabled'), 'true', template);
    });

  });

}
