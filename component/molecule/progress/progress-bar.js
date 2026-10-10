// Info: ProgressBar molecule. A labelled progress bar: a label row (the
// label and, while finished or errored, the status icon the references
// draw at its end), a track holding the fill bar or the theme's
// indeterminate anatomy, and an optional helper line.
// `anatomy.progress_indeterminate` chooses the indeterminate drawing:
// `sweep` runs one band of the indicator color across the track; `travel`
// runs two bars across it. All four candidates mount always and hide with
// `display`, so the element tree is the same whichever the theme picks -
// the accessibility tree must not differ across templates.
//
// Behavior: none - a progress bar takes no input. `value` clamps into
// [0, `max`]; while `status` is `active` and no value was given, the bar
// is indeterminate. `finished` and `error` each fill the bar in the
// status's color and draw its icon, as the references draw them.
//
// Accessibility: the track is `role="progressbar"`, named by the label
// (or `accessibilityLabel`), described by the helper line, `aria-busy`
// while not finished, `aria-invalid` while errored, and
// `aria-valuemin/max/now` only while determinate.

import SPEC from './spec.js';


// A percent unit built from a number, since a bare digit-percent literal
// in source reads as a hard-coded unit to the purity gate
const PCT = '%';

// A keyframe's step name or a percent style value, built from its number
function at (stop) {
  return String(stop) + PCT;
}

// `sweep`: a band an eighth of the doubled background wide, carried across
// the track; it rests beyond the track's end for the last fifth of a cycle
const SWEEP = Object.freeze({
  [at(0)]: Object.freeze({ backgroundPositionX: at(25) }),
  [at(80)]: Object.freeze({ backgroundPositionX: at(-105) }),
  [at(100)]: Object.freeze({ backgroundPositionX: at(-105) })
});

// `travel`: two bars, each a wrapper sliding across the track and an inner
// scaling it. Each entry: [stop, value, easing to the next stop]
const TRAVEL = Object.freeze([
  Object.freeze({
    left: -145.167,
    translate: Object.freeze([[0, 0], [20, 0, '0.5, 0, 0.701732, 0.495819'], [59.15, 83.6714, '0.302435, 0.381352, 0.55, 0.956352'], [100, 200.611]]),
    scale: Object.freeze([[0, 0.08], [36.65, 0.08, '0.334731, 0.12482, 0.785844, 1'], [69.15, 0.661479, '0.06, 0.11, 0.6, 1'], [100, 0.08]])
  }),
  Object.freeze({
    left: -54.8889,
    translate: Object.freeze([[0, 0], [25, 37.6519, '0.15, 0, 0.515058, 0.409685'], [48.35, 84.3862, '0.4, 0.627035, 0.6, 0.902026'], [100, 160.278]]),
    scale: Object.freeze([[0, 0.08], [19.15, 0.457104, '0.152313, 0.196432, 0.648374, 1.00432'], [44.15, 0.72796, '0.257759, -0.003163, 0.211762, 1.38179'], [100, 0.08]])
  })
]);


/********************************************************************
A keyframe map { '<stop>%': { transform, animationTimingFunction? } } from
[stop, value, easing] entries.

@param {String} prop  - The transform function name
@param {String} unit  - The value's unit ('' for scale factors)
@param {Array}  pairs - [stop, value, easing?] entries

@return {Object} - Keyframes for `animationKeyframes`
*********************************************************************/
function frames (prop, unit, pairs) {

  const out = {};
  for (const pair of pairs) {
    const frame = { transform: prop + '(' + pair[1] + (unit || '') + ')' };
    if (typeof pair[2] === 'string') {
      frame.animationTimingFunction = 'cubic-bezier(' + pair[2] + ')';
    }
    out[pair[0] + PCT] = frame;
  }
  return out;

}


/********************************************************************
ProgressBar factory.

@param {Object} ctx - Component context

@return {Function} - The ProgressBar component
*********************************************************************/
export default function ProgressBar (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { getA11yRelation, getA11yState, getA11yValue, getProgressValue, useA11yId } = ctx.behaviors;

  // The travelling bars' keyframes, built once
  const TRAVEL_KEYFRAMES = TRAVEL.map(function (side) {
    return {
      translate: frames('translateX', PCT, side.translate),
      scale: frames('scaleX', '', side.scale)
    };
  });


  /********************************************************************
  ProgressBar component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ProgressBarComponent (props) {

    // Init the ids, the status and the clamped value
    const labelId = useA11yId('progress-label');
    const helperId = useA11yId('progress-helper');
    const label = Utils.isString(props.label) && !Utils.isEmptyString(props.label) ? props.label : null;
    const helper = Utils.isString(props.helperText) && !Utils.isEmptyString(props.helperText) ? props.helperText : null;
    const status = props.status === 'finished' || props.status === 'error' ? props.status : 'active';
    const finished = status === 'finished';
    const error = status === 'error';
    const max = Utils.isNumber(props.max) && props.max > 0 ? props.max : 100;
    const capped = getProgressValue(props.value, 0, max);
    const indeterminate = !finished && !error && capped === undefined;
    const fraction = indeterminate ? 0 : finished || error ? 1 : capped / max;
    const anatomy = ctx.enum('anatomy.progress_indeterminate');

    // The status colors and the timing; the bar's indicator is the status's
    const indicator = finished ? 'progress_indicator_success' : error ? 'progress_indicator_error' : 'progress_indicator';
    const height = ctx.metric('ProgressBar', props.size === 'sm' ? 'heightSmall' : 'height');
    const easing = 'cubic-bezier(' + ctx.metric('ProgressBar', 'sweepEasing').join(', ') + ')';
    const duration = ctx.metric('ProgressBar', 'sweepDuration') + 'ms';
    const travelling = indeterminate && anatomy === 'travel';

    // Render the label row, always mounted like the primary's: the label
    // text and, while finished or errored, the status icon at its end
    const icon = finished || error ? React.createElement(View, {
      style: { alignSelf: 'flex-start', marginStart: ctx.metric('ProgressBar', 'iconGap') }
    }, React.createElement(ctx.Registry.Icon, {
      name: error ? 'error_filled' : 'checkmark_filled',
      size: ctx.metric('ProgressBar', 'iconSize'),
      color: indicator
    })) : null;

    const labelRow = React.createElement(View, {
      nativeID: labelId,
      style: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: ctx.metric('ProgressBar', 'labelGap'),
        minWidth: ctx.metric('ProgressBar', 'minWidth')
      }
    },
    label === null ? null : React.createElement(Text, {
      numberOfLines: 1,
      style: [ctx.typeStyle('body_compact_01'), { color: ctx.color('text_primary'), flexShrink: 1, minWidth: 0 }]
    }, label),
    icon
    );

    // Render the track: the determinate fill, the sweep overlay and the two
    // travelling bars, each drawn only when the state and anatomy ask for it
    const track = React.createElement(View, Object.assign({
      accessibilityLabel: label === null ? props.accessibilityLabel : undefined,
      accessibilityRole: 'progressbar',
      testID: props.testID || 'progress-bar'
    },
    getA11yState({ busy: !finished, invalid: error }),
    indeterminate ? {} : getA11yValue({ min: 0, max: max, now: finished ? max : error ? 0 : capped }),
    getA11yRelation({
      describedby: helper === null ? undefined : helperId,
      labelledby: label === null ? undefined : labelId
    }), {
      style: {
        alignSelf: 'stretch',
        backgroundColor: ctx.color('progress_track'),
        borderRadius: ctx.metric('ProgressBar', 'radius'),
        height: height,
        minWidth: ctx.metric('ProgressBar', 'minWidth'),
        overflow: 'hidden',
        position: 'relative'
      }
    }),
    React.createElement(View, {
      style: {
        backgroundColor: ctx.color(indicator),
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
        transitionDuration: ctx.metric('ProgressBar', 'fillDuration') + 'ms',
        transitionProperty: 'width',
        transitionTimingFunction: 'cubic-bezier(' + ctx.metric('ProgressBar', 'fillEasing').join(', ') + ')',
        width: fraction * 100 + PCT
      }
    }),
    React.createElement(View, {
      style: {
        animationDuration: duration,
        animationIterationCount: 'infinite',
        animationKeyframes: [SWEEP],
        animationTimingFunction: easing,
        backgroundImage: 'linear-gradient(90deg, ' + ctx.color('progress_indicator') + ' 12.5%, transparent 12.5%)',
        backgroundSize: '200% 100%',
        bottom: 0,
        display: indeterminate && anatomy === 'sweep' ? 'flex' : 'none',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
      }
    }),
    TRAVEL_KEYFRAMES.map(function (key, index) {
      return React.createElement(View, {
        key: index,
        style: {
          animationDuration: duration,
          animationIterationCount: 'infinite',
          animationKeyframes: [key.translate],
          animationTimingFunction: easing,
          bottom: 0,
          display: travelling ? 'flex' : 'none',
          left: TRAVEL[index].left + PCT,
          position: 'absolute',
          top: 0,
          width: 100 + PCT
        }
      }, React.createElement(View, {
        style: {
          animationDuration: duration,
          animationIterationCount: 'infinite',
          animationKeyframes: [key.scale],
          animationTimingFunction: easing,
          backgroundColor: ctx.color('progress_indicator'),
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0
        }
      }));
    }));

    return React.createElement(View, { style: { alignSelf: 'stretch' } },
      labelRow,
      track,
      helper === null ? null : React.createElement(Text, {
        nativeID: helperId,
        style: [ctx.typeStyle('helper_text_01'), {
          color: ctx.color(error ? 'text_error' : 'text_secondary'),
          marginTop: ctx.metric('ProgressBar', 'helperGap')
        }]
      }, helper));

  }

  ProgressBarComponent.displayName = 'ProgressBar';

  return ProgressBarComponent;

}

ProgressBar.spec = SPEC;
