// Info: The leveled-token reader seam and the Layer provider.
//
// A Layer publishes a painted level (1-3) on the system's LayerContext; the
// registry dispatches every component inside it to the implementation built
// for that level's reader context, so `ctx.token`/`ctx.color` read the
// level's own value when the built theme carries one and the base map
// otherwise. Literal values never move - the second template's transparent
// field stays transparent at every level - and a brand layer's pins and
// redirects ride the same map. DisabledContext does the same for an
// enclosing group's disabled state, and the hosted-overlay bridge republishes
// all three structural contexts inside the host tree.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { act } from 'react';

import * as factories from 'rnw-components/all';
import { Lib, TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render an element and return the TextInput frame inside it (the painted
field container).

@param {Object} element - React element

@return {Promise<Object>} - { container, frame }
*********************************************************************/
async function renderField (element) {

  const container = await render(element);
  const input = container.querySelector('input');

  return { container: container, frame: input === null ? null : input.parentElement };

}

// A field container color, serialized the way the DOM reports it
function paint (token) {

  return cssValue('backgroundColor', token);

}


describe('Layer: explicit level overrides paint the leveled field', function () {

  for (const template of ['default', 'carbon']) {
    for (const row of [
      { level: 0, field: 'color.field_01' },
      { level: 1, field: 'color.field_02' },
      { level: 2, field: 'color.field_03' }
    ]) {
      test(template + ': level ' + row.level + ' paints ' + row.field, async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, { Layer: factories.Layer, TextInput: factories.TextInput });
        const parts = await renderField(React.createElement(Registry.Layer, { level: row.level },
          React.createElement(Registry.TextInput, null)));
        assert.equal(parts.frame.style.backgroundColor, paint(t[row.field]));
      });
    }
  }

  test('the transparent field stays literal at every level under the second template', async function () {
    const Registry = buildSystem('material', { Layer: factories.Layer, TextInput: factories.TextInput });
    const base = paint(buildNative('material').tokens['color.field_container']);
    for (const level of [0, 1, 2]) {
      const parts = await renderField(React.createElement(Registry.Layer, { level: level },
        React.createElement(Registry.TextInput, null)));
      assert.equal(parts.frame.style.backgroundColor, base, 'material level ' + (level + 1));
    }
  });

  test('a sibling outside the Layer keeps the base value; two differently leveled siblings render together', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', { Layer: factories.Layer, TextInput: factories.TextInput });
    const container = await render(React.createElement(React.Fragment, null,
      React.createElement(Registry.TextInput, null),
      React.createElement(Registry.Layer, { level: 0 }, React.createElement(Registry.TextInput, null)),
      React.createElement(Registry.Layer, { level: 2 }, React.createElement(Registry.TextInput, null))));
    const frames = Array.from(container.querySelectorAll('input')).map(function (input) {
      return input.parentElement.style.backgroundColor;
    });
    assert.equal(frames[0], paint(t['color.field_01']));
    assert.equal(frames[1], paint(t['color.field_01']));
    assert.equal(frames[2], paint(t['color.field_03']));
  });

  test('every template reads the leveled alias: levels shift where authored, a literal never moves', async function () {
    for (const template of TEMPLATE_NAMES) {
      const built = buildNative(template);
      const Registry = buildSystem(template, { Layer: factories.Layer, TextInput: factories.TextInput });
      for (const level of [0, 1, 2]) {
        const parts = await renderField(React.createElement(Registry.Layer, { level: level },
          React.createElement(Registry.TextInput, null)));
        const leveled = built.levels && built.levels[level + 1] && built.levels[level + 1]['color.field_container'];
        const expected = leveled === undefined ? built.tokens['color.field_container'] : leveled;
        assert.equal(parts.frame.style.backgroundColor, paint(expected), template + ' level ' + (level + 1));
      }
    }
  });

});


describe('Layer: outside a Layer nothing changes', function () {

  test('a bare render reads the base map', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', { TextInput: factories.TextInput });
    const parts = await renderField(React.createElement(Registry.TextInput, null));
    assert.equal(parts.frame.style.backgroundColor, paint(t['color.field_container']));
  });

  test('a theme with no levels field renders from the base map', async function () {
    const built = buildNative('default');
    const unlevel = Object.assign({}, built);
    delete unlevel.levels;
    const Registry = buildSystem('default', { Layer: factories.Layer, TextInput: factories.TextInput }, { built: unlevel });
    const parts = await renderField(React.createElement(Registry.Layer, { level: 2 },
      React.createElement(Registry.TextInput, null)));
    assert.equal(parts.frame.style.backgroundColor, paint(built.tokens['color.field_container']));
  });

  test('an invalid level override throws a named TypeError', async function () {
    const Registry = buildSystem('default', { Layer: factories.Layer });
    await assert.rejects(
      render(React.createElement(Registry.Layer, { level: 4 }, React.createElement(Registry.Layer))),
      /Layer level must be 0, 1 or 2/
    );
  });

});


describe('Layer: omitted levels advance and clamp', function () {

  for (const row of [
    { depth: 1, field: 'color.field_02', note: 'an omitted Layer first paints level 2' },
    { depth: 2, field: 'color.field_03', note: 'a nested omitted Layer paints level 3' },
    { depth: 4, field: 'color.field_03', note: 'deeper omitted Layers clamp at level 3' }
  ]) {
    test(row.note, async function () {
      const t = buildNative('default').tokens;
      const Registry = buildSystem('default', { Layer: factories.Layer, TextInput: factories.TextInput });
      let element = React.createElement(Registry.TextInput, null);
      for (let i = 0; i < row.depth; i = i + 1) {
        element = React.createElement(Registry.Layer, null, element);
      }
      const parts = await renderField(element);
      assert.equal(parts.frame.style.backgroundColor, paint(t[row.field]));
    });
  }

  test('an explicit level 0 resets to painted level 1 inside a level-3 layer', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', { Layer: factories.Layer, TextInput: factories.TextInput });
    const parts = await renderField(React.createElement(Registry.Layer, { level: 2 },
      React.createElement(Registry.Layer, { level: 0 },
        React.createElement(Registry.TextInput, null))));
    assert.equal(parts.frame.style.backgroundColor, paint(t['color.field_01']));
  });

});


describe('Layer: withBackground paints the level surface', function () {

  for (const row of [
    { level: 0, background: 'color.layer_background_01' },
    { level: 1, background: 'color.layer_background_02' },
    { level: 2, background: 'color.layer_background_03' }
  ]) {
    test('level ' + row.level + ' paints ' + row.background, async function () {
      const t = buildNative('default').tokens;
      const Registry = buildSystem('default', { Layer: factories.Layer, Text: factories.Text });
      const container = await render(React.createElement(Registry.Layer, { level: row.level, withBackground: true },
        React.createElement(Registry.Text, { text: 'x' })));
      const layer = container.firstElementChild;
      assert.equal(layer.style.backgroundColor, paint(t[row.background]));
    });
  }

  test('withBackground false paints no background', async function () {
    const Registry = buildSystem('default', { Layer: factories.Layer, Text: factories.Text });
    const container = await render(React.createElement(Registry.Layer, { level: 1 },
      React.createElement(Registry.Text, { text: 'x' })));
    assert.equal(container.firstElementChild.style.backgroundColor, '');
  });

  test('a numeric zero child renders through the registry Text', async function () {
    const Registry = buildSystem('default', { Layer: factories.Layer, Text: factories.Text });
    const container = await render(React.createElement(Registry.Layer, { level: 0 }, 0));
    assert.equal(container.querySelector('[dir="auto"]').textContent, '0');
  });

  test('a nested array flattens and every scalar renders through the registry Text', async function () {
    const Registry = buildSystem('default', { Layer: factories.Layer, Text: factories.Text });
    const container = await render(React.createElement(Registry.Layer, { level: 0 },
      [0, ['nested'], React.createElement(Registry.Text, { text: 'kept' })]));
    const runs = container.querySelectorAll('[dir="auto"]');
    assert.equal(runs.length, 3);
    assert.equal(runs[0].textContent, '0');
    assert.equal(runs[1].textContent, 'nested');
    // A real element child is preserved, not rewrapped
    assert.equal(runs[2].textContent, 'kept');
  });

});


describe('seam: deferred and private reads keep their painted level', function () {

  // A factory whose private child holds local state and whose render keeps
  // a listPresentation callback for the test to invoke after the return
  function makeProbe (store) {

    function DeferredProbe (ctx) {
      const { View } = ctx.ReactNative;
      const list = ctx.listPresentation({
        dividerWidth: 0, itemHeight: 0, level: 0, mark: false,
        markRoom: 0, paddingBlock: 0, paddingInline: 0, radius: 0
      });

      function Private () {
        const [count, setCount] = React.useState(0);
        React.useEffect(function () {
          store.mounts = (store.mounts || 0) + 1;
        }, []);
        store.bump = setCount;
        store.count = count;
        return React.createElement(View, {
          style: { backgroundColor: ctx.color('field_container') },
          testID: 'private'
        });
      }

      function DeferredComponent () {
        store.readItem = list.item;
        return React.createElement(View, null, React.createElement(Private, null));
      }
      return DeferredComponent;
    }

    return DeferredProbe;

  }

  test('a deferred listPresentation callback reads levels 2 and 3 after the parent returned', async function () {
    const t = buildNative('default').tokens;
    const built = buildNative('default');
    const store = {};
    const LevelProbe = makeProbe(store);
    const Registry = buildSystem('default', { LevelProbe: LevelProbe, Layer: factories.Layer });
    await render(React.createElement(Registry.Layer, { level: 1 },
      React.createElement(Registry.LevelProbe, null)));
    // Level 2: the deferred callback reads the leveled selected fill
    assert.equal(store.readItem({ selected: true }).backgroundColor,
      built.levels[2]['color.list_item_container_selected']);
    await render(React.createElement(Registry.Layer, { level: 2 },
      React.createElement(Registry.LevelProbe, null)));
    assert.equal(store.readItem({ selected: true }).backgroundColor,
      built.levels[3]['color.list_item_container_selected']);
    // Sanity: the level-3 read genuinely differs from the base map's
    assert.notEqual(built.levels[3]['color.list_item_container_selected'], t['color.list_item_container_selected']);
  });

  test('a private child\'s local state update keeps the scoped color', async function () {
    const built = buildNative('default');
    const store = {};
    const Registry = buildSystem('default', { LevelProbe: makeProbe(store), Layer: factories.Layer });
    const container = await render(React.createElement(Registry.Layer, { level: 1 },
      React.createElement(Registry.LevelProbe, null)));
    const node = container.querySelector('[data-testid="private"]');
    assert.equal(node.style.backgroundColor, paint(built.levels[2]['color.field_container']));
    const mounts = store.mounts;
    await act(async function () {
      store.bump(function (count) {
        return count + 1;
      });
    });
    assert.equal(store.count, 1);
    assert.equal(node.style.backgroundColor, paint(built.levels[2]['color.field_container']));
    assert.equal(store.mounts, mounts);
  });

});


describe('seam: updates do not remount or lose input', function () {

  test('an uncontrolled TextInput keeps its value across a parent level update', async function () {
    const Registry = buildSystem('default', { Layer: factories.Layer, TextInput: factories.TextInput });
    let setLevel;
    function App () {
      const [level, set] = React.useState(0);
      setLevel = set;
      return React.createElement(Registry.Layer, { level: level },
        React.createElement(Registry.TextInput, null));
    }
    const container = await render(React.createElement(App));
    const input = container.querySelector('input');
    await act(async function () {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'keep me');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async function () {
      setLevel(2);
    });
    assert.equal(container.querySelector('input'), input);
    assert.equal(input.value, 'keep me');
    assert.equal(input.parentElement.style.backgroundColor,
      paint(buildNative('default').tokens['color.field_03']));
  });

  test('a routine rerender does not remount a private stateful child', async function () {
    const store = {};
    const Registry = buildSystem('default', { LevelProbe: makeProbeOuter(store), Layer: factories.Layer });
    const container = await render(React.createElement(Registry.Layer, { level: 1 },
      React.createElement(Registry.LevelProbe, null)));
    const node = container.querySelector('[data-testid="outer"]');
    const mounts = store.mounts;
    await act(async function () {
      store.bump(function (count) {
        return count + 1;
      });
    });
    assert.equal(container.querySelector('[data-testid="outer"]') === node, true, 'the outer node is marked');
    assert.equal(store.mounts, mounts);
    assert.equal(store.count, 1);
  });

  test('StrictMode renders the same painted levels; no shared mutable state lingers', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', { Layer: factories.Layer, TextInput: factories.TextInput });
    const container = await render(React.createElement(React.StrictMode, null,
      React.createElement(Registry.Layer, { level: 1 }, React.createElement(Registry.TextInput, null)),
      React.createElement(Registry.TextInput, null)));
    const frames = Array.from(container.querySelectorAll('input')).map(function (input) {
      return input.parentElement.style.backgroundColor;
    });
    assert.equal(frames[0], paint(t['color.field_02']));
    assert.equal(frames[1], paint(t['color.field_01']));
  });

});

// A probe whose own state lives at the registry level, for remount checks
function makeProbeOuter (store) {

  function OuterProbe (ctx) {
    const { View } = ctx.ReactNative;

    function Private () {
      const [count, setCount] = React.useState(0);
      React.useEffect(function () {
        store.mounts = (store.mounts || 0) + 1;
      }, []);
      store.bump = setCount;
      store.count = count;
      return React.createElement(View, { style: { backgroundColor: ctx.color('field_container') }, testID: 'inner' });
    }

    function OuterComponent () {
      return React.createElement(View, { testID: 'outer' }, React.createElement(Private, null));
    }
    return OuterComponent;
  }

  return OuterProbe;

}


describe('seam: structural contexts are per-system and shared across levels', function () {

  test('two systems have distinct contexts; within a system all three levels share them', async function () {
    const seen = {};
    function Probe (ctx) {
      const key = Probe.current;
      seen[key] = seen[key] || [];
      seen[key].push(ctx);
      return function () {
        return null;
      };
    }
    Probe.current = 'one';
    buildSystem('default', { Probe: Probe });
    Probe.current = 'two';
    buildSystem('default', { Probe: Probe });

    // Three reader contexts per system, one for each painted level
    assert.equal(seen.one.length, 3);
    assert.equal(seen.two.length, 3);
    assert.deepEqual(seen.one.map(function (ctx) {
      return ctx.level;
    }), [1, 2, 3]);

    // Within a system the behaviors map and the structural contexts are
    // the same objects at every level
    for (const key of ['one', 'two']) {
      assert.equal(seen[key][0].behaviors, seen[key][1].behaviors);
      assert.equal(seen[key][0].behaviors, seen[key][2].behaviors);
      assert.equal(seen[key][0].LayerContext, seen[key][1].LayerContext);
      assert.equal(seen[key][0].LayerContext, seen[key][2].LayerContext);
      assert.equal(seen[key][0].DisabledContext, seen[key][1].DisabledContext);
      assert.equal(seen[key][0].DisabledContext, seen[key][2].DisabledContext);
    }

    // Across systems every structural context and the behaviors map differ
    assert.notEqual(seen.one[0].LayerContext, seen.two[0].LayerContext);
    assert.notEqual(seen.one[0].DisabledContext, seen.two[0].DisabledContext);
    assert.notEqual(seen.one[0].behaviors, seen.two[0].behaviors);
  });

  test('a factory that does not return a function is rejected with a named TypeError', function () {
    function Bad () {
      return { $$typeof: 'memo' };
    }
    assert.throws(function () {
      buildSystem('default', { Bad: Bad });
    }, /factory "Bad" must return a function component/);
  });

});


describe('seam: a hosted overlay keeps the origin\'s structural contexts', function () {

  test('a Modal inside a Layer paints its hosted field at the origin level and follows updates', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', factories);
    let setLevel;
    let setOpen;
    function App () {
      const [level, setLevelState] = React.useState(1);
      const [open, setOpenState] = React.useState(true);
      setLevel = setLevelState;
      setOpen = setOpenState;
      return React.createElement(Registry.OverlayHost, null,
        React.createElement(Registry.Layer, { level: level },
          React.createElement(Registry.Modal, { open: open, title: 'T' },
            React.createElement(Registry.TextInput, null))));
    }
    const container = await render(React.createElement(App));
    const input = container.querySelector('input');
    assert.notEqual(input, null);
    // Layer level 1 paints level 2: the hosted field reads field_02
    assert.equal(input.parentElement.style.backgroundColor, paint(t['color.field_02']));
    assert.equal(container.querySelectorAll('[role="dialog"], [role="alertdialog"]').length, 1);

    // The origin's level update repaints the hosted layer, still one layer
    await act(async function () {
      setLevel(2);
    });
    const moved = container.querySelector('input');
    assert.equal(moved.parentElement.style.backgroundColor, paint(t['color.field_03']));
    assert.equal(container.querySelectorAll('[role="dialog"], [role="alertdialog"]').length, 1);

    // Closing unregisters the layer
    await act(async function () {
      setOpen(false);
    });
    assert.equal(container.querySelectorAll('[role="dialog"], [role="alertdialog"]').length, 0);
  });

  test('a hosted Heading keeps the Section level it opened from', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.OverlayHost, null,
      React.createElement(Registry.Section, null,
        React.createElement(Registry.Modal, { open: true, title: 'T' },
          React.createElement(Registry.Heading, null, 'Deep')))));
    const heading = container.querySelector('h2');
    assert.notEqual(heading, null, 'one Section in, the hosted heading is level 2');
    assert.equal(heading.textContent, 'Deep');
    assert.equal(heading.getAttribute('aria-level'), '2');
  });

});


describe('seam: brand-layer pins and redirects drive the levels', function () {

  for (const template of TEMPLATE_NAMES) {

    test(template + ': a literal pin on color.field_container holds at every level', async function () {
      const layers = [{ name: 'brand', tokens: { 'color.field_container': '#ff0000' } }];
      const Registry = buildSystem(template, { Layer: factories.Layer, TextInput: factories.TextInput }, { layers: layers });
      for (const level of [0, 1, 2]) {
        const parts = await renderField(React.createElement(Registry.Layer, { level: level },
          React.createElement(Registry.TextInput, null)));
        assert.equal(parts.frame.style.backgroundColor, paint('#ff0000'), 'level ' + (level + 1));
      }
    });

    test(template + ': a redirect of color.field_container to field_02 reads field_02, field_03, field_03', async function () {
      const layers = [{ name: 'brand', tokens: { 'color.field_container': '{color.field_02}' } }];
      const t = buildNative(template, layers).tokens;
      const Registry = buildSystem(template, { Layer: factories.Layer, TextInput: factories.TextInput }, { layers: layers });
      const expected = [t['color.field_02'], t['color.field_03'], t['color.field_03']];
      for (const level of [0, 1, 2]) {
        const parts = await renderField(React.createElement(Registry.Layer, { level: level },
          React.createElement(Registry.TextInput, null)));
        assert.equal(parts.frame.style.backgroundColor, paint(expected[level]), 'level ' + (level + 1));
      }
    });

  }

});


describe('FormGroup: the group disables everything inside it', function () {

  function GroupTree (Registry, props) {
    const groupProps = Object.assign({ legendText: 'Group' }, props);
    return React.createElement(React.Fragment, null,
      React.createElement(Registry.FormGroup, groupProps,
        React.createElement(Registry.TextInput, null),
        React.createElement(Registry.Checkbox, { label: 'Check', onChange: props.onCheck }),
        React.createElement(Registry.Button, { disabled: false, onPress: props.onPress }, 'Go'),
        React.createElement(Registry.FormGroup, { legendText: 'Inner', disabled: false },
          React.createElement(Registry.TextInput, null))),
      React.createElement(Registry.TextInput, null));
  }

  test('a disabled group disables its fields, including disabled:false children and a nested group', async function () {
    const calls = [];
    const Registry = buildSystem('default', factories);
    const container = await render(GroupTree(Registry, {
      disabled: true,
      onCheck: function (value) {
        calls.push(value);
      },
      onPress: function () {
        calls.push('press');
      }
    }));
    const inputs = Array.from(container.querySelectorAll('input'));
    const groups = container.querySelectorAll('[role="group"]');
    assert.equal(groups.length, 2);
    // Both grouped inputs are disabled; the sibling outside is not
    assert.equal(inputs[0].disabled || inputs[0].getAttribute('aria-disabled') === 'true', true);
    assert.equal(inputs[inputs.length - 2].disabled || inputs[inputs.length - 2].getAttribute('aria-disabled') === 'true', true);
    assert.equal(inputs[inputs.length - 1].disabled || inputs[inputs.length - 1].getAttribute('aria-disabled') === 'true', false);

    // The checkbox's own disabled:false cannot be undone; neither can the
    // button's
    const button = container.querySelector('[role="button"]');
    assert.equal(button.getAttribute('aria-disabled'), 'true');
    await act(async function () {
      button.click();
    });
    const checkbox = container.querySelector('[role="checkbox"]');
    assert.equal(checkbox.getAttribute('aria-disabled'), 'true');
    await act(async function () {
      checkbox.click();
    });
    assert.deepEqual(calls, []);
  });

  test('re-enabling the parent restores interaction; invalid alone disables nothing', async function () {
    const calls = [];
    const Registry = buildSystem('default', factories);
    let setDisabled;
    function App () {
      const [disabled, setDisabledState] = React.useState(true);
      setDisabled = setDisabledState;
      return GroupTree(Registry, {
        disabled: disabled,
        onPress: function () {
          calls.push('press');
        }
      });
    }
    const container = await render(React.createElement(App));
    const button = container.querySelector('[role="button"]');
    assert.equal(button.getAttribute('aria-disabled'), 'true');
    await act(async function () {
      setDisabled(false);
    });
    assert.equal(container.querySelector('[role="button"]').getAttribute('aria-disabled'), null);
    await act(async function () {
      container.querySelector('[role="button"]').click();
    });
    assert.deepEqual(calls, ['press']);

    // invalid marks the group without disabling a thing
    const invalid = await render(GroupTree(Registry, { invalid: true }));
    const marked = invalid.querySelector('[role="group"]');
    assert.equal(marked.getAttribute('aria-invalid'), 'true');
    assert.equal(marked.querySelector('[role="button"]').getAttribute('aria-disabled'), null);
    assert.equal(marked.querySelector('input').disabled, false);
  });

});


describe('FormGroup and Heading: relations and semantic levels', function () {

  test('the group is labelled by its legend; a shown message describes it', async function () {
    const Registry = buildSystem('default', { FormGroup: factories.FormGroup, Text: factories.Text });
    const container = await render(React.createElement(Registry.FormGroup, {
      legendText: 'Legend',
      message: true,
      messageText: 'The message.'
    }, React.createElement(Registry.Text, { text: 'field' })));
    const group = container.querySelector('[role="group"]');
    const legend = container.ownerDocument.getElementById(group.getAttribute('aria-labelledby'));
    assert.notEqual(legend, null);
    assert.equal(legend.textContent, 'Legend');
    const message = container.ownerDocument.getElementById(group.getAttribute('aria-describedby'));
    assert.notEqual(message, null);
    assert.equal(message.textContent, 'The message.');
  });

  test('message false carries no describedby', async function () {
    const Registry = buildSystem('default', { FormGroup: factories.FormGroup, Text: factories.Text });
    const container = await render(React.createElement(Registry.FormGroup, { legendText: 'Legend' }));
    const group = container.querySelector('[role="group"]');
    assert.equal(group.getAttribute('aria-describedby'), null);
  });

  for (const level of [1, 2, 3, 4, 5, 6]) {
    test('a Heading inside ' + (level - 1) + ' Sections draws heading0' + (7 - level) + ' at semantic level ' + level, async function () {
      const t = buildNative('default').tokens;
      const Registry = buildSystem('default', { Heading: factories.Heading, Section: factories.Section, Text: factories.Text });
      let element = React.createElement(Registry.Heading, null, 'H' + level);
      for (let i = 0; i < level - 1; i = i + 1) {
        element = React.createElement(Registry.Section, null, element);
      }
      const container = await render(element);
      const heading = container.querySelector('h' + level);
      assert.notEqual(heading, null);
      assert.equal(heading.getAttribute('aria-level'), String(level));
      assert.equal(heading.style.fontSize, t['type.heading0' + (7 - level)].fontSize + 'px');
    });
  }

});
