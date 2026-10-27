// Info: Enum coverage across supported templates. Each contract value must
// change the combined render of the component's sample states somewhere:
// a disabled-compositing choice is legitimately indistinguishable with
// opaque colors, but must be observable with a translucent template.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { discoverComponents, getRoster } from '../scripts/lib/components.js';
import { createSampleElement } from './harness/sample.js';
import { Lib, TEMPLATES, buildNative, buildSystem, LESSONS_LAYER } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const contract = Lib.Themer.getContract();
const roster = getRoster();
const components = await discoverComponents();
const rowsByName = {};
for (const row of roster.rows) {
  rowsByName[row.name] = row;
}
const withEnums = components.filter(function (component) {
  return rowsByName[component.name].enums.length > 0;
});
const TEMPLATE_NAMES = Object.keys(TEMPLATES);
// A third render under the lessons-pinned theme, so a value only the retired
// retired template picked still distinguishes itself somewhere
const RENDER_TEMPLATES = TEMPLATE_NAMES.concat(['lessons']);

afterEach(cleanup);

function systemWith (template, token, value) {
  const layers = template === 'lessons' ? [LESSONS_LAYER, { name: 'enum', tokens: { [token]: value } }] : [{ name: 'enum', tokens: { [token]: value } }];
  return buildSystem(template === 'lessons' ? 'carbon' : template, factories, { built: buildNative(template === 'lessons' ? 'carbon' : template, layers) });
}

describe('enum render: every listed enum value changes the render', function () {
  test('every roster enum on a built component is a contract enum token', function () {
    for (const component of withEnums) {
      for (const token of rowsByName[component.name].enums) {
        assert.ok(contract.tokens[token] && Array.isArray(contract.tokens[token].values),
          component.name + ' lists ' + token + ', which is not an enum token');
      }
    }
    assert.equal(withEnums.length, components.filter(function (component) {
      return rowsByName[component.name].enums.length > 0;
    }).length);
  });

  for (const component of withEnums) {
    for (const token of rowsByName[component.name].enums) {
      test(component.name + ' / ' + token, async function () {
        const values = contract.tokens[token].values;
        const renders = {};
        for (const value of values) {
          const profiles = [];
          for (const template of RENDER_TEMPLATES) {
            const Registry = systemWith(template, token, value);
            const container = await render(React.createElement(React.Fragment, null, component.sample.map(function (state, index) {
              return React.createElement(React.Fragment, { key: index }, createSampleElement(React, Registry, component.name, state));
            })));
            profiles.push({
              template: template,
              html: container.innerHTML.replace(/(id|aria-labelledby|aria-describedby|aria-controls)="[^"]*"/g, '$1="*"')
            });
          }
          renders[value] = JSON.stringify(profiles);
        }
        const distinct = new Set(Object.values(renders));
        assert.equal(distinct.size, values.length,
          component.name + ' renders identically across all templates for two values of ' + token);
      });
    }
  }
});
