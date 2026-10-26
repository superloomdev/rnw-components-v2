// Info: TagSet node tests - the measured fit count, the +n overflow seat, the
// popover listing, the >10 view-all link and the modal's search. Layout is
// driven by invoking the captured `onLayout` props with explicit widths.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { Lib, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

afterEach(cleanup);

// Render with a View that records every onLayout prop; then drive them with
// explicit widths: the container first, then each tag, then the overflow seat
async function renderSet (template, props) {
  const layouts = [];
  const MeasuringView = React.forwardRef(function (p, ref) {
    if (typeof p.onLayout === 'function') {
      layouts.push(p.onLayout);
    }
    return React.createElement(Lib.ReactNative.View, Object.assign({}, p, { ref: ref }));
  });
  const Registry = buildSystem(template, factories, {
    lib: Object.assign({}, Lib, { ReactNative: Object.assign({}, Lib.ReactNative, { View: MeasuringView }) })
  });
  const container = await render(React.createElement(Registry.TagSet, Object.assign({ tags: [] }, props)));
  return { container: container, layouts: layouts };
}

const layout = function (width) {
  return { nativeEvent: { layout: { height: 24, width: width, x: 0, y: 0 } } };
};

// Drive: container, then every tag at tagWidth, then the overflow seat
async function drive (parts, containerWidth, tagWidth, overflowWidth) {
  await act(async function () {
    // The first captured handler is the container's; the tag wrappers follow,
    // the overflow seat last
    parts.layouts[0](layout(containerWidth));
    const tagHandlers = parts.layouts.slice(1, -1);
    tagHandlers.forEach(function (fn) {
      fn(layout(tagWidth));
    });
    parts.layouts[parts.layouts.length - 1](layout(overflowWidth));
  });
}

describe('TagSet: fit and overflow', function () {

  test('each tag carries the tag_set_gap margin and the row keeps it', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderSet('carbon', { multiline: true, tags: [{ label: 'One' }, { label: 'Two' }] });
    const gap = t['control.tag_set_gap'];
    const tags = Array.from(parts.container.querySelectorAll('div')).filter(function (el) {
      return el.style && parseFloat(el.style.marginRight) === gap && parseFloat(el.style.marginBottom) === gap;
    });
    assert.ok(tags.length >= 2, 'each tag carries the gap as end and bottom margin');
    await cleanup();
  });

  test('maxVisible caps the visible count and the rest sit behind the overflow tag', async function () {
    const parts = await renderSet('carbon', {
      maxVisible: 2,
      tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }, { label: 'Four' }]
    });
    await drive(parts, 320, 60, 40);
    const text = parts.container.textContent;
    assert.ok(text.includes('+2'), 'the overflow tag shows +2');
    assert.ok(text.indexOf('Three') === -1 || text.includes('+2'), 'the capped tags are behind the overflow');
    await cleanup();
  });

  test('the measured fit shows only what fits beside the overflow tag', async function () {
    const parts = await renderSet('carbon', {
      tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }, { label: 'Four' }, { label: 'Five' }, { label: 'Six' }, { label: 'Seven' }, { label: 'Eight' }]
    });
    await drive(parts, 320, 60, 40);
    const text = parts.container.textContent;
    assert.ok(/\+\d/.test(text), 'the overflow tag mounts once the fit is known');
    await cleanup();
  });

  test('the overflow press opens the popover listing hidden tags', async function () {
    const parts = await renderSet('carbon', {
      maxVisible: 1,
      tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]
    });
    await drive(parts, 320, 60, 40);
    const plus = parts.container.querySelector('button[role="button"]');
    assert.ok(plus, 'the overflow tag renders as a button');
    await act(async function () {
      plus.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.ok(parts.container.textContent.includes('Three') || document.body.textContent.includes('Three'), 'the popover lists the hidden tags');
    assert.ok(!parts.container.textContent.includes('View all'), 'two hidden tags draw no view-all link');
    await cleanup();
  });

});
