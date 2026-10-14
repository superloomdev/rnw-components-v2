// Info: ProgressIndicatorSkeleton molecule. Every sample state mounts the
// reference's fixed four incomplete steps: the dashed glyph in the
// incomplete cell, a label-sized placeholder block on the skeleton cells
// and the connector line, on the step's geometry, row or column.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/progress/sample.progress-indicator-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


describe('ProgressIndicatorSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': four stand-in steps on the step\'s geometry', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const vertical = state.props.vertical === true;
        const container = await render(React.createElement(Registry.ProgressIndicatorSkeleton, state.props));
        const root = container.firstElementChild;
        const steps = Array.from(root.children);

        // The list and its four stand-ins
        assert.equal(root.tagName.toLowerCase(), 'ul');
        assert.equal(root.style.flexDirection, vertical ? 'column' : 'row');
        assert.equal(steps.length, 4);

        for (const step of steps) {
          // The step's bounds, the glyph, the label block and the line
          if (vertical) {
            assert.equal(step.style.minHeight, t['control.progress_step_vertical_min_height'] + 'px');
          } else {
            assert.equal(step.style.width, t['control.progress_step_width'] + 'px');
          }
          const row = step.children[0];
          const icon = row.querySelector(':scope > svg');
          assert.ok(icon !== null);
          assert.equal(icon.getAttribute('fill'), t['color.progress_step_icon_incomplete']);
          assert.equal(icon.getAttribute('width'), String(t['size.icon_01']));
          const label = row.children[1].children[0];
          assert.equal(label.style.width, t['control.progress_step_skeleton_label_width'] + 'px');
          assert.equal(label.style.height, t['control.progress_step_skeleton_label_height'] + 'px');
          const line = row.children[row.children.length - 1];
          assert.equal(line.style.backgroundColor, cssValue('backgroundColor', t['color.progress_step_line']));
          if (vertical) {
            assert.equal(parseFloat(line.style.width), Math.max(t['control.progress_step_vertical_line_width'], 2));
          } else {
            assert.equal(parseFloat(line.style.height), Math.max(t['control.progress_step_line_width'], 2));
            assert.equal(line.style.width, t['control.progress_step_width'] + 'px');
          }
        }
      });
    }
  }

});
