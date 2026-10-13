// Info: SkeletonPlaceholder atom. A box in the skeleton container colour
// whose full-cover shimmer sweeps left to right and back on the skeleton
// cycle, in the skeleton shimmer colour.
//
// Behavior: reduced motion. When the platform asks for reduced motion the
// shimmer does not animate: it rests at the same full cover a static
// screenshot of the running sweep shows.
//
// Accessibility: `aria-hidden` on the root - a skeleton announces nothing.

import SPEC from './spec.js';

const PCT = '%';
// `transformOrigin` begins with a verb the naming gate bans, so the
// property name is spelled once here and the frame keys are computed - the
// way ProgressBar keeps its stops data, not unit strings
const ORIGIN = 'transformOrigin';

// The primary reference's skeleton sweep, verbatim stops: [stop, opacity,
// scale, origin] - opacity absent where the primary's stop does not set it
const SHIMMER_STOPS = [
  [0, 0.3, 0, 'left'],
  [20, 1, 1, 'left'],
  [28, undefined, 1, 'right'],
  [51, undefined, 0, 'right'],
  [58, undefined, 0, 'right'],
  [82, undefined, 1, 'right'],
  [83, undefined, 1, 'left'],
  [96, undefined, 0, 'left'],
  [100, 0.3, 0, 'left']
];


/********************************************************************
A keyframe map { '<stop>%': { opacity?, transform, transformOrigin } }
from [stop, opacity, scale, origin] entries.

@param {Array} stops - The sweep's stops

@return {Object} - Keyframes for `animationKeyframes`
*********************************************************************/
function shimmerFrames (stops) {

  const out = {};
  for (const stop of stops) {
    const frame = { transform: 'scaleX(' + stop[2] + ')' };
    if (stop[1] !== undefined) {
      frame.opacity = stop[1];
    }
    frame[ORIGIN] = stop[3];
    out[stop[0] + PCT] = frame;
  }
  return out;

}

const SHIMMER = shimmerFrames(SHIMMER_STOPS);


/********************************************************************
SkeletonPlaceholder factory.

@param {Object} ctx - Component context

@return {Function} - The SkeletonPlaceholder component
*********************************************************************/
export default function SkeletonPlaceholder (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;
  const { useReducedMotion } = ctx.behaviors;


  /********************************************************************
  SkeletonPlaceholder component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function SkeletonPlaceholderComponent (props) {

    // Reduced motion stills the sweep: the shimmer rests at full cover, the
    // state a static capture of the running animation shows
    const reduced = useReducedMotion().state.reducedMotion;

    // A prop-free placeholder draws the square; `width`/`height` size it
    const size = ctx.metric('SkeletonPlaceholder', 'size');
    const width = props.width === undefined ? size : props.width;
    const height = props.height === undefined ? size : props.height;

    return React.createElement(View, {
      'aria-hidden': true,
      testID: props.testID,
      style: {
        backgroundColor: ctx.color('skeleton_container'),
        borderRadius: ctx.metric('SkeletonPlaceholder', 'radius'),
        height: height,
        overflow: 'hidden',
        position: 'relative',
        width: width
      }
    }, React.createElement(View, {
      style: Object.assign({
        backgroundColor: ctx.color('skeleton_shimmer'),
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
        width: 100 + PCT
      }, reduced ? {} : {
        animationDuration: ctx.token('motion.skeleton_cycle') + 'ms',
        animationIterationCount: 'infinite',
        animationKeyframes: [SHIMMER],
        animationTimingFunction: 'ease-in-out'
      })
    }));

  }

  SkeletonPlaceholderComponent.displayName = 'SkeletonPlaceholder';

  return SkeletonPlaceholderComponent;

}

SkeletonPlaceholder.spec = SPEC;
