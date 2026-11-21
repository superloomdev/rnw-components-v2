// PageHeader row tests: the title row renders without breadcrumbs; the
// breadcrumb row draws its trail in the header's own type, gap and top
// padding; the title icon takes the theme's offset; with page actions the
// breadcrumb row and column take the section share; below md the row
// splits at the narrow share and the trail is the back link; the trail and
// the page actions fit their room.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { Lib, buildNative, buildSystem } from './harness/system.js';
import { act } from 'react';
import { React, cleanup, cssValue, render } from './harness/render.js';
afterEach(cleanup);
// Runs `body` with the window narrower than `breakpoint.md`
async function belowMd (t, body) {
  const width = window.innerWidth;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: t['breakpoint.md'] - 1, writable: true });
  try {
    await body();
  } finally {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
  }
}
// Renders with a View that records every `onLayout` with its props, so a
// test drives the fit with explicit widths
async function renderMeasured (props) {
  const layouts = [];
  const MeasuringView = React.forwardRef(function (p, ref) {
    if (typeof p.onLayout === 'function') {
      layouts.push({ fn: p.onLayout, part: p.dataSet ? p.dataSet.part : undefined, role: p.role });
    }
    return React.createElement(Lib.ReactNative.View, Object.assign({}, p, { ref: ref }));
  });
  const Registry = buildSystem('carbon', factories, {
    lib: Object.assign({}, Lib, { ReactNative: Object.assign({}, Lib.ReactNative, { View: MeasuringView }) })
  });
  const container = await render(React.createElement(Registry.PageHeader, props));
  return { container: container, layouts: layouts };
}
const layout = function (width) {
  return { nativeEvent: { layout: { height: 16, width: width, x: 0, y: 0 } } };
};
describe('PageHeader: the title row', function () {
  test('the title row renders without breadcrumbs', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.PageHeader, { title: 'Page title' }));
    const title = container.querySelector('[data-part="title"]');
    assert.equal(title !== null, true, 'the title row renders');
    assert.equal(container.querySelector('[data-part="breadcrumb"]') === null, true, 'no breadcrumb row without breadcrumbs');
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
    // Before the fit's first layout the overflow item is measured hidden
    // after the hidden title; the drawn items are the two breadcrumbs
    const items = row.querySelectorAll('[role="listitem"]:not([aria-hidden="true"])');
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
  test('without page actions the trail spans the whole row; below md the row splits at the narrow share', async function () {
    const Registry = buildSystem('carbon', factories);
    const t = buildNative('carbon').tokens;
    const plain = await render(React.createElement(Registry.PageHeader, { breadcrumbs: crumbs, title: 'Title' }));
    assert.equal(plain.querySelector('[data-part="breadcrumbRow"]') === null, true, 'no split without page actions');
    await cleanup();
    await belowMd(t, async function () {
      // Below md the row carries the action-bar class with or without page
      // actions (`PageHeader.js:310`): the column takes the `_sm` share
      const narrow = await render(React.createElement(Registry.PageHeader, { breadcrumbs: crumbs, title: 'Title' }));
      const row = narrow.querySelector('[data-part="breadcrumbRow"]');
      assert.equal(row !== null, true, 'the row splits below md');
      assert.equal(row.firstChild.style.width, '100%', 'the row spans the header');
      const column = row.querySelector('[data-part="breadcrumbColumn"]');
      assert.equal(column.style.width, (t['control.page_header_breadcrumb_ratio_sm'] * 100) + '%');
      assert.equal(column.style.paddingLeft, t['grid.gutter'] / 2 + 'px');
    });
  });
});
describe('PageHeader: below md, the back link', function () {
  test('below md the trail is one icon link back to the last breadcrumb, in the narrow line box', async function () {
    const Registry = buildSystem('carbon', factories);
    const t = buildNative('carbon').tokens;
    await belowMd(t, async function () {
      const container = await render(React.createElement(Registry.PageHeader, { breadcrumbs: [{ href: '#one', label: 'Breadcrumb 1' }, { href: '#two', label: 'Breadcrumb 2' }], title: 'Title' }));
      const items = container.querySelectorAll('[data-part="breadcrumb"] [role="listitem"]');
      assert.equal(items.length, 1, 'only the back link draws');
      const link = items[0].querySelector('[role="link"]');
      assert.equal(link.getAttribute('aria-label'), 'Breadcrumb 2');
      assert.equal(link.getAttribute('href'), '#two');
      assert.equal(items[0].querySelector('svg').getAttribute('fill'), t['color.icon_primary']);
      assert.equal(items[0].style.marginTop, t['control.page_header_breadcrumb_back_offset'] + 'px');
      assert.equal(items[0].style.height, t['control.page_header_breadcrumb_back_height'] + 'px');
    });
  });
});
describe('PageHeader: the fit', function () {
  const trail = [1, 2, 3, 4, 5].map(function (n) {
    return { href: '#', label: 'Breadcrumb ' + n };
  });
  test('the trail keeps the last, the first, then n-1 ... and gathers the rest after the first', async function () {
    const parts = await renderMeasured({ breadcrumbs: trail, title: 'Title' });
    // Widths with the 4 gap: overflow 24, crumbs 84, title 64 in a 300
    // room: title, crumb 1 and crumb 5 fit (68 left), crumb 4 does not
    await act(async function () {
      parts.layouts.filter(function (l) {
        return l.part === 'trail';
      })[0].fn(layout(300));
      // The first render's items: five crumbs, the title and the overflow seat
      const items = parts.layouts.filter(function (l) {
        return l.role === 'listitem';
      }).slice(0, 7);
      items.forEach(function (l, i) {
        l.fn(layout(i < 5 ? 80 : i === 5 ? 60 : 20));
      });
    });
    const shown = Array.from(parts.container.querySelectorAll('[data-part="breadcrumb"] [role="listitem"]'));
    assert.equal(shown.length, 4);
    assert.equal(shown[0].textContent.indexOf('Breadcrumb 1'), 0);
    assert.equal(shown[1].querySelector('[role="button"]') !== null, true, 'the overflow item sits after the first');
    assert.equal(shown[2].textContent.indexOf('Breadcrumb 5'), 0);
    assert.equal(shown[3].getAttribute('aria-hidden'), 'true', 'the title ends the trail, hidden');
  });
  test('the tags take the right section alt share of the row widened by the gutter, less the column insets', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderMeasured({ tags: [{ label: 'Tag one', type: 'blue' }, { label: 'Tag two', type: 'green' }], title: 'Title' });
    await act(async function () {
      parts.layouts.filter(function (l) {
        return l.part === 'titleRow';
      })[0].fn(layout(1216));
    });
    const room = (1 - t['control.page_header_breadcrumb_ratio_sm']) * (1216 + t['grid.gutter']) - t['grid.gutter'] / 2 - t['control.page_header_tags_padding_end'];
    assert.equal(parts.container.querySelector('[data-part="tags"]').style.width, room + 'px');
  });
  test('the page actions are a button set while they fit and one menu button when they do not', async function () {
    const actions = [{ kind: 'secondary', label: 'Secondary button' }, { kind: 'danger', label: 'Delete' }];
    const drive = async function (each) {
      const parts = await renderMeasured({ pageActions: actions, pageActionsOverflowLabel: 'More actions', title: 'Title' });
      // At md and up the room is 40 % of the row widened by the gutter:
      // 0.4 x (1216 + 32) - 32 = 467.2
      await act(async function () {
        parts.layouts.filter(function (l) {
          return l.part === 'titleRow';
        })[0].fn(layout(1216));
        parts.layouts.filter(function (l) {
          return l.part === 'action';
        }).forEach(function (l) {
          l.fn(layout(each));
        });
      });
      return parts.container.querySelector('[data-part="actions"]');
    };
    const set = await drive(230);
    assert.equal(set.textContent, 'Secondary buttonDelete', 'two buttons in 460');
    await cleanup();
    const menu = await drive(240);
    assert.equal(menu.textContent.indexOf('More actions') !== -1, true, 'one menu button past 467.2');
    assert.equal(menu.textContent.indexOf('Secondary button'), -1);
    await act(async function () {
      menu.querySelector('[role="button"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const list = document.querySelector('[role="menu"]');
    assert.equal(list.textContent, 'DeleteSecondary button', 'the menu lists the actions in reverse');
  });
});
