// Info: Loading atom. Every sample state renders the spinner on the
// theme's loading cells: under the `spin` anatomy the svg arc - the
// square, stroke and arc per size, the small track circle - and under
// `arc` the second system's half-masked bordered circles with their three
// composed animations; the overlay form's scrim dialog either way.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';
import { AccessibilityInfo } from 'react-native-web';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/atom/loading/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

// The behaviors' reduced-motion hook reads `AccessibilityInfo`, a singleton:
// stub its answer so a state render sees the motion level under test (in
// jsdom there is no matchMedia, so the real answer is always "reduced")
const REAL_IS_REDUCED = AccessibilityInfo.isReduceMotionEnabled;

function stubReducedMotion (value) {
  AccessibilityInfo.isReduceMotionEnabled = function () {
    return Promise.resolve(value);
  };
}

afterEach(function () {
  AccessibilityInfo.isReduceMotionEnabled = REAL_IS_REDUCED;
});
afterEach(cleanup);


/********************************************************************
Render one Loading and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Props

@return {Promise<Object>} - { container, root, svg, circles, dialog }
*********************************************************************/
async function renderLoading (Registry, props) {

  stubReducedMotion(false);
  const container = await render(React.createElement(Registry.Loading, props));
  const svg = container.querySelector('svg');
  const root = container.firstElementChild;

  return {
    container: container,
    root: root,
    svg: svg,
    circles: svg === null ? [] : Array.from(svg.querySelectorAll('circle')),
    dialog: container.querySelector('[role="dialog"]'),
    // The `arc` anatomy's tree: the inset drawing box (the linear turn),
    // its stepping layer and the two masked halves' seat + circle views
    drawing: svg === null && root !== null && root.getAttribute('role') !== 'dialog' ? root.firstElementChild : null
  };

}


describe('Loading: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the spinner draws the theme\'s cells', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const small = state.props.small === true;
        const parts = await renderLoading(Registry, state.props);

        const size = small ? t['control.loading_size_small'] : t['control.loading_size'];
        const width = (small ? t['control.loading_stroke_width_small'] : t['control.loading_stroke_width']) * 100 / size;
        const arc = small ? t['control.loading_arc_small'] : t['control.loading_arc'];
        const circumference = 44 * 2 * 3.1416;

        if (state.props.withOverlay !== false) {
          // The overlay form: a scrim in the loading cell holding a dialog
          // seat for the spinner
          assert.equal(parts.dialog.getAttribute('role'), 'dialog');
          assert.equal(parts.dialog.getAttribute('aria-modal'), 'true');
          assert.equal(cssValue('backgroundColor', t['color.loading_scrim']), parts.root.style.backgroundColor);
          assert.equal(parts.root.style.zIndex, String(t['stacking.overlay']));
        } else if (t['anatomy.loading_motion'] === 'arc') {
          // The `arc` drawing: an inset box turning linearly, its stepping
          // layer running the rotate-arc steps over four cycles, and two
          // masked halves each holding a bordered circle breathing on the
          // expand-arc steps - the second system's composed construction
          assert.equal(parts.root.style.width, size + 'px');
          assert.equal(parts.root.style.height, size + 'px');
          const drawing = parts.drawing;
          assert.equal(drawing.getAttribute('role'), 'img');
          for (const side of ['top', 'right', 'bottom', 'left']) {
            assert.equal(drawing.style[side], '4px');
          }
          const stepper = drawing.firstElementChild;
          const halves = Array.from(stepper.children);
          assert.equal(halves.length, 2);
          // RNW splits the mask's overflow and the circle's border width
          // and radius into their longhands
          assert.equal(halves[0].style.right, '50%');
          assert.equal(halves[0].style.overflowX, 'hidden');
          assert.equal(halves[1].style.left, '50%');
          assert.equal(halves[1].style.overflowX, 'hidden');
          const seats = halves.map(function (mask) { return mask.firstElementChild; });
          assert.equal(seats[0].style.transform, 'rotate(135deg)');
          assert.equal(seats[1].style.transform, 'rotate(100deg)');
          const strokePx = small ? t['control.loading_stroke_width_small'] : t['control.loading_stroke_width'];
          const arcEase = 'cubic-bezier(' + t['motion.loading_arc_easing'].join(', ') + ')';
          seats.forEach(function (seat, i) {
            const circle = seat.firstElementChild;
            assert.equal(circle.style.borderTopColor, cssValue('color', t['color.loading_indicator']));
            assert.equal(circle.style.borderRightColor, cssValue('color', t['color.loading_indicator']));
            // RNW normalizes `transparent` to an rgba() string
            assert.equal(circle.style.borderBottomColor, 'rgba(0, 0, 0, 0)');
            assert.equal(circle.style.borderLeftColor, 'rgba(0, 0, 0, 0)');
            assert.equal(circle.style.borderTopWidth, String(strokePx) + 'px');
            assert.equal(circle.style.borderTopLeftRadius, t['shape.radius_max'] + 'px');
            // The still drawing carries no transform of its own, as the
            // upstream circles stand on their `rotate:` property alone -
            // the arc pose comes from the expand keyframes alone
            assert.equal(circle.style.transform, '');
            if (state.props.active !== false) {
              assert.equal(circle.style.animationDuration, String(t['motion.loading_arc_cycle']) + 'ms');
              assert.equal(circle.style.animationTimingFunction, arcEase);
              assert.equal(circle.style.animationIterationCount, 'infinite');
              assert.equal(circle.style.animationFillMode, 'both');
              if (i === 1) {
                assert.equal(circle.style.animationDelay, '-' + t['motion.loading_arc_cycle'] / 2 + 'ms');
              }
            }
          });
          if (state.props.active === false) {
            // The stop: the drawing fades over the exit pair
            assert.equal(drawing.style.animationDuration, String(t['motion.duration_slow_02']) + 'ms');
            assert.equal(drawing.style.animationFillMode, 'forwards');
            assert.equal(drawing.style.animationTimingFunction, 'cubic-bezier(' + t['motion.easing_exit_productive'].join(', ') + ')');
          } else {
            assert.equal(drawing.style.animationDuration, String(t['motion.loading_rotation']) + 'ms');
            assert.equal(drawing.style.animationTimingFunction, 'linear');
            assert.equal(stepper.style.animationDuration, String(4 * t['motion.loading_arc_cycle']) + 'ms');
            assert.equal(stepper.style.animationTimingFunction, arcEase);
            assert.equal(stepper.style.animationIterationCount, 'infinite');
            assert.equal(stepper.style.animationFillMode, 'both');
          }
        } else {
          // The bare spinner: the svg in the 100-unit viewBox, one stroke
          // circle, plus the small size's track circle
          assert.equal(parts.root.style.width, size + 'px');
          assert.equal(parts.root.style.height, size + 'px');
          assert.equal(parts.svg.getAttribute('viewBox'), '0 0 100 100');
          // The accessible node is the `img` seat; the svg inside it is
          // drawing, as the `arc` anatomy's View tree is
          assert.equal(parts.svg.parentElement.getAttribute('role'), 'img');
          assert.equal(parts.svg.parentElement.getAttribute('aria-label'), 'loading');
          const stroke = parts.circles[parts.circles.length - 1];
          assert.equal(stroke.getAttribute('stroke'), t['color.loading_indicator']);
          assert.equal(stroke.getAttribute('stroke-dasharray'), circumference + ' ' + circumference);
          assert.equal(stroke.getAttribute('stroke-width'), String(width));
          // The attribute holds the drawn arc's offset; a mounted-inactive
          // spinner's close run carries it shut as a style animation
          assert.equal(stroke.getAttribute('stroke-dashoffset'), String(circumference * (1 - arc)));
          if (state.props.active === false) {
            assert.equal(stroke.style.animationDuration, String(t['motion.duration_slow_02']) + 'ms');
          }
          assert.equal(parts.circles.length, small ? 2 : 1);
          if (small) {
            const track = parts.circles[0];
            assert.equal(track.getAttribute('stroke'), t['color.loading_track']);
            assert.equal(track.getAttribute('stroke-dashoffset'), '-22');
          }
        }
      });
    }
  }

});


describe('Loading: an inactive spinner closes then unmounts', function () {

  test('active false runs the close duration then renders nothing', async function () {
    const template = 'carbon';
    const t = buildNative(template).tokens;
    const Registry = buildSystem(template, factories);
    const parts = await renderLoading(Registry, { active: false, withOverlay: false });

    // The arc stands shut (the close run is a style animation), then the
    // node renders nothing once the slow-02 duration has passed
    assert.ok(parts.svg !== null);
    const stroke = parts.circles[parts.circles.length - 1];
    assert.equal(stroke.style.animationDuration, String(t['motion.duration_slow_02']) + 'ms');

    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, t['motion.duration_slow_02'] + 50);
      });
    });
    assert.equal(parts.container.querySelector('svg'), null);
  });

  test('under the arc anatomy the drawing fades then unmounts', async function () {
    const template = 'material';
    const t = buildNative(template).tokens;
    const Registry = buildSystem(template, factories);
    const parts = await renderLoading(Registry, { active: false, withOverlay: false });

    // The drawing's box carries the fade over the exit duration; the
    // unmount rule is the same as the spin anatomy's
    assert.ok(parts.drawing !== null);
    assert.equal(parts.drawing.style.animationDuration, String(t['motion.duration_slow_02']) + 'ms');
    assert.equal(parts.drawing.style.animationFillMode, 'forwards');

    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, t['motion.duration_slow_02'] + 50);
      });
    });
    assert.equal(parts.container.firstElementChild, null);
  });

});
