// Info: FileUploader composite: a title, a description, the picking
// button and the list of chosen files under it. Each chosen file is a
// FileUploaderItem at the uploader's size in the one `filenameStatus` the
// uploader gives every file; the list keeps its gap under the button even
// while empty, as the reference's container does.
//
// Behavior: the button picks (`multiple` adds to the list by name,
// otherwise replaces it); entries larger than `maxFileSize` are reported
// through `onAddFiles` but not listed; `onChange(files)` follows each
// change to the list; a file's close button in the `edit` status removes
// it and calls `onDelete(file)`.

import SPEC from './spec.js';
import createFilePicking from './file-picking.js';


/********************************************************************
FileUploader factory.

@param {Object} ctx - Component context

@return {Function} - The FileUploader component
*********************************************************************/
export default function FileUploader (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { useA11yId } = ctx.behaviors;
  const picking = createFilePicking(ctx);


  /********************************************************************
  FileUploader component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function FileUploaderComponent (props) {

    const disabled = props.disabled === true;
    const [files, setFiles] = React.useState([]);
    const descriptionId = useA11yId('file-uploader');
    const live = React.useRef(files);
    live.current = files;

    const change = function (next) {
      setFiles(next);
      if (Utils.isFunction(props.onChange)) {
        props.onChange(next);
      }
    };

    // Picked entries: every one is reported, the valid ones are listed
    const onPicked = function (entries) {
      const checked = picking.validate(props.multiple === true ? entries : entries.slice(0, 1), { maxFileSize: props.maxFileSize });
      if (Utils.isFunction(props.onAddFiles)) {
        props.onAddFiles({ addedFiles: checked });
      }
      const valid = checked.filter(function (entry) {
        return entry.invalidFileType !== true;
      });
      if (Utils.isEmptyArray(valid)) {
        return;
      }
      if (props.multiple !== true) {
        change(valid);
        return;
      }
      const names = live.current.map(function (entry) {
        return entry.name;
      });
      change(live.current.concat(valid.filter(function (entry) {
        return !Utils.inArray(names, entry.name);
      })));
    };

    const labelColor = function (leaf) {
      return ctx.color(disabled ? 'file_uploader_label_disabled' : leaf);
    };

    return React.createElement(View, { dataSet: { part: 'root' }, style: { alignItems: 'flex-start' }, testID: props.testID },
      Utils.isString(props.labelTitle) ? React.createElement(Text, {
        dataSet: { part: 'title' },
        role: 'heading',
        style: [ctx.typeStyle('file_uploader_title'), { color: labelColor('file_uploader_title'), marginBottom: ctx.metric('FileUploader', 'titleGap') }]
      }, props.labelTitle) : null,
      React.createElement(Text, {
        dataSet: { part: 'description' },
        nativeID: descriptionId,
        style: [ctx.typeStyle('file_uploader_description'), { color: labelColor('file_uploader_description'), marginBottom: ctx.metric('FileUploader', 'descriptionGap') }]
      }, props.labelDescription),
      React.createElement(ctx.Registry.FileUploaderButton, {
        accept: props.accept,
        buttonKind: props.buttonKind,
        disableLabelChanges: true,
        disabled: disabled,
        labelText: props.buttonLabel,
        multiple: props.multiple === true,
        onChange: onPicked,
        size: props.size
      }),
      React.createElement(View, {
        dataSet: { part: 'container' },
        style: { alignSelf: 'stretch', marginTop: ctx.metric('FileUploader', 'listGap') }
      }, files.map(function (file, index) {
        return React.createElement(View, {
          key: file.name,
          style: { marginBottom: index === files.length - 1 ? 0 : ctx.metric('FileUploader', 'itemGap') }
        }, React.createElement(ctx.Registry.FileUploaderItem, {
          disabled: disabled,
          iconDescription: props.iconDescription,
          name: file.name,
          onDelete: function () {
            change(live.current.filter(function (entry) {
              return entry.name !== file.name;
            }));
            if (Utils.isFunction(props.onDelete)) {
              props.onDelete(file);
            }
          },
          size: props.size === 'sm' || props.size === 'md' ? props.size : undefined,
          status: Utils.isString(props.filenameStatus) ? props.filenameStatus : 'uploading'
        }));
      })));

  }

  FileUploaderComponent.displayName = 'FileUploader';

  return FileUploaderComponent;

}

FileUploader.spec = SPEC;
