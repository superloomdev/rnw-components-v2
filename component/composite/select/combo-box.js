// Info: ComboBox composite. The field frame and open list the family's
// dropdown reads, around an editable input as the trigger: typing filters
// the open option list, the clear action empties the selection while a
// value sits, and the caret toggles the list. Composes the `useCombobox`
// behavior for open, query, selection and keyboard traversal, and draws
// the theme's `feedback.field` frame, `anatomy.label` placement and `field`
// role cells, with the theme's own dropdown indicator glyph.

import SPEC from './spec.combo-box.js';


/********************************************************************
ComboBox factory.

@param {Object} ctx - Component context

@return {Function} - The ComboBox component
*********************************************************************/
export default function ComboBox (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const NativeTextInput = ctx.ReactNative.TextInput;
  const { useAnchoredPosition, useOverlay, useCombobox, getA11yState } = ctx.behaviors;

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  ComboBox component.

  @param {Object} props - See `api.combo-box.js`

  @return {Object} - React element
  *********************************************************************/
  function ComboBoxComponent (props) {

    // Init the behavior and its state
    const combo = useCombobox(props);
    const state = combo.state;
    const items = combo.items;
    const invalid = props.invalid === true && !state.disabled;
    const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);

    // Read the geometry and the theme's field presentation, as the family
    // reads it for the member 'select'
    const height = ctx.metric('ComboBox', SIZES[props.size] || 'height');
    const iconSize = ctx.metric('ComboBox', 'iconSize');
    const iconZone = ctx.metric('ComboBox', 'iconZone');
    const iconInset = ctx.metric('ComboBox', 'iconInset');
    const iconGapEnd = ctx.metric('ComboBox', 'iconGapEnd');
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled === true,
      focused: state.focused === true || state.open === true,
      // The option ring draws on the highlighted row; the field keeps its
      // own ring while the list is open, as the reference draws it
      highlighted: false,
      hovered: state.hovered === true,
      invalid: invalid,
      open: state.open === true,
      populated: state.populated === true
    }, {
      member: 'text_input',
      outlineDisabled: 'select_outline_disabled',
      height: height,
      radius: ctx.metric('ComboBox', 'radius'),
      surface: surface,
      trailing: true
    });
    // The input is the field: it carries the fill, the bottom outline and the
    // inline padding itself, as the reference's input does. An open underline
    // frame redraws its bottom edge in the subtle border color, an outline
    // frame keeps its outline instead
    const inputFieldStyle = Object.assign({}, presentation.frame,
      state.open === true && ctx.enum('feedback.field') === 'underline'
        ? { borderBottomColor: ctx.color('border_subtle_01'), borderBottomWidth: ctx.metric('ComboBox', 'restingEdge') }
        : {});

    // The theme's list presentation: fills, labels, divider and the selected
    // mark per `anatomy.list_selected_mark`; the items take the field's own
    // height, as the reference sizes its list rows with its size
    const markSize = ctx.metric('ComboBox', 'markSize');
    const list = ctx.listPresentation({
      itemHeight: height,
      paddingInline: ctx.metric('ComboBox', 'itemPaddingInline'),
      dividerWidth: ctx.metric('ComboBox', 'itemDividerWidth'),
      paddingBlock: ctx.metric('ComboBox', 'listPaddingBlock'),
      radius: ctx.metric('ComboBox', 'listRadius'),
      level: ctx.metric('ComboBox', 'listLevel'),
      markRoom: ctx.metric('ComboBox', 'itemMarkRoom'),
      mark: false
    });

    // The frame is the open list's anchor: where an overlay host is mounted
    // the list renders through it on the layer style the positioner returns
    const frameRef = React.useRef(null);
    const [pressing, setPressing] = React.useState(false);
    const anchored = useAnchoredPosition({
      anchor: frameRef,
      offset: 0,
      placement: 'bottom-start',
      track: state.open === true
    });
    React.useEffect(function () {
      if (state.open === true) {
        anchored.measure();
      }
    }, [state.open, anchored.measure]);

    // The list registers with the overlay host while open; the host calls
    // `render` after this component has returned, when `listElement` exists
    const overlay = useOverlay({
      isOpen: state.open === true,
      name: 'ComboBox',
      onClose: function () {
        combo.setOpen(false);
      },
      render: function () {
        return listElement;
      }
    });

    // Render the option list while open; it spans the frame border to border,
    // so it pulls itself out by the side borders' thickness - the same
    // margins apply to the hosted copy's measured box
    const edge = presentation.borderSide;
    const listElement = state.open ? React.createElement(View, Object.assign({}, combo.listProps, {
      style: [overlay.hosted === true
        ? Object.assign({}, anchored.layerStyle, {
          left: anchored.layerStyle.left - edge,
          transform: [{ translateX: (anchored.shift || { x: 0 }).x + '%' }, { translateY: (anchored.shift || { y: 0 }).y + '%' }],
          width: anchored.anchor === null ? undefined : anchored.anchor.width + 2 * edge
        })
        : {
          left: -edge,
          position: 'absolute',
          right: -edge,
          top: height
        }, list.container, {
        maxHeight: height * ctx.metric('ComboBox', 'listMaxRows') + ctx.metric('ComboBox', 'listPaddingBlock') * 2,
        overflowY: 'auto'
      }]
    }), items.map(function (item, index) {
      const itemDisabled = item.disabled === true;
      const selectedItem = index === state.selectedIndex;
      const itemState = function (interaction) {
        return {
          disabled: itemDisabled,
          highlighted: index === state.highlightedIndex,
          hovered: interaction.hovered === true,
          pressed: interaction.pressed === true,
          // The open list marks the chosen option for assistive technology
          // only; it draws no selected fill, as the reference draws none
          selected: false
        };
      };
      // The divider hides on the first item and on the rows at and after the
      // highlighted or selected row, as the reference's rules suppress it there
      const divider = index !== 0 && index !== state.selectedIndex && index - 1 !== state.selectedIndex &&
        index !== state.highlightedIndex && index - 1 !== state.highlightedIndex;
      return React.createElement(Pressable, Object.assign({ key: item.value }, combo.getOptionProps(index), {
        style: function (interaction) {
          return list.item(itemState(interaction));
        }
      }),
      React.createElement(View, { style: list.option(divider) },
        React.createElement(Text, {
          numberOfLines: 1,
          style: list.label(itemState({}))
        }, item.label)),
      // The mark's seat mounts on every item; the theme's anatomy decides it draws
      React.createElement(View, { style: [list.markStyle, {
        display: list.mark === 'shown' && selectedItem ? 'flex' : 'none',
        top: (height - markSize) / 2
      }] },
      React.createElement(ctx.Registry.Icon, { name: 'selected_indicator', size: markSize, color: list.labelLeaf(itemState({})) })));
    })) : null;

    // Render the message below: the error while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? props.invalidText
      : Utils.isString(props.helperText) ? props.helperText : null;

    // The members in the frame's end, all absolutely inset: the caret keeps
    // the family's zone, the clear button sits ahead of it while populated,
    // and the invalid icon ahead of the clear while populated and invalid.
    // The input's end padding reserves the members' room: the combo cells
    // while populated, else the caret zone the field's own trailing member
    // already reserves
    const clearSize = ctx.metric('ComboBox', 'clearSize');
    const clearInsetEnd = ctx.metric('ComboBox', 'clearInsetEnd');
    const populated = state.populated === true;
    const inputPaddingEnd = populated === true
      ? (invalid ? ctx.metric('ComboBox', 'inputPaddingEndInvalid') : ctx.metric('ComboBox', 'inputPaddingEnd'))
      : iconInset + iconZone;
    // The reference treats a press on its input as opening: the error icon
    // takes its unpopulated seat while pressed or open
    const invalidInsetEnd = populated === true && state.open !== true && pressing !== true
      ? ctx.metric('ComboBox', 'invalidIconInsetEnd')
      : iconInset + iconZone + iconGapEnd;

    // The input is the trigger: the behavior's input props carry the role,
    // the list wiring and the query channel; the DOM click and a native
    // press-in are the input's press and the key event arrives as onKeyPress
    const input = React.createElement(NativeTextInput, Object.assign({}, combo.inputProps, getA11yState({ invalid: invalid ? true : undefined }), {
      ref: combo.inputRef,
      accessibilityLabel: props.accessibilityLabel,
      'aria-describedby': message === null ? undefined : undefined,
      editable: !state.disabled,
      onClick: combo.inputProps.onPress,
      onKeyPress: combo.inputProps.onKeyDown,
      onMouseDown: function (event) {
        setPressing(true);
        if (typeof combo.inputProps.onMouseDown === 'function') {
          combo.inputProps.onMouseDown(event);
        }
      },
      onMouseUp: function (event) {
        setPressing(false);
        if (typeof combo.inputProps.onMouseUp === 'function') {
          combo.inputProps.onMouseUp(event);
        }
      },
      // React Native's TextInput fires these on the native halves; the web
      // build ignores them, where the DOM events above carry the press
      onPressIn: function (event) {
        setPressing(true);
        if (typeof combo.inputProps.onPressIn === 'function') {
          combo.inputProps.onPressIn(event);
        }
      },
      onPressOut: function (event) {
        setPressing(false);
        if (typeof combo.inputProps.onPressOut === 'function') {
          combo.inputProps.onPressOut(event);
        }
      },
      placeholder: Utils.isString(props.placeholder) ? props.placeholder : '',
      placeholderTextColor: presentation.placeholderColor,
      testID: props.testID,
      style: [{
        alignSelf: 'stretch',
        flexBasis: 'auto',
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 0,
        // The field's own invalid ring paints; a focused or open combobox
        // draws no ring, as the upstream field's does not - so the input's
        // browser-ring suppression wins unless the invalid ring is the style
        outlineStyle: 'none'
      }, inputFieldStyle, presentation.value, {
        paddingEnd: inputPaddingEnd,
        paddingStart: ctx.token('control.field_padding_inline')
      }]
    }));

    // The clear button while populated: a square seat at its inset, the
    // theme's close glyph in the field's icon cells
    const clear = populated === true ? React.createElement(View, {
      style: {
        alignItems: 'center',
        height: clearSize,
        justifyContent: 'center',
        position: 'absolute',
        end: clearInsetEnd,
        top: (height - clearSize) / 2,
        width: clearSize
      }
    },
    React.createElement(Pressable, Object.assign({}, combo.clearProps, {
      style: ctx.pressTarget({ height: clearSize, width: clearSize })
    }),
    React.createElement(ctx.Registry.Icon, { name: 'close', size: iconSize, color: presentation.indicator }))) : null;

    // The error icon while invalid, at its populated inset or ahead of the
    // caret otherwise
    const icon = invalid ? React.createElement(View, {
      style: {
        alignItems: 'center',
        height: iconSize,
        justifyContent: 'center',
        position: 'absolute',
        end: invalidInsetEnd,
        top: (height - iconSize) / 2,
        width: iconSize
      }
    },
    React.createElement(ctx.Registry.Icon, { name: 'invalid', size: iconSize, color: presentation.invalidIcon })) : null;

    // The indicator: the theme's own dropdown glyph in the field's indicator
    // color for the state, centered in the family's square zone at the
    // frame's end and turned while the list is open; its pressable toggles
    const caret = React.createElement(View, {
      style: {
        alignItems: 'center',
        height: iconZone,
        justifyContent: 'center',
        position: 'absolute',
        end: iconInset,
        top: (height - iconZone) / 2,
        transform: state.open ? [{ rotate: '180deg' }] : [],
        width: iconZone
      }
    },
    React.createElement(ctx.Registry.Icon, { name: 'dropdown_indicator', size: iconSize, color: presentation.indicator }),
    React.createElement(Pressable, Object.assign({}, combo.toggleProps, {
      style: ctx.pressTarget({ height: iconZone, width: iconZone })
    })));

    // Render the root, the label, the frame with the input and its members,
    // and the message
    return React.createElement(View, Object.assign({}, combo.rootProps, { style: [{ position: 'relative' }, presentation.root] }),
      labelled ? React.createElement(Text, Object.assign({}, combo.labelProps, {
        style: ctx.enum('anatomy.label') === 'above' ? [presentation.label, { marginTop: ctx.metric('ComboBox', 'labelInset') }] : presentation.label
      }), props.label) : null,
      React.createElement(View, { ref: frameRef, style: {
        position: 'relative',
        // The open list stacks over the helper/error text that follows the
        // frame at the dropdown level, as the reference's menu covers it
        zIndex: state.open === true ? ctx.metric('ComboBox', 'listLevel') : undefined
      } }, input, icon, clear,
      overlay.hosted === true ? null : listElement, caret),
      message !== null ? React.createElement(Text, {
        numberOfLines: 2,
        style: presentation.message
      }, message) : null);

  }

  ComboBoxComponent.displayName = 'ComboBox';

  return ComboBoxComponent;

}

ComboBox.spec = SPEC;
