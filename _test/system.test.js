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
    const literal = buildNative('carbon').tokens['icon.close'];
    const small = ctx.icon('close', 16);
    assert.equal(small.viewBox, literal.sizes['16'].viewBox);
    assert.deepEqual(small.paths, literal.sizes['16'].paths);
    const large = ctx.icon('close', 32);
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
