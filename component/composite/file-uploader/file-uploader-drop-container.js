// Info: FileUploaderDropContainer composite: the dashed drop area. Its
// label sits at the top start inside the area's padding in the link ink;
// hover and focus draw the focus ring inside the edge and underline the
// label, a press inks it primary, a drag over the area draws the active
// ring, and a disabled area draws its dashed edge and label disabled.
//
// Behavior: a press, Enter or Space opens the chooser through the
// family's picking helper; a drop (where the host delivers drag events to
// the area's node) adds the dropped files. Either calls
// `onAddFiles(event, { addedFiles })` with every entry, those breaking
// `accept`, `pattern` or `maxFileSize` marked `invalidFileType`.

import SPEC from './spec.file-uploader-drop-container.js';
import createFilePicking from './file-picking.js';


/********************************************************************
FileUploaderDropContainer factory.

@param {Object} ctx - Component context

@return {Function} - The FileUploaderDropContainer component
*********************************************************************/
export default function FileUploaderDropContainer (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { fileEntries, onNodeEvent } = ctx.behaviors;
  const picking = createFilePicking(ctx);

  // The area fills its container up to its maximum width
  const PCT = '%';


  /********************************************************************
  FileUploaderDropContainer component.

  @param {Object} props - See `api.file-uploader-drop-container.js`

  @return {Object} - React element
  *********************************************************************/
  function FileUploaderDropContainerComponent (props) {

    const disabled = props.disabled === true || !picking.available();
    const [active, setActive] = React.useState(false);
    const nodeRef = React.useRef(null);
    const live = React.useRef(props);
    live.current = props;
    picking.report('FileUploaderDropContainer');

    // The entries one pick or drop adds, validated against the rules
    const add = function (event, entries) {
      const current = live.current;
      const list = current.multiple === true ? entries : entries.slice(0, 1);
      if (Utils.isFunction(current.onAddFiles)) {
        current.onAddFiles(event, { addedFiles: picking.validate(list, current) });
      }
    };

    // Drag events reach the area's node only where the host delivers them
    React.useEffect(function () {
      const node = nodeRef.current;
      const stop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
      const offs = [
        onNodeEvent(node, 'dragover', function (event) {
          stop(event);
          if (live.current.disabled !== true) {
            setActive(true);
          }
        }),
        onNodeEvent(node, 'dragleave', function (event) {
          stop(event);
          setActive(false);
        }),
        onNodeEvent(node, 'drop', function (event) {
          stop(event);
          setActive(false);
          if (live.current.disabled !== true) {
            add(event, fileEntries(event.dataTransfer === undefined ? null : event.dataTransfer.files));
          }
        })
      ];
      return function () {
        offs.forEach(function (off) {
          off();
        });
      };
    }, []);

    const onPress = function (event) {
      picking.pick({ accept: props.accept, multiple: props.multiple === true }).then(function (files) {
        if (Array.isArray(files) && !Utils.isEmptyArray(files)) {
          add(event, files);
        }
      });
    };

    const ringWidth = ctx.metric('FileUploaderDropContainer', 'ringWidth');
    return React.createElement(View, { dataSet: { part: 'root' }, style: { width: 100 + PCT } },
      React.createElement(Pressable, {
        accessibilityLabel: props.accessibilityLabel,
        dataSet: { part: 'drop' },
        disabled: disabled,
        onPress: disabled ? undefined : onPress,
        ref: nodeRef,
        role: 'button',
        style: function (state) {
          const ring = !disabled && (active || state.hovered === true || state.focused === true);
          return {
            alignItems: 'flex-start',
            borderColor: ctx.color(disabled ? 'file_uploader_drop_outline_disabled' : 'file_uploader_drop_outline'),
            borderStyle: 'dashed',
            borderWidth: ctx.metric('FileUploaderDropContainer', 'borderWidth'),
            flexDirection: 'row',
            // A minimum, not a fixed height: scaled text grows the area
            minHeight: ctx.metric('FileUploaderDropContainer', 'height'),
            maxWidth: ctx.metric('FileUploaderDropContainer', 'maxWidth'),
            outlineColor: ring ? ctx.color('file_uploader_drop_outline_active') : undefined,
            outlineOffset: ring ? -ringWidth : undefined,
            outlineStyle: ring ? 'solid' : 'none',
            outlineWidth: ring ? ringWidth : undefined,
            overflow: 'hidden',
            padding: ctx.metric('FileUploaderDropContainer', 'padding'),
            width: 100 + PCT
          };
        },
        testID: props.testID
      }, function (state) {
        const underline = !disabled && (state.hovered === true || state.focused === true || state.pressed === true);
        return React.createElement(Text, {
          dataSet: { part: 'label' },
          style: [ctx.typeStyle('file_uploader_item'), {
            color: ctx.color(disabled ? 'text_disabled' : state.pressed === true ? 'file_uploader_drop_label_active' : 'file_uploader_drop_label'),
            textDecorationLine: underline ? 'underline' : 'none'
          }]
        }, Utils.isString(props.labelText) ? props.labelText : 'Add file');
      }));

  }

  FileUploaderDropContainerComponent.displayName = 'FileUploaderDropContainer';

  return FileUploaderDropContainerComponent;

}

FileUploaderDropContainer.spec = SPEC;
