// Info: SkeletonText molecule. One skeleton line, a heading-height line, or
// a paragraph of lines whose widths step back by the primary's fixed
// three-value sequence, each followed by the skeleton text gap.
//
// Behavior: the percent-width paragraph measures its root (`onLayout`) and
// draws each line at the percent of that width less the sequence's per-line
// offset in points, as the primary's `calc()` does; until the layout pass
// answers, a line draws the plain percent.
//
// Accessibility: the placeholders hide themselves; the root announces
// nothing more.

import SPEC from './spec.skeleton-text.js';

const PCT = '%';

// The primary reference's fixed three-value sequence, verbatim: the per-line
// offset it subtracts from a paragraph's line widths
const RANDOMS = [0.973051493507435, 0.15334737213558558, 0.5671034553053769];


/********************************************************************
The sequence's n-th draw between min and max, the primary's formula.

@param {Number} min - Lower bound
@param {Number} max - Upper bound
@param {Number} n   - The line index

@return {Number} - The step's value
*********************************************************************/
function step (min, max, n) {

  return Math.floor(RANDOMS[n % 3] * (max - min + 1)) + min;

}


/********************************************************************
SkeletonText factory.

@param {Object} ctx - Component context

@return {Function} - The SkeletonText component
*********************************************************************/
export default function SkeletonText (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;
  const Utils = ctx.Utils;


  /********************************************************************
  SkeletonText component.

  @param {Object} props - See `api.skeleton-text.js`

  @return {Object} - React element
  *********************************************************************/
  function SkeletonTextComponent (props) {

    const paragraph = props.paragraph === true;
    const count = paragraph
      ? (Utils.isNumber(props.lineCount) ? props.lineCount : 3)
      : 1;
    const width = props.width === undefined ? 100 + PCT : props.width;
    const height = ctx.metric('SkeletonText', props.heading === true ? 'headingHeight' : 'lineHeight');
    const gap = ctx.metric('SkeletonText', 'gap');

    // The measured root width a percent-width paragraph resolves against
    const [rootWidth, setRootWidth] = React.useState();
    const onLayout = function (event) {
      setRootWidth(event.nativeEvent.layout.width);
    };

    const widthNum = typeof width === 'number' ? width : parseInt(width, 10);
    const isPercent = Utils.isString(width) && width.endsWith(PCT);

    const lines = [];
    for (let index = 0; index < count; index++) {
      let lineWidth = width;
      if (paragraph) {
        if (typeof width === 'number') {
          // A point width in a paragraph: the primary's per-line formula
          lineWidth = step(Math.max(widthNum - 75, 0), widthNum, index);
        } else if (isPercent && rootWidth !== undefined) {
          // The percent of the measured root less the per-line offset
          lineWidth = rootWidth * widthNum / 100 - step(0, 75, index);
        }
      }
      lines.push(React.createElement(View, {
        key: index,
        style: { marginBottom: gap }
      }, React.createElement(ctx.Registry.SkeletonPlaceholder, {
        height: height,
        width: lineWidth
      })));
    }

    return React.createElement(View, {
      onLayout: onLayout,
      style: { alignSelf: 'stretch' },
      testID: props.testID
    }, lines);

  }

  SkeletonTextComponent.displayName = 'SkeletonText';

  return SkeletonTextComponent;

}

SkeletonText.spec = SPEC;
