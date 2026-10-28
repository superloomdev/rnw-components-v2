// Info: FloatingActionButton molecule. Every sample renders under all three
// templates with the square's side, corner, fill, icon and shadow read from
// the theme's `fab` cells; the extended form takes the medium height, its
// own paddings and the family's label type; hover lifts the elevation to
// the hover shadow; a press reports once; the accessibility answer is a
// named button.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/floating-action-button/sample.floating-action-button.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);


/********************************************************************
Render one FloatingActionButton and return its parts.

@param {String} template - Template name
@param {Object} props    - FloatingActionButton props

@return {Promise<Object>} - { container, root, button, face, icon, label() }
*********************************************************************/
async function renderFab (template, props) {

  const Registry = buildSystem(template, factories);
  const container = await render(React.createElement(Registry.FloatingActionButton, props));
  const root = container.firstElementChild;
  const button = root.querySelector('[role="button"]');
  const face = root.querySelector('[data-testid="fab-face"]');

  return {
    container: container,
    root: root,
    button: button,
    face: face,
    icon: function () {
      return face.querySelector('svg');
    },
    label: function () {
      return face.querySelector('[dir="auto"]');
    }
  };

}


describe('FloatingActionButton: every sample renders under all three templates', function () {

  for (const name of TEMPLATE_NAMES) {
    for (const sample of SAMPLE) {
      test(name + ' / ' + sample.label + ': exact geometry, paint and type from the theme', async function () {
        const t = buildNative(name).tokens;
        const props = sample.props;
        const kind = props.kind || 'surface';
        const extended = props.label !== undefined;
        const size = extended ? 'md' : (props.size || 'md');
        const parts = await renderFab(name, props);

        // The square's side and corner, or the extended row's medium height
        // and its own end paddings
        const side = t['control.fab_size' + (size === 'sm' ? '_small' : size === 'lg' ? '_large' : '')];
        const radius = t['control.fab_radius' + (size === 'sm' ? '_small' : size === 'lg' ? '_large' : '')];
        assert.equal(parts.face.style.height, side + 'px');
        assert.equal(parts.face.style.borderTopLeftRadius, radius + 'px');
        if (extended === true) {
          assert.equal(parts.face.style.paddingLeft, t['control.fab_extended_padding'] + 'px');
          assert.equal(parts.face.style.paddingRight, t['control.fab_extended_padding_end'] + 'px');
        } else {
          assert.equal(parts.face.style.width, side + 'px');
        }

        // The container fill, the icon's size and the kind's ink, the label
        // in the family's type set and the icon color
        assert.equal(parts.face.style.backgroundColor, cssValue('color', t['color.fab_' + kind + '_container']));
        const iconSize = t['control.fab_icon_size' + (size === 'lg' ? '_large' : '')];
        const icon = parts.icon();
        assert.equal(icon.getAttribute('width'), String(iconSize));
        assert.equal(icon.getAttribute('height'), String(iconSize));
        assert.equal(icon.getAttribute('fill'), t['color.fab_' + kind + '_icon']);
        if (extended === true) {
          const label = parts.label();
          assert.notEqual(label, null);
          assert.equal(label.textContent, props.label);
          assert.equal(label.style.fontSize, t['type.fab_label'].fontSize + 'px');
          assert.equal(label.style.color, cssValue('color', t['color.fab_' + kind + '_icon']));
          assert.equal(label.style.marginLeft, t['control.fab_label_gap'] + 'px');
        }
      });
    }
  }

});

describe('FloatingActionButton: interaction', function () {

  for (const name of TEMPLATE_NAMES) {
    test(name + ': hover lifts the elevation to the hover shadow, a press reports onPress once', async function () {
    const t = buildNative(name).tokens;
    const calls = [];
    const parts = await renderFab(name, { icon: 'add', accessibilityLabel: 'Add', onPress: function () { calls.push(1); } });
    assert.equal(parts.face.style.boxShadow, t['shadow.fab'].boxShadow);
    await act(async function () {
      parts.button.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
    });
    assert.equal(parts.face.style.boxShadow, t['shadow.fab_hover'].boxShadow);
    await act(async function () {
      parts.button.click();
    });
    assert.equal(calls.length, 1);
    await act(async function () {
      parts.button.dispatchEvent(new MouseEvent('pointerout', { bubbles: true }));
    });
    assert.equal(parts.face.style.boxShadow, t['shadow.fab'].boxShadow);
    });
  }

});

describe('FloatingActionButton: accessibility', function () {

  test('a bare icon button throws a TypeError without an accessible name', async function () {
    const Registry = buildSystem('carbon', factories);
    await assert.rejects(render(React.createElement(Registry.FloatingActionButton, { icon: 'add' })), TypeError);
  });

  test('the button names itself by its label or its accessibilityLabel', async function () {
    const extended = await renderFab('carbon', { icon: 'add', label: 'Create' });
    assert.equal(extended.button.getAttribute('aria-label'), 'Create');
    const bare = await renderFab('carbon', { icon: 'add', accessibilityLabel: 'Add' });
    assert.equal(bare.button.getAttribute('aria-label'), 'Add');
  });

});
