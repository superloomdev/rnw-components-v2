// Info: Slider molecule. Every template renders the same control: label,
// row of minimum bound, track host, maximum bound and the optional number
// field. The track paint is the family's shared geometry - inactive bar,
// center tick, filled portion, state layers, focus answer and handle
// face - and the semantic thumb is the expanded press target over it.
// These tests pin every declared geometry/color/type/shadow cell to its
// node, the two focus anatomies, the draft and keyboard contract, and the
// fact that generic selection focus cells never reach this paint.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/slider/sample.js';
import { composePaintGroup } from '../component/molecule/slider/slider-parts.js';
import { TEMPLATES, buildNative, buildSystem, LESSONS_LAYER } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
The named parts of one rendered slider.

@param {HTMLElement} container - Rendered container

@return {Object}
*********************************************************************/
function parts (container) {
  const input = container.querySelector('[data-testid="slider-input"]');
  const host = container.querySelector('[data-testid="slider-track"]');
  return {
    label: container.querySelector('[data-testid="slider-label"]'),
    row: container.querySelector('[data-testid="slider-row"]'),
    minimum: container.querySelector('[data-testid="slider-minimum"]'),
    maximum: container.querySelector('[data-testid="slider-maximum"]'),
    host: host,
    paintGroup: host === null ? null : Array.from(host.children).find(function (node) {
      return node.style.opacity !== '';
    }),
    inactive: container.querySelector('[data-testid="slider-inactive"]'),
    tick: container.querySelector('[data-testid="slider-tick"]'),
    filled: container.querySelector('[data-testid="slider-filled"]'),
    face: container.querySelector('[data-testid="slider-thumb-face"]'),
    layer: container.querySelector('[data-testid="slider-state-layer"]'),
    outerFocus: container.querySelector('[data-testid="slider-outer-focus"]'),
    thumb: container.querySelector('[role="slider"]'),
    input: input,
    frame: input === null ? null : input.parentElement,
    message: container.querySelector('[data-testid="slider-message"]'),
    container: container
  };

}


/********************************************************************
Dispatch one DOM event inside act.

@param {HTMLElement} element - Target
@param {Event}       event   - Event to dispatch
*********************************************************************/
async function fire (element, event) {
  await act(async function () {
    element.dispatchEvent(event);
  });
}


/********************************************************************
Send a key to an element, reporting whether default was prevented.

@param {HTMLElement} element   - Target
@param {String}      key       - KeyboardEvent key
@param {Boolean}     [shiftKey] - Held Shift

@return {Promise<Boolean>}
*********************************************************************/
async function keydown (element, key, shiftKey) {
  const event = new KeyboardEvent('keydown', { key: key, shiftKey: shiftKey === true, bubbles: true, cancelable: true });
  await fire(element, event);
  return event.defaultPrevented;
}


/********************************************************************
Type a value into the member input the way a user does.

@param {HTMLInputElement} input - The input
@param {String}           text  - Next value
*********************************************************************/
async function type (input, text) {
  await act(async function () {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}


/********************************************************************
Focus the thumb by the real delegated event path.
*********************************************************************/
async function focus (element) {
  await act(async function () {
    element.focus();
  });
}


/********************************************************************
Literal snapped value per sample state - never a re-derivation of the
implementation's grid math.
*********************************************************************/
const EXPECTED_VALUE = {
  'default': 50,
  'disabled': 50,
  'fractional': 0.2,
  'hidden input': 50,
  'hidden label': 50,
  'invalid': 50,
  'maximum': 100,
  'minimum': 0,
  'quarter': 25
};


/********************************************************************
Numeric style equality with a 1e-10 epsilon - jsdom serializes fractional
pixels through CSSOM, so exact float products can differ in the last bit.
*********************************************************************/
function near (actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-10,
    (message === undefined ? '' : message + ': ') + actual + ' ~ ' + expected);
}


/********************************************************************
DOM serialization of a group color: an '#rrggbbaa' child is quantized by
RNW processColor to an 8-bit alpha, then the DOM reports
normalizeColor's toFixed(2); anything else normalizes via cssValue.
*********************************************************************/
function groupColor (value) {

  const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(value);
  if (hex === null) {
    return cssValue('backgroundColor', value);
  }
  const alpha = Number.parseInt(hex[4], 16) / 255;
  if (alpha === 1) {
    return 'rgb(' + Number.parseInt(hex[1], 16) + ', ' + Number.parseInt(hex[2], 16) + ', ' + Number.parseInt(hex[3], 16) + ')';
  }
  return 'rgba(' + Number.parseInt(hex[1], 16) + ', ' + Number.parseInt(hex[2], 16) + ', ' +
    Number.parseInt(hex[3], 16) + ', ' + alpha.toFixed(2) + ')';

}


describe('slider-parts: composePaintGroup', function () {

  test('opaque colors keep group opacity 1 and their own strings', function () {
    const group = composePaintGroup({ a: '#112233', b: 'rgba(10, 20, 30, 1)' });
    assert.equal(group.opacity, 1);
    assert.equal(group.colors.a, '#112233');
    assert.equal(group.colors.b, 'rgba(10, 20, 30, 1)');
  });

  test('all-transparent colors keep opacity 1 and stay transparent', function () {
    const group = composePaintGroup({ a: 'rgba(1, 2, 3, 0)', b: '#00000000' });
    assert.equal(group.opacity, 1);
    assert.equal(group.colors.a, 'rgba(1, 2, 3, 0)');
    assert.equal(group.colors.b, '#00000000');
  });

  test('mixed alphas factor the largest; children keep their share', function () {
    const group = composePaintGroup({
      a: 'rgba(29, 27, 32, 0.12)',
      b: 'rgba(29, 27, 32, 0.38)',
      c: 'rgba(29, 27, 32, 0.38)'
    });
    assert.equal(group.opacity, 0.38);
    assert.equal(group.colors.a, '#1d1b2051', '0.12/0.38 quantizes to byte 0x51');
    assert.equal(group.colors.b, '#1d1b20ff', 'the maximum-alpha child is normalized to opaque inside the group');
    assert.equal(group.colors.c, '#1d1b20ff');
  });

  test('a single translucent child becomes opaque under its own alpha', function () {
    const group = composePaintGroup({ a: '#10203080' });
    assert.equal(group.opacity, 128 / 255);
    assert.equal(group.colors.a, '#102030ff');
  });

  test('malformed colors throw rather than guess', function () {
    assert.throws(function () {
      composePaintGroup({ a: 'blue' });
    }, TypeError);
    assert.throws(function () {
      composePaintGroup({ a: 5 });
    }, TypeError);
  });

});


describe('Slider: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': track paint, bounds and field from the theme', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const props = state.props;
        const container = await render(React.createElement(Registry.Slider, props));
        const node = parts(container);

        const min = props.min === undefined ? 0 : props.min;
        const max = props.max === undefined ? 100 : props.max;
        const value = EXPECTED_VALUE[state.label];
        const ratio = (value - min) / (max - min);
        const disabled = props.disabled === true;
        const invalid = props.invalid === true;
        const hiddenInput = props.hideTextInput === true;
        const hiddenLabel = props.hideLabel === true;

        const height = t['control.slider_height'];
        const minWidth = t['control.slider_min_width'];
        const trackInset = t['control.slider_track_inset'];
        const handleInset = t['control.slider_handle_inset'];
        const baseSize = t['control.slider_handle_size'];
        const trackHeight = t['control.slider_track_height'];
        const trackTop = (height - trackHeight) / 2;
        const handleCenter = handleInset + Math.max(0, minWidth - 2 * handleInset) * ratio;
        const paintedWidth = Math.max(0, minWidth - 2 * trackInset);
        const fillWidth = ratio >= 1 ? paintedWidth
          : Math.min(Math.max(handleCenter - trackInset, 0), paintedWidth);

        // The disabled paint composes per the theme's anatomy enum:
        // 'grouped' factors one shared opacity so the overlap never
        // doubles, 'independent' keeps each layer's own alpha; the
        // enabled paint is never factored
        const paintColors = {
          fill: t['color.' + (disabled ? 'slider_disabled' : 'slider_track_filled')],
          nub: t['color.' + (disabled ? 'slider_disabled' : 'slider_handle')],
          track: t['color.' + (disabled ? 'slider_track_disabled' : 'slider_track')]
        };
        const group = disabled && t['anatomy.slider_disabled_paint'] === 'grouped'
          ? composePaintGroup(paintColors) : { opacity: 1, colors: paintColors };

        // Label and message relations
        assert.equal(node.label.textContent, props.label, template);
        assert.equal(node.label.style.fontSize, t['type.field_label'].fontSize + 'px', template);
        assert.equal(node.label.style.color, cssValue('color', t['color.' + (disabled ? 'field_label_disabled' : 'field_label')]), template);
        if (hiddenLabel) {
          assert.equal(node.label.style.position, 'absolute', template + ': hidden label keeps its clipped box');
          assert.equal(node.label.style.width, '1px', template);
        } else {
          assert.equal(Number.parseFloat(node.label.style.marginBottom), t['spacing.spacing_03'], template);
        }
        if (invalid) {
          assert.equal(node.message.textContent, props.invalidText, template);
          assert.equal(node.message.style.color, cssValue('color', t['color.field_message_invalid']), template);
          assert.equal(node.message.style.fontSize, t['type.field_helper'].fontSize + 'px', template);
          assert.equal(node.message.style.marginTop, t['control.field_message_gap'] + 'px', template);
          assert.equal(Number.parseFloat(node.message.style.marginLeft || node.message.style.marginInlineStart), t['control.field_message_inset'], template);
        } else {
          assert.equal(node.message, null, template + ': no message without invalidText');
        }

        // Row and bounds
        assert.equal(node.row.style.flexDirection, 'row', template);
        assert.equal(node.row.style.alignItems, 'center', template);
        assert.equal(node.row.style.flexWrap, 'wrap', template);
        assert.equal(Number.parseFloat(node.row.style.gap), t['control.slider_gap'], template);
        assert.equal(node.minimum.textContent, String(min) + (props.minLabel || ''), template);
        assert.equal(node.maximum.textContent, String(max) + (props.maxLabel || ''), template);
        assert.equal(node.minimum.style.fontSize, t['type.slider_range_label'].fontSize + 'px', template);
        assert.equal(node.minimum.style.color, cssValue('color', t['color.' + (disabled ? 'field_value_disabled' : 'slider_range_label')]), template);

        // Track host and the shared paint nodes
        near(Number.parseFloat(node.host.style.minWidth), minWidth, template);
        near(Number.parseFloat(node.host.style.width), minWidth, template);
        near(Number.parseFloat(node.host.style.height), height, template);
        assert.equal(node.host.style.position, 'relative', template);
        near(Number.parseFloat(node.inactive.style.left), trackInset, template);
        near(Number.parseFloat(node.inactive.style.right), trackInset, template);
        near(Number.parseFloat(node.inactive.style.top), trackTop, template);
        near(Number.parseFloat(node.inactive.style.height), trackHeight, template);
        near(Number.parseFloat(node.inactive.style.borderTopLeftRadius), t['control.slider_track_radius'], template);
        assert.equal(node.inactive.style.backgroundColor, groupColor(group.colors.track), template);
        near(Number.parseFloat(node.filled.style.left), trackInset, template);
        near(Number.parseFloat(node.filled.style.top), trackTop, template);
        near(Number.parseFloat(node.filled.style.width), fillWidth, template + ' ' + state.label);
        assert.equal(node.filled.style.backgroundColor, groupColor(group.colors.fill), template);
        near(Number.parseFloat(node.paintGroup.style.opacity), group.opacity, template);
        assert.equal(node.tick.style.left, '50%', template);
        near(Number.parseFloat(node.tick.style.width), t['border.width_02'], template);
        near(Number.parseFloat(node.tick.style.height), t['control.slider_tick_height'], template);
        near(Number.parseFloat(node.tick.style.top), trackTop - t['border.width_01'] - t['control.slider_tick_height'], template);
        assert.equal(node.tick.style.backgroundColor, cssValue('backgroundColor', t['color.slider_track']), template + ': the tick keeps its authored color even while disabled');

        // Handle face, state layer and (outline-only) focus circle
        near(Number.parseFloat(node.face.style.left), handleCenter - baseSize / 2, template);
        near(Number.parseFloat(node.face.style.top), (height - baseSize) / 2, template);
        near(Number.parseFloat(node.face.style.width), baseSize, template);
        near(Number.parseFloat(node.face.style.borderTopLeftRadius), baseSize / 2, template);
        assert.equal(node.face.style.backgroundColor, groupColor(group.colors.nub), template);
        assert.equal(node.face.style.boxShadow,
          cssValue('boxShadow', t['shadow.' + (disabled ? 'slider_handle_disabled' : 'slider_handle')].boxShadow), template);
        // The inset focus discs stay mounted, hidden while unfocused
        assert.equal(node.face.children.length, 3, template + ': gap, core and pressed-ring discs stay mounted');
        assert.equal(node.face.children[0].style.display, 'none', template);
        assert.equal(node.face.children[1].style.display, 'none', template);
        assert.equal(node.face.children[2].style.display, 'none', template + ': the pressed ring hides at rest');
        near(Number.parseFloat(node.layer.style.width), t['control.slider_state_layer_size'], template);
        near(Number.parseFloat(node.layer.style.left), handleCenter - t['control.slider_state_layer_size'] / 2, template);
        if (disabled) {
          assert.equal(node.layer.style.display, 'none', template + ': the state-layer host hides while disabled');
        }
        // At rest the focus circle is mounted but undrawn under either
        // anatomy - only an outline template showing real focus reveals it
        assert.equal(node.outerFocus.style.display, 'none', template + ': no focus circle at rest');
        if (t['anatomy.slider_focus'] === 'outline') {
          near(Number.parseFloat(node.outerFocus.style.width), t['control.slider_focus_size'], template);
          near(Number.parseFloat(node.outerFocus.style.left), handleCenter - t['control.slider_focus_size'] / 2, template);
        }

        // The semantic thumb is the one tab stop, expanded to the press target
        assert.equal(node.thumb.getAttribute('role'), 'slider', template);
        assert.equal(node.thumb.getAttribute('aria-valuemin'), String(min), template);
        assert.equal(node.thumb.getAttribute('aria-valuemax'), String(max), template);
        assert.equal(node.thumb.getAttribute('aria-valuenow'), String(value), template + ' ' + state.label);
        assert.equal(node.thumb.getAttribute('aria-valuetext'), String(value), template);
        if (disabled) {
          assert.equal(node.thumb.getAttribute('tabindex'), '-1', template);
          assert.equal(node.thumb.getAttribute('aria-disabled'), 'true', template);
        } else {
          assert.equal(node.thumb.getAttribute('tabindex'), '0', template);
        }
        assert.ok(Number.parseFloat(node.thumb.style.width) >= t['control.target_min'], template + ': thumb is the press target');
        if (hiddenLabel) {
          assert.equal(node.thumb.getAttribute('aria-label'), props.accessibilityLabel, template);
        } else {
          assert.equal(node.thumb.getAttribute('aria-labelledby'), node.label.id, template + ': visible label names the thumb');
        }
        if (invalid) {
          assert.equal(node.thumb.getAttribute('aria-describedby'), node.message.id, template);
        }

        // The member field: a spinbutton at the slider's own widths, no
        // NumberInput (its 150 minimum and steppers never appear)
        if (hiddenInput) {
          assert.equal(node.input, null, template + ': hideTextInput removes the field');
          assert.equal(Number.parseFloat(node.thumb.parentElement.style.width), baseSize, template + ': the tooltip anchor is the base-sized face box');
        } else {
          assert.equal(node.input.getAttribute('role'), 'spinbutton', template);
          assert.equal(node.input.getAttribute('inputmode'), 'decimal', template);
          assert.equal(node.input.getAttribute('aria-valuemin'), String(min), template);
          assert.equal(node.input.getAttribute('aria-valuemax'), String(max), template);
          assert.equal(node.input.getAttribute('aria-valuenow'), String(value), template);
          assert.equal(node.input.getAttribute('aria-label'), props.inputLabel || props.label, template);
          assert.equal(node.input.value, String(value), template);
          assert.equal(Number.parseFloat(node.frame.style.width), t['control.' + (invalid ? 'slider_input_width_invalid' : 'slider_input_width')], template);
          assert.ok(Number.parseFloat(node.frame.style.width) < 150, template + ': not the NumberInput minimum');
          assert.equal(container.querySelectorAll('button').length, 0, template + ': no steppers');
          if (invalid) {
            assert.equal(node.input.getAttribute('aria-invalid'), 'true', template);
            assert.equal(node.input.getAttribute('aria-describedby'), node.message.id, template);
            assert.ok(node.frame.querySelector('svg') !== null, template + ': invalid icon');
          }
          if (disabled) {
            assert.equal(node.input.getAttribute('aria-disabled'), 'true', template);
            const disabledBorder = t['control.slider_input_outline_width_disabled'];
            if (t['feedback.field'] === 'underline') {
              near(Number.parseFloat(node.frame.style.borderBottomWidth), disabledBorder, template + ': disabled underline keeps its bottom border');
              assert.equal(Number.parseFloat(node.frame.style.borderTopWidth || '0'), 0, template + ': no invented top border');
              assert.equal(Number.parseFloat(node.frame.style.borderLeftWidth || '0'), 0, template + ': no invented side border');
              assert.equal(Number.parseFloat(node.frame.style.borderRightWidth || '0'), 0, template + ': no invented side border');
            } else {
              near(Number.parseFloat(node.frame.style.borderTopWidth), disabledBorder, template + ': disabled outline keeps its ring');
            }
          }
        }
      });
    }
  }

});


describe('Slider: focus anatomy', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': ' + 'a focused thumb paints the template\'s focus answer', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const container = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
      const node = parts(container);
      await focus(node.thumb);

      if (t['anatomy.slider_focus'] === 'outline') {
        // The outer circle takes the slider's own ring cells and shows
        assert.equal(node.outerFocus.style.display, '', template + ': the revealed circle');
        assert.equal(node.outerFocus.style.outlineStyle, 'solid', template);
        assert.equal(Number.parseFloat(node.outerFocus.style.outlineWidth), t['control.slider_focus_width'], template);
        assert.equal(node.outerFocus.style.outlineColor, cssValue('outlineColor', t['color.slider_focus_ring']), template);
        assert.equal(Number.parseFloat(node.outerFocus.style.outlineOffset), t['control.slider_focus_offset'], template);
        assert.equal(node.face.children.length, 3, template + ': inset discs stay mounted');
        assert.equal(node.face.children[0].style.display, 'none', template + ': hidden under outline anatomy');
        assert.equal(node.face.children[1].style.display, 'none', template);
        assert.equal(node.face.children[2].style.display, 'none', template + ': the pressed ring never draws under outline anatomy');
      } else {
        // Inset discs: ring face, page-colored gap, focus-colored core;
        // the outer circle stays mounted but hidden
        assert.equal(node.outerFocus.style.display, 'none', template);
        assert.equal(node.face.children.length, 3, template + ': gap, core and pressed-ring discs inside the face');
        assert.equal(node.face.children[2].style.display, 'none', template + ': the pressed ring stays hidden while only focused');
        const gap = node.face.children[0];
        const inner = node.face.children[1];
        assert.equal(gap.style.display, '', template + ': shown under inset focus');
        assert.equal(node.face.style.backgroundColor, cssValue('backgroundColor', t['color.slider_focus_ring']), template);
        assert.equal(Number.parseFloat(gap.style.left), t['control.slider_focus_width'], template);
        assert.equal(gap.style.backgroundColor, cssValue('backgroundColor', t['color.slider_handle_gap_focus']), template);
        assert.equal(Number.parseFloat(inner.style.left), t['control.slider_focus_width'] + t['control.slider_focus_gap_width'], template);
        assert.equal(inner.style.backgroundColor, cssValue('backgroundColor', t['color.slider_handle_focus']), template);
      }
    });
  }

});


describe('Slider: interaction states scale the base-sized face', function () {

  test('hover, focus and press grow the face by the theme ratio; disabled never grows', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', factories);
    const active = t['control.slider_handle_size_active'];
    const base = t['control.slider_handle_size'];
    const container = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
    const node = parts(container);

    // mouseenter is the useHover fallback jsdom selects
    await fire(node.thumb, new Event('mouseenter', { bubbles: false }));
    if (active === base) {
      assert.equal(node.face.style.transform, '', 'equal cells draw no transform');
    } else {
      assert.match(node.face.style.transform, /scale\(/, 'hover scales the face');
      assert.ok(node.face.style.transform.includes(String(active / base)) || node.face.style.transform.includes((active / base).toFixed(4)),
        'scale is ' + active + '/' + base);
    }

    // A pressed thumb without hover paints no hover wash: desktop hover
    // persists through press, so the press-only case needs a fresh render
    const pressBox = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
    const pressParts = parts(pressBox);
    await fire(pressParts.thumb, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    const layerChildren = parts(pressBox).layer.children;
    assert.equal(layerChildren[0].style.opacity, '0', 'a press alone does not invent hover');
    assert.equal(layerChildren[2].style.opacity, '1', 'the active wash shows');

    // A disabled face is never scaled
    const disabledBox = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50, disabled: true }));
    const disabledParts = parts(disabledBox);
    assert.equal(disabledParts.face.style.transform, '', 'disabled never grows');
  });

});


describe('Slider: keyboard, draft and controlled value', function () {

  test('thumb keys step the grid; Home and End reach the endpoints', async function () {
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
    const node = parts(container);
    assert.equal(await keydown(node.thumb, 'ArrowRight'), true);
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '51');
    assert.equal(node.input.value, '51', 'the draft echoes the requested number');
    assert.equal(await keydown(node.thumb, 'ArrowRight', true), true);
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '55', 'Shift steps by the multiplier');
    assert.equal(await keydown(node.thumb, 'PageUp'), true);
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '59');
    assert.equal(await keydown(node.thumb, 'Home'), true);
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '0');
    assert.equal(await keydown(node.thumb, 'End'), true);
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '100');
    assert.equal(await keydown(node.thumb, 'x'), false, 'unhandled keys do not preventDefault');
  });

  test('the input is a text draft: arrows delegate, Enter commits, malformed stays put', async function () {
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
    const node = parts(container);

    // Arrows in the field step the same value
    await keydown(node.input, 'ArrowUp');
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '51');
    assert.equal(node.input.value, '51');

    // A malformed draft stays verbatim, invalid, and never moves the thumb
    await type(node.input, '-');
    assert.equal(node.input.value, '-');
    assert.equal(node.input.getAttribute('aria-invalid'), 'true');
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '51');
    assert.equal(node.input.getAttribute('aria-valuenow'), '51');

    // Enter commits: the draft resets to the actual value
    await keydown(node.input, 'Enter');
    assert.equal(node.input.value, '51');
    assert.equal(node.input.getAttribute('aria-invalid'), null);

    // A valid typed number requests immediately
    await type(node.input, '80');
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '80');

    // Out of range stays the draft until a commit clamps it
    await type(node.input, '999');
    assert.equal(node.input.value, '999');
    assert.equal(node.input.getAttribute('aria-invalid'), 'true');
    await keydown(node.input, 'Enter');
    assert.equal(node.input.value, '100');
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '100');
  });

  test('a controlled value reports but retains until the parent supplies it', async function () {
    const Registry = buildSystem('carbon', factories);
    const calls = [];
    const container = await render(React.createElement(Registry.Slider, {
      label: 'Volume',
      value: 50,
      onChange: function (next) { calls.push(next); }
    }));
    const node = parts(container);
    await keydown(node.thumb, 'ArrowRight');
    assert.deepEqual(calls, [51]);
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '50', 'controlled value retains');
  });

  test('a controlled parent accepting onChange rerenders to the new value', async function () {
    const Registry = buildSystem('carbon', factories);
    function Controlled () {
      const [value, setValue] = React.useState(50);
      return React.createElement(Registry.Slider, { label: 'Volume', value: value, onChange: setValue });
    }
    const container = await render(React.createElement(Controlled));
    const node = parts(container);
    await keydown(node.thumb, 'ArrowRight');
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '51');
    assert.equal(node.input.value, '51');
  });

  test('disabled ignores keys and keeps its value', async function () {
    const Registry = buildSystem('carbon', factories);
    const calls = [];
    const container = await render(React.createElement(Registry.Slider, {
      label: 'Volume',
      defaultValue: 50,
      disabled: true,
      onChange: function (next) { calls.push(next); }
    }));
    const node = parts(container);
    assert.equal(await keydown(node.thumb, 'ArrowRight'), false);
    assert.equal(node.thumb.getAttribute('aria-valuenow'), '50');
    assert.deepEqual(calls, []);
  });

});


describe('Slider: brand layers', function () {

  test('custom track and handle insets, focus widths and sizes reach their paint nodes', async function () {
    const layers = [{ name: 'brand', tokens: {
      'control.slider_track_inset': 33,
      'control.slider_handle_inset': 11,
      'control.slider_handle_size': 22,
      'control.slider_focus_width': 7,
      'control.slider_focus_gap_width': 4
    } }];
    const t = buildNative('default', layers).tokens;
    const Registry = buildSystem('default', factories, { layers: layers });
    const container = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
    const node = parts(container);

    assert.equal(Number.parseFloat(node.inactive.style.left), 33, 'track inset');
    assert.equal(Number.parseFloat(node.inactive.style.right), 33, 'track inset');
    assert.equal(Number.parseFloat(node.face.style.width), 22, 'handle size');
    // The handle seats inside its own inset, not the track's
    const center = 11 + Math.max(0, t['control.slider_min_width'] - 2 * 11) * 0.5;
    assert.equal(Number.parseFloat(node.face.style.left), center - 11, 'handle inset centers the face');

    // Focused: the inset discs take the overridden widths
    await focus(node.thumb);
    assert.equal(Number.parseFloat(node.face.children[0].style.left), 7, 'focus width');
    assert.equal(Number.parseFloat(node.face.children[1].style.left), 11, 'focus width plus gap');
  });

  test('enabled translucency is never factored: group opacity stays 1 and each color keeps its alpha', async function () {
    const layers = [{ name: 'brand', tokens: {
      'color.slider_track': 'rgba(10, 20, 30, 0.5)',
      'color.slider_track_filled': 'rgba(10, 20, 30, 0.5)',
      'color.slider_handle': 'rgba(10, 20, 30, 0.5)'
    } }];
    const Registry = buildSystem('default', factories, { layers: layers });
    const container = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
    const node = parts(container);
    assert.equal(node.paintGroup.style.opacity, '1', 'no group fade when enabled');
    assert.equal(node.inactive.style.backgroundColor, 'rgba(10, 20, 30, 0.5)', 'track keeps its alpha');
    assert.equal(node.filled.style.backgroundColor, 'rgba(10, 20, 30, 0.5)', 'fill keeps its alpha');
    assert.equal(node.face.style.backgroundColor, 'rgba(10, 20, 30, 0.5)', 'nub keeps its alpha');
  });

  test('generic selection focus cells never reach the slider paint', async function () {
    const layers = [{ name: 'brand', tokens: {
      'control.selection_focus_width': 9,
      'color.selection_focus_ring': '#ff0000',
      'color.selection_outline_focus': '#ff0000',
      'color.selection_container_focus': '#ff0000'
    } }];
    for (const template of ['default', 'carbon']) {
      const t = buildNative(template, layers).tokens;
      const Registry = buildSystem(template, factories, { layers: layers });
      const container = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
      const node = parts(container);
      await focus(node.thumb);
      if (t['anatomy.slider_focus'] === 'outline') {
        assert.equal(node.outerFocus.style.outlineColor, cssValue('outlineColor', t['color.slider_focus_ring']),
          template + ': ring is the slider cell, not selection');
        assert.equal(Number.parseFloat(node.outerFocus.style.outlineWidth), t['control.slider_focus_width'],
          template + ': width is the slider cell, not selection');
      } else {
        assert.equal(node.face.style.backgroundColor, cssValue('backgroundColor', t['color.slider_focus_ring']),
          template + ': face is the slider cell, not selection');
      }
    }
  });

});


describe('Slider: formatted spoken value', function () {

  test('formatLabel feeds aria-valuetext and the bound labels', async function () {
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Slider, {
      label: 'Volume',
      defaultValue: 50,
      formatLabel: function (value) { return value + ' dB'; }
    }));
    const node = parts(container);
    assert.equal(node.thumb.getAttribute('aria-valuetext'), '50 dB');
    assert.equal(node.minimum.textContent, '0 dB');
    assert.equal(node.maximum.textContent, '100 dB');
  });

});


describe('Slider: disabled paint composition', function () {

  test('independent disabled paints retain separate alpha layers', async function () {
    const layers = [{ name: 'brand', tokens: {
      'color.slider_disabled': 'rgba(141, 141, 141, 0.5)',
      'color.slider_track_disabled': 'rgba(141, 141, 141, 0.5)'
    } }];
    const Registry = buildSystem('carbon', factories, { layers: layers });
    const container = await render(React.createElement(Registry.Slider, {
      label: 'Volume',
      defaultValue: 50,
      disabled: true
    }));
    const node = parts(container);
    assert.equal(node.paintGroup.style.opacity, '1', 'independent layers keep their own alpha');
    assert.equal(node.inactive.style.backgroundColor, 'rgba(141, 141, 141, 0.5)', 'track keeps its alpha');
    assert.equal(node.filled.style.backgroundColor, 'rgba(141, 141, 141, 0.5)', 'fill keeps its alpha');
    assert.equal(node.face.style.backgroundColor, 'rgba(141, 141, 141, 0.5)', 'nub keeps its alpha');
  });

  test('the grouped disabled paint factors its alpha; children carry un-factored colors', function () {

    // Carbon's disabled paints are opaque, so the grouped share is 1 and the
    // grouped render matches independent - the branch is exercised through
    // composePaintGroup directly
    const translucent = composePaintGroup({
      fill: 'rgba(29, 27, 32, 0.76)',
      track: 'rgba(29, 27, 32, 0.38)'
    });
    assert.equal(translucent.opacity, 0.76);
    assert.equal(translucent.colors.track, '#1d1b2080');
    const opaque = composePaintGroup({ fill: '#c6c6c6', track: '#e0e0e0' });
    assert.equal(opaque.opacity, 1);
    assert.equal(opaque.colors.track, '#e0e0e0');
  });

  test('under the lessons layer the grouped pick draws one shared opacity where independent keeps per-part rgba', async function () {
    const groupedSystem = buildSystem('carbon', factories, { built: buildNative('carbon', [LESSONS_LAYER]) });
    const groupedBox = await render(React.createElement(groupedSystem.Slider, {
      label: 'Volume',
      defaultValue: 50,
      disabled: true
    }));
    const groupedNode = parts(groupedBox);
    assert.equal(Number.parseFloat(groupedNode.paintGroup.style.opacity), 0.38);
    assert.equal(groupedNode.inactive.style.backgroundColor, 'rgba(29, 27, 32, 0.32)');
    assert.equal(groupedNode.filled.style.backgroundColor, 'rgb(29, 27, 32)');
    const independentSystem = buildSystem('carbon', factories, { built: buildNative('carbon', [{ name: 'enum', tokens: { 'anatomy.slider_disabled_paint': 'independent', 'color.slider_disabled': 'rgba(29, 27, 32, 0.38)', 'color.slider_track_disabled': 'rgba(29, 27, 32, 0.12)' } }]) });
    const independentBox = await render(React.createElement(independentSystem.Slider, {
      label: 'Volume',
      defaultValue: 50,
      disabled: true
    }));
    const independentNode = parts(independentBox);
    assert.equal(independentNode.paintGroup.style.opacity, '1');
    assert.equal(independentNode.inactive.style.backgroundColor, 'rgba(29, 27, 32, 0.12)');
    assert.equal(independentNode.filled.style.backgroundColor, 'rgba(29, 27, 32, 0.38)');
  });

});


describe('Slider: hidden-field tooltip member', function () {

  test('the value badge reads the member\'s tighter inline padding', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Slider, {
      label: 'Volume',
      defaultValue: 50,
      hideTextInput: true
    }));
    const thumb = container.querySelector('[role="slider"]');
    await focus(thumb);
    // The compact tooltip opens after its 100 ms open delay
    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, 150);
      });
    });
    const popover = container.querySelector('[role="tooltip"]');
    assert.notEqual(popover, null, 'the hidden field leaves the badge on the thumb');
    assert.equal(popover.firstElementChild.style.paddingLeft, t['spacing.spacing_03'] + 'px',
      'the badge pins the tighter spacing, not the shared inline cell');
    assert.notEqual(t['spacing.spacing_03'], t['control.tooltip_padding_inline'],
      'the member cell must differ from the role default to prove the seam');
  });

});


describe('Slider: pressed inset stroke', function () {

  test('pressed inset focus paints a second ring over the scaled face', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50 }));
    const node = parts(container);
    await fire(node.thumb, new MouseEvent('mousedown', { bubbles: true, button: 0 }));

    const ring = node.face.children[2];
    assert.equal(ring.style.display, '', 'the pressed ring draws under the inset anatomy');
    assert.equal(Number.parseFloat(ring.style.borderTopWidth), t['control.slider_focus_width'], 'its own focus-width cell');
    assert.equal(ring.style.borderTopColor, cssValue('borderTopColor', t['color.slider_focus_ring']), 'its own ring color');
    assert.equal(ring.style.position, 'absolute');
    assert.equal(Number.parseFloat(ring.style.left), 0);
    assert.equal(Number.parseFloat(ring.style.right), 0);
    assert.equal(node.face.children[0].style.display, 'none', 'gap stays hidden while pressed');
    assert.equal(node.face.children[1].style.display, 'none', 'core stays hidden while pressed');

    const outlined = buildSystem('carbon', factories, { built: buildNative('carbon', [LESSONS_LAYER]) });
    const outlinedNode = parts(await render(React.createElement(outlined.Slider, { label: 'Volume', defaultValue: 50 })));
    await fire(outlinedNode.thumb, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(outlinedNode.face.children[2].style.display, 'none', 'the outline anatomy never shows the ring');

    const disabledBox = await render(React.createElement(Registry.Slider, { label: 'Volume', defaultValue: 50, disabled: true }));
    const disabledNode = parts(disabledBox);
    assert.equal(disabledNode.face.children[2].style.display, 'none', 'disabled never shows the ring');
  });

});
