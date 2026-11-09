// Info: PaginationSkeleton composite. The bar paints the container cells
// and the four SkeletonText bars read their own width cells in the text
// gap's rhythm (medium, short, long, medium).

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/pagination/sample.pagination-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one PaginationSkeleton and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Skeleton props

@return {Promise<Object>} - { root, texts }
*********************************************************************/
async function renderSkeleton (Registry, props) {

  const container = await render(React.createElement(Registry.PaginationSkeleton, props));
  const root = container.firstElementChild;

  return { root: root, texts: Array.from(root.querySelectorAll('[data-part="text"]')) };

}


describe('PaginationSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    const tokens = buildNative(template).tokens;
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the bars read the skeleton width cells', async function () {
        const Registry = buildSystem(template, factories);
        const { root, texts } = await renderSkeleton(Registry, state.props);
        assert.equal(root.style.backgroundColor, cssValue('backgroundColor', tokens['color.pagination_container']));
        assert.equal(root.style.borderTopColor, cssValue('borderTopColor', tokens['color.pagination_divider']));
        assert.equal(texts.length, 4);
        assert.equal(texts[0].style.marginRight, tokens['control.pagination_text_gap'] + 'px');

      });
    }
  }

});
