// Info: DatePickerSkeleton composite. The date picker's loading shape: a
// label bar over an input bar - two side by side when `range` - as the
// primary reference's skeleton draws it. The single bar takes the picker's
// short input width, the range bars the range input width with the one-gap
// between them.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholders hide themselves; the root carries nothing
// else.

import SPEC from './spec.date-picker-skeleton.js';


/********************************************************************
DatePickerSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The DatePickerSkeleton component
*********************************************************************/
export default function DatePickerSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  Render one picker's placeholder: the label bar (unless `hideLabel`) over
  the input bar.

  @param {Object} options
  @param {Boolean}[options.hideLabel] - Skips the label bar
  @param {Number} options.width       - The bars' width
  @param {Number} [options.marginEnd] - End margin on the container

  @return {Object} - React element
  *********************************************************************/
  function drawPicker (options) {

    return React.createElement(View, {
      dataSet: { part: 'container' },
      key: options.key,
      style: { marginRight: options.marginEnd === undefined ? 0 : options.marginEnd, width: options.width }
    },
    options.hideLabel === true ? null : React.createElement(View, {
      style: { marginBottom: ctx.metric('DatePickerSkeleton', 'labelGap') }
    },
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('DatePickerSkeleton', 'labelHeight'),
      testID: 'date-picker-skeleton-label',
      width: ctx.metric('DatePickerSkeleton', 'labelWidth')
    })),
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('DatePickerSkeleton', 'height'),
      testID: 'date-picker-skeleton-input',
      width: options.width
    }));

  }


  /********************************************************************
  DatePickerSkeleton component.

  @param {Object} props - See `api.date-picker-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function DatePickerSkeletonComponent (props) {

    const range = props.range === true;
    const width = ctx.metric('DatePickerSkeleton', range === true ? 'widthRange' : 'width');
    const containers = range === true
      ? [drawPicker({ hideLabel: props.hideLabel, key: 'start', marginEnd: 1, width: width }),
        drawPicker({ hideLabel: props.hideLabel, key: 'end', width: width })]
      : [drawPicker({ hideLabel: props.hideLabel, key: 'single', width: width })];

    return React.createElement(View, {
      accessibilityElementsHidden: true,
      dataSet: { part: 'root' },
      style: { flexDirection: 'row' },
      testID: props.testID
    }, containers);

  }

  DatePickerSkeletonComponent.displayName = 'DatePickerSkeleton';

  return DatePickerSkeletonComponent;

}

DatePickerSkeleton.spec = SPEC;
