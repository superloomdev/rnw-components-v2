// Info: OverflowMenuItem member. The row height per size with and
// without the divider (the rule sits inside the row's height); the
// danger cells on hover and focus plus the inset ring; a disabled row
// takes no hover fill; an `href` renders a link on web.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

async function renderRow (template, item, size) {
  const Registry = buildSystem(template, factories);
  const props = Object.assign({ onPress: function () { return undefined; }, size: size }, item);
  const container = await render(React.createElement(Registry.OverflowMenuItem, props));
  return {
    container: container,
    row: container.querySelector('[role="presentation"]'),
    button: container.querySelector('[role="menuitem"], [role="link"]')
  };
}

describe('OverflowMenuItem: the row height reads the option cells per size', function () {

  const heights = { xs: 'size.size_xsmall', sm: 'size.size_small', md: 'control.option_height', lg: 'size.size_large' };
  for (const template of TEMPLATE_NAMES) {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      for (const divider of [false, true]) {
        test(template + ' / ' + size + (divider ? ' + divider' : '') + ': the row height cell', async function () {
          const t = buildNative(template).tokens;
          const { row } = await renderRow(template, { divider: divider, label: 'Edit' }, size);
          assert.equal(row.style.height, t[heights[size]] + 'px', 'the row height cell');
          if (divider) {
            assert.equal(row.style.borderTopWidth, t['control.menu_divider_width'] + 'px', 'the divider sits inside the height');
            assert.equal(row.style.borderTopColor, cssValue('color', t['color.menu_divider']), 'the divider color');
          } else {
            assert.equal(row.style.borderTopWidth, '0px', 'no rule without hasDivider');
          }
        });
      }
    }
  }

});

describe('OverflowMenuItem: state cells', function () {

  test('the danger option paints its cells on hover and focus', async function () {
    const t = buildNative('carbon').tokens;
    const { button } = await renderRow('carbon', { danger: true, label: 'Delete' });
    await act(async function () {
      button.dispatchEvent(new Event('pointerover', { bubbles: true }));
    });
    assert.equal(button.style.backgroundColor, cssValue('backgroundColor', t['color.menu_item_danger_container_hover']), 'the danger fill on hover');
    const label = button.querySelector('[dir="auto"]');
    assert.equal(label.style.color, cssValue('color', t['color.menu_item_danger_label_hover']), 'the danger label on hover');
    await act(async function () {
      button.focus();
    });
    assert.equal(button.style.boxShadow.includes('inset'), true, 'the inset ring on focus');
    assert.equal(button.style.boxShadow.includes(String(t['color.menu_item_danger_focus_inset'])), true, 'the ring color');
  });

  test('a disabled option takes no hover fill', async function () {
    const t = buildNative('carbon').tokens;
    const { button } = await renderRow('carbon', { disabled: true, label: 'Archive' });
    await act(async function () {
      button.dispatchEvent(new Event('pointerover', { bubbles: true }));
    });
    assert.notEqual(button.style.backgroundColor, cssValue('backgroundColor', t['color.list_item_container_hover']), 'no hover fill when disabled');
    const label = button.querySelector('[dir="auto"]');
    assert.equal(label.style.color, cssValue('color', t['color.list_item_label_disabled']), 'the disabled label cell');
  });

  test('an href renders a link on web', async function () {
    const { container, button } = await renderRow('carbon', { href: 'https://example.com', label: 'Docs' });
    assert.equal(button.tagName, 'A', 'the option is an anchor');
    assert.equal(button.getAttribute('href'), 'https://example.com', 'the href lands');
  });

});
