// Info: Tag molecule. Every sample state renders under all three templates
// with its container, label and icon read from the theme's `tag` role cells
// (or the hue cells a `type` names); the outline paints as an inset shadow
// so it never moves the text; a tag is not a control and carries no role.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tag/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const HUES = ['red', 'magenta', 'purple', 'blue', 'cyan', 'teal', 'green', 'gray', 'cool_gray', 'warm_gray'];

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
Render one Tag and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Tag props

@return {Promise<Object>} - { root, icon, label }
*********************************************************************/
async function renderTag (Registry, props) {

  const container = await render(React.createElement(Registry.Tag, props));
  const root = container.firstElementChild;

  return {
    root: root,
    icon: root.querySelector('svg'),
    label: root.querySelector('[dir="auto"]')
  };

}


describe('Tag: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': container, label and icon come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const type = typeof props.type === 'string' ? props.type : null;
        const parts = await renderTag(registryFor(template), props);

        const container = disabled ? 'tag_container_disabled' : type === null ? 'tag_container' : 'tag_background_' + type;
        const label = disabled ? 'tag_label_disabled' : type === null ? 'tag_label' : 'tag_color_' + type;
        const height = props.size === 'sm' ? t['size.icon_01'] + t['spacing.spacing_01'] : props.size === 'lg' ? t['size.size_small'] : t['control.tag_height'];
        const padding = props.size === 'lg' ? t['spacing.spacing_04'] : t['control.tag_padding_inline'];

        // Container geometry and colors; the outline is an inset shadow that neither shifts the text nor grows the box
        assert.equal(parts.root.style.height, height + 'px');
        assert.equal(parts.root.style.minWidth, t['size.size_small'] + 'px');
        assert.equal(parts.root.style.borderTopLeftRadius, t['control.tag_radius'] + 'px');
        assert.equal(parts.root.style.borderTopWidth, '');
        assert.equal(parts.root.style.backgroundColor, cssValue('backgroundColor', t['color.' + container]));
        const width = t['control.tag_outline_width'];
        const outline = disabled ? 'tag_outline_disabled' : 'tag_outline';
        assert.equal(parts.root.style.boxShadow, width > 0 ? cssValue('boxShadow', 'inset 0 0 0 ' + width + 'px ' + t['color.' + outline]) : '');
        if (typeof props.icon === 'string') {
          assert.equal(parts.root.style.paddingLeft, (props.size === 'lg' ? t['spacing.spacing_03'] : t['control.tag_padding_icon']) + 'px');
        } else {
          assert.equal(parts.root.style.paddingLeft, padding + 'px');
        }
        assert.equal(parts.root.style.paddingRight, padding + 'px');

        // The label: the tag's own type set and label color
        assert.equal(parts.label.textContent, props.children);
        assert.equal(parts.label.style.fontSize, t['type.tag_label'].fontSize + 'px');
        assert.equal(parts.label.style.color, cssValue('color', t['color.' + label]));

        // The icon: the theme's glyph at the tag's icon size and color, decorative
        if (typeof props.icon === 'string') {
          const iconColor = disabled ? 'tag_icon_disabled' : type === null ? 'tag_icon' : 'tag_color_' + type;
          assert.equal(parts.icon.getAttribute('width'), String(t['control.tag_icon_size']));
          assert.equal(parts.icon.getAttribute('fill'), t['color.' + iconColor]);
          assert.equal(parts.icon.getAttribute('aria-hidden'), 'true');
          assert.equal(parts.icon.parentElement.style.paddingRight, t['control.tag_padding_icon'] + 'px');
        } else {
          assert.equal(parts.icon, null);
        }

        // A tag is not a control: no role, no tabindex
        assert.equal(parts.root.getAttribute('role'), null);
        assert.equal(parts.root.getAttribute('tabindex'), null);
      });
    }
  }

});


describe('Tag: the hue a type names', function () {

  test('every listed type reads its own background and label cells under every template', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      for (const hue of HUES) {
        const parts = await renderTag(registryFor(template), { children: 'T', type: hue });
        assert.equal(parts.root.style.backgroundColor, cssValue('backgroundColor', t['color.tag_background_' + hue]), template + '/' + hue);
        assert.equal(parts.label.style.color, cssValue('color', t['color.tag_color_' + hue]), template + '/' + hue);
      }
    }
  });

});
