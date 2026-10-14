// Info: ProgressIndicatorSkeleton molecule. The skeleton form of a
// ProgressIndicator: the reference's fixed four incomplete steps, each the
// state glyph in the incomplete cell, a label-sized placeholder block and
// the connector line, laid out on the step's geometry - a stand-in while
// the steps load.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: a list of list items, as the indicator itself; nothing
// inside names itself.

import SPEC from './spec.progress-indicator-skeleton.js';

const PCT = '%';


/********************************************************************
ProgressIndicatorSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The ProgressIndicatorSkeleton component
*********************************************************************/
export default function ProgressIndicatorSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  ProgressIndicatorSkeleton component.

  @param {Object} props - See `api.progress-indicator-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function ProgressIndicatorSkeletonComponent (props) {

    // Init the column form and the line's drawn thickness - the cell or
    // the pair of transparent borders the reference's box-sizing folds
    // into it, whichever is wider
    const vertical = props.vertical === true;
    const lineBorder = ctx.metric('ProgressIndicatorSkeleton', 'lineBorder');
    const lineHeight = Math.max(ctx.metric('ProgressIndicatorSkeleton', 'lineWidth'), 2 * lineBorder);
    const verticalLineWidth = Math.max(ctx.metric('ProgressIndicatorSkeleton', 'verticalLineWidth'), 2 * lineBorder);

    // Render one skeleton step: glyph, label block and line on the step's
    // own geometry; the label block shares the glyph's top margin
    const step = function (index) {
      return React.createElement(View, {
        accessibilityRole: 'listitem',
        key: index,
        style: vertical
          ? { alignSelf: 'stretch', minHeight: ctx.metric('ProgressIndicatorSkeleton', 'verticalMinHeight') }
          : {
            alignSelf: 'flex-start',
            flexDirection: 'row',
            // Skeleton steps shrink with their row like the real steps'
            // upstream flex items do
            flexShrink: 1,
            minWidth: ctx.metric('ProgressIndicatorSkeleton', 'minWidth'),
            width: ctx.metric('ProgressIndicatorSkeleton', 'width')
          }
      },
      React.createElement(View, {
        style: Object.assign({ flexDirection: 'row', outlineStyle: 'none' },
          vertical ? { alignSelf: 'flex-start', minHeight: ctx.metric('ProgressIndicatorSkeleton', 'verticalMinHeight') } : { width: 100 + PCT })
      },
      React.createElement(ctx.Registry.Icon, {
        color: 'progress_step_icon_incomplete',
        name: 'circle_dash',
        size: ctx.metric('ProgressIndicatorSkeleton', 'iconSize'),
        style: Object.assign({ borderRadius: ctx.metric('ProgressIndicatorSkeleton', 'iconRadius') }, vertical
          ? { marginEnd: ctx.metric('ProgressIndicatorSkeleton', 'iconGap'), marginStart: ctx.metric('ProgressIndicatorSkeleton', 'iconGap'), marginTop: ctx.metric('ProgressIndicatorSkeleton', 'verticalIconTop') }
          : { marginEnd: ctx.metric('ProgressIndicatorSkeleton', 'iconGap'), marginTop: ctx.metric('ProgressIndicatorSkeleton', 'iconTop') })
      }),
      React.createElement(View, {
        style: { marginTop: ctx.metric('ProgressIndicatorSkeleton', vertical ? 'verticalIconTop' : 'iconTop') }
      },
      React.createElement(ctx.Registry.SkeletonPlaceholder, {
        height: ctx.metric('ProgressIndicatorSkeleton', 'labelHeight'),
        width: ctx.metric('ProgressIndicatorSkeleton', 'labelWidth')
      })),
      React.createElement(View, {
        style: vertical
          ? {
            backgroundColor: ctx.color('progress_step_line'),
            borderColor: 'transparent',
            borderWidth: lineBorder,
            bottom: 0,
            left: 0,
            position: 'absolute',
            top: 0,
            width: verticalLineWidth
          }
          : {
            backgroundColor: ctx.color('progress_step_line'),
            borderColor: 'transparent',
            borderWidth: lineBorder,
            height: lineHeight,
            left: 0,
            position: 'absolute',
            top: 0,
            width: ctx.metric('ProgressIndicatorSkeleton', 'width')
          }
      })));
    };

    // Render the list of the reference's fixed steps
    return React.createElement(View, {
      accessibilityRole: 'list',
      testID: props.testID,
      style: {
        alignSelf: 'flex-start',
        flexDirection: vertical ? 'column' : 'row'
      }
    }, Array.from({ length: ctx.metric('ProgressIndicatorSkeleton', 'count') }, function (empty, index) {
      return step(index);
    }));

  }

  ProgressIndicatorSkeletonComponent.displayName = 'ProgressIndicatorSkeleton';

  return ProgressIndicatorSkeletonComponent;

}

ProgressIndicatorSkeleton.spec = SPEC;
