// TextList node gates: the built values, the markers and the roles.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { buildSystem, buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import UnorderedList from '../component/molecule/text-list/unordered-list.js';
import OrderedList from '../component/molecule/text-list/ordered-list.js';
import ListItem from '../component/molecule/text-list/list-item.js';

const TEMPLATES = ['carbon'];
const TITLES = Object.freeze(['List item 1', 'List item 2']);
const NESTED = Object.freeze([Object.freeze({ label: 'Item', items: Object.freeze(['Nested one']) })]);

describe('TextList: the lists', function () {

  for (const template of TEMPLATES) {
    const system = buildSystem(template, { ListItem, OrderedList, UnorderedList });
    const t = buildNative(template).tokens;

    test('a nested list indents by its own cell', async function () {
      const rendered = await render(React.createElement(system.UnorderedList, { items: NESTED }));
      const lists = rendered.querySelectorAll('[role="list"]');
      assert.equal(lists.length, 2, 'the nested items render a child list');
      assert.equal(lists[1].style.marginLeft || lists[1].style.marginStart, (t['control.text_list_nested_indent']) + 'px', 'the nested list reads text_list_nested_indent');
      assert.equal(lists[0].style.marginLeft || lists[0].style.marginStart, (t['control.text_list_indent']) + 'px', 'the root reads text_list_indent');
    });

    test('the ordered marker sits at the ordinal offset', async function () {
      const rendered = await render(React.createElement(system.OrderedList, { items: TITLES }));
      const marker = rendered.querySelector('[role="listitem"] > [aria-hidden="true"]');
      assert.ok(marker, 'the ordered marker renders');
      assert.equal(marker.style.left, (-t['control.text_list_ordinal_offset']) + 'px', 'the marker is -ordinal_offset');
      assert.equal(marker.textContent, '1.', 'the marker is the ordinal');
    });

    test(template + ': the markers and roles come from the theme', async function () {
      const ul = await render(React.createElement(system.UnorderedList, { items: TITLES }));
      assert.equal(ul.querySelector('[role="list"]') !== null, true, 'the root is a list');
      const dash = ul.querySelector('[role="listitem"] > [aria-hidden="true"]');
      assert.equal(dash.textContent, '–', 'the unordered marker is an en dash');
      assert.equal(dash.style.left, (-t['control.text_list_marker_offset']) + 'px');
      const nested = await render(React.createElement(system.UnorderedList, { items: NESTED }));
      const square = nested.querySelectorAll('[role="listitem"] > [aria-hidden="true"]')[1];
      assert.equal(square.textContent, '▪', 'the nested unordered marker is a square');
      assert.equal(square.style.left, (-t['control.text_list_nested_marker_offset']) + 'px');
      const items = ul.querySelectorAll('[role="listitem"]');
      assert.equal(items.length, 2, 'every item is a listitem');
      assert.equal(items[0].style.color || '', '', 'the item itself carries no color');
      const label = items[0].querySelector('[aria-hidden="true"]');
      assert.equal(label.style.color, cssValue('color', t['color.text_list_label']), 'the marker paints the label color');
    });
  }
});
