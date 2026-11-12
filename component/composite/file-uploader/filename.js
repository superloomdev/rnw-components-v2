// Info: Filename composite: the status seat at the end of a file row. It
// is the state container both upstream parents wrap it in: a centered row
// at least one glyph seat wide with the state's end inset, holding the
// small spinner (`uploading`), the close button with the error glyph
// before it when invalid (`edit`), or the checkmark (`complete`).
//
// Behavior: the close button is a pressable named "<iconDescription> -
// <name>"; press, Enter and Space call `onPress`; the checkmark is an
// image named by `iconDescription`; the spinner announces it.

import SPEC from './spec.filename.js';


/********************************************************************
Filename factory.

@param {Object} ctx - Component context

@return {Function} - The Filename component
*********************************************************************/
export default function Filename (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;


  /********************************************************************
  Filename component.

  @param {Object} props - See `api.filename.js`

  @return {Object} - React element
  *********************************************************************/
  function FilenameComponent (props) {

    const status = Utils.isString(props.status) ? props.status : 'uploading';
    const description = Utils.isString(props.iconDescription) ? props.iconDescription : 'Uploading file';
    const disabled = props.disabled === true;
    const seat = ctx.metric('Filename', 'seat');
    const glyph = ctx.metric('Filename', 'glyph');

    // The state's glyph: each sits in the one seat width
    let content = null;
    if (status === 'uploading') {
      content = React.createElement(View, {
        dataSet: { part: 'loading' },
        style: { alignItems: 'center', height: glyph, justifyContent: 'center', width: seat }
      }, React.createElement(ctx.Registry.Loading, { description: description, small: true, withOverlay: false }));
    } else if (status === 'complete') {
      content = React.createElement(View, {
        'aria-label': description,
        dataSet: { part: 'complete' },
        role: 'img',
        style: { alignItems: 'center', height: glyph, justifyContent: 'center', width: seat }
      }, React.createElement(ctx.Registry.Icon, { color: 'file_uploader_complete_icon', name: 'checkmark_filled', size: glyph }));
    } else if (status === 'edit') {
      content = [
        props.invalid === true ? React.createElement(View, { dataSet: { part: 'invalidIcon' }, key: 'invalid', style: { marginEnd: ctx.metric('Filename', 'invalidGap') } },
          React.createElement(ctx.Registry.Icon, { color: 'file_uploader_invalid_icon', name: 'warning_filled', size: glyph })) : null,
        React.createElement(Pressable, {
          'aria-label': description + ' - ' + (Utils.isString(props.name) ? props.name : ''),
          dataSet: { part: 'close' },
          disabled: disabled,
          key: 'close',
          onKeyDown: function (event) {
            if ((event.key === 'Enter' || event.key === ' ') && Utils.isFunction(props.onPress)) {
              if (typeof event.preventDefault === 'function') {
                event.preventDefault();
              }
              props.onPress(event);
            }
          },
          onPress: disabled ? undefined : props.onPress,
          role: 'button',
          style: function (state) {
            return [{ alignItems: 'center', height: seat, justifyContent: 'center', width: seat }, ctx.focusRing('field', state)];
          },
          testID: props.testID
        }, React.createElement(ctx.Registry.Icon, { color: disabled ? 'file_uploader_close_icon_disabled' : 'file_uploader_close_icon', name: 'close', size: glyph }))
      ];
    }

    return React.createElement(View, {
      dataSet: { part: 'state' },
      style: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        minWidth: seat,
        paddingEnd: ctx.metric('Filename', 'paddingEnd')
      }
    }, content);

  }

  FilenameComponent.displayName = 'Filename';

  return FilenameComponent;

}

Filename.spec = SPEC;
