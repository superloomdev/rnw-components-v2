// Info: Breadcrumb molecule. Every sample state renders under all three
// themes: a `navigation` landmark named `Breadcrumb` (or the given label)
// holding an ordered list; links through `ctx.Registry.Link`, the current
// page `aria-current="page"` in `color.breadcrumb_current` without
// underline; the `/` separator in `color.breadcrumb_separator` after every
// item but the last (none with `noTrailingSlash`) at the
// `control.breadcrumb_gap` (`_small`) gap; the overflow item is the
// breadcrumb-boxed OverflowMenu and its menu opens 10 below, 13 left of
// the trigger's start with the caret. Below md each item takes its own
// line; a composing parent's icon, hidden and line-box items.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/breadcrumb/sample.breadcrumb.js';
import { Lib, TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

async function fire (element, event) {
  await act(async function () {
    element.dispatchEvent(event);
  });
}

function registryFor (template) {
  return buildSystem(template, factories);
}

async function renderBreadcrumb (Registry, props) {
  const rendered = await render(React.createElement(Registry.Breadcrumb, props));
  const nav = rendered.querySelector('[role="navigation"]');
  const list = rendered.querySelector('[role="list"]');
  return {
    nav: nav,
    list: list,
    items: list === null ? [] : Array.from(list.querySelectorAll(':scope > [role="listitem"]')),
    rendered: rendered
  };
}

describe('Breadcrumb: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the trail comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const parts = await renderBreadcrumb(registryFor(template), props);
        const small = props.size === 'sm';
        const gap = t[small ? 'control.breadcrumb_gap_small' : 'control.breadcrumb_gap'];

        // The landmark and its ordered list at the breadcrumb type
        assert.equal(parts.nav !== null, true);
        assert.equal(parts.nav.getAttribute('aria-label'), 'Breadcrumb');
        assert.equal(parts.nav.style.fontSize, t[small ? 'type.breadcrumb_small' : 'type.breadcrumb'].fontSize + 'px');
        if (small === true) {
          const linkText = parts.items[0].querySelector('[role="link"], [dir="auto"]');
          assert.ok(linkText !== null, 'the small link renders');
          assert.equal(linkText.style.letterSpacing, t['type.breadcrumb_small'].letterSpacing + 'px', 'the small link reads type.breadcrumb_small');
        }
        assert.equal(parts.list !== null, true);
        assert.equal(parts.items.length, props.items.length);

        for (let index = 0; index < props.items.length; index++) {
          const item = props.items[index];
          const li = parts.items[index];
          // The last item takes no end gap (`_breadcrumb.scss:88-91`)
          assert.equal(li.style.marginRight, (index === props.items.length - 1 ? 0 : gap) + 'px', 'the item gap');

          if (item.overflow !== undefined) {
            // The overflow trigger: the breadcrumb box, the glyph and its ink
            const trigger = li.querySelector('[role="button"]');
            assert.equal(trigger !== null, true);
            const face = trigger.parentElement;
            assert.equal(face.style.width, t['control.breadcrumb_overflow_width'] + 'px', 'trigger width');
            assert.equal(face.style.height, (small ? t['control.breadcrumb_overflow_height_small'] : t['control.breadcrumb_overflow_height']) + 'px', 'trigger height');
            const svg = face.querySelector('svg');
            assert.equal(svg.getAttribute('fill'), t['color.breadcrumb_overflow_icon'], 'the overflow ink');
            const iconWrap = svg.parentElement;
            assert.equal(iconWrap.style.marginTop, t['control.breadcrumb_overflow_icon_offset'] + 'px', 'the icon offset');
            await fire(trigger, new Event('pointerover', { bubbles: true }));
            const under = li.querySelector('[data-part="focusUnderline"]');
            if (under !== null) {
              assert.equal(under.style.top, ((small ? t['control.breadcrumb_overflow_height_small'] : t['control.breadcrumb_overflow_height']) - 3) + 'px', 'the underline sits 2 px above the trigger bottom');
            } else {
              assert.fail('the focus underline renders for every template');
            }
          } else {
            const link = li.querySelector('[role="link"]');
            const text = li.querySelector('[dir="auto"]');
            if (item.isCurrentPage === true) {
              assert.equal(text.getAttribute('aria-current'), 'page');
              assert.equal(text.style.color, cssValue('color', t['color.breadcrumb_current']));
              assert.equal(text.style.textDecorationLine, '', 'no underline');
            } else if (item.href !== undefined) {
              assert.equal(link !== null, true, 'an href item is a link');
              assert.equal(link.getAttribute('href'), item.href);
            } else {
              assert.equal(text.style.color, cssValue('color', t['color.link_primary']), 'link-styled text');
            }
          }

          // The separator: after every item; the last one only drops its
          // own when `noTrailingSlash` - upstream's item `::after` draws it
          const separators = Array.from(li.querySelectorAll(':scope > [dir="auto"]')).filter(function (el) {
            return el.textContent === '/';
          });
          const last = index === props.items.length - 1 && props.noTrailingSlash === true;
          if (last) {
            assert.equal(separators.length, 0, 'no separator after the last item');
          } else {
            assert.equal(separators.length, 1, 'the separator follows');
            assert.equal(separators[0].style.color, cssValue('color', t['color.breadcrumb_separator']));
            assert.equal(separators[0].style.marginLeft, gap + 'px');
          }
        }
      });
    }
  }

});

describe('Breadcrumb: the overflow menu', function () {

  test('the menu opens 10 below and 13 left of the trigger with the caret', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderBreadcrumb(registryFor('carbon'), { items: SAMPLE[3].props.items });
    const trigger = parts.items[1].querySelector('[role="button"]');
    await fire(trigger, new MouseEvent('click', { bubbles: true }));
    const menu = parts.rendered.querySelector('[role="menu"]');
    assert.equal(menu !== null, true, 'the menu mounts');
    // The constant offset: 10 below the trigger, 13 left of its start
    assert.equal(menu.style.top, '10px');
    assert.equal(menu.style.left, '-13px');

    // The caret: the first child inside the panel, a border triangle on
    // the top edge in the caret cell
    const caret = menu.children[0];
    assert.equal(caret.style.borderBottomWidth, t['control.breadcrumb_overflow_caret_size'] + 'px');
    assert.equal(caret.style.borderBottomColor, cssValue('borderBottomColor', t['color.breadcrumb_overflow_caret']));

    // The connector is suppressed even where the anatomy draws one
    const connector = menu.children[1];
    assert.equal(connector.style.opacity, '0', 'no connector under the breadcrumb');
  });

  test('the trigger focus draws the underline bar', async function () {
    const parts = await renderBreadcrumb(registryFor('carbon'), { items: SAMPLE[3].props.items });
    const trigger = parts.items[1].querySelector('[role="button"]');
    const t = buildNative('carbon').tokens;
    await fire(trigger, new Event('focusin', { bubbles: true }));
    const underline = parts.items[1].querySelector('[data-part="focusUnderline"]');
    assert.equal(underline !== null, true, 'the underline shows while focused');
    assert.equal(underline.style.width, t['control.breadcrumb_overflow_underline_width'] + 'px');
    assert.equal(underline.style.backgroundColor, cssValue('backgroundColor', t['color.focus']));
  });

});


describe('Breadcrumb: below md and the composition items', function () {

  async function belowMd (body) {
    const t = buildNative('carbon').tokens;
    const width = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: t['breakpoint.md'] - 1, writable: true });
    try {
      await body();
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
    }
  }

  test('below md every item takes its own line across the list', async function () {
    const wide = await renderBreadcrumb(registryFor('carbon'), { items: SAMPLE[0].props.items });
    assert.equal(wide.list.style.flexDirection, 'row', 'one line at md and up');
    await cleanup();
    await belowMd(async function () {
      const parts = await renderBreadcrumb(registryFor('carbon'), { items: SAMPLE[0].props.items });
      assert.equal(parts.list.style.flexDirection, 'column', 'one item per line below md');
      assert.equal(parts.list.style.alignItems, 'stretch', 'each item spans the list');
    });
  });

  test('an icon item is the glyph alone, named by its label; a hidden item keeps its room', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderBreadcrumb(registryFor('carbon'), {
      items: [
        { boxHeight: 17, href: '#back', icon: 'arrow_left', iconColorLeaf: 'icon_primary', label: 'Back', offsetTop: 2 },
        { hidden: true, isCurrentPage: true, label: 'Title' }
      ]
    });
    const back = parts.items[0];
    const link = back.querySelector('[role="link"]');
    assert.equal(link.getAttribute('aria-label'), 'Back');
    assert.equal(link.getAttribute('href'), '#back');
    assert.equal(back.textContent, '/', 'no label text, only the separator');
    assert.equal(back.querySelector('svg').getAttribute('fill'), t['color.icon_primary'], 'the glyph in the leaf it is given');
    assert.equal(back.style.marginTop, '2px');
    assert.equal(back.style.height, '17px');
    assert.equal(back.style.alignItems, 'flex-start', 'the glyph at the top of its box');
    assert.equal(parts.items[1].style.opacity, '0');
    assert.equal(parts.items[1].getAttribute('aria-hidden'), 'true');
  });

});

describe('Breadcrumb: the stacked row height of the form classes', function () {

  async function stacked (built) {
    const width = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: built.tokens['breakpoint.md'] - 1, writable: true });
    try {
      return await renderBreadcrumb(buildSystem('carbon', factories, { built: built }), { items: SAMPLE[0].props.items });
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
    }
  }

  test('base: a stacked item keeps its line and its link stays at the line', async function () {
    const parts = await stacked(buildNative('carbon'));
    assert.equal(buildNative('carbon').tokens['control.breadcrumb_stacked_item_min_height'], 0);
    assert.equal(parts.items[0].style.minHeight, '', 'no row floor');
  });

  test('compact: every stacked item is a target-floor row, its content centered', async function () {
    const compact = Lib.Themer.buildTheme(TEMPLATES.carbon, [], 'native', { variant: { form: 'compact' } });
    const t = compact.tokens;
    assert.equal(t['control.breadcrumb_stacked_item_min_height'], t['control.target_min']);
    const parts = await stacked(compact);
    for (const item of parts.items) {
      assert.equal(item.style.minHeight, t['control.target_min'] + 'px');
      assert.equal(item.style.alignItems, 'center');
    }
  });

});
