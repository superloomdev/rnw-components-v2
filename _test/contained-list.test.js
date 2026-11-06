// ContainedList node gates: the built values, the structure and the states.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { buildSystem, buildNative } from './harness/system.js';
import { act } from 'react';
import { React, cleanup, cssValue, render } from './harness/render.js';
import * as factories from 'rnw-components/all';

const TEMPLATES = ['carbon'];
const ROWS = Object.freeze([Object.freeze({ label: 'One' }), Object.freeze({ label: 'Two' }), Object.freeze({ label: 'Three' })]);
const CLICKABLE = Object.freeze([Object.freeze({ label: 'One', onPress: function () {} }), Object.freeze({ disabled: true, label: 'Two', onPress: function () {} })]);

describe('ContainedList: the container and its rows', function () {

  for (const template of TEMPLATES) {
    const system = buildSystem(template, factories);
    const t = buildNative(template).tokens;

    test(template + ': the disclosed header draws its own height', async function () {
      const page = await render(React.createElement(system.ContainedList, { items: ROWS, kind: 'disclosed', label: 'Title' }));
      const header = Array.from(page.querySelectorAll('div')).find(function (d) { return d.style.height !== ''; });
      assert.equal(header.style.height, t['control.contained_list_header_height_disclosed'] + 'px', 'disclosed header height');
      const rest = await render(React.createElement(system.ContainedList, { items: ROWS, label: 'Title' }));
      const restHeader = Array.from(rest.querySelectorAll('div')).find(function (d) { return d.style.height !== ''; });
      assert.equal(restHeader.style.height, t['size.size_large'] + 'px', 'on-page header height');
      const md = await render(React.createElement(system.ContainedList, { items: ROWS, label: 'Title', size: 'md' }));
      const mdHeader = Array.from(md.querySelectorAll('div')).find(function (d) { return d.style.height !== ''; });
      assert.equal(mdHeader.style.height, t['size.size_medium'] + 'px', 'the header follows the size cell');
      const discBorder = Array.from(page.querySelectorAll('div')).find(function (d) { return d.style.height === (t['control.contained_list_header_height_disclosed']) + 'px'; });
      assert.equal(discBorder.style.borderBottomWidth, '0px', 'the disclosed header draws no divider');
      await cleanup();
    });

    test(template + ': the last item draws no ruler', async function () {
      const page = await render(React.createElement(system.ContainedList, { items: ROWS, label: 'Title' }));
      const rulers = Array.from(page.querySelectorAll('[data-part="ruler"]'));
      assert.equal(rulers.length, 2, 'three items draw two rulers');
      await cleanup();
    });

    test(template + ': the search action filters the items by label', async function () {
      const page = await render(React.createElement(system.ContainedList, { action: 'search', items: ROWS, label: 'Title' }));
      const input = page.querySelector('input');
      assert.ok(input !== null, 'the search renders an input');
      await act(async function () {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, 'Three');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      const labels = Array.from(page.querySelectorAll('[role="list"] div')).map(function (d) { return d.textContent; });
      assert.equal(labels.some(function (text) { return text === 'Three'; }), true, 'the matching item stays');
      assert.equal(labels.some(function (text) { return text === 'One'; }), false, 'a non-matching item filters out');
      await cleanup();
    });

    test(template + ': the search input frame reads the contained-list leaves', async function () {
      const page = await render(React.createElement(system.ContainedList, { action: 'search', items: ROWS, label: 'Title' }));
      const wrapper = page.querySelector('[data-part="search"]');
      assert.equal(wrapper.style.backgroundColor, '', 'the wrapper paints no fill');
      const frame = wrapper.querySelector('input').parentElement;
      assert.equal(frame.style.backgroundColor, cssValue('backgroundColor', t['color.contained_list_search_container']), 'the input frame reads the fill leaf');
      await cleanup();
    });

    test(template + ': disabled dims only a clickable item', async function () {
      const page = await render(React.createElement(system.ContainedListItem, { disabled: true, label: 'Static' }));
      const text = page.querySelector('div + div') || page;
      const labelColor = Array.from(page.querySelectorAll('*')).map(function (el) { return el.style && el.style.color; }).filter(Boolean)[0];
      assert.notEqual(labelColor, cssValue('color', t['color.contained_list_item_label_disabled']), 'a non-clickable item ignores disabled');
      const click = await render(React.createElement(system.ContainedListItem, { disabled: true, label: 'Click', onPress: function () {} }));
      const clickColor = Array.from(click.querySelectorAll('*')).map(function (el) { return el.style && el.style.color; }).filter(Boolean)[0];
      assert.equal(clickColor, cssValue('color', t['color.contained_list_item_label_disabled']), 'a disabled clickable dims');
      await cleanup();
    });
  }
});
