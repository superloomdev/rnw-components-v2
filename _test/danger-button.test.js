// Info: DangerButton molecule. A kind wrapper over Button: for every
// sample state its rendered tree equals the Button's for the danger kind,
// under every template; the kind is always `danger` whatever the call
// passes.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/button/sample.danger-button.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render a component's tree for the comparison.

@param {Object} Registry  - Registry
@param {String} component - Registry member name
@param {Object} props     - Props

@return {Promise<String>} - The rendered tree's markup
*********************************************************************/
async function markup (Registry, component, props) {

  const container = await render(React.createElement(Registry[component], props));

  return container.innerHTML;

}


for (const template of TEMPLATE_NAMES) {

  describe('DangerButton / ' + template, function () {

    test('every sample state renders the Button tree of the danger kind', async function () {
      const Registry = buildSystem(template, factories);
      for (const state of SAMPLE) {
        const button = Object.assign({}, state.props, { kind: 'danger' });
        assert.equal(
          await markup(Registry, 'DangerButton', state.props),
          await markup(Registry, 'Button', button),
          template + ' / ' + state.label);
      }
    });

    test('a caller kind never wins: the kind is always danger', async function () {
      const Registry = buildSystem(template, factories);
      assert.equal(
        await markup(Registry, 'DangerButton', { children: 'Danger', kind: 'ghost' }),
        await markup(Registry, 'Button', { children: 'Danger', kind: 'danger' }));
    });

  });

}
