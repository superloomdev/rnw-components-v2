// Info: ProgressBar molecule. Every sample state renders under all three
// templates with its track, fill, label, status icon and helper read from
// the theme's `progress` role cells; the indeterminate anatomy element
// count never changes with the template, so the accessibility tree is the
// same everywhere; the track is `role="progressbar"` with the value,
// relation and state attributes the references carry.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/progress/sample.js';
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
Render one ProgressBar and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - ProgressBar props

@return {Promise<Object>} - { root, labelRow, track, fill, sweep, travels, icon, label, helper }
*********************************************************************/
async function renderProgressBar (Registry, props) {

  const container = await render(React.createElement(Registry.ProgressBar, props));
  const root = container.firstElementChild;
  const labelRow = root.children[0];
  const track = root.children[1];

  return {
    root: root,
    labelRow: labelRow,
    label: labelRow.querySelector('[dir="auto"]'),
    icon: labelRow.querySelector('svg'),
    track: track,
    fill: track.children[0],
    sweep: track.children[1],
    travels: [track.children[2], track.children[3]],
    helper: root.children[2] || null
  };

}


describe('ProgressBar: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': track, fill, label, icon and helper come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const finished = props.status === 'finished';
        const error = props.status === 'error';
        const indeterminate = !finished && !error && typeof props.value !== 'number';
        const parts = await renderProgressBar(registryFor(template), props);

        // The label row is always mounted: the label text when a label was given, the status icon at its end
        const labelled = typeof props.label === 'string';
        assert.equal(parts.label !== null, labelled);
        assert.equal(parts.icon !== null, finished || error);
        if (labelled) {
          assert.equal(parts.label.textContent, props.label);
          assert.equal(parts.label.style.fontSize, t['type.body_compact_01'].fontSize + 'px');
          assert.equal(parts.label.style.color, cssValue('color', t['color.text_primary']));
        }
        assert.equal(parts.labelRow.style.marginBottom, t['spacing.spacing_03'] + 'px');
        assert.equal(parts.labelRow.style.minWidth, t['spacing.spacing_09'] + 'px');
        if (parts.icon !== null) {
          assert.equal(parts.icon.getAttribute('width'), String(t['size.icon_01']));
          assert.equal(parts.icon.getAttribute('fill'), t['color.progress_indicator_' + (error ? 'error' : 'success')]);
          assert.equal(parts.icon.getAttribute('aria-hidden'), 'true');
          assert.equal(parts.icon.parentElement.style.marginLeft, t['spacing.spacing_05'] + 'px');
        }

        // The track and its fill
        assert.equal(parts.track.getAttribute('role'), 'progressbar');
        assert.equal(parts.track.style.height, (props.size === 'sm' ? t['spacing.spacing_02'] : t['control.progress_height']) + 'px');
        assert.equal(parts.track.style.minWidth, t['spacing.spacing_09'] + 'px');
        assert.equal(parts.track.style.borderTopLeftRadius, t['control.progress_radius'] + 'px');
        assert.equal(parts.track.style.backgroundColor, cssValue('backgroundColor', t['color.progress_track']));
        const indicator = finished ? 'progress_indicator_success' : error ? 'progress_indicator_error' : 'progress_indicator';
        assert.equal(parts.fill.style.backgroundColor, cssValue('backgroundColor', t['color.' + indicator]));
        const fraction = indeterminate ? 0 : finished || error ? 1 : Math.min(Math.max(props.value, 0), props.max || 100) / (props.max || 100);
        assert.equal(parts.fill.style.width, String(fraction * 100) + '%');

        // The indeterminate elements: four track children under every
        // template, whichever anatomy the theme picked - the tree is stable
        assert.equal(parts.track.children.length, 4);
        assert.equal(parts.travels[0].children.length, 1);
        assert.equal(parts.travels[1].children.length, 1);

        // The track's accessibility: value attributes only while determinate
        assert.equal(parts.track.getAttribute('aria-busy'), String(!finished));
        assert.equal(parts.track.getAttribute('aria-invalid'), String(error));
        if (indeterminate) {
          assert.equal(parts.track.getAttribute('aria-valuemin'), null);
          assert.equal(parts.track.getAttribute('aria-valuemax'), null);
          assert.equal(parts.track.getAttribute('aria-valuenow'), null);
        } else {
          assert.equal(parts.track.getAttribute('aria-valuemin'), '0');
          assert.equal(parts.track.getAttribute('aria-valuemax'), String(props.max || 100));
          assert.equal(parts.track.getAttribute('aria-valuenow'), String(finished ? props.max || 100 : error ? 0 : Math.min(Math.max(props.value, 0), props.max || 100)));
        }
        if (labelled) {
          assert.equal(parts.track.getAttribute('aria-labelledby'), parts.labelRow.id);
        }
        assert.equal(parts.track.getAttribute('aria-describedby'), typeof props.helperText === 'string' ? parts.helper.id : null);

        // The helper line: present only when `helperText`, error-colored while errored
        if (typeof props.helperText === 'string') {
          assert.equal(parts.helper.textContent, props.helperText);
          assert.equal(parts.helper.style.fontSize, t['type.helper_text_01'].fontSize + 'px');
          assert.equal(parts.helper.style.color, cssValue('color', t[error ? 'color.text_error' : 'color.text_secondary']));
          assert.equal(parts.helper.style.marginTop, t['spacing.spacing_03'] + 'px');
        } else {
          assert.equal(parts.helper, null);
        }
      });
    }
  }

});


describe('ProgressBar: value semantics', function () {

  test('value clamps into [0, max] and the indeterminate state carries no value attributes', async function () {
    const Registry = registryFor('default');
    const t = buildNative('default').tokens;
    void t;
    const over = await renderProgressBar(Registry, { label: 'P', value: 140, max: 100 });
    assert.equal(over.fill.style.width, '100%');
    assert.equal(over.track.getAttribute('aria-valuenow'), '100');
    const under = await renderProgressBar(Registry, { label: 'P', value: -20, max: 100 });
    assert.equal(under.fill.style.width, '0%');
    assert.equal(under.track.getAttribute('aria-valuenow'), '0');
    const none = await renderProgressBar(Registry, { label: 'P' });
    assert.equal(none.fill.style.width, '0%');
    assert.equal(none.track.getAttribute('aria-busy'), 'true');
  });

});
