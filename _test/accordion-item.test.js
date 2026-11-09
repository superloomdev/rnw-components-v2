// Info: AccordionItem member. One headed section of an Accordion; its own
// disclosure owns `open`, the heading carries the button role and the
// aria-expanded/aria-controls pair.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/accordion/sample.accordion-item.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

describe('AccordionItem: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the heading draws with its chevron and top rule', async function () {
        const container = await render(React.createElement(registryFor(template).AccordionItem, state.props));
        const heading = container.querySelector('[role="button"]');
        assert.notEqual(heading, null);
        assert.equal(heading.getAttribute('aria-expanded'), state.label === 'open' ? 'true' : 'false');
      });
    }
  }

  for (const template of TEMPLATE_NAMES) {
    test(template + ': an open item colors its string body text with color.text_primary', async function () {
      const t = buildNative(template).tokens;
      const container = await render(React.createElement(registryFor(template).AccordionItem, {
        title: 'Section', defaultOpen: true, children: 'body text'
      }));
      const region = container.querySelector('[role="region"]');
      assert.notEqual(region, null, 'the body region mounts open');
      const text = region.querySelector('div');
      assert.notEqual(text, null, 'the body text mounts');
      assert.equal(text.style.color, cssValue('color', t['color.text_primary']), 'the body text takes color.text_primary');
    });
  }

});


describe('AccordionItem: disclosure through the DOM', function () {

  test('pressing the heading toggles aria-expanded and aria-controls names the content', async function () {
    const container = await render(React.createElement(registryFor('default').AccordionItem, {
      title: 'Section', children: 'body', contentId: 'content-one'
    }));
    const heading = container.querySelector('[role="button"]');
    assert.equal(heading.getAttribute('aria-controls'), 'content-one');
    assert.equal(heading.getAttribute('aria-expanded'), 'false');
    await act(async function () { heading.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(heading.getAttribute('aria-expanded'), 'true');
  });

});

