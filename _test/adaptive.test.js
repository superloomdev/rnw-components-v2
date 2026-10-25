// Info: The adaptive engine seam (decisions 23-26, 33): the host resolves
// the form class from its window width and builds the theme's variants,
// the context reads `control.target_min` for every press target and applies
// the host's `textScale` to every type set clamped to
// `control.text_scale_max`, the native context switches the OS's own font
// scaling off so it is never applied twice, and the Toggle dispatcher
// mounts the host's OS switch adapter when the theme asks for a system
// widget, reporting `adapter_missing` through `config.onDiagnostic` when
// the host cannot supply one.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { FORM_CLASSES, resolveForm } from 'rnw-components';
import * as factories from 'rnw-components/all';
import { Lib, TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

// A factory that hands its context back so the tests can call it directly
function Probe (ctx) {
  function ProbeComponent () {
    return null;
  }
  ProbeComponent.ctx = ctx;
  return ProbeComponent;
}


/********************************************************************
Build the native projection of one template with build options.

@param {String} name    - 'default' | 'carbon' | 'material'
@param {Array}  layers  - Brand layers
@param {Object} options - buildTheme options: { variant, adaptive }

@return {Object} - The built theme
*********************************************************************/
function buildWith (name, layers, options) {

  return Lib.Themer.buildTheme(TEMPLATES[name], layers || [], 'native', options);

}


/********************************************************************
Build a system for a native platform answer (iOS), with the given adapter
map and config.

@param {Object} built     - Built theme
@param {Object} [adapterMap]  - shared_libs.adapters
@param {Object} [config]      - createSystem config

@return {Object} - The registry
*********************************************************************/
function nativeSystem (built, adapterMap, config) {

  const nativeLib = Object.assign({}, Lib, {
    ReactNative: Object.assign({}, Lib.ReactNative, { Platform: { OS: 'ios' } }),
    adapters: adapterMap
  });

  return buildSystem('default', factories, { built: built, config: config || {}, lib: nativeLib });

}


describe('adaptive: the host resolves the form class', function () {

  test('resolveForm maps 599, 600, 839 and 840 to compact, medium, medium, expanded', function () {
    assert.deepEqual(FORM_CLASSES, ['compact', 'medium', 'expanded']);
    assert.ok(Object.isFrozen(FORM_CLASSES));
    assert.equal(resolveForm(599), 'compact');
    assert.equal(resolveForm(600), 'medium');
    assert.equal(resolveForm(839), 'medium');
    assert.equal(resolveForm(840), 'expanded');
  });

});


describe('adaptive: the press target reads the theme', function () {

  test('pressTarget reads control.target_min on both axes', function () {
    const floor = function (min) {
      const built = buildWith('default', [{ tokens: { 'control.target_min': min } }]);
      return buildSystem('default', { Probe: Probe }, { built: built }).Probe.ctx;
    };
    const small = floor(24).pressTarget({ height: 16, width: 16 });
    assert.equal(small.width, 24);
    assert.equal(small.height, 24);
    const touch = floor(48).pressTarget({ height: 16, width: 16 });
    assert.equal(touch.width, 48);
    assert.equal(touch.height, 48);
  });

});


describe('adaptive: text scale', function () {

  test('typeStyle scales by the clamped text scale', function () {
    const base = buildNative('default').tokens['type.body_compact_01'];
    const ctx13 = buildSystem('default', { Probe: Probe }, { config: { textScale: 1.3 } }).Probe.ctx;
    const scaled = ctx13.typeStyle('body_compact_01');
    assert.equal(scaled.fontSize, base.fontSize * 1.3);
    assert.equal(scaled.lineHeight, base.lineHeight * 1.3);
    assert.equal(scaled.letterSpacing, base.letterSpacing * 1.3);
    // 3 clamps to the theme's maximum of 2
    const max = buildNative('default').tokens['control.text_scale_max'];
    assert.equal(max, 2, 'fixture: the default text scale ceiling is 2');
    const ctx3 = buildSystem('default', { Probe: Probe }, { config: { textScale: 3 } }).Probe.ctx;
    const clamped = ctx3.typeStyle('body_compact_01');
    assert.equal(clamped.fontSize, base.fontSize * 2);
    assert.equal(clamped.lineHeight, base.lineHeight * 2);
    assert.equal(clamped.letterSpacing, base.letterSpacing * 2);
  });

  test('native text wrappers switch off OS font scaling', async function () {
    const seen = { text: [], input: [] };
    function SpyText (props) {
      seen.text.push(props);
      return React.createElement(Lib.ReactNative.View);
    }
    function SpyTextInput (props) {
      seen.input.push(props);
      return React.createElement(Lib.ReactNative.View);
    }
    const nativeLib = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, {
        Platform: { OS: 'ios' },
        Text: SpyText,
        TextInput: SpyTextInput
      })
    });
    const ctx = buildSystem('default', { Probe: Probe }, { lib: nativeLib }).Probe.ctx;
    // The context's text components are the wrapped halves
    assert.notEqual(ctx.ReactNative.Text, SpyText);
    const container = await render(React.createElement(ctx.ReactNative.Text, null, 'x'));
    assert.equal(seen.text.length, 1);
    assert.equal(seen.text[0].allowFontScaling, false);
    // A caller's own prop wins
    await render(React.createElement(ctx.ReactNative.Text, { allowFontScaling: true }, 'x'));
    assert.equal(seen.text[1].allowFontScaling, true);
    await render(React.createElement(ctx.ReactNative.TextInput, null));
    assert.equal(seen.input[0].allowFontScaling, false);
    await cleanup();
  });

  test('the native namespace is wrapped without reading any other export', function () {
    let touched = false;
    const RN = Object.assign({}, Lib.ReactNative, { Platform: { OS: 'ios' } });
    Object.defineProperty(RN, 'PushNotificationIOS', { enumerable: true, get () { touched = true; throw new Error('removed module'); } });
    const ctx = buildSystem('default', { Probe: Probe }, { lib: Object.assign({}, Lib, { ReactNative: RN }) }).Probe.ctx;
    assert.equal(touched, false);
    assert.equal(ctx.ReactNative.View, RN.View);
    assert.notEqual(ctx.ReactNative.Text, RN.Text);
  });

});


describe('adaptive: selection labels read the theme', function () {

  test('selection labels read type.selection_label', async function () {
    const label = { type_set: true, font_family: 'sans', font_size: 21, weight: 700, letter_spacing: 0.5, line_height_px: 26 };
    const built = buildWith('default', [{ tokens: { 'type.selection_label': label } }]);
    const Registry = buildSystem('default', factories, { built: built });
    for (const name of ['Checkbox', 'RadioButton']) {
      const container = await render(React.createElement(Registry[name], { label: 'L' }));
      const target = container.querySelector('[role="checkbox"], [role="radio"]');
      // The label names the control through aria-labelledby
      const text = container.ownerDocument.getElementById(target.getAttribute('aria-labelledby'));
      assert.ok(text, name + ' draws a label');
      assert.equal(text.style.fontSize, '21px', name + ' label font size');
      assert.equal(text.style.fontWeight, '700', name + ' label font weight');
      await cleanup();
    }
  });

});


describe('adaptive: the compact form class', function () {

  test('a compact build moves the selection pitch and glyph', function () {
    const compact = buildWith('carbon', [], { variant: { form: 'compact', platform: 'web' } });
    assert.equal(compact.tokens['control.checkbox_size'], 20);
    assert.equal(compact.tokens['control.checkbox_group_gap'], 28);
    // The carbon compact selection label carries a fractional scale factor;
    // its product lands on 20 within float noise
    assert.ok(Math.abs(compact.tokens['type.selection_label'].lineHeight - 20) < 0.01, 'selection_label line height ~20');
    // The expanded base stays the web values
    const expanded = buildWith('carbon', [], { variant: { form: 'expanded', platform: 'web' } });
    assert.equal(expanded.tokens['control.target_min'], 24);
  });

});


describe('adaptive: the Toggle system widget', function () {

  function StubSwitch (props) {
    StubSwitch.calls.push(props);
    return React.createElement(Lib.ReactNative.View, { testID: 'stub-switch' });
  }

  test('Toggle draws the OS switch through the adapter under system', async function () {
    StubSwitch.calls = [];
    const built = buildWith('carbon', [], { variant: { form: 'expanded', platform: 'ios' } });
    assert.equal(built.tokens['anatomy.toggle_widget'], 'system', 'fixture: carbon platform.ios pins the system widget');
    const Registry = nativeSystem(built, { Switch: StubSwitch });
    const container = await render(React.createElement(Registry.Toggle, { label: 'L', checked: true }));
    assert.equal(StubSwitch.calls.length, 1);
    const props = StubSwitch.calls[0];
    assert.equal(props.value, true);
    assert.equal(typeof props.onValueChange, 'function');
    assert.equal(props.disabled, false);
    const t = built.tokens;
    assert.equal(props.trackColor.false, t['color.switch_track']);
    assert.equal(props.trackColor.true, t['color.switch_track_selected']);
    assert.equal(props.thumbColor, t['color.switch_handle_selected']);
    assert.equal(props.ios_backgroundColor, t['color.switch_track']);
    // The drawn switch is not mounted alongside the system widget
    assert.equal(container.querySelectorAll('[role="switch"]').length, 0);
    assert.ok(container.querySelector('[testid="stub-switch"], [data-testid="stub-switch"]'), 'the adapter rendered');
    await cleanup();
  });

  test('Toggle without its adapter draws the theme\'s switch and reports adapter_missing once', async function () {
    const records = [];
    const built = buildWith('carbon', [], { variant: { form: 'expanded', platform: 'ios' } });
    const Registry = nativeSystem(built, undefined, { onDiagnostic: function (record) {
      records.push(record);
    } });
    const container = await render(React.createElement('div', null,
      React.createElement(Registry.Toggle, { label: 'A' }),
      React.createElement(Registry.Toggle, { label: 'B' })));
    // Both toggles draw the theme's switch; the diagnostic is reported once
    // per system build, not per mount
    assert.equal(container.querySelectorAll('[role="switch"]').length, 2);
    assert.deepEqual(records, [{ adapter: 'Switch', code: 'adapter_missing', component: 'Toggle' }]);
    await cleanup();
  });

  test('Toggle on web always draws the theme\'s switch', async function () {
    StubSwitch.calls = [];
    const built = buildWith('carbon', [], { variant: { form: 'expanded', platform: 'ios' } });
    const Registry = buildSystem('carbon', factories, { built: built, lib: Object.assign({}, Lib, { adapters: { Switch: StubSwitch } }) });
    const container = await render(React.createElement(Registry.Toggle, { label: 'L' }));
    assert.equal(StubSwitch.calls.length, 0);
    assert.equal(container.querySelectorAll('[role="switch"]').length, 1);
    await cleanup();
  });

});
