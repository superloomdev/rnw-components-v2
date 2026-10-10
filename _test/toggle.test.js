// Info: Toggle molecule. Every sample state renders under all three
// templates with its track, handle, layer, mark and texts read from the
// theme's switch role cells; the handle slides inside a track-height zone
// at the unchecked or checked end, `grows` reads the pressed and selected
// sizes and `shown` renders the on/off text; press and Space drive the
// state through the DOM; the accessibility answer is a labelled switch
// that is checked or disabled exactly when it says so.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/switch/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Build a registry for a template, optionally with token overrides.

@param {String} template  - Template name
@param {Object} overrides - Token name -> value

@return {Object} - Registry
*********************************************************************/
function registryFor (template, overrides) {

  const built = buildNative(template);
  const tokens = Object.assign({}, built.tokens, overrides || {});

  return buildSystem(template, factories, { built: Object.assign({}, built, { tokens: tokens }) });

}


/********************************************************************
Render one Toggle and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Toggle props

@return {Promise<Object>} - { root, label, row, track, layer, handle, mark, stateText }
*********************************************************************/
async function renderToggle (Registry, props) {

  const container = await render(React.createElement(Registry.Toggle, props));
  const root = container.querySelector('[role="switch"]');
  const row = root.children[1];
  const track = row.children[0];

  return {
    root: root,
    label: root.children[0],
    row: row,
    track: track,
    layer: track.children[0],
    handle: track.children[1],
    mark: track.children[2] || null,
    stateText: row.children[1] || null
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


/********************************************************************
The sizes the theme says a variant's handle reads.

@param {Object} t      - Theme tokens
@param {String} size   - 'sm' or another size
@param {String} key    - '' | 'Selected' | 'Pressed'

@return {Number} - Handle size in px
*********************************************************************/
function handleSizeFor (t, size, key) {

  if (t['anatomy.switch_handle'] !== 'grows') {
    key = '';
  }
  const small = size === 'sm' ? t['size.icon_01'] - t['spacing.spacing_02'] - t['spacing.spacing_01'] : null;
  const base = size === 'sm' ? small : t['control.switch_handle_size'];
  if (key === 'Pressed') {
    return size === 'sm' ? small : t['control.switch_handle_size_pressed'];
  }
  if (key === 'Selected') {
    return size === 'sm' ? small : t['control.switch_handle_size_selected'];
  }
  return base;

}


describe('Toggle: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.name + ': track, handle, mark and texts come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const selected = props.checked === true;
        const small = props.size === 'sm';
        const phase = disabled ? '_disabled' : '';
        const parts = await renderToggle(registryFor(template), props);

        // Track geometry and colors; the border draws only while unchecked
        const trackWidth = small ? t['size.size_small'] : t['control.switch_track_width'];
        const trackHeight = small ? t['size.icon_01'] : t['control.switch_track_height'];
        assert.equal(parts.track.style.width, trackWidth + 'px');
        assert.equal(parts.track.style.height, trackHeight + 'px');
        assert.equal(parts.track.style.borderTopLeftRadius, t['shape.radius_max'] + 'px');
        assert.equal(parts.track.style.borderTopWidth, selected ? '0px' : t['control.switch_outline_width'] + 'px');
        assert.equal(parts.track.style.borderTopColor, cssValue('borderTopColor', t['color.switch_outline' + phase]));
        assert.equal(parts.track.style.backgroundColor, cssValue('backgroundColor', t['color.switch_track' + (selected ? '_selected' : '') + phase]));

        // The handle, centered in the end-anchored zone; a `skin` edge costs no
        // room, so the active border width comes back out of the offset
        const inset = t['anatomy.switch_edge'] === 'skin' ? (selected ? 0 : t['control.switch_outline_width']) : 0;
        const handleSize = handleSizeFor(t, props.size, selected ? 'Selected' : '');
        assert.equal(parts.handle.style.width, handleSize + 'px');
        assert.equal(parts.handle.style.height, handleSize + 'px');
        assert.equal(parts.handle.style.borderTopLeftRadius, t['shape.radius_max'] + 'px');
        assert.equal(parts.handle.style.backgroundColor, cssValue('backgroundColor', t['color.switch_handle' + (selected ? '_selected' : '') + phase]));
        assert.equal(parts.handle.style.left, ((selected ? trackWidth - trackHeight : 0) + (trackHeight - handleSize) / 2 - inset) + 'px');
        assert.equal(parts.handle.style.top, ((trackHeight - handleSize) / 2 - inset) + 'px');

        // The slide: `grows` animates size too, `fixed` position only
        assert.equal(parts.handle.style.transitionProperty, t['anatomy.switch_handle'] === 'grows' ? 'left, width, height, background-color' : 'left, background-color');
        assert.equal(parts.handle.style.transitionDuration, t['motion.duration_moderate_02'] + 'ms');

        // The state layer disc centers on the zone and rests hidden
        const zoneX = selected ? trackWidth - trackHeight : 0;
        const layerOffset = (trackHeight - t['control.selection_layer_size']) / 2 - inset;
        assert.equal(parts.layer.style.width, t['control.selection_layer_size'] + 'px');
        assert.equal(parts.layer.style.left, zoneX + layerOffset + 'px');
        assert.equal(parts.layer.style.top, layerOffset + 'px');
        assert.equal(parts.layer.style.visibility, 'hidden');

        // The mark renders under `sm`, shown only once checked
        const markSize = t['size.icon_01'] - t['spacing.spacing_02'] - t['spacing.spacing_01'] - t['spacing.spacing_01'] * 2;
        assert.equal(parts.mark === null, !small);
        if (small) {
          assert.equal(parts.mark.getAttribute('width'), String(markSize));
          assert.equal(parts.mark.getAttribute('height'), String(markSize));
          assert.equal(parts.mark.style.left, (trackWidth - trackHeight + (trackHeight - markSize) / 2 - inset) + 'px');
          assert.equal(parts.mark.style.visibility, selected ? 'visible' : 'hidden');
        }

        // The label and the on/off text where the theme shows it
        assert.equal(parts.label.textContent, props.label);
        assert.equal(parts.label.style.fontSize, t['type.label01'].fontSize + 'px');
        assert.equal(parts.label.style.color, cssValue('color', t['color.' + (disabled ? 'text_disabled' : 'text_secondary')]));
        assert.equal(parts.label.style.marginBottom, t['spacing.spacing_05'] + 'px');
        assert.equal(parts.stateText.style.display, t['anatomy.switch_state_text'] === 'shown' ? 'flex' : 'none');
        if (t['anatomy.switch_state_text'] === 'shown') {
          assert.equal(parts.stateText.textContent, selected ? props.onText : props.offText);
          assert.equal(parts.stateText.getAttribute('aria-hidden'), 'true');
          assert.equal(parts.stateText.style.fontSize, t['type.body01'].fontSize + 'px');
          assert.equal(parts.stateText.style.color, cssValue('color', t['color.' + (disabled ? 'text_disabled' : 'text_primary')]));
          assert.equal(parts.stateText.style.marginLeft, t['spacing.spacing_03'] + 'px');
        }

        // Accessibility answer
        assert.equal(parts.root.getAttribute('aria-checked'), String(selected));
        assert.equal(parts.root.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(parts.root.getAttribute('aria-labelledby'), parts.label.id);
        assert.equal(parts.root.getAttribute('tabindex'), disabled ? '-1' : '0');
      });
    }
  }

});


describe('Toggle: state through the DOM', function () {

  test('press and Space toggle an uncontrolled switch and report the next value', async function () {
    const calls = [];
    const parts = await renderToggle(registryFor('carbon'), { label: 'L', onChange: function (next) { calls.push(next); } });
    await act(async function () {
      parts.root.click();
    });
    assert.equal(parts.root.getAttribute('aria-checked'), 'true');
    await act(async function () {
      parts.root.click();
    });
    assert.equal(parts.root.getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, [true, false]);
    const spare = await renderToggle(registryFor('carbon'), { label: 'S', onChange: function (next) { calls.push(next); } });
    await fire(spare.root, new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    assert.equal(spare.root.getAttribute('aria-checked'), 'true');
    assert.deepEqual(calls, [true, false, true]);
  });

  test('a controlled switch reports the press and keeps the caller\'s state', async function () {
    const calls = [];
    const parts = await renderToggle(registryFor('carbon'), { label: 'L', checked: true, onChange: function (next) { calls.push(next); } });
    await act(async function () {
      parts.root.click();
    });
    assert.equal(parts.root.getAttribute('aria-checked'), 'true');
    assert.deepEqual(calls, [false]);
  });

  test('disabled switch ignores press and Space', async function () {
    const calls = [];
    const parts = await renderToggle(registryFor('carbon'), { label: 'D', disabled: true, onChange: function (next) { calls.push(next); } });
    await act(async function () {
      parts.root.click();
    });
    await fire(parts.root, new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    assert.equal(parts.root.getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, []);
  });

  test('the state layer shows only under the ripple press presentation, centered on the zone', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderToggle(registryFor('material'), { label: 'L' });
    await fire(parts.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(parts.layer.style.visibility, 'visible');
    assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', t['color.switch_layer_hover']));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', t['color.switch_layer_active']));
    const checked = await renderToggle(registryFor('material'), { label: 'L', checked: true });
    await fire(checked.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(checked.layer.style.backgroundColor, cssValue('backgroundColor', t['color.switch_layer_selected_hover']));
    // Under `highlight` the track paints the state fill and the layer stays hidden
    const carbon = await renderToggle(registryFor('carbon'), { label: 'L' });
    await fire(carbon.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(carbon.layer.style.visibility, 'hidden');
    assert.equal(carbon.track.style.backgroundColor, cssValue('backgroundColor', buildNative('carbon').tokens['color.switch_track_hover']));
  });

  test('a grows switch reads the pressed and selected handle sizes; a fixed one reads the base', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderToggle(registryFor('material'), { label: 'L' });
    assert.equal(parts.handle.style.width, t['control.switch_handle_size'] + 'px');
    const checked = await renderToggle(registryFor('material'), { label: 'L', checked: true });
    assert.equal(checked.handle.style.width, t['control.switch_handle_size_selected'] + 'px');
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.handle.style.width, t['control.switch_handle_size_pressed'] + 'px');
    // The pressed handle stays centered in the unchecked zone, growing past
    // the track edge; under `skin` the unchecked border comes back out
    assert.equal(parts.handle.style.left, ((t['control.switch_track_height'] - t['control.switch_handle_size_pressed']) / 2 - t['control.switch_outline_width']) + 'px');
    const carbon = await renderToggle(registryFor('carbon'), { label: 'L', checked: true });
    assert.equal(carbon.handle.style.width, buildNative('carbon').tokens['control.switch_handle_size'] + 'px');
    await fire(carbon.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(carbon.handle.style.width, buildNative('carbon').tokens['control.switch_handle_size'] + 'px');
  });

  test('hover and press read the state cells for handle and outline', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderToggle(registryFor('material'), { label: 'L' });
    await fire(parts.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(parts.handle.style.backgroundColor, cssValue('backgroundColor', t['color.switch_handle_hover']));
    assert.equal(parts.track.style.borderTopColor, cssValue('borderTopColor', t['color.switch_outline_hover']));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.handle.style.backgroundColor, cssValue('backgroundColor', t['color.switch_handle_active']));
    const checked = await renderToggle(registryFor('material'), { label: 'L', checked: true });
    await fire(checked.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(checked.handle.style.backgroundColor, cssValue('backgroundColor', t['color.switch_handle_selected_hover']));
    assert.equal(checked.track.style.borderTopWidth, '0px');
  });

  test('focus draws the ring on the track; a pointer-driven focus shows it only where the theme says any', async function () {
    for (const template of ['carbon', 'material']) {
      const t = buildNative(template).tokens;
      const parts = await renderToggle(registryFor(template), { label: 'L' });
      assert.equal(parts.track.style.outlineWidth, '');
      await act(async function () {
        parts.root.focus();
      });
      assert.equal(parts.track.style.outlineWidth, t['control.switch_focus_width'] + 'px', template);
      assert.equal(parts.track.style.outlineOffset, t['control.switch_focus_offset'] + 'px', template);
      assert.equal(parts.track.style.outlineColor, cssValue('outlineColor', t['color.switch_focus_ring']), template);
      assert.equal(parts.root.style.outlineStyle, 'none');
    }
    const material = await renderToggle(registryFor('material'), { label: 'L' });
    await fire(material.root, new Event('pointerdown', { bubbles: true }));
    await act(async function () {
      material.root.focus();
    });
    assert.equal(material.track.style.outlineWidth, '');
  });

  test('the ring stays drawn through a press where the theme rings on any focus', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderToggle(registryFor('carbon'), { label: 'L' });
    await fire(parts.root, new Event('pointerdown', { bubbles: true }));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.track.style.outlineWidth, t['control.switch_focus_width'] + 'px');
    assert.equal(parts.track.style.outlineColor, cssValue('outlineColor', t['color.switch_focus_ring']));
  });

});
