// ContainedList node gates: the built values, the structure and the states.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { buildSystem, buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import ContainedList from '../component/composite/contained-list/contained-list.js';
import ContainedListItem from '../component/composite/contained-list/contained-list-item.js';
import Search from '../component/molecule/search/search.js';

const TEMPLATES = ['carbon'];
const ROWS = Object.freeze([Object.freeze({ label: 'One' }), Object.freeze({ label: 'Two' }), Object.freeze({ label: 'Three' })]);
const CLICKABLE = Object.freeze([Object.freeze({ label: 'One', onPress: function () {} }), Object.freeze({ disabled: true, label: 'Two', onPress: function () {} })]);

describe('ContainedList: the container and its rows', function () {

  for (const template of TEMPLATES) {
    const system = buildSystem(template, { ContainedList, ContainedListItem, Search });
    const t = buildNative(template).tokens;

    test(template + ': the disclosed header draws its own height', async function () {
      const page = await render(React.createElement(system.ContainedList, { items: ROWS, kind: 'disclosed', label: 'Title' }));
      const header = Array.from(page.querySelectorAll('div')).find(function (d) { return d.style.height !== ''; });
      assert.equal(header.style.height, t['control.contained_list_header_height_disclosed'] + 'px', 'disclosed header height');
      const rest = await render(React.createElement(system.ContainedList, { items: ROWS, label: 'Title' }));
      const restHeader = Array.from(rest.querySelectorAll('div')).find(function (d) { return d.style.height !== ''; });
      assert.equal(restHeader.style.height, t['size.size_large'] + 'px', 'on-page header height');
      await cleanup();
    });

    test(template + ': the last item draws no ruler', async function () {
      const page = await render(React.createElement(system.ContainedList, { items: ROWS, label: 'Title' }));
      const items = Array.from(page.querySelectorAll('[role="list"] > div'));
      assert.equal(items.length, 3, 'three items render');
      assert.equal(items[0].style.borderBottomWidth, '1px', 'item one draws its ruler');
      assert.equal(items[2].style.borderBottomWidth, '', 'the last item draws no ruler');
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
