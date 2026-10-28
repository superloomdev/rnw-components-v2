// Info: SelectableTag molecule. Every sample state renders a Tag toggling
// selected on press: the selectable container, label and outline cells per
// state, the selected mark where the theme shows one, `aria-pressed` on the
// pressable.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tag/sample.selectable-tag.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories);

}


/********************************************************************
Render one SelectableTag and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Props

@return {Promise<Object>} - { container, root, tag, label, layer, pressable, icon }
*********************************************************************/
async function renderSelectable (Registry, props) {

  const container = await render(React.createElement(Registry.SelectableTag, props));
  const root = container.firstElementChild;

  return {
    container: container,
    root: root,
    tag: root.children[0],
    label: root.querySelector('[dir="auto"]'),
    layer: root.children[1],
    pressable: root.querySelector('[role="button"]'),
    icon: root.children[0].querySelector('svg')
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


describe('SelectableTag: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the selectable cells, the outline and the mark', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const selected = props.selected === true;
        const parts = await renderSelectable(registryFor(template), props);

        // The container, label and border leaves per state: selected and
        // disabled reads its own pair
        const container = disabled && selected ? 'tag_selectable_container_selected_disabled'
          : disabled ? 'tag_container_disabled' : selected ? 'tag_selectable_container_selected' : 'tag_selectable_container';
        const textLeaf = disabled && selected ? 'tag_selectable_label_selected_disabled'
          : disabled ? 'tag_label_disabled' : selected ? 'tag_selectable_label_selected' : 'tag_selectable_label';
        const border = disabled ? 'tag_interactive_outline_disabled' : 'tag_selectable_outline';
        assert.equal(parts.tag.style.backgroundColor, cssValue('backgroundColor', t['color.' + container]));
        assert.equal(parts.label.style.color, cssValue('color', t['color.' + textLeaf]));
        const outlineWidth = t[selected ? 'control.tag_selectable_outline_width_selected' : 'control.tag_interactive_outline_width'];
        if (t['anatomy.tag_interactive_outline'] === 'border') {
          assert.equal(parts.tag.style.borderTopWidth, outlineWidth + 'px');
          assert.equal(parts.tag.style.borderTopColor, cssValue('borderColor', t['color.' + border]));
          assert.equal(parts.tag.style.boxShadow, '');
        } else {
          assert.equal(parts.tag.style.borderTopWidth, '');
          assert.equal(parts.tag.style.boxShadow, outlineWidth > 0 ? cssValue('boxShadow', 'inset 0 0 0 ' + outlineWidth + 'px ' + t['color.' + border]) : '');
        }

        // The selected mark: its seat mounts whenever the tag is selected
        // (or an icon is given) under every template; it draws the mark
        // where the theme shows one and mounts undrawn, taking no space,
        // where it does not - the element tree is the same everywhere
        const marked = selected && t['anatomy.tag_selected_mark'] === 'shown';
        if (selected || typeof props.icon === 'string') {
          assert.ok(parts.icon !== null);
          assert.equal(parts.icon.parentElement.style.display, selected && !marked && typeof props.icon !== 'string' ? 'none' : 'flex');
        } else {
          assert.equal(parts.icon, null);
        }

        // A toggle: role button, aria-pressed, named by the label
        assert.equal(parts.pressable.getAttribute('aria-pressed'), selected ? 'true' : 'false');
        assert.equal(parts.pressable.getAttribute('aria-label'), props.text);
        assert.equal(parts.pressable.getAttribute('aria-disabled'), disabled ? 'true' : null);
      });
    }
  }

});

describe('SelectableTag: press toggles the selection', function () {

  test('uncontrolled: a press selects, reports onChange and fills with the selected cells', async function () {
    const t = buildNative('carbon').tokens;
    const changes = [];
    const parts = await renderSelectable(registryFor('carbon'), { onChange: function (next) { changes.push(next); }, text: 'T' });
    assert.equal(parts.pressable.getAttribute('aria-pressed'), 'false');
    await fire(parts.pressable, new MouseEvent('click', { bubbles: true }));
    assert.deepEqual(changes, [true]);
    assert.equal(parts.pressable.getAttribute('aria-pressed'), 'true');
    assert.equal(parts.tag.style.backgroundColor, cssValue('backgroundColor', t['color.tag_selectable_container_selected']));
    assert.equal(parts.label.style.color, cssValue('color', t['color.tag_selectable_label_selected']));
    await fire(parts.pressable, new MouseEvent('click', { bubbles: true }));
    assert.deepEqual(changes, [true, false]);
    assert.equal(parts.pressable.getAttribute('aria-pressed'), 'false');
  });

  test('controlled: selected drives the fill and a press reports without mutating', async function () {
    const t = buildNative('carbon').tokens;
    const changes = [];
    const parts = await renderSelectable(registryFor('carbon'), { onChange: function (next) { changes.push(next); }, selected: false, text: 'T' });
    assert.equal(parts.tag.style.backgroundColor, cssValue('backgroundColor', t['color.tag_selectable_container']));
    await fire(parts.pressable, new MouseEvent('click', { bubbles: true }));
    assert.deepEqual(changes, [true]);
    assert.equal(parts.pressable.getAttribute('aria-pressed'), 'false');
  });

  test('a press layers the unselected active cell while unselected, the selected one while selected', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      const unselected = await renderSelectable(registryFor(template), { text: 'T' });
      await fire(unselected.pressable, new MouseEvent('mousedown', { bubbles: true }));
      assert.equal(unselected.layer.style.backgroundColor, cssValue('backgroundColor', t['color.tag_selectable_layer_unselected_active']));
      // Release the press before the next instance's, or the responder stays held
      await fire(unselected.pressable, new MouseEvent('mouseup', { bubbles: true }));
      const selected = await renderSelectable(registryFor(template), { selected: true, text: 'T' });
      await fire(selected.pressable, new MouseEvent('mousedown', { bubbles: true }));
      assert.equal(selected.layer.style.backgroundColor, cssValue('backgroundColor', t['color.tag_selectable_layer_active']), template + ' selected');
      await fire(selected.pressable, new MouseEvent('mouseup', { bubbles: true }));
    }
  });

  test('hover swaps to the hover cell', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderSelectable(registryFor('carbon'), { text: 'T' });
    await fire(parts.pressable, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.tag.style.backgroundColor, cssValue('backgroundColor', t['color.tag_selectable_container_hover']));
  });

});
