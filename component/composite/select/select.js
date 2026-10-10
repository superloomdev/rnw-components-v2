// Info: Select composite. A field root holding the label, the frame (a
// pressable trigger showing the selection, an error Icon while invalid and
// the caret Icon) and a helper or error message; while open, the option
// list is laid out below the frame at the dropdown stacking level. Composes
// the `useSelect` behavior for open, selection and keyboard traversal, and
// draws the theme's `feedback.field` frame, `anatomy.label` placement and
// `field` role cells, with the theme's own dropdown indicator glyph.

import SPEC from './spec.js';


/********************************************************************
Select factory.

@param {Object} ctx - Component context

@return {Function} - The Select component
*********************************************************************/
export default function Select (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useSelect, getA11yState } = ctx.behaviors;

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  Select component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function SelectComponent (props) {

    // Init the behavior and its state
    const select = useSelect(props);
    const state = select.state;
    const items = Utils.isArray(props.items) ? props.items : [];
    const invalid = props.invalid === true && !state.disabled;
    const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);
    const selected = state.selectedIndex >= 0 ? items[state.selectedIndex] : null;

    // Read the geometry and the theme's field presentation
    const height = ctx.metric('Select', SIZES[props.size] || 'height');
    const iconSize = ctx.metric('Select', 'iconSize');
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled,
      focused: state.focused || state.open,
      hovered: state.hovered,
      invalid: invalid,
      populated: selected !== null
    }, {
      member: 'select',
      height: height,
      radius: ctx.metric('Select', 'radius'),
      surface: surface,
      trailing: true
    });
    const iconGap = presentation.iconGap;
    const list = ctx.listPresentation({
      itemHeight: ctx.metric('Select', 'itemHeight'),
      paddingInline: ctx.metric('Select', 'itemPaddingInline'),
      dividerWidth: ctx.metric('Select', 'itemDividerWidth'),
      paddingBlock: ctx.metric('Select', 'listPaddingBlock'),
      radius: ctx.metric('Select', 'listRadius'),
      level: ctx.metric('Select', 'listLevel')
    });

    // The indicator: the theme's own dropdown glyph, in the field's indicator color for the state
    const caret = React.createElement(View, { style: { marginStart: iconGap, transform: state.open ? [{ rotate: '180deg' }] : [] } },
      React.createElement(ctx.Registry.Icon, { name: 'dropdown_indicator', size: iconSize, color: presentation.indicator }));

    // Render the error icon while invalid
    const icon = invalid ? React.createElement(View, { style: { marginStart: iconGap } },
      React.createElement(ctx.Registry.Icon, { name: 'invalid', size: iconSize, color: presentation.invalidIcon })) : null;

    // Render the option list while open
    const openList = state.open ? React.createElement(View, Object.assign({}, select.listProps, {
      style: [{
        left: 0,
        position: 'absolute',
        right: 0,
        top: height
      }, list.container, {
        maxHeight: ctx.metric('Select', 'itemHeight') * ctx.metric('Select', 'listMaxRows') + ctx.metric('Select', 'listPaddingBlock') * 2,
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
          selected: selectedItem
        };
      };
      return React.createElement(Pressable, Object.assign({ key: item.value }, select.getOptionProps(index), {
        style: function (interaction) {
          return list.item(itemState(interaction));
        }
      }),
      React.createElement(View, { style: list.option(index !== 0) },
        React.createElement(Text, {
          numberOfLines: 1,
          style: list.label(itemState({}))
        }, item.label)));
    })) : null;

    // Render the message below: the error while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? props.invalidText
      : Utils.isString(props.helperText) ? props.helperText : null;

    // Size the trigger to its widest text, as a platform select sizes to its
    // widest option, so the frame does not change width with the selection;
    // the sizer takes no height and is hidden from assistive technology
    const bodyStyle = presentation.value;
    const placeholder = Utils.isString(props.placeholder) ? props.placeholder : '';
    const sizer = React.createElement(View, { 'aria-hidden': true, style: { height: 0, overflow: 'hidden' } },
      [placeholder].concat(items.map(function (item) {
        return item.label;
      })).map(function (text, index) {
        return React.createElement(Text, { key: index, numberOfLines: 1, style: bodyStyle }, text);
      }));

    // Render the root, the label, the frame with the trigger and the list, and the message
    return React.createElement(View, Object.assign({}, select.rootProps, { style: [{ position: 'relative' }, presentation.root] }),
      labelled ? React.createElement(Text, Object.assign({}, select.labelProps, { style: presentation.label }), props.label) : null,
      React.createElement(View, { style: presentation.frame },
        React.createElement(Pressable, Object.assign({}, select.triggerProps, getA11yState({ invalid: invalid ? true : undefined }), {
          accessibilityLabel: props.accessibilityLabel,
          testID: props.testID,
          // The focus ring is drawn on the frame, so the trigger itself shows none.
          // The trigger grows from its content (the sizer), not from zero: native
          // layout gives `flex: 1` a zero basis, which collapses the trigger
          // inside a container that sizes to its content
          style: { alignItems: 'center', alignSelf: 'stretch', flexBasis: 'auto', flexDirection: 'row', flexGrow: 1, flexShrink: 1, outlineStyle: 'none' }
        }),
        React.createElement(View, { style: { flexGrow: 1 } },
          React.createElement(Text, {
            numberOfLines: 1,
            // A list box's placeholder is its label, drawn in the field's own
            // ink; under a floating label it stays in the tree, undrawn
            style: [bodyStyle, {
              opacity: selected === null && labelled && ctx.enum('anatomy.label') === 'floating' ? 0 : 1
            }]
          }, selected === null ? placeholder : selected.label),
          sizer),
        icon,
        caret),
        openList
      ),
      message === null ? null : React.createElement(Text, { style: presentation.message }, message)
    );

  }

  SelectComponent.displayName = 'Select';

  return SelectComponent;

}

Select.spec = SPEC;
