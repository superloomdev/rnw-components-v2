// Info: Loading atom. A square spinner drawn two ways by
// `anatomy.loading_motion`: `spin` draws one arc in the theme's
// `loading_indicator` color through ctx.Svg in a 100-unit viewBox, turning
// over the `loading_rotation` duration; `arc` builds the second system's
// construction - two half-masked bordered circles turned by three composed
// animations (the second system's progress/internal/_circular-progress.scss:
// 115-164, 191-244), drawn with Views so it renders natively too. `small`
// draws the small size, stroke and arc, with a `loading_track` circle
// behind it under `spin`.
//
// `active` going false runs the arc shut over `duration_slow_02` at the
// exit-productive easing, then the node renders nothing; mounted inactive it
// stands with the arc already shut for the same duration before it goes. The
// overlay form hides at once when the spinner stops, as upstream's stop rule
// does.
//
// `withOverlay` centers the spinner on a `loading_scrim` layer in the
// `stacking.overlay` order, with focus trapped in a `role="dialog"` seat, the
// way the references draw it.
//
// Behavior: none of its own - the spinner takes no input. On a native
// platform and under reduced motion the arc stands still: the keyframe
// styles are a web mechanism and the platform ignores them.
//
// Accessibility: one `img` seat named by `description` carries the drawing
// under either anatomy (ARIA makes an img's descendants presentational, so
// the svg shapes and the masked halves are drawing alike), inside a live
// region (`aria-live="assertive"` while active) - no progressbar role, as
// upstream.

import SPEC from './spec.js';

// A keyframe's step name, built from its number so no unit literal appears
const PCT = '%';
const CENTER = '50' + PCT;

// The `spin` drawing's box turn
const LINEAR_ROTATE = [{
  [0 + PCT]: { transform: 'rotate(0deg)' },
  [100 + PCT]: { transform: 'rotate(360deg)' }
}];

// The `arc` anatomy's three composed animations, as the second system
// writes them: EXPAND breathes each half's circle between a tenth and
// three quarters of the turn (_circular-progress.scss:191-201), ROTATE
// steps the pair around in eighths to a full turn (:210-235), and the
// drawing box turns linearly on top (:240-244)
const EXPAND_ARC = [{
  [0 + PCT]: { transform: 'rotate(265deg)' },
  [50 + PCT]: { transform: 'rotate(130deg)' },
  [100 + PCT]: { transform: 'rotate(265deg)' }
}];
const ROTATE_ARC = [{
  ['12.5' + PCT]: { transform: 'rotate(135deg)' },
  ['25' + PCT]: { transform: 'rotate(270deg)' },
  ['37.5' + PCT]: { transform: 'rotate(405deg)' },
  [50 + PCT]: { transform: 'rotate(540deg)' },
  ['62.5' + PCT]: { transform: 'rotate(675deg)' },
  [75 + PCT]: { transform: 'rotate(810deg)' },
  ['87.5' + PCT]: { transform: 'rotate(945deg)' },
  [100 + PCT]: { transform: 'rotate(1080deg)' }
}];

// Each half's circle sits under a static rotation on a nested View - the
// upstream `rotate:` property the keyframe transform composes with
// (:157-164). Like the upstream circles the still drawing carries only
// those seat rotations: the arc's pose is all in EXPAND's keyframes, so a
// drawing with no animations (native, reduced motion, a frozen shot)
// stands with the arcs visible across the bottom of the ring
const HALF_ROTATE = { left: '135deg', right: '100deg' };


/********************************************************************
Loading factory.

@param {Object} ctx - Component context

@return {Function} - The Loading component
*********************************************************************/
export default function Loading (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { Circle, Svg } = ctx.Svg;
  const { useFocusTrap, useOverlay, useReducedMotion, useViewportLayer } = ctx.behaviors;


  /********************************************************************
  Loading component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function LoadingComponent (props) {

    // Init the props and the theme's answers
    const active = props.active !== false;
    const small = props.small === true;
    const withOverlay = props.withOverlay !== false;
    const description = Utils.isString(props.description) && !Utils.isEmptyString(props.description) ? props.description : 'loading';
    const reduced = useReducedMotion().state.reducedMotion;

    const size = ctx.metric('Loading', small ? 'sizeSmall' : 'size');
    const viewBox = ctx.metric('Loading', 'viewBox');
    const strokeWidth = ctx.metric('Loading', small ? 'strokeWidthSmall' : 'strokeWidth') * viewBox / size;
    const radius = ctx.metric('Loading', small ? 'radiusSmall' : 'radius');
    const circumference = ctx.metric('Loading', 'radius') * 2 * ctx.metric('Loading', 'pi');
    const offset = circumference * (1 - ctx.metric('Loading', small ? 'arcSmall' : 'arc'));
    const spinning = ctx.enum('anatomy.loading_motion') === 'spin';
    const rotation = ctx.metric('Loading', 'rotation') + 'ms';
    const stopDuration = ctx.metric('Loading', 'stopDuration');
    const animated = !reduced;

    // The unmount: once inactive for the close duration the node renders
    // nothing, as the upstream stop rule's end state draws nothing
    const [gone, setGone] = React.useState(false);
    React.useEffect(function () {
      if (active === false) {
        const timer = setTimeout(function () {
          setGone(true);
        }, stopDuration);
        return function () {
          clearTimeout(timer);
        };
      }
      return undefined;
    }, [active]);

    // The spinner box turns over the rotation duration under `spin`;
    // under `arc` the turning step sits on the drawing's inner box
    const turn = animated && spinning ? {
      animationDuration: rotation,
      animationIterationCount: 'infinite',
      animationKeyframes: LINEAR_ROTATE,
      animationTimingFunction: 'linear'
    } : {};
    // The stroke's paint: the fixed arc's offset, and the closing run
    // while inactive - the keyframes ride in `style` where the web's svg
    // shapes compile them; a still arc (native, reduced motion) takes the
    // attribute offset, shut while inactive
    const strokeStyle = {};
    if (!active && animated) {
      strokeStyle.animationDuration = stopDuration + 'ms';
      strokeStyle.animationFillMode = 'forwards';
      strokeStyle.animationKeyframes = [{ [0 + PCT]: { strokeDashoffset: offset }, [100 + PCT]: { strokeDashoffset: circumference } }];
      strokeStyle.animationTimingFunction = 'cubic-bezier(' + ctx.metric('Loading', 'stopEasing').join(', ') + ')';
    }

    // The `arc` drawing: a box inset by the upstream container padding
    // turning linearly over `rotation`, the arc-stepping `spinner` layer
    // inside it running ROTATE_ARC over four cycles, and the two masked
    // halves each holding a bordered circle breathing on EXPAND_ARC - the
    // right half's circle delayed half a cycle (:164). The indicator
    // color sits on each circle's top and right borders (:144-145)
    const indicator = ctx.color('loading_indicator');
    const drawing = spinning === false && animated === true && active === true;
    const arcCycle = ctx.metric('Loading', 'arcCycle');
    const arcEasing = 'cubic-bezier(' + ctx.metric('Loading', 'arcEasing').join(', ') + ')';
    const arcBox = { bottom: ctx.metric('Loading', 'arcInset'), left: ctx.metric('Loading', 'arcInset'), position: 'absolute', right: ctx.metric('Loading', 'arcInset'), top: ctx.metric('Loading', 'arcInset') };
    if (!active) {
      // The arc's stop: the drawing fades out over the exit pair (the
      // second system's determinate transition has no closing arc to
      // copy), then the unmount timer drops the node; a still drawing is
      // already shut
      if (animated) {
        Object.assign(arcBox, {
          animationDuration: stopDuration + 'ms',
          animationFillMode: 'forwards',
          animationKeyframes: [{ [0 + PCT]: { opacity: 1 }, [100 + PCT]: { opacity: 0 } }],
          animationTimingFunction: 'cubic-bezier(' + ctx.metric('Loading', 'stopEasing').join(', ') + ')'
        });
      } else {
        arcBox.opacity = 0;
      }
    } else if (animated) {
      Object.assign(arcBox, {
        animationDuration: rotation,
        animationIterationCount: 'infinite',
        animationKeyframes: LINEAR_ROTATE,
        animationTimingFunction: 'linear'
      });
    }
    const spinnerBox = { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 };
    if (drawing) {
      Object.assign(spinnerBox, {
        animationDuration: ctx.metric('Loading', 'arcCycles') * arcCycle + 'ms',
        animationFillMode: 'both',
        animationIterationCount: 'infinite',
        animationKeyframes: ROTATE_ARC,
        animationTimingFunction: arcEasing
      });
    }
    const arcHalf = function (side) {
      const mask = side === 'left'
        ? { bottom: 0, left: 0, overflow: 'hidden', position: 'absolute', right: 50 + PCT, top: 0 }
        : { bottom: 0, left: 50 + PCT, overflow: 'hidden', position: 'absolute', right: 0, top: 0 };
      const seat = side === 'left'
        ? { bottom: 0, left: 0, position: 'absolute', right: '-' + 100 + PCT, top: 0, transform: [{ rotate: HALF_ROTATE.left }] }
        : { bottom: 0, left: '-' + 100 + PCT, position: 'absolute', right: 0, top: 0, transform: [{ rotate: HALF_ROTATE.right }] };
      const circle = {
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRadius: ctx.metric('Loading', 'radiusMax'),
        borderRightColor: indicator,
        borderStyle: 'solid',
        borderTopColor: indicator,
        borderWidth: ctx.metric('Loading', small ? 'strokeWidthSmall' : 'strokeWidth'),
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
      };
      if (drawing) {
        if (side === 'right') {
          circle.animationDelay = '-' + arcCycle / 2 + 'ms';
        }
        circle.animationDuration = arcCycle + 'ms';
        circle.animationFillMode = 'both';
        circle.animationIterationCount = 'infinite';
        circle.animationKeyframes = EXPAND_ARC;
        circle.animationTimingFunction = arcEasing;
      }
      return React.createElement(View, { style: mask },
        React.createElement(View, { style: seat },
          React.createElement(View, { style: circle })));
    };
    const arcDrawing = React.createElement(View, {
      accessibilityLabel: description,
      accessibilityRole: 'image',
      style: arcBox
    }, React.createElement(View, {
      style: spinnerBox
    }, arcHalf('left'), arcHalf('right')));

    // The spinner: the drawing sits under one `img` seat whatever the
    // anatomy - a set draws the picture with different elements (the svg
    // shapes under `spin`, the masked halves under `arc`) but the
    // accessible node is the same. Under `spin` the seat holds the arc
    // circle, and behind it the small size's track circle with its dash
    // offset (the same dasharray for both radii, as upstream writes one
    // circumference for both)
    const spinner = React.createElement(View, {
      'aria-atomic': true,
      'aria-live': active ? 'assertive' : 'off',
      testID: props.testID,
      style: [{ height: size, width: size }, turn]
    }, spinning ? React.createElement(View, {
      accessibilityLabel: description,
      accessibilityRole: 'image',
      style: { height: 100 + PCT, width: 100 + PCT }
    }, React.createElement(Svg, {
      viewBox: '0 0 ' + viewBox + ' ' + viewBox
    },
    small ? React.createElement(Circle, {
      cx: CENTER, cy: CENTER, r: radius,
      fill: 'transparent',
      stroke: ctx.color('loading_track'),
      strokeDasharray: circumference + ' ' + circumference,
      strokeDashoffset: ctx.metric('Loading', 'trackOffset'),
      strokeLinecap: 'butt',
      strokeWidth: strokeWidth
    }) : null,
    React.createElement(Circle, {
      cx: CENTER, cy: CENTER, r: radius,
      fill: 'transparent',
      stroke: indicator,
      strokeDasharray: circumference + ' ' + circumference,
      strokeDashoffset: !active && !animated ? circumference : offset,
      strokeLinecap: 'butt',
      strokeWidth: strokeWidth,
      style: strokeStyle
    }))) : arcDrawing);

    // The overlay seat: the scrim holds a `role="dialog"` frame for the
    // spinner with the trap on it, registered with the overlay host where
    // one is mounted
    const layerStyle = useViewportLayer();
    const trap = useFocusTrap({ isOpen: active && withOverlay });
    const scrim = withOverlay === true ? React.createElement(View, {
      role: 'presentation',
      style: [layerStyle, {
        alignItems: 'center',
        backgroundColor: ctx.color('loading_scrim'),
        justifyContent: 'center',
        zIndex: ctx.metric('Loading', 'stacking')
      }]
    }, React.createElement(View, {
      ref: trap.containerRef,
      'aria-label': active ? description : undefined,
      'aria-modal': active ? true : undefined,
      focusable: true,
      role: 'dialog',
      tabIndex: -1
    }, spinner)) : null;
    const overlay = useOverlay({
      isOpen: active && withOverlay,
      name: 'Loading',
      render: function () {
        return scrim;
      },
      trap: true
    });

    if (gone === true && !active) {
      return null;
    }
    if (withOverlay !== true) {
      return spinner;
    }
    // The overlay's stop rule hides the whole layer at once
    if (!active) {
      return null;
    }
    return overlay.hosted ? null : scrim;

  }

  LoadingComponent.displayName = 'Loading';

  return LoadingComponent;

}

Loading.spec = SPEC;
