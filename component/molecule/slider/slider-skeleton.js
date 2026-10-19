// Info: SliderSkeleton molecule. The slider's loading shape: a label bar
// over the row the live control draws - minimum bound bar, track host
// with the shared paint (full fill, centered handle) and maximum bound
// bar. The row's width is the nominal track plus the two endpoint blocks
// and gaps; inside it the track's full-width basis and the endpoints all
// flex-shrink together, as the source's own flex arithmetic does, so the
// placeholder bars follow the measured wrapper width rather than a fixed
// number.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the root hides itself (`aria-hidden`); every painted
// node and placeholder does the same.

import SPEC from './spec.slider-skeleton.js';
import createSliderParts from './slider-parts.js';


/********************************************************************
SliderSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The SliderSkeleton component
*********************************************************************/
export default function SliderSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;
  const parts = createSliderParts(ctx);


  /********************************************************************
  SliderSkeleton component.

  @param {Object} props - See `api.slider-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function SliderSkeletonComponent (props) {

    const rangeWidth = ctx.metric('SliderSkeleton', 'rangeWidth');
    const rangeHeight = ctx.metric('SliderSkeleton', 'rangeHeight');

    // The endpoint bars' wrappers shrink with the row's flex; the
    // placeholder draws at the wrapper's measured width (nominal until
    // the first layout lands)
    const [minFace, onMinLayout] = ctx.useFaceSize();
    const [maxFace, onMaxLayout] = ctx.useFaceSize();
    const endpoint = function (key, face, onLayout) {
      return React.createElement(View, {
        key: key,
        onLayout: onLayout,
        style: { flexShrink: 1, height: rangeHeight, width: rangeWidth }
      }, React.createElement(ctx.Registry.SkeletonPlaceholder, {
        height: rangeHeight,
        testID: 'slider-skeleton-' + key,
        width: face === null ? rangeWidth : face.width
      }));
    };

    // The shared track paint at a full fill with a centered, non-
    // interactive handle
    const paint = parts.trackPaint('SliderSkeleton', {
      percent: true,
      prefix: 'slider-skeleton',
      ratio: 1,
      state: {}
    });

    return React.createElement(View, {
      'aria-hidden': true,
      style: { alignSelf: 'flex-start', maxWidth: 100 + '%' },
      testID: props.testID
    },
    props.hideLabel === true ? null : React.createElement(View, {
      style: { marginBottom: ctx.metric('SliderSkeleton', 'labelGap') }
    }, React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('SliderSkeleton', 'labelHeight'),
      testID: 'slider-skeleton-label',
      width: ctx.metric('SliderSkeleton', 'labelWidth')
    })),
    React.createElement(View, {
      style: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: ctx.metric('SliderSkeleton', 'gap'),
        width: ctx.metric('SliderSkeleton', 'rowWidth')
      },
      testID: 'slider-skeleton-row'
    },
    endpoint('minimum', minFace, onMinLayout),
    React.createElement(View, {
      style: {
        flexShrink: 1,
        height: ctx.metric('SliderSkeleton', 'height'),
        maxWidth: ctx.metric('SliderSkeleton', 'maxWidth'),
        minWidth: ctx.metric('SliderSkeleton', 'minWidth'),
        position: 'relative',
        width: 100 + '%'
      },
      testID: 'slider-skeleton-track'
    }, paint),
    endpoint('maximum', maxFace, onMaxLayout)));

  }

  SliderSkeletonComponent.displayName = 'SliderSkeleton';

  return SliderSkeletonComponent;

}

SliderSkeleton.spec = SPEC;
