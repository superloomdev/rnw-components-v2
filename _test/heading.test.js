// Info: Heading and Section. A Section raises the heading level of every
// Heading inside it by one, clamped at six; a Heading is the registry Text
// in the level's `heading0<7 - N>` set and `text_primary`, with the
// semantic level carried through Text's `header` role.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

const HEADING_FACTORIES = { Heading: factories.Heading, Section: factories.Section, Text: factories.Text };


/********************************************************************
Wrap an element in n Sections.

@param {Object} Registry - Registry
@param {Object} element  - React element
@param {Number} depth    - Sections deep

@return {Object} - React element
*********************************************************************/
function sections (Registry, element, depth) {

  let wrapped = element;
  for (let i = 0; i < depth; i = i + 1) {
    wrapped = React.createElement(Registry.Section, null, wrapped);
  }
  return wrapped;

}


describe('Heading: level drives the type set and the semantic level', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const depth of [0, 1, 2, 5]) {
      const level = depth + 1;
      test(template + ': ' + depth + ' Sections deep is level ' + level + ' in type.heading0' + (7 - level), async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, HEADING_FACTORIES);
        const container = await render(sections(Registry,
          React.createElement(Registry.Heading, null, 'Level ' + level), depth));
        const heading = container.querySelector('h' + level);
        assert.notEqual(heading, null);
        assert.equal(heading.getAttribute('aria-level'), String(level));
        assert.equal(heading.style.fontSize, t['type.heading0' + (7 - level)].fontSize + 'px');
        assert.equal(heading.style.color, cssValue('color', t['color.text_primary']));
        assert.equal(heading.textContent, 'Level ' + level);
      });
    }
  }

  test('seven Sections clamp to level 6', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', HEADING_FACTORIES);
    const container = await render(sections(Registry, React.createElement(Registry.Heading, null, 'Deep'), 7));
    const heading = container.querySelector('h6');
    assert.notEqual(heading, null);
    assert.equal(heading.getAttribute('aria-level'), '6');
    assert.equal(heading.style.fontSize, t['type.heading01'].fontSize + 'px');
  });

  test('a Section level override sets the subtree\'s level outright', async function () {
    const Registry = buildSystem('default', HEADING_FACTORIES);
    const container = await render(React.createElement(Registry.Section, { level: 4 },
      React.createElement(Registry.Heading, null, 'Override')));
    assert.notEqual(container.querySelector('h4'), null);
  });

  test('an invalid Section level throws a named TypeError', async function () {
    const Registry = buildSystem('default', HEADING_FACTORIES);
    await assert.rejects(
      render(React.createElement(Registry.Section, { level: 9 }, React.createElement(Registry.Heading, null, 'x'))),
      /Section level must be an integer from 1 through 6/
    );
  });

});


describe('Section: text children render through the registry Text', function () {

  test('a bare string child renders through the registry Text', async function () {
    const Registry = buildSystem('default', HEADING_FACTORIES);
    const container = await render(React.createElement(Registry.Section, null, 'plain text'));
    assert.equal(container.querySelector('[dir="auto"]').textContent, 'plain text');
  });

  test('a numeric zero child renders through the registry Text', async function () {
    const Registry = buildSystem('default', HEADING_FACTORIES);
    const container = await render(React.createElement(Registry.Section, null, 0));
    assert.equal(container.querySelector('[dir="auto"]').textContent, '0');
  });

  test('a nested array flattens and every scalar renders through the registry Text', async function () {
    const Registry = buildSystem('default', HEADING_FACTORIES);
    const container = await render(React.createElement(Registry.Section, null,
      [0, ['nested'], React.createElement(Registry.Heading, null, 'kept')]));
    const runs = container.querySelectorAll('[dir="auto"]');
    assert.equal(runs.length, 3);
    assert.equal(runs[0].textContent, '0');
    assert.equal(runs[1].textContent, 'nested');
    // A real element child is preserved, not rewrapped; the Section raises it to h2
    assert.equal(container.querySelector('h2').textContent, 'kept');
  });

});
