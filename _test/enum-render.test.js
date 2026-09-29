// Info: Enum coverage. For every built component whose roster row lists enum
// tokens, each value the contract lists for that token produces a different
// render of the component's first sample state; a value that changes nothing
// means the component ignores the theme's choice. The set of components
// under test is computed from the roster and all.js, never typed here.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { discoverComponents, getRoster } from '../scripts/lib/components.js';
import { Lib, buildNative, buildSystem } from './harness/system.js';
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

afterEach(cleanup);


/********************************************************************
Build a default-template system whose built tokens carry one override.

@param {String} token - Token name
@param {String} value - Enum value

@return {Object} - Registry
*********************************************************************/
function systemWith (token, value) {

  const built = buildNative('default');
  const tokens = Object.assign({}, built.tokens);
  tokens[token] = value;

  return buildSystem('default', factories, { built: Object.assign({}, built, { tokens: tokens }) });

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
          const Registry = systemWith(token, value);
          const container = await render(React.createElement(Registry[component.name], component.sample[0].props));
          renders[value] = container.innerHTML;
        }
        const distinct = new Set(Object.values(renders));
        assert.equal(distinct.size, values.length,
          component.name + ' renders identically for two values of ' + token + ': ' + JSON.stringify(renders));
      });
    }
  }

});
