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
    delete tokens['color.focus'];
    delete tokens['focus.width'];
    assert.throws(function () {
      buildSystem('default', {}, { built: Object.assign({}, built, { tokens: tokens }) });
    }, function (error) {
      assert.ok(error instanceof TypeError);
      assert.match(error.message, /missing required tokens: color\.focus, focus\.width/);
      return true;
    });
  });

  test('a required token whose value resolved to nothing is rejected, naming it', function () {
    const built = buildNative('default');
    const tokens = Object.assign({}, built.tokens, { 'color.focus': undefined });
    assert.throws(function () {
      buildSystem('default', {}, { built: Object.assign({}, built, { tokens: tokens }) });
    }, /resolves required tokens to no value: color\.focus/);
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


describe('context: focusPresentation', function () {

  test('unfocused is empty; focused follows the template\'s feedback.focus enum', function () {
    for (const name of TEMPLATE_NAMES) {
      const ctx = buildSystem(name, { Probe: Probe }).Probe.ctx;
      const t = buildNative(name).tokens;
      assert.deepEqual(ctx.focusPresentation(false), {});
      const style = ctx.focusPresentation(true);
      const mode = t['feedback.focus'];
      if (mode === 'outline') {
        assert.equal(style.outlineWidth, t['focus.width']);
        assert.equal(style.outlineColor, t['color.focus']);
      } else if (mode === 'inset') {
        assert.match(style.boxShadow, /^inset 0 0 0 /);
      } else {
        assert.equal(mode, 'underline');
        assert.equal(style.borderBottomWidth, t['focus.width']);
      }
    }
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

  const palette = { rest: 'button_primary', hover: 'button_primary_hover', active: 'button_primary_active', content: 'text_on_color' };
  const t = buildNative('default').tokens;
  const easing = 'cubic-bezier(' + t['motion.easing_standard_productive'].join(', ') + ')';

  test('highlight: the container fill follows rest, hover and pressed; the layer is not drawn', function () {
    const ctx = probeWith({ 'feedback.press': 'highlight' });
    const rest = ctx.pressPresentation({}, palette);
    assert.deepEqual(rest, {
      container: { backgroundColor: t['color.button_primary'], transitionDuration: t['motion.duration_fast_01'] + 'ms', transitionProperty: 'background-color', transitionTimingFunction: easing },
      layer: { display: 'none' },
      engaged: false
    });
    assert.equal(ctx.pressPresentation({ hovered: true }, palette).container.backgroundColor, t['color.button_primary_hover']);
    assert.equal(ctx.pressPresentation({ hovered: true }, palette).engaged, true);
    assert.equal(ctx.pressPresentation({ hovered: true, disabled: true }, palette).engaged, false);
    assert.equal(ctx.pressPresentation({ hovered: true, pressed: true }, palette).container.backgroundColor, t['color.button_primary_active']);
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, palette).container.backgroundColor, t['color.button_primary']);
    assert.equal(ctx.pressPresentation({}, { rest: null, hover: 'background_hover', active: 'background_active', content: 'link_primary' }).container.backgroundColor, 'transparent');
  });

  test('opacity: the container fades by the theme\'s state opacity; the layer is not drawn', function () {
    const ctx = probeWith({ 'feedback.press': 'opacity', 'state.pressed_opacity': 0.25, 'state.hover_opacity': 0.125 });
    assert.equal(ctx.pressPresentation({}, palette).container.opacity, 1);
    assert.equal(ctx.pressPresentation({ hovered: true }, palette).container.opacity, 0.875);
    assert.equal(ctx.pressPresentation({ pressed: true }, palette).container.opacity, 0.75);
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, palette).container.opacity, 1);
    assert.equal(ctx.pressPresentation({}, palette).container.transitionProperty, 'opacity');
    assert.deepEqual(ctx.pressPresentation({ pressed: true }, palette).layer, { display: 'none' });
    assert.equal(ctx.pressPresentation({ pressed: true }, palette).engaged, false);
  });

  test('ripple: a state layer in the content color at the pressed, hovered or focused opacity', function () {
    const ctx = probeWith({ 'feedback.press': 'ripple', 'state.pressed_opacity': 0.25, 'state.hover_opacity': 0.125, 'state.focus_opacity': 0.5 });
    const rest = ctx.pressPresentation({}, palette);
    assert.deepEqual(rest.container, { backgroundColor: t['color.button_primary'] });
    assert.equal(rest.layer.backgroundColor, t['color.text_on_color']);
    assert.equal(rest.layer.opacity, 0);
    assert.equal(rest.layer.pointerEvents, 'none');
    assert.equal(ctx.pressPresentation({ focused: true }, palette).layer.opacity, 0.5);
    assert.equal(ctx.pressPresentation({ focused: true, hovered: true }, palette).layer.opacity, 0.125);
    assert.equal(ctx.pressPresentation({ hovered: true, pressed: true }, palette).layer.opacity, 0.25);
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, palette).layer.opacity, 0);
    assert.equal(ctx.pressPresentation({ pressed: true }, palette).engaged, false);
  });

});


describe('context: fieldPresentation', function () {

  const options = { height: 40, paddingInline: 16, radius: 4, surface: 'layer_01' };
  const t = buildNative('default').tokens;

  test('underline draws a filled frame with a bottom border; outline draws four borders and no fill', function () {
    const underline = probeWith({ 'feedback.field': 'underline' }).fieldPresentation({}, options).frame;
    assert.equal(underline.backgroundColor, t['color.field_01']);
    assert.equal(underline.borderBottomWidth, t['border.width_01']);
    assert.equal(underline.borderWidth, undefined);
    assert.equal(underline.height, 40);
    assert.equal(underline.borderRadius, 4);
    const hovered = probeWith({ 'feedback.field': 'underline' }).fieldPresentation({ hovered: true }, options).frame;
    assert.equal(hovered.backgroundColor, t['color.field_hover_01']);
    const outline = probeWith({ 'feedback.field': 'outline' }).fieldPresentation({}, options).frame;
    assert.equal(outline.backgroundColor, 'transparent');
    assert.equal(outline.borderWidth, t['border.width_01']);
    assert.equal(outline.paddingHorizontal, 16 - t['border.width_01']);
    assert.equal(outline.borderBottomWidth, undefined);
  });

  test('invalid: an underline frame keeps its border and draws an inner error ring; an outline frame draws an error border', function () {
    const underline = probeWith({ 'feedback.field': 'underline' });
    assert.equal(underline.fieldPresentation({}, options).frame.borderColor, t['color.border_strong_01']);
    assert.equal(underline.fieldPresentation({}, options).frame.outlineWidth, undefined);
    const ring = underline.fieldPresentation({ invalid: true }, options).frame;
    assert.equal(ring.borderColor, t['color.border_strong_01']);
    assert.equal(ring.outlineColor, t['color.support_error']);
    assert.equal(ring.outlineWidth, t['border.width_02']);
    assert.equal(ring.outlineOffset, -t['border.width_02']);
    const outline = probeWith({ 'feedback.field': 'outline' }).fieldPresentation({ invalid: true }, options).frame;
    assert.equal(outline.borderColor, t['color.support_error']);
    assert.equal(outline.outlineWidth, undefined);
  });

  test('disabled: the border is the field\'s disabledBorder leaf, border_disabled by default; null draws none under underline and border_disabled under outline; never invalid', function () {
    const ctx = probeWith({ 'feedback.field': 'outline' });
    assert.equal(ctx.fieldPresentation({ invalid: true, disabled: true }, options).frame.borderColor, t['color.border_disabled']);
    assert.equal(ctx.fieldPresentation({ disabled: true }, Object.assign({}, options, { disabledBorder: 'border_strong_01' })).frame.borderColor, t['color.border_strong_01']);
    // Under outline the border is all that draws the frame, so null still draws the disabled border
    assert.equal(ctx.fieldPresentation({ disabled: true }, Object.assign({}, options, { disabledBorder: null })).frame.borderColor, t['color.border_disabled']);
    const underline = probeWith({ 'feedback.field': 'underline' });
    assert.equal(underline.fieldPresentation({ disabled: true }, Object.assign({}, options, { disabledBorder: null })).frame.borderColor, 'transparent');
    assert.equal(underline.fieldPresentation({ invalid: true, disabled: true }, options).frame.outlineWidth, undefined);
  });

  test('above: the label is in the flow over the frame, in the label type set', function () {
    const field = probeWith({ 'anatomy.label': 'above' }).fieldPresentation({ focused: true }, options);
    assert.equal(field.raised, false);
    assert.equal(field.placeholder, true);
    assert.equal(field.label.position, undefined);
    assert.equal(field.label.fontSize, t['type.label01'].fontSize);
    assert.equal(field.label.marginBottom, t['spacing.spacing_03']);
    assert.equal(field.label.color, t['color.text_secondary']);
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
    assert.equal(resting.label.fontSize, t['type.body_compact_01'].fontSize);
    assert.equal(resting.label.top, reserve + (40 - t['type.body_compact_01'].lineHeight) / 2);
    assert.equal(resting.label.left, 16);
    assert.equal(resting.label.backgroundColor, undefined);
    for (const state of [{ focused: true }, { populated: true }]) {
      const raised = ctx.fieldPresentation(state, options);
      assert.equal(raised.raised, true);
      assert.equal(raised.placeholder, true);
      assert.equal(raised.label.fontSize, t['type.field_label_raised'].fontSize);
      assert.equal(raised.label.top, 0);
      assert.deepEqual(raised.root, { paddingTop: reserve });
      assert.equal(raised.label.left, 16 - t['spacing.spacing_02']);
      assert.equal(raised.label.paddingHorizontal, t['spacing.spacing_02']);
      assert.equal(raised.label.backgroundColor, t['color.layer_01']);
    }
    assert.equal(ctx.fieldPresentation({ disabled: true }, options).label.color, t['color.text_disabled']);
  });

});
