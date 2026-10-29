// Info: BreadcrumbItem member. Its cells and roles through a standalone
// render: the link for an `href` item at the breadcrumb's type and the
// `sm` links' minimum width, plain link-styled text without one, the
// current page's `aria-current` and ink, and the separator gated by
// `last` / `noTrailingSlash`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

describe('BreadcrumbItem: the member draws its cells', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': the href item is a link with the separator at the gap', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.BreadcrumbItem, { href: '#home', label: 'Home' }));
      const li = rendered.firstElementChild;
      assert.equal(li.getAttribute('role'), 'listitem');
      assert.equal(li.style.marginRight, t['control.breadcrumb_gap'] + 'px');
      const link = li.querySelector('[role="link"]');
      assert.notEqual(link, null);
      assert.equal(link.getAttribute('href'), '#home');
      const separator = li.querySelector(':scope > [dir="auto"]');
      assert.notEqual(separator, null);
      assert.equal(separator.textContent, '/');
      assert.equal(separator.style.color, cssValue('color', t['color.breadcrumb_separator']));
      assert.equal(separator.style.marginLeft, t['control.breadcrumb_gap'] + 'px');
      await cleanup();
    });

    test(template + ': the small link takes the minimum width and the small gap', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.BreadcrumbItem, { href: '#home', label: 'Home', size: 'sm' }));
      const li = rendered.firstElementChild;
      assert.equal(li.style.marginRight, t['control.breadcrumb_gap_small'] + 'px');
      const link = li.querySelector('[role="link"]');
      const face = link.parentElement.children[0];
      assert.equal(face.style.minWidth, t['control.breadcrumb_link_min_width_small'] + 'px');
      await cleanup();
    });

    test(template + ': the current page is aria-current in the current ink without a link', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.BreadcrumbItem, { isCurrentPage: true, label: 'Product A' }));
      const li = rendered.firstElementChild;
      assert.equal(li.querySelector('[role="link"]'), null, 'the current page is not a link');
      const text = li.querySelector('[dir="auto"]');
      assert.equal(text.getAttribute('aria-current'), 'page');
      assert.equal(text.style.color, cssValue('color', t['color.breadcrumb_current']));
      await cleanup();
    });

    test(template + ': the separator drops only on the last item with noTrailingSlash', async function () {
      const Registry = buildSystem(template, factories);
      const last = await render(React.createElement(Registry.BreadcrumbItem, { href: '#a', label: 'A', last: true }));
      assert.equal(last.firstElementChild.querySelectorAll(':scope > [dir="auto"]').length, 1, 'upstream draws the trailing separator');
      await cleanup();
      const noSlash = await render(React.createElement(Registry.BreadcrumbItem, { href: '#a', label: 'A', noTrailingSlash: true }));
      assert.equal(noSlash.firstElementChild.querySelectorAll(':scope > [dir="auto"]').length, 1, 'a non-last item keeps its separator');
      await cleanup();
      const both = await render(React.createElement(Registry.BreadcrumbItem, { href: '#a', label: 'A', last: true, noTrailingSlash: true }));
      assert.equal(both.firstElementChild.querySelectorAll(':scope > [dir="auto"]').length, 0);
      await cleanup();
    });
  }

});
