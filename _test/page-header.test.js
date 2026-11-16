// PageHeader row tests: the title row renders without breadcrumbs; the
// breadcrumb row draws its trail in the header's own type, gap and top
// padding; the title icon takes the theme's offset; with page actions the
// breadcrumb row and column take the section share.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
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
describe('PageHeader: the subtitle', function () {
  test('the subtitle presents its line height as the unitless ratio', async function () {
    const Registry = buildSystem('carbon', factories);
    const set = buildNative('carbon').tokens['type.page_header_subtitle'];
    const container = await render(React.createElement(Registry.PageHeader, { subtitle: 'Subtitle', title: 'Title' }));
    const subtitle = container.querySelector('[data-part="subtitle"]');
    assert.equal(subtitle.style.lineHeight, cssValue('lineHeight', String(set.lineHeight / set.fontSize)));
  });
});
describe('PageHeader: the breadcrumb row and the title icon', function () {
  test('the breadcrumb row draws its trail in the header type and gap, 12 down', async function () {
    const Registry = buildSystem('carbon', factories);
    const t = buildNative('carbon').tokens;
    const container = await render(React.createElement(Registry.PageHeader, { breadcrumbs: [{ href: '#', label: 'Breadcrumb 1' }, { href: '#', label: 'Breadcrumb 2' }], title: 'Title' }));
    const row = container.querySelector('[data-part="breadcrumb"]');
    assert.equal(row.style.paddingTop, t['control.page_header_breadcrumb_padding_top'] + 'px');
    const nav = row.querySelector('[role="navigation"]');
    assert.equal(nav.style.fontSize, t['type.page_header_breadcrumb'].fontSize + 'px');
    assert.equal(nav.style.letterSpacing, t['type.page_header_breadcrumb'].letterSpacing + 'px');
    const items = row.querySelectorAll('[role="listitem"]');
    assert.equal(items.length, 2);
    assert.equal(items[0].textContent.indexOf('Breadcrumb 1'), 0, 'the trail draws its labels');
    assert.equal(items[0].style.marginRight, t['control.page_header_breadcrumb_gap'] + 'px');
  });
  test('the title icon takes the theme offset', async function () {
    const Registry = buildSystem('carbon', factories);
    const t = buildNative('carbon').tokens;
    const container = await render(React.createElement(Registry.PageHeader, { title: 'Title', titleIcon: 'document' }));
    const icon = container.querySelector('[data-part="titleIcon"]');
    assert.match(icon.style.transform, new RegExp('translateY\\(' + t['control.page_header_title_icon_offset'] + 'px\\)'));
  });
});
describe('PageHeader: the breadcrumb section share', function () {
  const crumbs = [{ href: '#', label: 'Breadcrumb 1' }, { href: '#', label: 'Breadcrumb 2' }];
  const actions = [{ kind: 'secondary', label: 'Secondary button' }, { kind: 'primary', label: 'Primary button' }];
  test('with page actions the row and its breadcrumb column take the section share inside the gutters', async function () {
    const Registry = buildSystem('carbon', factories);
    const t = buildNative('carbon').tokens;
    const share = (t['control.page_header_breadcrumb_ratio'] * 100) + '%';
    const half = t['grid.gutter'] / 2;
    const container = await render(React.createElement(Registry.PageHeader, { breadcrumbs: crumbs, pageActions: actions, title: 'Title' }));
    const row = container.querySelector('[data-part="breadcrumbRow"]');
    assert.equal(row.style.marginLeft, -half + 'px');
    assert.equal(row.style.marginRight, -half + 'px');
    assert.equal(row.firstChild.style.width, share);
    const column = row.querySelector('[data-part="breadcrumbColumn"]');
    assert.equal(column.style.width, share);
    assert.equal(column.style.paddingLeft, half + 'px');
    assert.equal(column.style.paddingRight, half + 'px');
    assert.equal(column.querySelector('[role="list"]') !== null, true, 'the trail sits in the column');
  });
  test('without page actions, or below md, the trail spans the whole row', async function () {
    const Registry = buildSystem('carbon', factories);
    const t = buildNative('carbon').tokens;
    const plain = await render(React.createElement(Registry.PageHeader, { breadcrumbs: crumbs, title: 'Title' }));
    assert.equal(plain.querySelector('[data-part="breadcrumbRow"]') === null, true, 'no split without page actions');
    await cleanup();
    const width = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: t['breakpoint.md'] - 1, writable: true });
    try {
      const narrow = await render(React.createElement(Registry.PageHeader, { breadcrumbs: crumbs, pageActions: actions, title: 'Title' }));
      assert.equal(narrow.querySelector('[data-part="breadcrumb"] [role="list"]') !== null, true, 'the trail renders below md');
      assert.equal(narrow.querySelector('[data-part="breadcrumbRow"]') === null, true, 'no split below md');
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
    }
  });
});
