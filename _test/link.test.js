// Info: Link molecule. Every sample state renders under all three
// templates as a `role="link"` target over a face whose label reads the
// theme's link type set and color leaf, underlined while hovered, focused,
// pressed or inline; the trailing icon draws the icon-size glyph in the
// size's icon box and tracks the label's leaf; hover, focus and press drive
// the target through the DOM.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/link/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, a11yTree, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);


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

// The label leaf a sample state draws at rest
function restLeaf (props) {
  if (props.disabled === true) {
    return 'link_label_disabled';
  }
  return props.visited === true ? 'link_label_visited' : 'link_label';
}

// The type set a size draws
function typeLeaf (size) {
  return size === 'sm' ? 'type.link_label_small' : size === 'lg' ? 'type.link_label_large' : 'type.link_label';
}

// The DOM's serialization of a decoration style (jsdom expands the line)
function underlineOf (element) {
  return (element.style.textDecorationLine || element.style.textDecoration || '').indexOf('underline') !== -1;
}

// The glyph ctx.icon picks for a size: the set's own at that size, else the base
function glyphAt (literal, size) {
  return literal.sizes !== undefined && literal.sizes[String(size)] !== undefined
    ? literal.sizes[String(size)] : literal;
}

afterEach(cleanup);


describe('Link: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': role, leaf, underline and icon come from the theme', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.Link, state.props));
        const root = container.firstChild;
        const face = root.firstChild;
        const target = root.lastChild;
        const label = face.firstChild;
        const props = state.props || {};
        const disabled = props.disabled === true;
        const leaf = restLeaf(props);

        // The row and its transparent target: the face holds the paint, the
        // pressable covers it and carries the link role, the href except
        // while disabled, and the interaction
        assert.equal(root.style.alignSelf, 'flex-start');
        assert.equal(root.style.position, 'relative');
        assert.equal(face.style.flexDirection, 'row');
        assert.equal(face.style.alignItems, 'center');
        assert.equal(target.getAttribute('role'), 'link');
        assert.equal(target.tagName === 'A', disabled !== true);
        assert.equal(target.getAttribute('href'), disabled ? null : props.href);
        assert.equal(target.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(target.getAttribute('aria-label'), props.children);
        assert.equal(target.style.position, 'absolute');
        assert.equal(target.style.outlineStyle, 'none');
        assert.equal(face === target, false, 'the face wraps the target, not the other way');

        // The label: the size's type set, the state's color leaf, the
        // underline only while inline at rest
        const set = t[typeLeaf(props.size)];
        assert.equal(label.style.fontSize, set.fontSize + 'px');
        assert.equal(label.style.lineHeight, set.lineHeight + 'px');
        assert.equal(label.style.fontWeight, String(set.fontWeight));
        assert.equal(label.style.color, cssValue('color', t['color.' + leaf]));
        assert.equal(underlineOf(label), disabled !== true && props.inline === true);

        // The trailing icon: the row gap, the icon-size glyph drawn in the
        // size's icon box, the leaf
        const iconWrap = label.nextSibling;
        if (props.icon !== undefined) {
          assert.equal(iconWrap.style.marginLeft, t['control.link_icon_gap'] + 'px');
          const svg = iconWrap.querySelector('svg');
          const iconSize = t[props.size === 'lg' ? 'control.link_icon_size_large' : 'control.link_icon_size'];
          const glyph = glyphAt(t['icon.' + props.icon], t['control.link_icon_size']);
          assert.equal(svg.getAttribute('width'), String(iconSize));
          assert.equal(svg.getAttribute('height'), String(iconSize));
          assert.equal(svg.getAttribute('viewBox'), glyph.viewBox);
          assert.equal(svg.querySelector('path').getAttribute('d'), glyph.paths[0].d);
          assert.equal(svg.getAttribute('fill'), t['color.' + leaf]);
        } else {
          assert.equal(iconWrap, null);
        }

        // The accessibility answer: a named link over its text
        const tree = a11yTree(container);
        assert.equal(tree.some(function (line) {
          return line.indexOf('role=link') !== -1;
        }), true);
      });
    }
  }

});


describe('Link: interaction states through the DOM', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': hover, press and focus paint the state leaves, the underline and the ring', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const container = await render(React.createElement(Registry.Link, { children: 'Link', href: '#' }));
      const root = container.firstChild;
      const face = root.firstChild;
      const target = root.lastChild;
      const label = face.firstChild;

      // Rest: the rest leaf, no underline, no ring
      assert.equal(label.style.color, cssValue('color', t['color.link_label']));
      assert.equal(underlineOf(label), false);
      assert.equal(face.style.outlineWidth, '');

      // Hover: the hover leaf and the underline
      await fire(target, new Event('mouseenter', { bubbles: false }));
      assert.equal(label.style.color, cssValue('color', t['color.link_label_hover']));
      assert.equal(underlineOf(label), true);

      // Press: the active leaf and the ring at the edge
      await fire(target, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      assert.equal(label.style.color, cssValue('color', t['color.link_label_active']));
      assert.equal(face.style.outlineWidth, t['control.link_focus_width'] + 'px');
      assert.equal(face.style.outlineColor, cssValue('color', t['color.link_focus_ring']));
      assert.equal(face.style.outlineOffset, '0px');
      assert.equal(face.style.outlineStyle, 'solid');
      await fire(target, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
      await fire(target, new Event('mouseleave', { bubbles: false }));

      // Focus: the underline and the ring one point out, released on blur
      await act(async function () {
        target.focus();
      });
      assert.equal(underlineOf(label), true);
      assert.equal(face.style.outlineWidth, t['control.link_focus_width'] + 'px');
      assert.equal(face.style.outlineOffset, '1px');
      await act(async function () {
        target.blur();
      });
      assert.equal(label.style.color, cssValue('color', t['color.link_label']));
      assert.equal(underlineOf(label), false);
      assert.equal(face.style.outlineWidth, '');
    });
  }

  test('disabled draws the disabled leaf, keeps no href and swallows the press', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = buildSystem('carbon', factories);
    const calls = [];
    const container = await render(React.createElement(Registry.Link, { children: 'Link', href: '#', disabled: true, onPress: function () { calls.push('press'); } }));
    const root = container.firstChild;
    const face = root.firstChild;
    const target = root.lastChild;
    const label = face.firstChild;
    assert.equal(label.style.color, cssValue('color', t['color.link_label_disabled']));
    assert.equal(underlineOf(label), false);
    assert.equal(target.getAttribute('href'), null);
    assert.equal(target.getAttribute('aria-disabled'), 'true');
    await fire(target, new Event('mouseenter', { bubbles: false }));
    await fire(target, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    await fire(target, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
    assert.equal(label.style.color, cssValue('color', t['color.link_label_disabled']));
    assert.equal(calls.length, 0);
  });

});
