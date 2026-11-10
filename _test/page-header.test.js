// PageHeader row tests: the title row renders without breadcrumbs.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';
afterEach(cleanup);
describe('PageHeader: the title row', function () {
  test('the title row renders without breadcrumbs', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.PageHeader, { title: 'Page title' }));
    const title = container.querySelector('[data-part="title"]');
    assert.notEqual(title, null, 'the title row renders');
    assert.equal(container.querySelector('[data-part="breadcrumb"]'), null, 'no breadcrumb row without breadcrumbs');
    assert.match(title.getAttribute('style'), /min-height:\s*32px|min-height:\s*40px/, 'the title keeps its min height');
  });
});
