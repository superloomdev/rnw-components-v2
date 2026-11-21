// Info: FileUploaderItem composite: one chosen file's row. The file name
// (one line, cut with an ellipsis) beside its Filename status seat on the
// item fill, at the size's height; an invalid item draws the error outline
// inside its edge, its own padding, and the error message under a rule.
//
// Behavior: the status seat's close button calls `onDelete(event,
// { uuid })` in the `edit` status; a disabled item disables it.

import SPEC from './spec.file-uploader-item.js';


/********************************************************************
FileUploaderItem factory.

@param {Object} ctx - Component context

@return {Function} - The FileUploaderItem component
*********************************************************************/
export default function FileUploaderItem (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { useA11yId } = ctx.behaviors;

  // Size -> the metric suffix of its height, row gap, invalid padding and
  // message inset; the default is the large row
  const SIZES = Object.freeze({ sm: 'Small', md: 'Medium' });

  // The row fills its container up to its maximum width
  const PCT = '%';


  /********************************************************************
  FileUploaderItem component.

  @param {Object} props - See `api.file-uploader-item.js`

  @return {Object} - React element
  *********************************************************************/
  function FileUploaderItemComponent (props) {

    const generated = useA11yId('file');
    const uuid = Utils.isString(props.uuid) ? props.uuid : generated;
    const disabled = props.disabled === true;
    const invalid = props.invalid === true;
    const suffix = SIZES[props.size] || '';
    const message = invalid && Utils.isString(props.errorSubject);

    // The invalid outline draws inside the edge, as the reference's inset ring
    const outline = invalid ? {
      outlineColor: ctx.color('file_uploader_item_outline_invalid'),
      outlineOffset: -ctx.metric('FileUploaderItem', 'outlineWidth'),
      outlineStyle: 'solid',
      outlineWidth: ctx.metric('FileUploaderItem', 'outlineWidth')
    } : {};

    return React.createElement(View, {
      dataSet: { part: 'item' },
      style: Object.assign({
        backgroundColor: ctx.color('file_uploader_item_container'),
        justifyContent: 'center',
        maxWidth: ctx.metric('FileUploaderItem', 'maxWidth'),
        minHeight: ctx.metric('FileUploaderItem', 'height' + suffix),
        paddingVertical: invalid ? ctx.metric('FileUploaderItem', 'paddingInvalid' + suffix) : 0,
        width: 100 + PCT
      }, outline),
      testID: props.testID
    },
    React.createElement(View, { style: { alignItems: 'center', flexDirection: 'row' } },
      React.createElement(Text, {
        dataSet: { part: 'name' },
        numberOfLines: 1,
        style: [ctx.typeStyle('file_uploader_item'), {
          color: ctx.color(disabled ? 'text_disabled' : 'file_uploader_item_label'),
          flexBasis: 'auto',
          flexGrow: 1,
          flexShrink: 1,
          marginStart: ctx.metric('FileUploaderItem', 'paddingStart')
        }]
      }, props.name),
      React.createElement(ctx.Registry.Filename, {
        disabled: disabled,
        iconDescription: props.iconDescription,
        invalid: invalid,
        name: props.name,
        onPress: function (event) {
          if (props.status === 'edit' && Utils.isFunction(props.onDelete)) {
            props.onDelete(event, { uuid: uuid });
          }
        },
        status: Utils.isString(props.status) ? props.status : 'uploading'
      })),
    // The message spans the row under its rule, the size's gap below the row
    message ? React.createElement(View, {
      dataSet: { part: 'message' },
      role: 'alert',
      style: {
        borderTopColor: ctx.color('file_uploader_error_rule'),
        borderTopWidth: ctx.metric('FileUploaderItem', 'ruleWidth'),
        marginTop: ctx.metric('FileUploaderItem', 'rowGap' + suffix),
        paddingTop: ctx.metric('FileUploaderItem', 'errorPaddingTop' + suffix)
      }
    },
    React.createElement(Text, {
      dataSet: { part: 'errorTitle' },
      style: [ctx.typeStyle('file_uploader_error_title'), { color: ctx.color('file_uploader_error_title'), paddingHorizontal: ctx.metric('FileUploaderItem', 'errorPaddingInline') }]
    }, props.errorSubject),
    Utils.isString(props.errorBody) ? React.createElement(Text, {
      dataSet: { part: 'errorBody' },
      style: [ctx.typeStyle('file_uploader_error_body'), { color: ctx.color('file_uploader_error_body'), paddingHorizontal: ctx.metric('FileUploaderItem', 'errorPaddingInline') }]
    }, props.errorBody) : null) : null);

  }

  FileUploaderItemComponent.displayName = 'FileUploaderItem';

  return FileUploaderItemComponent;

}

FileUploaderItem.spec = SPEC;
