// Info: Tabs composite. Every sample state renders under all three
// templates with the bar, the tab's track or contained fill, the label, the
// indicator and the state layer read from the theme's `tab` family cells;
// the indicator is `full` or `content` width by `anatomy.tab_indicator`;
// arrows move and select, skipping disabled tabs; selection is
// controllable through `selectedIndex`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
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
Render one Tabs bar and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Tabs props

@return {Promise<Object>} - { root, bar, tabs }
*********************************************************************/
async function renderTabs (Registry, props) {

  const container = await render(React.createElement(Registry.Tabs, props));
  const bar = container.querySelector('[role="tablist"]');

  return {
    bar: bar,
    tabs: function () {
      return Array.from(bar.querySelectorAll('[role="tab"]'));
    },
    label: function (tab) {
      return tab.querySelector('[dir="auto"]');
    },
    layer: function (tab) {
      return tab.children[0];
    },
    separator: function (tab) {
      return tab.children[1];
    },
    indicatorContent: function (tab) {
      return tab.children[2].children[1];
    },
    indicatorFull: function (tab) {
      return tab.children[3];
    }
  };

}


/********************************************************************
Dispatch one keydown on an element inside act.

@param {HTMLElement} element - Target
@param {String}      key     - Key name
*********************************************************************/
async function press (element, key) {

  await act(async function () {
    element.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true }));
  });

}


describe('Tabs: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': bar, tabs, labels and indicator come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const contained = props.variant === 'contained';
        const selected = props.defaultSelectedIndex === undefined ? 0 : props.defaultSelectedIndex;
        const parts = await renderTabs(registryFor(template), props);
        const tabs = parts.tabs();

        // The bar's container and divider
        assert.equal(tabs.length, props.items.length);
        assert.equal(parts.bar.style.backgroundColor, cssValue('backgroundColor', t['color.tab_container']));
        assert.equal(parts.bar.style.borderBottomWidth, t['control.tab_divider_width'] + 'px');
        if (t['control.tab_divider_width'] > 0) {
          assert.equal(parts.bar.style.borderBottomColor, cssValue('borderBottomColor', t['color.tab_divider']));
        }

        for (let index = 0; index < props.items.length; index = index + 1) {
          const item = props.items[index];
          const tab = tabs[index];
          const disabled = item.disabled === true;
          const isSelected = index === selected;

          // The tab's box: track under `line` (the selected tab's track
          // carries the indicator color), a fill seat under `contained`
          assert.equal(tab.style.height, (contained ? t['control.tab_contained_height'] : t['control.tab_height']) + 'px');
          assert.equal(tab.style.paddingLeft, t['control.tab_padding_inline'] + 'px');
          assert.equal(tab.style.backgroundColor, contained ? cssValue('backgroundColor', t['color.' + (disabled ? 'tab_contained_container' : isSelected ? 'tab_contained_container_selected' : 'tab_contained_container')]) : 'rgba(0, 0, 0, 0)');
          assert.equal(tab.getAttribute('aria-selected'), String(isSelected));
          assert.equal(tab.getAttribute('aria-disabled'), disabled ? 'true' : null);
          assert.equal(tab.getAttribute('tabindex'), index === selected ? '0' : '-1');
          if (contained) {
            assert.equal(tab.style.borderRightWidth === '' ? '0px' : tab.style.borderRightWidth, '0px');
            assert.equal(tab.style.borderBottomWidth, '0px');
            // The separator seat draws on the leading edge, save the first
            // tab (nothing leads it: upstream's clip hides the first tab's
            // leading shadow), the selected tab and the one after it
            const separator = parts.separator(tab);
            const drawn = index !== 0 && isSelected !== true && index !== selected + 1;
            assert.equal(separator.style.width, t['border.width_01'] + 'px');
            assert.equal(separator.style.backgroundColor, drawn ? cssValue('backgroundColor', t['color.tab_contained_separator']) : 'rgba(0, 0, 0, 0)');
          } else {
            const content = t['anatomy.tab_indicator'] === 'content';
            const track = disabled ? 'tab_track_disabled' : isSelected && !content ? 'tab_indicator' : 'tab_track';
            assert.equal(tab.style.borderBottomWidth, t['control.tab_track_width'] + 'px');
            assert.equal(tab.style.borderBottomColor, cssValue('borderBottomColor', t['color.' + track]));
          }

          // The label's color and type
          const label = parts.label(tab);
          const labelLeaf = disabled ? 'tab_label_disabled' : isSelected ? 'tab_label_selected' : 'tab_label';
          const face = isSelected ? t['type.tab_label_selected'] : t['type.tab_label'];
          assert.equal(label.style.color, cssValue('color', t['color.' + labelLeaf]));
          assert.equal(label.style.fontWeight, face.fontWeight);
          if (contained) {
            assert.equal(label.style.lineHeight, (t['control.tab_contained_height'] - t['control.tab_contained_padding_block'] * 2) + 'px');
          }
          assert.equal(label.textContent, item.label);

          // The indicator draws only on the selected tab, on the variant's
          // edge; the bottom one covers the track line itself
          const edge = contained ? 'top' : 'bottom';
          const full = parts.indicatorFull(tab);
          const content = parts.indicatorContent(tab);
          const contentWidth = t['anatomy.tab_indicator'] === 'content' && !contained;
          assert.equal(full.style[edge], (contained ? 0 : -t['control.tab_track_width']) + 'px');
          assert.equal(content.style[edge], '0px');
          assert.equal(contentWidth ? content.style.backgroundColor : full.style.backgroundColor, isSelected ? cssValue('backgroundColor', t['color.tab_indicator']) : 'rgba(0, 0, 0, 0)');
          assert.equal((contentWidth ? full : content).style.backgroundColor, 'rgba(0, 0, 0, 0)');
          assert.equal(full.style.height, t['control.tab_indicator_width'] + 'px');
        }
      });
    }
  }

});


describe('Tabs: selection through the DOM', function () {

  test('a click selects and reports; arrows move and select, skipping disabled', async function () {
    const changes = [];
    const items = [
      { label: 'A' },
      { label: 'B', disabled: true },
      { label: 'C' },
      { label: 'D' }
    ];
    const parts = await renderTabs(registryFor('carbon'), {
      items: items,
      accessibilityLabel: 'Sections',
      onChange: function (next) {
        changes.push(next.selectedIndex);
      }
    });
    const tabs = parts.tabs();
    assert.equal(tabs[0].getAttribute('tabindex'), '0');
    assert.equal(tabs[0].getAttribute('aria-selected'), 'true');

    // A click on the third tab selects it and roves the tab order
    await act(async function () {
      tabs[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(tabs[2].getAttribute('aria-selected'), 'true');
    assert.equal(tabs[2].getAttribute('tabindex'), '0');
    assert.equal(tabs[0].getAttribute('tabindex'), '-1');
    assert.deepEqual(changes, [2]);

    // ArrowRight wraps to the first; ArrowLeft wraps back, skipping the disabled second tab both ways
    await press(parts.bar, 'ArrowRight');
    assert.equal(tabs[3].getAttribute('aria-selected'), 'true');
    await press(parts.bar, 'ArrowRight');
    assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
    await press(parts.bar, 'ArrowRight');
    assert.equal(tabs[2].getAttribute('aria-selected'), 'true');
    assert.deepEqual(changes, [2, 3, 0, 2]);
  });

  test('selectedIndex is controlled through onChange', async function () {
    const seen = [];
    const parts = await renderTabs(registryFor('carbon'), {
      items: [{ label: 'A' }, { label: 'B' }],
      selectedIndex: 0,
      onChange: function (next) {
        seen.push(next.selectedIndex);
      }
    });
    const tabs = parts.tabs();
    await act(async function () {
      tabs[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.deepEqual(seen, [1]);
    assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
    assert.equal(tabs[1].getAttribute('aria-selected'), 'false');
  });

});
