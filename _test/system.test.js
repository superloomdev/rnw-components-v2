// Info: createSystem and the component context.
//
// The seam between a built theme and the components: required tokens are
// checked through the engine and every gap is named in one TypeError; the
// theme must be the native projection; enum reads are checked against the
// contract; icon reads pick the set's own glyph for a size and never
// substitute; metrics resolve through a factory's spec sheet.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { createSystem, REQUIRED_ICONS, REQUIRED_TOKENS, SUPPORTED_TOKENS } from 'rnw-components';
import { Lib, TEMPLATES, buildNative, buildSystem } from './harness/system.js';

// A factory that hands its context back so the tests can call it directly
function Probe (ctx) {
  function ProbeComponent () {
    return null;
  }
  ProbeComponent.ctx = ctx;
  return ProbeComponent;
}
Probe.spec = {
  height: 'size.size_medium',
  inner: { tokens: ['size.size_medium', 'border.width_01'], operation: 'subtract' },
  doubled: { tokens: ['spacing.spacing_05', 'spacing.spacing_05'], operation: 'sum' },
  decided: { constant: 3 },
  broken: { tokens: ['spacing.spacing_05'], operation: 'multiply' }
};

const TEMPLATE_NAMES = Object.keys(TEMPLATES);


describe('createSystem: declared requirements', function () {

  test('REQUIRED_TOKENS, SUPPORTED_TOKENS and REQUIRED_ICONS are frozen arrays of unique names', function () {
    for (const list of [REQUIRED_TOKENS, SUPPORTED_TOKENS, REQUIRED_ICONS]) {
      assert.ok(Array.isArray(list) && Object.isFrozen(list));
      assert.equal(new Set(list).size, list.length);
    }
    for (const name of REQUIRED_TOKENS) {
      assert.ok(SUPPORTED_TOKENS.includes(name), name + ' is required, so it is supported');
    }
  });

  test('every required token is in the contract', function () {
    const contract = Lib.Themer.getContract();
    const unknown = REQUIRED_TOKENS.filter(function (name) {
      return contract.tokens[name] === undefined;
    });
    assert.deepEqual(unknown, []);
  });

});


describe('createSystem: validation', function () {

  test('rejects a missing shared lib, naming every gap', function () {
    assert.throws(function () {
      createSystem({ Utils: Lib.Utils, React: Lib.React }, {}, buildNative('default'), 'md', {});
    }, /requires shared_libs\.ReactNative, shared_libs\.Svg, shared_libs\.Debug, shared_libs\.Themer/);
    assert.throws(function () {
      createSystem({}, {}, buildNative('default'), 'md', {});
    }, /requires shared_libs\.Utils/);
  });

  test('a missing required token throws one TypeError naming all missing tokens', function () {
    const built = buildNative('default');
    const tokens = Object.assign({}, built.tokens);
    delete tokens['feedback.focus_trigger'];
    delete tokens['color.field_outline'];
    assert.throws(function () {
      buildSystem('default', {}, { built: Object.assign({}, built, { tokens: tokens }) });
    }, function (error) {
      assert.ok(error instanceof TypeError);
      assert.match(error.message, /missing required tokens: .*feedback\.focus_trigger/);
      assert.match(error.message, /color\.field_outline/);
      return true;
    });
  });

  test('a required token whose value resolved to nothing is rejected, naming it', function () {
    const built = buildNative('default');
    const tokens = Object.assign({}, built.tokens, { 'feedback.focus_trigger': undefined });
    assert.throws(function () {
      buildSystem('default', {}, { built: Object.assign({}, built, { tokens: tokens }) });
    }, /resolves required tokens to no value: feedback\.focus_trigger/);
  });

  test('a theme built for the web projection is rejected', function () {
    const web = Lib.Themer.buildTheme(TEMPLATES.default, [], 'web');
    assert.throws(function () {
      buildSystem('default', {}, { built: web });
    }, /native projection/);
  });

  test('the breakpoint must be a contract breakpoint name', function () {
    assert.throws(function () {
      buildSystem('default', {}, { breakpoint: 'huge' });
    }, /breakpoint must be one of sm, md, lg, xlg, max/);
  });

  test('a non-function factory is rejected', function () {
    assert.throws(function () {
      buildSystem('default', { Broken: 42 });
    }, /factory "Broken" must be a function/);
  });

  test('the registry is frozen and holds one component per factory', function () {
    const Registry = buildSystem('default', { Probe: Probe });
    assert.ok(Object.isFrozen(Registry));
    assert.deepEqual(Object.keys(Registry), ['Probe']);
    assert.equal(typeof Registry.Probe, 'function');
  });

});


describe('context: reads', function () {

  for (const name of TEMPLATE_NAMES) {
    test(name + ': token, color, typeStyle resolve from the built theme', function () {
      const ctx = buildSystem(name, { Probe: Probe }).Probe.ctx;
      const built = buildNative(name);
      assert.equal(ctx.token('focus.width'), built.tokens['focus.width']);
      assert.equal(ctx.color('focus'), built.tokens['color.focus']);
      const style = ctx.typeStyle('body01');
      assert.equal(style.fontSize, built.tokens['type.body01'].fontSize);
      assert.equal(style.fontFamily, built.tokens['font.family.' + built.tokens['type.body01'].fontFamily]);
      assert.deepEqual(Object.keys(style).sort(), ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight']);
    });
  }

  test('a token the theme lacks throws; nothing falls back', function () {
    const ctx = buildSystem('default', { Probe: Probe }).Probe.ctx;
    assert.throws(function () {
      ctx.token('color.no_such_token');
    }, /token "color\.no_such_token" is not in the theme/);
    assert.throws(function () {
      ctx.color('no_such_color');
    }, TypeError);
  });

  test('the context is frozen and carries the injected frameworks, behaviors and registry', function () {
    const Registry = buildSystem('default', { Probe: Probe });
    const ctx = Registry.Probe.ctx;
    assert.ok(Object.isFrozen(ctx));
    assert.equal(ctx.React, Lib.React);
    assert.equal(ctx.ReactNative, Lib.ReactNative);
    assert.equal(ctx.Svg, Lib.Svg);
    assert.equal(ctx.Registry, Registry);
    assert.equal(typeof ctx.behaviors.useButton, 'function');
    assert.equal(ctx.platform.os, 'web');
    assert.equal(ctx.breakpoint, 'md');
  });

});


describe('context: enum', function () {

  const EXPECTED_LABEL = { default: 'above', carbon: 'above', material: 'floating' };

  for (const name of TEMPLATE_NAMES) {
    test(name + ": enum('anatomy.label') returns the template's value", function () {
      const ctx = buildSystem(name, { Probe: Probe }).Probe.ctx;
      assert.equal(ctx.enum('anatomy.label'), EXPECTED_LABEL[name]);
    });
  }

  test('a non-enum token is rejected', function () {
    const ctx = buildSystem('default', { Probe: Probe }).Probe.ctx;
    assert.throws(function () {
      ctx.enum('focus.width');
    }, /not an enum token/);
  });

  test('a value outside the contract list is rejected', function () {
    const built = buildNative('default');
    const tokens = Object.assign({}, built.tokens, { 'anatomy.label': 'sideways' });
    const ctx = buildSystem('default', { Probe: Probe }, { built: Object.assign({}, built, { tokens: tokens }) }).Probe.ctx;
    assert.throws(function () {
      ctx.enum('anatomy.label');
    }, /"sideways", not one of above, floating/);
  });

});


describe('context: icon', function () {

  test('carbon: a size the set draws itself returns that glyph with its own viewBox', function () {
    const ctx = buildSystem('carbon', { Probe: Probe }).Probe.ctx;
    const literal = buildNative('carbon').tokens['icon.chevron_down'];
    assert.notEqual(literal.sizes['16'].viewBox, literal.viewBox, 'fixture: the 16px grid must differ from the base grid');
    const small = ctx.icon('chevron_down', 16);
    assert.equal(small.viewBox, literal.sizes['16'].viewBox);
    assert.deepEqual(small.paths, literal.sizes['16'].paths);
    const large = ctx.icon('chevron_down', 32);
    assert.equal(large.viewBox, literal.viewBox);
    assert.deepEqual(large.paths, literal.paths);
  });

  test('material: every size returns the single glyph scaled by viewBox', function () {
    const ctx = buildSystem('material', { Probe: Probe }).Probe.ctx;
    for (const size of [16, 20, 24, 32]) {
      const glyph = ctx.icon('close', size);
      assert.equal(glyph.viewBox, '0 -960 960 960');
      assert.equal(glyph.paths.length, 1);
    }
  });

  test('a missing icon throws; no other glyph is substituted', function () {
    const ctx = buildSystem('default', { Probe: Probe }).Probe.ctx;
    assert.throws(function () {
      ctx.icon('no_such_icon', 16);
    }, /token "icon\.no_such_icon" is not in the theme/);
    assert.throws(function () {
      ctx.icon('close', 0);
    }, /positive numeric size/);
  });

});


describe('context: metric through the spec sheet', function () {

  test('token, subtract, sum and constant entries resolve', function () {
    const ctx = buildSystem('default', { Probe: Probe }).Probe.ctx;
    const t = buildNative('default').tokens;
    assert.equal(ctx.metric('Probe', 'height'), t['size.size_medium']);
    assert.equal(ctx.metric('Probe', 'inner'), t['size.size_medium'] - t['border.width_01']);
    assert.equal(ctx.metric('Probe', 'doubled'), t['spacing.spacing_05'] * 2);
    assert.equal(ctx.metric('Probe', 'decided'), 3);
  });

  test('an unknown component, metric or operation throws', function () {
    const ctx = buildSystem('default', { Probe: Probe }).Probe.ctx;
    assert.throws(function () {
      ctx.metric('Nope', 'height');
    }, /component "Nope" has no spec sheet/);
    assert.throws(function () {
      ctx.metric('Probe', 'width');
    }, /metric "Probe\.width" is not in the spec sheet/);
    assert.throws(function () {
      ctx.metric('Probe', 'broken');
    }, /sum \| subtract/);
  });

});


describe('context: focusRing', function () {

  test('a family draws its ring from its own cells; none while unfocused or at width 0', function () {
    for (const name of TEMPLATE_NAMES) {
      const ctx = buildSystem(name, { Probe: Probe }).Probe.ctx;
      const t = buildNative(name).tokens;
      for (const family of ['button', 'selection', 'field']) {
        assert.deepEqual(ctx.focusRing(family, { focused: false, focusVisible: false }), {});
        const ring = ctx.focusRing(family, { focused: true, focusVisible: true }, 1);
        if (t['control.' + family + '_focus_width'] === 0) {
          assert.deepEqual(ring, {}, name + ' ' + family);
          continue;
        }
        if (family === 'button' && t['control.button_focus_offset'] < 0) {
          assert.equal(ring.borderColor, t['color.button_focus_ring'], name + ' ' + family);
          continue;
        }
        assert.equal(ring.outlineWidth, t['control.' + family + '_focus_width'], name + ' ' + family);
        assert.equal(ring.outlineOffset, t['control.' + family + '_focus_offset'], name + ' ' + family);
        assert.equal(ring.outlineColor, t['color.' + family + '_focus_ring'], name + ' ' + family);
      }
    }
  });

  test('feedback.focus_trigger: keyboard draws a button ring on keyboard focus only; a field ring shows on any focus', function () {
    const keyboard = probeWith({ 'feedback.focus_trigger': 'keyboard' });
    assert.deepEqual(keyboard.focusRing('button', { focused: true, focusVisible: false }), {});
    assert.notDeepEqual(keyboard.focusRing('button', { focused: true, focusVisible: true }), {});
    assert.notDeepEqual(keyboard.focusRing('field', { focused: true, focusVisible: false }), {});
    const any = probeWith({ 'feedback.focus_trigger': 'any' });
    assert.notDeepEqual(any.focusRing('button', { focused: true, focusVisible: false }), {});
  });

  test('a button ring drawn inside the edge is the border in the ring colour, the rest of the ring and the page-colour line inset inside it', function () {
    const t = buildNative('carbon').tokens;
    const ring = buildSystem('carbon', { Probe: Probe }).Probe.ctx.focusRing('button', { focused: true }, 1);
    assert.deepEqual(ring, {
      borderColor: t['color.button_focus_ring'],
      boxShadow: 'inset 0 0 0 1px ' + t['color.button_focus_ring'] + ', inset 0 0 0 2px ' + t['color.button_focus_gap']
    });
  });

});


/********************************************************************
Build a default-template probe context whose tokens carry overrides.

@param {Object} overrides - Token name -> value

@return {Object} - The probe's context
*********************************************************************/
function probeWith (overrides) {

  const built = buildNative('default');
  const tokens = Object.assign({}, built.tokens, overrides);

  return buildSystem('default', { Probe: Probe }, { built: Object.assign({}, built, { tokens: tokens }) }).Probe.ctx;

}


describe('context: pressPresentation', function () {

  const prefix = 'button_primary_container';
  const t = buildNative('default').tokens;
  const easing = 'cubic-bezier(' + t['motion.easing_standard_productive'].join(', ') + ')';

  test('the phase follows the state: disabled, pressed, hovered, selected, focused, rest', function () {
    const ctx = probeWith({});
    assert.equal(ctx.pressPresentation({}, prefix).phase, '');
    assert.equal(ctx.pressPresentation({ focused: true }, prefix).phase, '_focus');
    assert.equal(ctx.pressPresentation({ focused: true, selected: true }, prefix).phase, '_selected');
    assert.equal(ctx.pressPresentation({ hovered: true, selected: true }, prefix).phase, '_hover');
    assert.equal(ctx.pressPresentation({ hovered: true, pressed: true }, prefix).phase, '_active');
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, prefix).phase, '_disabled');
  });

  test('highlight: the container paints the state\'s cell; the layer is not drawn', function () {
    const ctx = probeWith({ 'feedback.press': 'highlight' });
    assert.deepEqual(ctx.pressPresentation({}, prefix), {
      container: { backgroundColor: t['color.button_primary_container'], transitionDuration: t['motion.duration_fast_01'] + 'ms', transitionProperty: 'background-color', transitionTimingFunction: easing },
      layer: { opacity: 0, pointerEvents: 'none' },
      phase: ''
    });
    assert.equal(ctx.pressPresentation({ hovered: true }, prefix).container.backgroundColor, t['color.button_primary_container_hover']);
    assert.equal(ctx.pressPresentation({ pressed: true }, prefix).container.backgroundColor, t['color.button_primary_container_active']);
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, prefix).container.backgroundColor, t['color.button_primary_container_disabled']);
  });

  test('opacity: the resting cell fades by the theme\'s state opacity; the layer is not drawn', function () {
    const ctx = probeWith({ 'feedback.press': 'opacity', 'state.pressed_opacity': 0.25, 'state.hover_opacity': 0.125 });
    assert.equal(ctx.pressPresentation({}, prefix).container.opacity, 1);
    assert.equal(ctx.pressPresentation({ hovered: true }, prefix).container.opacity, 0.875);
    assert.equal(ctx.pressPresentation({ pressed: true }, prefix).container.opacity, 0.75);
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, prefix).container.opacity, 1);
    assert.equal(ctx.pressPresentation({ pressed: true }, prefix).container.backgroundColor, t['color.button_primary_container']);
    assert.equal(ctx.pressPresentation({ pressed: true }, prefix).layer.opacity, 0);
  });

  test('ripple: the state\'s cell is a layer over the resting container', function () {
    const ctx = probeWith({ 'feedback.press': 'ripple' });
    const rest = ctx.pressPresentation({}, prefix);
    assert.deepEqual(rest.container, { backgroundColor: t['color.button_primary_container'] });
    assert.equal(rest.layer.opacity, 0);
    const hovered = ctx.pressPresentation({ hovered: true }, prefix);
    assert.equal(hovered.layer.backgroundColor, t['color.button_primary_container_hover']);
    assert.equal(hovered.layer.opacity, 1);
    assert.equal(ctx.pressPresentation({ pressed: true }, prefix).layer.backgroundColor, t['color.button_primary_container_active']);
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, prefix).container.backgroundColor, t['color.button_primary_container_disabled']);
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, prefix).layer.opacity, 0);
  });

});


describe('context: fieldPresentation', function () {

  const options = { member: 'text_input', height: 40, radius: 4, surface: 'layer_01' };
  const t = buildNative('default').tokens;
  const pad = t['control.field_padding_inline'];

  test('underline draws a filled frame with a bottom border; outline draws four borders inside the padding', function () {
    const underline = probeWith({ 'feedback.field': 'underline' }).fieldPresentation({}, options).frame;
    assert.equal(underline.backgroundColor, t['color.field_container']);
    assert.equal(underline.borderBottomWidth, t['control.field_outline_width']);
    assert.equal(underline.borderWidth, undefined);
    assert.equal(underline.paddingStart, pad);
    assert.equal(underline.height, 40);
    assert.equal(underline.borderRadius, 4);
    const outline = probeWith({ 'feedback.field': 'outline' }).fieldPresentation({}, options).frame;
    assert.equal(outline.borderWidth, t['control.field_outline_width']);
    assert.equal(outline.paddingStart, pad - t['control.field_outline_width']);
    assert.equal(outline.borderBottomWidth, undefined);
  });

  test('every state reads its own cell: container, outline, label, text and message', function () {
    const ctx = probeWith({ 'color.field_outline_hover': '#010101', 'color.field_outline_focus': '#020202', 'color.field_label_focus': '#030303', 'control.field_outline_width_focus': 2 });
    assert.equal(ctx.fieldPresentation({ hovered: true }, options).frame.borderColor, '#010101');
    assert.equal(ctx.fieldPresentation({ hovered: true }, options).frame.backgroundColor, t['color.text_input_container_hover']);
    assert.equal(ctx.fieldPresentation({ hovered: true }, Object.assign({}, options, { member: 'select' })).frame.backgroundColor, t['color.field_container_hover']);
    assert.equal(ctx.fieldPresentation({ focused: true }, options).frame.borderColor, '#020202');
    assert.equal(ctx.fieldPresentation({ focused: true }, options).frame.borderBottomWidth, 2);
    assert.equal(ctx.fieldPresentation({ focused: true }, options).label.color, '#030303');
    const disabled = ctx.fieldPresentation({ disabled: true, invalid: true }, options);
    assert.equal(disabled.frame.borderColor, t['color.field_outline_disabled']);
    assert.equal(disabled.label.color, t['color.field_label_disabled']);
    assert.equal(disabled.value.color, t['color.field_value_disabled']);
    assert.equal(disabled.message.color, t['color.field_helper_disabled']);
    assert.equal(ctx.fieldPresentation({ disabled: true }, Object.assign({}, options, { member: 'select' })).frame.borderColor, t['color.select_outline_disabled']);
    assert.equal(ctx.fieldPresentation({}, options).message.color, t['color.field_helper']);
    assert.equal(ctx.fieldPresentation({}, options).value.fontSize, t['type.field_value'].fontSize);
    assert.equal(ctx.fieldPresentation({}, options).placeholderColor, t['color.field_placeholder']);
  });

  test('invalid: the outline, label and message read the invalid cells; a ring width above zero draws the invalid ring', function () {
    const ctx = probeWith({ 'color.field_outline_invalid_hover': '#040404' });
    const invalid = ctx.fieldPresentation({ invalid: true }, options);
    assert.equal(invalid.frame.borderColor, t['color.field_outline_invalid']);
    assert.equal(invalid.label.color, t['color.field_label_invalid']);
    assert.equal(invalid.message.color, t['color.field_message_invalid']);
    assert.equal(invalid.frame.outlineColor, t['color.field_ring_invalid']);
    assert.equal(invalid.frame.outlineWidth, t['control.field_invalid_ring_width']);
    assert.equal(invalid.frame.outlineOffset, -t['control.field_invalid_ring_width']);
    assert.equal(ctx.fieldPresentation({ invalid: true, hovered: true }, options).frame.borderColor, '#040404');
    const noRing = probeWith({ 'control.field_invalid_ring_width': 0 }).fieldPresentation({ invalid: true }, options).frame;
    assert.equal(noRing.outlineWidth, undefined);
  });

  test('focus draws the field ring from its cells; a trailing icon takes the icon inset', function () {
    const focused = probeWith({}).fieldPresentation({ focused: true }, options).frame;
    assert.equal(focused.outlineWidth, t['control.field_focus_width']);
    assert.equal(focused.outlineOffset, t['control.field_focus_offset']);
    assert.equal(probeWith({ 'feedback.field': 'underline' }).fieldPresentation({}, Object.assign({}, options, { trailing: true })).frame.paddingEnd, t['control.field_icon_inset']);
  });

  test('above: the label is in the flow over the frame, in the field label type set', function () {
    const field = probeWith({ 'anatomy.label': 'above' }).fieldPresentation({}, options);
    assert.equal(field.raised, false);
    assert.equal(field.placeholder, true);
    assert.equal(field.label.position, undefined);
    assert.equal(field.label.fontSize, t['type.field_label'].fontSize);
    assert.equal(field.label.marginBottom, t['spacing.spacing_03']);
    assert.equal(field.label.color, t['color.field_label']);
    assert.deepEqual(field.root, {});
  });

  test('floating: the root reserves half the raised label; the label rests centered in the frame and rises onto the border over the surface when focused or populated', function () {
    const ctx = probeWith({ 'anatomy.label': 'floating' });
    const resting = ctx.fieldPresentation({}, options);
    const reserve = t['type.field_label_raised'].lineHeight / 2;
    assert.deepEqual(resting.root, { paddingTop: reserve });
    assert.equal(resting.raised, false);
    assert.equal(resting.placeholder, false);
    assert.equal(resting.label.position, 'absolute');
    assert.equal(resting.label.fontSize, t['type.field_label'].fontSize);
    assert.equal(resting.label.top, reserve + (40 - t['type.field_label'].lineHeight) / 2);
    assert.equal(resting.label.left, pad);
    assert.equal(resting.label.backgroundColor, undefined);
    for (const state of [{ focused: true }, { populated: true }]) {
      const raised = ctx.fieldPresentation(state, options);
      assert.equal(raised.raised, true);
      assert.equal(raised.placeholder, true);
      assert.equal(raised.label.fontSize, t['type.field_label_raised'].fontSize);
      assert.equal(raised.label.top, 0);
      assert.equal(raised.label.left, pad - t['spacing.spacing_02']);
      assert.equal(raised.label.paddingHorizontal, t['spacing.spacing_02']);
      assert.equal(raised.label.backgroundColor, t['color.layer_01']);
    }
  });

});

