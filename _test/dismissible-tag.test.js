// Info: DismissibleTag molecule. Every sample state renders a Tag with the
// close control trailing inside it: a square circle of the tag's height
// under the `circle` anatomy, a glyph on the trailing-action circle under
// `inset`. The control names itself `title`, calls `onClose` and draws the
// theme's close hover, press and focus cells.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tag/sample.dismissible-tag.js';
import { TEMPLATES, buildNative, buildSystem, LESSONS_LAYER } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories);

}


/********************************************************************
Render one DismissibleTag and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Props

@return {Promise<Object>} - { root, label, face, layer, close, icon }
*********************************************************************/
async function renderDismissible (Registry, props) {

  const container = await render(React.createElement(Registry.DismissibleTag, props));
  const root = container.firstElementChild;
  const face = container.querySelector('[data-testid="tag-close-face"]');

  return {
    root: root,
    label: root.querySelector('[dir="auto"]'),
    face: face,
    layer: face === null ? null : face.children[0],
    close: container.querySelector('[role="button"]'),
    icon: face === null ? null : face.querySelector('svg')
  };

}


/********************************************************************
Dispatch one DOM event on an element inside act.

@param {HTMLElement} element - Target
@param {Event}       event   - Event
*********************************************************************/
async function fire (element, event) {

  await act(async function () {
    element.dispatchEvent(event);
  });

}


describe('DismissibleTag: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the tag and its close control read the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const small = props.size === 'sm';
        const height = small ? t['control.tag_height_small'] : props.size === 'lg' ? t['size.size_small'] : t['control.tag_height'];
        const parts = await renderDismissible(registryFor(template), props);

        // The tag itself keeps the Tag cells
        assert.equal(parts.root.style.minHeight, height + 'px');
        assert.equal(parts.label.textContent, props.text);

        // The close control: a circle the tag's height, or the action layer
        // circle of 4/3 the icon, and the close glyph inside
        const inset = t['anatomy.tag_close'] === 'inset';
        const iconSize = t['control.tag_close_icon_size'];
        // The inset layer circle is 4/3 the icon, never taller than the
        // tag, and centered on the tag's height
        const faceSide = inset ? Math.min(iconSize * 4 / 3, height) : height;
        assert.equal(parts.face.style.height, faceSide + 'px');
        assert.equal(parts.face.style.width, faceSide + 'px');
        assert.equal(parts.face.style.borderTopLeftRadius, faceSide / 2 + 'px');
        if (inset) {
          assert.equal(parts.face.style.alignSelf, 'center');
          assert.equal(parts.face.style.marginTop, '');
        }
        const gap = t['control.tag_close_gap'] - (inset ? (faceSide - iconSize) / 2 : 0) +
          (!inset && small ? (t['control.tag_height'] - (t['control.tag_height_small'])) / 2 : 0);
        assert.equal(parts.face.style.marginLeft, gap + 'px');
        assert.equal(parts.face.style.marginRight, -((faceSide - iconSize) / 2 * (inset ? 1 : 0)) + 'px');

        // The tag's end padding: none for the circle anatomy, the close
        // inset for the glyph anatomy
        assert.equal(parts.root.style.paddingRight, (inset ? t['control.tag_close_inset'] : 0) + 'px');

        // The glyph: the close icon at the close icon size, the label's leaf
        assert.ok(parts.icon !== null);
        assert.equal(parts.icon.getAttribute('width'), String(iconSize));
        const disabled = props.disabled === true;
        const type = typeof props.type === 'string' ? props.type : null;
        const glyphLeaf = disabled ? 'tag_icon_disabled' : type === null ? 'tag_label' : 'tag_color_' + type;
        assert.equal(parts.icon.getAttribute('fill'), t['color.' + glyphLeaf]);

        // The control is a button named by `title`, disabled with the tag
        assert.equal(parts.close.getAttribute('aria-label'), props.title);
        assert.equal(parts.close.getAttribute('aria-disabled'), disabled ? 'true' : null);
      });
    }
  }

});

describe('DismissibleTag: the close control interacts', function () {

  test('a press calls onClose; a disabled tag does not', async function () {
    let closes = 0;
    const parts = await renderDismissible(registryFor('carbon'), { onClose: function () { closes = closes + 1; }, text: 'T', title: 'Dismiss' });
    await fire(parts.close, new MouseEvent('click', { bubbles: true }));
    assert.equal(closes, 1);
    const off = await renderDismissible(registryFor('carbon'), { disabled: true, onClose: function () { closes = closes + 1; }, text: 'T', title: 'Dismiss' });
    await fire(off.close, new MouseEvent('click', { bubbles: true }));
    assert.equal(closes, 1);
  });

  test('a press keeps the hover fill and layers the close\'s own active cell below the glyph', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      const parts = await renderDismissible(registryFor(template), { text: 'T', title: 'Dismiss' });
      // The active layer mounts under every theme between the face and the glyph
      assert.equal(parts.face.children[0] === parts.layer, true, 'the layer is the face\'s first child');
      assert.equal(parts.layer.style.position, 'absolute');
      assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', 'rgba(0, 0, 0, 0)'));
      await fire(parts.close, new Event('pointerover', { bubbles: true }));
      await fire(parts.close, new MouseEvent('mousedown', { bubbles: true }));
      assert.equal(parts.face.style.backgroundColor, cssValue('backgroundColor', t['color.tag_close_container_hover']));
      assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', t['color.tag_close_layer_active']), template + ' pressed');
      // Release the press before the next template's, or the responder stays held
      await fire(parts.close, new MouseEvent('mouseup', { bubbles: true }));
    }
  });

  test('hover paints the close hover cell for a neutral tag, the hue\'s hover for a typed one', async function () {
    const t = buildNative('carbon').tokens;
    const neutral = await renderDismissible(registryFor('carbon'), { text: 'T', title: 'Dismiss' });
    await fire(neutral.close, new Event('pointerover', { bubbles: true }));
    assert.equal(neutral.face.style.backgroundColor, cssValue('backgroundColor', t['color.tag_close_container_hover']));
    const typed = await renderDismissible(registryFor('carbon'), { text: 'T', title: 'Dismiss', type: 'blue' });
    await fire(typed.close, new Event('pointerover', { bubbles: true }));
    assert.equal(typed.face.style.backgroundColor, cssValue('backgroundColor', t['color.tag_hover_blue']));
  });

  test('focus draws the primary\'s inset ring in the close focus ring color under the circle anatomy', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderDismissible(registryFor('carbon'), { text: 'T', title: 'Dismiss' });
    await act(async function () {
      parts.close.focus();
    });
    assert.equal(parts.face.style.boxShadow, cssValue('boxShadow', 'inset 0 0 0 ' + t['border.width_01'] + 'px ' + t['color.tag_close_focus_ring']));
  });

  test('the start padding seam overrides, zeros and falls back', async function () {
    const t = buildNative('carbon').tokens;
    // The host override answers for its member's legacy leading edge; an
    // explicit zero is honored; absent, the tag's own size logic stands -
    // the standalone large keeps its large inline padding
    const wide = await renderDismissible(registryFor('carbon'), { text: 'T', title: 'D', size: 'lg', paddingStart: 8 });
    assert.equal(wide.root.style.paddingLeft, '8px');
    const zero = await renderDismissible(registryFor('carbon'), { text: 'T', title: 'D', size: 'lg', paddingStart: 0 });
    assert.equal(zero.root.style.paddingLeft, '0px');
    const plain = await renderDismissible(registryFor('carbon'), { text: 'T', title: 'D', size: 'lg' });
    assert.equal(plain.root.style.paddingLeft, t['spacing.spacing_04'] + 'px', 'the standalone large keeps its large padding');
  });

  test('the inset close uses its own zero focus offset', async function () {
    const t = buildNative('carbon', [LESSONS_LAYER]).tokens;
    const parts = await renderDismissible(registryFor('carbon', undefined, [LESSONS_LAYER]), { text: 'T', title: 'Dismiss' });
    await fire(parts.close, new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }));
    await act(async function () {
      parts.close.focus();
    });
    assert.notEqual(parts.face.style.boxShadow, '');
    assert.match(parts.face.style.boxShadow, /inset/);
  });

});
