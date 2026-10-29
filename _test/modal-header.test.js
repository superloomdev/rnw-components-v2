// Info: ModalHeader member. Its cells and roles through a standalone
// render: the eyebrow label gated by `anatomy.dialog_label`, the heading
// and the close seat gated by `anatomy.dialog_close`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

describe('ModalHeader: the member draws its cells', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': label, heading and the close seat come from the theme', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalHeader, { label: 'Account', title: 'T' }));
      const header = rendered.firstElementChild;
      const closeSeat = header.nextElementSibling;
      assert.notEqual(closeSeat, null, 'the close seat is a sibling of the header');

      assert.equal(header.style.paddingTop, t['control.dialog_padding_top'] + 'px');
      assert.equal(header.style.paddingLeft, t['control.dialog_padding_inline'] + 'px');
      const labelOverlay = t['type.label01'].lineHeight + t['control.dialog_header_gap'] - t['control.dialog_body_padding_top'];
      assert.equal(header.style.marginBottom, (t['control.dialog_header_space'] - t['type.dialog_heading'].lineHeight - labelOverlay) + 'px', 'the heading overlays the content padding');
      assert.equal(header.style.paddingRight, (t['anatomy.dialog_close'] === 'shown' ? t['control.icon_button_size'] : t['control.dialog_padding_inline']) + 'px');

      const eyebrow = header.children[0];
      assert.equal(eyebrow.textContent, 'Account');
      assert.equal(eyebrow.style.fontSize, t['type.label01'].fontSize + 'px');
      assert.equal(eyebrow.style.color, cssValue('color', t['color.text_secondary']));
      assert.equal(eyebrow.style.display, t['anatomy.dialog_label'] === 'shown' ? '' : 'none');
      assert.equal(eyebrow.style.marginBottom, t['control.dialog_header_gap'] + 'px');

      const heading = header.children[1];
      assert.equal(heading.textContent, 'T');
      assert.equal(heading.style.fontSize, t['type.dialog_heading'].fontSize + 'px');
      assert.equal(heading.style.color, cssValue('color', t['color.dialog_heading']));

      assert.equal(closeSeat.style.display, t['anatomy.dialog_close'] === 'shown' ? 'flex' : 'none');
      const closeButton = closeSeat.querySelector('[role="button"]');
      assert.notEqual(closeButton, null);
      const closeSvg = closeSeat.querySelector('svg');
      assert.equal(closeSvg.getAttribute('width'), String(t['control.dialog_close_icon_size']));
      await cleanup();
    });
  }

});
