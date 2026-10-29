// Info: ModalBody member. Its cells and roles through a standalone
// render: the prose body type and padding, the scrolling region with its
// end space, and the bottom fade only where `anatomy.dialog_scroll_fade`
// says `shown`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

describe('ModalBody: the member draws its cells', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': the prose body comes from the theme', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalBody, { children: 'The body.' }));
      const body = rendered.firstElementChild;
      assert.equal(body.style.paddingTop, t['control.dialog_body_padding_top'] + 'px');
      assert.equal(body.style.paddingBottom, t['control.dialog_body_padding_bottom'] + 'px');
      assert.equal(body.style.paddingLeft, t['control.dialog_padding_inline'] + 'px');
      const prose = body.querySelector('[dir="auto"]');
      assert.equal(prose.textContent, 'The body.');
      assert.equal(prose.style.fontSize, t['type.dialog_body'].fontSize + 'px');
      assert.equal(prose.style.color, cssValue('color', t['color.dialog_body']));
      assert.equal(body.querySelector('[role="region"]'), null, 'no region without scrolling');
      await cleanup();
    });

    test(template + ': hasScrollingContent makes a region with the end space and the fade per the anatomy', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalBody, { hasScrollingContent: true, children: 'Long.' }));
      const body = rendered.firstElementChild;
      const region = body.querySelector('[role="region"]');
      assert.notEqual(region, null, 'a scrolling body is a region');
      const scroller = region.firstElementChild.firstElementChild;
      const endSpace = scroller.children[scroller.children.length - 1];
      assert.equal(endSpace.style.height, t['control.dialog_scroll_end_space'] + 'px', 'the scroll end space follows the last child');
      const fade = body.querySelector('svg');
      if (t['anatomy.dialog_scroll_fade'] === 'shown') {
        assert.notEqual(fade, null, 'the shown fade draws');
      } else {
        assert.equal(fade, null, 'no fade under hidden');
      }
      await cleanup();
    });
  }

});
