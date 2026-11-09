// Info: ExpandableSearch molecule. Collapsed it is a field-height magnifier
// trigger inside a `search` landmark; pressing it opens the full Search
// field and reports through `onExpandedChange`; Escape on the empty field
// collapses back to the trigger and returns focus to it. A controlled
// `expanded` stays where the owner puts it. Focus moves to the input only
// for a user's expand request: a controlled prop alone never steals it.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/search/sample.expandable-search.js';
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
Render one ExpandableSearch and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - ExpandableSearch props

@return {Promise<Object>} - { container, root, input, trigger }
*********************************************************************/
async function renderExpandable (Registry, props) {

  const container = await render(React.createElement(Registry.ExpandableSearch, props));
  const input = container.querySelector('input');
  const buttons = Array.from(container.querySelectorAll('button'));

  return {
    container: container,
    input: input,
    root: container.firstElementChild,
    trigger: input === null ? buttons[0] : null
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


describe('ExpandableSearch: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': a search landmark holding trigger or field', async function () {
        const parts = await renderExpandable(registryFor(template), state.props);
        assert.equal(parts.root.getAttribute('role'), 'search');
        if (state.props.expanded === true) {
          assert.ok(parts.input, 'expanded state shows the field');
          assert.equal(parts.input.getAttribute('role'), 'searchbox');
        }
      });
    }
  }

});

describe('ExpandableSearch: the expand and collapse contract', function () {

  test('collapsed: a named magnifier trigger, and focusing it alone does not expand', async function () {
    const calls = [];
    const parts = await renderExpandable(registryFor('carbon'), {
      label: 'Search',
      onExpandedChange: function (next) { calls.push(next); }
    });
    assert.equal(parts.input, null, 'collapsed draws no input');
    assert.ok(parts.trigger, 'collapsed draws the trigger');
    assert.equal(parts.trigger.getAttribute('aria-label'), 'Search');
    await act(async function () {
      parts.trigger.focus();
    });
    assert.equal(parts.container.querySelector('input'), null, 'focus alone must not expand');
    assert.deepEqual(calls, []);
  });

  test('pressing the trigger opens the field, reports, and focuses the input', async function () {
    const calls = [];
    const parts = await renderExpandable(registryFor('carbon'), {
      label: 'Search',
      onExpandedChange: function (next) { calls.push(next); }
    });
    await act(async function () {
      parts.trigger.click();
    });
    assert.deepEqual(calls, [true]);
    const input = parts.container.querySelector('input');
    assert.ok(input, 'field mounted after expand');
    assert.equal(document.activeElement === input, true, 'a user expand request moves focus to the input');
  });

  test('an initially controlled expanded field mounts without stealing focus', async function () {
    const parts = await renderExpandable(registryFor('carbon', undefined, [LESSONS_LAYER]), { expanded: true, label: 'Search' });
    assert.ok(parts.input, 'controlled expanded mounts the field');
    assert.equal(document.activeElement === parts.input, false, 'a controlled prop alone never steals focus');
  });

  test('Escape on the empty expanded field collapses and returns focus to the trigger', async function () {
    const calls = [];
    const parts = await renderExpandable(registryFor('carbon'), {
      onExpandedChange: function (next) { calls.push(next); }
    });
    // Uncontrolled: open through the collapsed trigger, the way a user does
    await act(async function () {
      parts.trigger.click();
    });
    const input = parts.container.querySelector('input');
    assert.ok(input, 'started expanded');
    await keydown(input, 'Escape');
    assert.deepEqual(calls, [true, false]);
    assert.equal(parts.container.querySelector('input'), null, 'field unmounted after collapse');
    const trigger = parts.container.querySelector('button');
    assert.ok(trigger, 'trigger remounted after collapse');
    assert.equal(document.activeElement === trigger, true, 'focus returns to the remounted trigger');
  });

  test('blur on the empty field requests collapse; a populated blur keeps it open', async function () {
    const calls = [];
    const blurs = [];
    const empty = await renderExpandable(registryFor('carbon'), {
      onBlur: function () { blurs.push(true); },
      onExpandedChange: function (next) { calls.push(next); }
    });
    await act(async function () {
      empty.trigger.click();
    });
    await act(async function () {
      empty.container.querySelector('input').blur();
    });
    assert.deepEqual(blurs, [true], 'the owner onBlur still runs');
    assert.deepEqual(calls, [true, false], 'an empty blur asks the owner to collapse');
    assert.equal(empty.container.querySelector('input'), null);

    const populated = await renderExpandable(registryFor('carbon'), {
      onExpandedChange: function (next) { calls.push(next); }
    });
    await act(async function () {
      populated.trigger.click();
    });
    const input = populated.container.querySelector('input');
    await type(input, 'query');
    await act(async function () {
      input.blur();
    });
    assert.deepEqual(calls, [true, false, true], 'a populated blur never asks to collapse');
    assert.ok(populated.container.querySelector('input'), 'field stays mounted');
  });

  test('controlled expanded answers requests but stays where the owner puts it', async function () {
    const calls = [];
    const parts = await renderExpandable(registryFor('carbon', undefined, [LESSONS_LAYER]), {
      expanded: false,
      label: 'Search',
      onExpandedChange: function (next) { calls.push(next); }
    });
    await act(async function () {
      parts.trigger.click();
    });
    assert.deepEqual(calls, [true], 'the request reaches the owner');
    assert.equal(parts.container.querySelector('input'), null, 'the owner kept it collapsed');

    const opened = await renderExpandable(registryFor('carbon', undefined, [LESSONS_LAYER]), { expanded: true, label: 'Search' });
    await keydown(opened.input, 'Escape');
    // The owner kept `expanded` true, so the field stays mounted
    assert.ok(opened.container.querySelector('input'));
  });

});
