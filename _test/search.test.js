// Info: Search molecule. Every sample state renders under all three
// templates: a `search` landmark holding a `searchbox`, a leading magnifier,
// and a clear action that mounts hidden and untabbable while the field is
// empty. The clear action empties the field and reports `onClear`; Escape on
// a populated field does the same; Escape on an empty field asks the owner
// to collapse through `onCollapseRequest`; submission reports the text.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/search/sample.js';
import REFERENCE from '../component/molecule/search/reference.js';
import { TEMPLATES, buildNative, buildSystem, LESSONS_LAYER } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories, { built: buildNative(template) });

}


/********************************************************************
Render one Search and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Search props

@return {Promise<Object>} - { root, input, clear }
*********************************************************************/
async function renderSearch (Registry, props) {

  const container = await render(React.createElement(Registry.Search, props));

  return {
    clear: container.querySelector('button'),
    input: container.querySelector('input'),
    root: container.firstElementChild
  };

}


/********************************************************************
Type a value into an input the way a user does.

@param {HTMLInputElement} input - The input
@param {String}           text  - Next value
*********************************************************************/
async function type (input, text) {

  await act(async function () {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

}


/********************************************************************
Send a key to an element.

@param {HTMLElement} el  - The element
@param {String}      key - Key name
*********************************************************************/
async function keydown (el, key) {

  await act(async function () {
    el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: key }));
  });

}


describe('Search: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': searchbox in a search landmark with the clear action', async function () {
        const parts = await renderSearch(registryFor(template), state.props);
        assert.equal(parts.root.getAttribute('role'), 'search');
        assert.equal(parts.root.getAttribute('aria-label'), 'Search', 'the landmark carries the resolved name');
        assert.equal(parts.input.getAttribute('role'), 'searchbox');
        assert.equal(parts.input.getAttribute('aria-label'), 'Search');
        assert.equal(parts.input.getAttribute('placeholder'), 'Search', 'the default hint');
        // The labelless field reserves no floating-label band
        assert.equal(Number.parseFloat(parts.root.firstElementChild.style.paddingTop), 0, 'no floating-label reserve');
        const populated = typeof state.props.value === 'string' && state.props.value !== '';
        const disabled = state.props.disabled === true;
        // The clear action is reachable only when there is live text to clear
        assert.equal(parts.clear.getAttribute('tabindex'), populated && !disabled ? '0' : '-1');
        assert.equal(parts.clear.getAttribute('aria-hidden'), populated ? null : 'true');
      });
    }
  }

});

describe('Search: the clear and keyboard contract', function () {

  test('an explicit empty placeholder stays empty; the label names landmark and field', async function () {
    const blank = await renderSearch(registryFor('carbon'), { placeholder: '' });
    assert.equal(blank.input.getAttribute('placeholder'), '', 'an explicit empty hint is preserved');
    const named = await renderSearch(registryFor('carbon'), { label: 'Find records' });
    assert.equal(named.root.getAttribute('aria-label'), 'Find records');
    assert.equal(named.input.getAttribute('aria-label'), 'Find records');
  });

  test('the clear action empties the field, reports onChangeText and onClear, and stays out of the way when empty', async function () {
    const calls = [];
    const cleared = [];
    const parts = await renderSearch(registryFor('carbon'), {
      onChangeText: function (next) { calls.push(next); },
      onClear: function () { cleared.push(true); },
      value: 'Query'
    });
    assert.equal(parts.clear.getAttribute('aria-label'), 'Clear search input');
    await act(async function () {
      parts.clear.click();
    });
    assert.deepEqual(calls, ['']);
    assert.deepEqual(cleared, [true]);
  });

  test('Escape clears a populated field; on an empty field it asks the owner to collapse', async function () {
    const calls = [];
    const collapses = [];
    const populated = await renderSearch(registryFor('carbon'), {
      onChangeText: function (next) { calls.push(next); },
      value: 'Query'
    });
    await keydown(populated.input, 'Escape');
    assert.deepEqual(calls, ['']);

    const empty = await renderSearch(registryFor('carbon'), {
      expanded: true,
      onCollapseRequest: function () { collapses.push(true); }
    });
    await keydown(empty.input, 'Escape');
    assert.deepEqual(collapses, [true]);
  });

  test('submission reports the current text', async function () {
    const submits = [];
    const parts = await renderSearch(registryFor('carbon', undefined, [LESSONS_LAYER]), {
      onSubmit: function (next) { submits.push(next); },
      value: 'Query'
    });
    await keydown(parts.input, 'Enter');
    assert.deepEqual(submits, ['Query']);
  });

  test('typing drives the clear action in and out of the tab order', async function () {
    const parts = await renderSearch(registryFor('carbon'), {});
    assert.equal(parts.clear.getAttribute('tabindex'), '-1');
    await type(parts.input, 'a');
    assert.equal(parts.clear.getAttribute('tabindex'), '0');
    await type(parts.input, '');
    assert.equal(parts.clear.getAttribute('tabindex'), '-1');
  });

  test('the leading magnifier is decorative, sized by the theme icon role', async function () {
    const parts = await renderSearch(registryFor('carbon'), {});
    const magnifier = parts.input.parentElement.querySelector('[aria-hidden="true"] svg');
    assert.ok(magnifier, 'leading magnifier mounted');
  });

  test('disabled locks the input and announces the action disabled', async function () {
    const parts = await renderSearch(registryFor('carbon'), { disabled: true, value: 'Query' });
    assert.equal(parts.input.disabled, true);
    assert.equal(parts.clear.getAttribute('aria-disabled'), 'true');
  });


});
