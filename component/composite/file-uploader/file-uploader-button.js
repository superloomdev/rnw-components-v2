// Info: FileUploaderButton composite: a Button that opens the host's file
// chooser. Its label turns to the chosen file's name, or "<n> files",
// unless the owner keeps it (`disableLabelChanges`).
//
// Behavior: press, Enter and Space pick through the family's picking
// helper (`adapters.FilePicker`, else a document's file input) and call
// `onChange(files)` with the chosen entries. A host that cannot pick
// draws the button disabled and reports `adapter_missing`.

import SPEC from './spec.file-uploader-button.js';
import createFilePicking from './file-picking.js';


/********************************************************************
FileUploaderButton factory.

@param {Object} ctx - Component context

@return {Function} - The FileUploaderButton component
*********************************************************************/
export default function FileUploaderButton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const picking = createFilePicking(ctx);


  /********************************************************************
  FileUploaderButton component.

  @param {Object} props - See `api.file-uploader-button.js`

  @return {Object} - React element
  *********************************************************************/
  function FileUploaderButtonComponent (props) {

    const ownLabel = Utils.isString(props.labelText) ? props.labelText : 'Add file';
    const [label, setLabel] = React.useState(ownLabel);
    React.useEffect(function () {
      setLabel(ownLabel);
    }, [ownLabel]);
    picking.report('FileUploaderButton');

    const onPress = function () {
      picking.pick({ accept: props.accept, multiple: props.multiple === true }).then(function (files) {
        if (!Array.isArray(files) || Utils.isEmptyArray(files)) {
          return;
        }
        if (props.disableLabelChanges !== true) {
          setLabel(files.length > 1 ? files.length + ' files' : files[0].name);
        }
        if (Utils.isFunction(props.onChange)) {
          props.onChange(files);
        }
      });
    };

    return React.createElement(ctx.Registry.Button, {
      accessibilityLabel: props.accessibilityLabel,
      disabled: props.disabled === true || !picking.available(),
      kind: Utils.isString(props.buttonKind) ? props.buttonKind : 'primary',
      onPress: onPress,
      size: Utils.isString(props.size) ? props.size : 'md',
      testID: props.testID
    }, label);

  }

  FileUploaderButtonComponent.displayName = 'FileUploaderButton';

  return FileUploaderButtonComponent;

}

FileUploaderButton.spec = SPEC;
