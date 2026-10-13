// Info: SecondaryButton molecule. A kind wrapper over Button: for every
// sample state its rendered tree equals the Button's for the resulting
// kind, under every template; a caller `kind` wins over the secondary
// default.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/button/sample.secondary-button.js';
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

  describe('SecondaryButton / ' + template, function () {

    test('every sample state renders the Button tree of its resulting kind', async function () {
      const Registry = buildSystem(template, factories);
      for (const state of SAMPLE) {
        const button = Object.assign({ kind: 'secondary' }, state.props);
        assert.equal(
          await markup(Registry, 'SecondaryButton', state.props),
          await markup(Registry, 'Button', button),
          template + ' / ' + state.label);
      }
    });

    test('a caller kind wins over the secondary default', async function () {
      const Registry = buildSystem(template, factories);
      assert.equal(
        await markup(Registry, 'SecondaryButton', { children: 'Secondary', kind: 'ghost' }),
        await markup(Registry, 'Button', { children: 'Secondary', kind: 'ghost' }));
    });

  });

}
