// Info: HeaderContainer composite. Every sample state under every template:
// it draws its `header` with the menu button showing the side navigation's
// state (`isActive`, the close glyph); a press toggles it, Escape collapses
// it; a `render` component receives the state and its toggle.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/header/sample.header-container.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { BAR, TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('HeaderContainer: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the header shows the side navigation state', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'HeaderContainer', state);
        const bar = container.querySelector(BAR);
        assert.equal(bar !== null, true, 'the header');
        const button = bar.querySelector(':scope > button');
        const selected = cssValue('backgroundColor', t['color.header_action_container_selected']);
        const expanded = state.props.isSideNavExpanded === true;
        assert.equal(button.style.backgroundColor === selected, expanded, 'active while expanded');
        await act(async function () {
          button.click();
        });
        assert.equal(button.style.backgroundColor === selected, !expanded, 'a press toggles it');
        if (!expanded) {
          await fire(document, new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
          assert.equal(button.style.backgroundColor === selected, false, 'Escape collapses it');
        }
      });
    }
  }

  test('a render component receives the state and its toggle', async function () {
    const Registry = registryFor('carbon');
    const seen = [];
    let toggle = null;
    const Shell = function (props) {
      seen.push(props.isSideNavExpanded);
      toggle = props.onClickSideNavExpand;
      return React.createElement(Registry.Text, null, props.isSideNavExpanded ? 'open' : 'closed');
    };
    const container = await render(React.createElement(Registry.HeaderContainer, { render: Shell }));
    assert.equal(container.textContent, 'closed');
    await act(async function () {
      toggle();
    });
    assert.equal(container.textContent, 'open');
    assert.equal(seen[0], false);
  });

});
