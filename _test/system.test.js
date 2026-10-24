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


describe('context: textPresentation', function () {

  const NativeLib = function (os, roundToNearestPixel) {
    return Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, {
        Platform: { OS: os },
        PixelRatio: { roundToNearestPixel: roundToNearestPixel }
      })
    });
  };

  test('typeStyle stays numeric; web presents the exact unitless ratio', function () {
    const ctx = buildSystem('default', { Probe: Probe }).Probe.ctx;
    const set = buildNative('default').tokens['type.body01'];
    const style = ctx.typeStyle('body01');
    assert.equal(style.lineHeight, set.lineHeight);
    assert.equal(typeof style.lineHeight, 'number');
    const presented = ctx.textPresentation(style);
    assert.equal(presented.lineHeight, String(set.lineHeight / set.fontSize));
    assert.equal(presented.fontSize, set.fontSize);
    // The source style is not changed
    assert.equal(style.lineHeight, set.lineHeight);
    assert.notEqual(presented, style);
  });

  for (const os of ['ios', 'android']) {
    test(os + ' presents the numeric absolute line height', function () {
      const ctx = buildSystem('default', { Probe: Probe }, { lib: NativeLib(os, Math.round) }).Probe.ctx;
      const set = buildNative('default').tokens['type.body01'];
      const presented = ctx.textPresentation(ctx.typeStyle('body01'));
      assert.equal(presented.lineHeight, set.lineHeight);
      assert.equal(typeof presented.lineHeight, 'number');
    });
  }

  test('a brand-overridden type set presents ' + "'1.5'" + ' on web and 15 on native', function () {
    const layers = [{ name: 'brand', tokens: {
      'type.body01': { type_set: true, font_family: 'sans', font_size: 10, weight: 400, letter_spacing: 0, line_height_px: 15 }
    } }];
    const web = buildSystem('default', { Probe: Probe }, { layers: layers }).Probe.ctx;
    assert.equal(web.textPresentation(web.typeStyle('body01')).lineHeight, '1.5');
    const native = buildSystem('default', { Probe: Probe }, { layers: layers, lib: NativeLib('ios', Math.round) }).Probe.ctx;
    assert.equal(native.textPresentation(native.typeStyle('body01')).lineHeight, 15);
  });

  test('a style without numeric fontSize and lineHeight throws', function () {
    const ctx = buildSystem('default', { Probe: Probe }).Probe.ctx;
    assert.throws(function () {
      ctx.textPresentation({ fontSize: 14 });
    }, TypeError);
  });

});


describe('context: native lineHeight on the physical pixel grid', function () {

  const NativeGridLib = function (os, roundToNearestPixel) {
    return Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, {
        Platform: { OS: os },
        PixelRatio: { roundToNearestPixel: roundToNearestPixel }
      })
    });
  };

  test('mdpi resolves the carbon compact lineHeight to 18; the token and the built theme keep 18.00008', function () {
    const set = buildNative('carbon').tokens['type.body_compact_01'];
    assert.equal(set.lineHeight, 18.00008, 'fixture: carbon body_compact_01 must carry the fractional lineHeight');
    for (const os of ['ios', 'android']) {
      const ctx = buildSystem('carbon', { Probe: Probe }, { lib: NativeGridLib(os, Math.round) }).Probe.ctx;
      assert.equal(ctx.typeStyle('body_compact_01').lineHeight, 18);
    }
    assert.equal(buildNative('carbon').tokens['type.body_compact_01'].lineHeight, 18.00008);
    assert.equal(buildSystem('carbon', { Probe: Probe }).Probe.ctx.token('type.body_compact_01').lineHeight, 18.00008);
  });

  test('the host grid resolves, not a constant density: grid2 18.25 -> 18.5, grid3 -> its third', function () {
    const built = buildNative('default');
    const tokens = Object.assign({}, built.tokens, {
      'type.body01': Object.assign({}, built.tokens['type.body01'], { lineHeight: 18.25 })
    });
    const custom = Object.assign({}, built, { tokens: tokens });
    const grid2 = buildSystem('default', { Probe: Probe }, { built: custom, lib: NativeGridLib('android', function (v) { return Math.round(v * 2) / 2; }) }).Probe.ctx;
    assert.equal(grid2.typeStyle('body01').lineHeight, 18.5);
    const grid3 = buildSystem('default', { Probe: Probe }, { built: custom, lib: NativeGridLib('ios', function (v) { return Math.round(v * 3) / 3; }) }).Probe.ctx;
    assert.equal(grid3.typeStyle('body01').lineHeight, Math.round(18.25 * 3) / 3);
    assert.notEqual(grid3.typeStyle('body01').lineHeight, 18);
  });

  test('web never invokes the pixel grid and keeps the exact raw number', function () {
    let calls = 0;
    const counting = function (v) { calls += 1; return Math.round(v); };
    const webLib = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, { PixelRatio: { roundToNearestPixel: counting } })
    });
    const ctx = buildSystem('carbon', { Probe: Probe }, { lib: webLib }).Probe.ctx;
    const set = buildNative('carbon').tokens['type.body_compact_01'];
    const style = ctx.typeStyle('body_compact_01');
    assert.equal(style.lineHeight, 18.00008);
    assert.equal(calls, 0);
    assert.equal(ctx.textPresentation(style).lineHeight, String(set.lineHeight / set.fontSize));
  });

  test('an integer lineHeight is unchanged; a missing or bad PixelRatio throws on native only', function () {
    const built = buildNative('default');
    const tokens = Object.assign({}, built.tokens, {
      'type.body01': Object.assign({}, built.tokens['type.body01'], { lineHeight: 20 })
    });
    const custom = Object.assign({}, built, { tokens: tokens });
    const native = buildSystem('default', { Probe: Probe }, { built: custom, lib: NativeGridLib('android', Math.round) }).Probe.ctx;
    assert.equal(native.typeStyle('body01').lineHeight, 20);
    const noGrid = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, { Platform: { OS: 'android' }, PixelRatio: undefined })
    });
    assert.throws(function () {
      buildSystem('default', { Probe: Probe }, { lib: noGrid }).Probe.ctx.typeStyle('body01');
    }, /PixelRatio\.roundToNearestPixel/);
    const bad = buildSystem('default', { Probe: Probe }, { lib: NativeGridLib('android', function () { return 'oops'; }) }).Probe.ctx;
    assert.throws(function () {
      bad.typeStyle('body01');
    }, TypeError);
    // Web does not need the grid at all
    const webLib = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, { PixelRatio: undefined })
    });
    assert.equal(buildSystem('default', { Probe: Probe }, { lib: webLib }).Probe.ctx.typeStyle('body01').lineHeight, buildNative('default').tokens['type.body01'].lineHeight);
  });

  test('three carbon text lines in a group predict 54, not the ceiled 57', function () {
    const ctx = buildSystem('carbon', { Probe: Probe }, { lib: NativeGridLib('android', Math.round) }).Probe.ctx;
    const lines = ctx.typeStyle('body_compact_01').lineHeight
      + ctx.typeStyle('heading_compact_01').lineHeight
      + ctx.typeStyle('helper_text_02').lineHeight;
    assert.equal(lines, 54);
    assert.notEqual(lines, 57);
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

  test('a button ring drawn inside the edge is the border in the ring color, the rest of the ring and the page-color line inset inside it', function () {
    const t = buildNative('carbon').tokens;
    const ring = buildSystem('carbon', { Probe: Probe }).Probe.ctx.focusRing('button', { focused: true }, 1);
    assert.deepEqual(ring, {
      borderColor: t['color.button_focus_ring'],
      boxShadow: 'inset 0 0 0 1px ' + t['color.button_focus_ring'] + ', inset 0 0 0 2px ' + t['color.button_focus_gap']
    });
  });

  test('options.gapWidth replaces the family\'s gap cell; options.gap === false still draws no line', function () {
    const t = buildNative('carbon').tokens;
    const ctx = buildSystem('carbon', { Probe: Probe }).Probe.ctx;
    const override = ctx.focusRing('button', { focused: true }, 1, { gapWidth: 3 });
    assert.equal(override.boxShadow, 'inset 0 0 0 1px ' + t['color.button_focus_ring'] + ', inset 0 0 0 4px ' + t['color.button_focus_gap']);
    const zero = ctx.focusRing('button', { focused: true }, 1, { gapWidth: 0 });
    assert.equal(zero.boxShadow, 'inset 0 0 0 1px ' + t['color.button_focus_ring']);
    const none = ctx.focusRing('button', { focused: true }, 1, { gap: false });
    assert.equal(none.boxShadow, 'inset 0 0 0 1px ' + t['color.button_focus_ring']);
    const both = ctx.focusRing('button', { focused: true }, 1, { gap: false, gapWidth: 9 });
    assert.equal(both.boxShadow, 'inset 0 0 0 1px ' + t['color.button_focus_ring']);
  });

  test('options.offset overrides the family offset, including zero', function () {
    const t = buildNative('material').tokens;
    const ctx = buildSystem('material', { Probe: Probe }).Probe.ctx;
    for (const offset of [0, 4]) {
      const ring = ctx.focusRing('tag', { focused: true, focusVisible: true }, undefined, { offset: offset });
      assert.equal(ring.outlineOffset, offset, 'offset ' + offset);
      assert.equal(ring.outlineWidth, t['control.tag_focus_width']);
      assert.equal(ring.outlineColor, t['color.tag_focus_ring']);
    }
    const plain = ctx.focusRing('tag', { focused: true, focusVisible: true });
    assert.equal(plain.outlineOffset, t['control.tag_focus_offset'], 'no options reads the family cell');
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

  test('the phase follows the state: disabled, selected, pressed, hovered, focused, rest', function () {
    const ctx = probeWith({});
    assert.equal(ctx.pressPresentation({}, prefix).phase, '');
    assert.equal(ctx.pressPresentation({ focused: true }, prefix).phase, '_focus');
    assert.equal(ctx.pressPresentation({ focused: true, selected: true }, prefix).phase, '_selected');
    assert.equal(ctx.pressPresentation({ hovered: true, selected: true }, prefix).phase, '_selected');
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

  test('colors: an explicit map replaces the prefix convention; every phase key must be present', function () {
    const ctx = probeWith({});
    const palette = {
      '': null,
      _active: 'button_primary_container_active',
      _disabled: null,
      _focus: null,
      _hover: 'button_primary_container_hover',
      _selected: null
    };
    const rest = ctx.pressPresentation({}, '', { colors: palette });
    assert.equal(rest.container.backgroundColor, 'transparent');
    assert.equal(ctx.pressPresentation({ hovered: true }, '', { colors: palette }).container.backgroundColor, t['color.button_primary_container_hover']);
    assert.equal(ctx.pressPresentation({ pressed: true }, '', { colors: palette }).container.backgroundColor, t['color.button_primary_container_active']);
    assert.equal(ctx.pressPresentation({ pressed: true, disabled: true }, '', { colors: palette }).container.backgroundColor, 'transparent');
    const missing = Object.assign({}, palette);
    delete missing._active;
    assert.throws(function () {
      ctx.pressPresentation({}, '', { colors: missing });
    }, /colors must map every phase/);
    assert.throws(function () {
      ctx.pressPresentation({}, '', { colors: 'not-a-map' });
    }, /colors must be an object/);
    assert.throws(function () {
      ctx.pressPresentation({}, '', { colors: Object.assign({}, palette, { _hover: 42 }) });
    }, /must name a color leaf or null/);
    assert.throws(function () {
      ctx.pressPresentation({ hovered: true }, '', { colors: Object.assign({}, palette, { _hover: 'no_such_leaf' }) });
    }, /token "color\.no_such_leaf" is not in the theme/);
  });

  test('separateLayers: ripple mounts the hover and the active fills as two layers', function () {
    const ctx = probeWith({ 'feedback.press': 'ripple' });
    const palette = {
      '': null,
      _active: 'button_primary_container_active',
      _disabled: null,
      _focus: null,
      _hover: 'button_primary_container_hover',
      _selected: null
    };
    const rest = ctx.pressPresentation({}, '', { colors: palette, separateLayers: true });
    assert.equal(rest.container.backgroundColor, 'transparent');
    assert.equal(rest.layer.backgroundColor, t['color.button_primary_container_active']);
    assert.equal(rest.layer.opacity, 0);
    assert.equal(rest.hoverLayer.backgroundColor, t['color.button_primary_container_hover']);
    assert.equal(rest.hoverLayer.opacity, 0);
    const hovered = ctx.pressPresentation({ hovered: true }, '', { colors: palette, separateLayers: true });
    assert.equal(hovered.hoverLayer.opacity, 1);
    assert.equal(hovered.layer.opacity, 0);
    const pressed = ctx.pressPresentation({ hovered: true, pressed: true }, '', { colors: palette, separateLayers: true });
    assert.equal(pressed.layer.opacity, 1);
    assert.equal(pressed.hoverLayer.opacity, 1, 'the hover layer survives a press in flight');
    const disabled = ctx.pressPresentation({ pressed: true, disabled: true }, '', { colors: palette, separateLayers: true });
    assert.equal(disabled.layer.opacity, 0);
    assert.equal(disabled.hoverLayer.opacity, 0);
  });

});


describe('context: pressTarget', function () {

  test('a null face covers it exactly; a small face centers the theme minimum; a wider face keeps its width', function () {
    const ctx = probeWith({});
    // The default theme's expanded minimum: 24 points
    assert.equal(buildNative('default').tokens['control.target_min'], 24, 'fixture: the default target minimum is 24');
    assert.deepEqual(ctx.pressTarget(null), { bottom: 0, left: 0, outlineStyle: 'none', position: 'absolute', right: 0, top: 0 });
    assert.deepEqual(ctx.pressTarget({ height: 26, width: 20 }), {
      height: 26,
      left: -2,
      outlineStyle: 'none',
      position: 'absolute',
      top: -0,
      width: 24
    });
    assert.deepEqual(ctx.pressTarget({ height: 20, width: 64 }), {
      height: 24,
      left: -0,
      outlineStyle: 'none',
      position: 'absolute',
      top: -2,
      width: 64
    });
  });

  test('inlineExpansion pushes the minimum out through the named logical edge, so adjacent faces share a boundary without overlap', function () {
    const ctx = probeWith({});
    // A 20-point face: centered leaves two points of overhang on each side
    assert.deepEqual(ctx.pressTarget({ height: 20, width: 20 }), {
      height: 24, left: -2, outlineStyle: 'none', position: 'absolute', top: -2, width: 24
    });
    // 'start' pushes the same four points out through the leading edge: the
    // target ends flush with the face's end edge
    const start = ctx.pressTarget({ height: 20, width: 20 }, { inlineExpansion: 'start' });
    assert.equal(start.width, 24);
    assert.equal(start.start, -4);
    assert.equal(start.start + start.width, 20);
    // 'end' pushes them through the trailing edge: it starts flush with the
    // face's start edge
    const end = ctx.pressTarget({ height: 20, width: 20 }, { inlineExpansion: 'end' });
    assert.equal(end.width, 24);
    assert.equal(end.start, 0);
    // Two adjacent 20 faces, the first 'start' and the second 'end': the first
    // target stops at 20, exactly where the second target begins - they meet
    // without overlap
    assert.equal(start.start + start.width, end.start + 20);
    // A 16-point sided face keeps both axes at the minimum and pushes the
    // whole eight-point overhang through one edge
    const smallStart = ctx.pressTarget({ height: 16, width: 16 }, { inlineExpansion: 'start' });
    assert.equal(smallStart.width, 24);
    assert.equal(smallStart.height, 24);
    assert.equal(smallStart.start, -8);
    assert.equal(smallStart.start + smallStart.width, 16);
    const smallEnd = ctx.pressTarget({ height: 16, width: 16 }, { inlineExpansion: 'end' });
    assert.equal(smallEnd.start, 0);
    assert.equal(smallEnd.width, 24);
    assert.equal(smallEnd.height, 24);
    assert.throws(function () {
      ctx.pressTarget({ height: 40, width: 40 }, { inlineExpansion: 'up' });
    }, /inlineExpansion must be "center", "start" or "end"/);
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
    assert.equal(underline.minHeight, 40);
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

