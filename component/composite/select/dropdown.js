// Info: Dropdown composite. A field root holding the label, the frame (a
// pressable trigger showing the selection, an error Icon while invalid and
// the caret Icon, turned while open) and a helper or error message; while
// open, the option list is laid out below the frame at the dropdown stacking
// level, drawn on the theme's `list` role cells, and the selected item draws
// the `selected_indicator` mark where `anatomy.list_selected_mark` says so.
// Composes the `useSelect` behavior for open, selection and keyboard
// traversal, and draws the theme's `feedback.field` frame, `anatomy.label`
// placement and `field` role cells as the select member.

import SPEC from './spec.dropdown.js';


/********************************************************************
Dropdown factory.

@param {Object} ctx - Component context

@return {Function} - The Dropdown component
*********************************************************************/
export default function Dropdown (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useSelect, getA11yState } = ctx.behaviors;

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  Dropdown component.

  @param {Object} props - See `api.dropdown.js`

  @return {Object} - React element
  *********************************************************************/
  function DropdownComponent (props) {

    // Init the behavior and its state
    const select = useSelect(props);
    const state = select.state;
    const items = Utils.isArray(props.items) ? props.items : [];
    const invalid = props.invalid === true && !state.disabled;
    const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);
    const selected = state.selectedIndex >= 0 ? items[state.selectedIndex] : null;

    // Read the geometry and the theme's field presentation; the presentation
    // resolves how the open state draws for the theme's field mode
    const height = ctx.metric('Dropdown', SIZES[props.size] || 'height');
    const iconSize = ctx.metric('Dropdown', 'iconSize');
    const iconZone = ctx.metric('Dropdown', 'iconZone');
    const iconInset = ctx.metric('Dropdown', 'iconInset');
    const iconGapEnd = ctx.metric('Dropdown', 'iconGapEnd');
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled,
      focused: state.focused === true,
      // While the open list carries the highlight its ring moves onto the
      // highlighted option and the field's own ring rests
      highlighted: state.highlightedIndex >= 0,
      hovered: state.hovered === true,
      invalid: invalid,
      open: state.open === true,
      populated: selected !== null
    }, {
      member: 'select',
      height: height,
      radius: ctx.metric('Dropdown', 'radius'),
      surface: surface,
      trailing: true
    });
    // The frame's end padding is the caret zone's inset less the side border
    // the outline mode draws inside it; an open underline frame redraws its
    // bottom edge in the subtle border color, an outline frame keeps its
    // outline instead
    const frame = Object.assign({}, presentation.frame, { paddingEnd: iconInset - presentation.borderSide },
      state.open === true && ctx.enum('feedback.field') === 'underline'
        ? { borderBottomColor: ctx.color('border_subtle_00'), borderBottomWidth: ctx.metric('Dropdown', 'restingEdge') }
        : {});

    // The theme's list presentation: fills, labels, divider and the selected
    // mark per `anatomy.list_selected_mark`; the items take the field's own
    // height, as the reference sizes its list rows with its size
    const markSize = ctx.metric('Dropdown', 'markSize');
    const list = ctx.listPresentation({
      itemHeight: height,
      paddingInline: ctx.metric('Dropdown', 'itemPaddingInline'),
      dividerWidth: ctx.metric('Dropdown', 'itemDividerWidth'),
      paddingBlock: ctx.metric('Dropdown', 'listPaddingBlock'),
      radius: ctx.metric('Dropdown', 'listRadius'),
      level: ctx.metric('Dropdown', 'listLevel'),
      markRoom: ctx.metric('Dropdown', 'itemMarkRoom'),
      mark: true
    });

    // The indicator: the theme's own dropdown glyph in the field's indicator
    // color for the state, centered in a square zone at the frame's end and
    // turned while the list is open
    const caret = React.createElement(View, {
      style: {
        alignItems: 'center',
        height: iconZone,
        justifyContent: 'center',
        marginStart: iconGapEnd,
        transform: state.open ? [{ rotate: '180deg' }] : [],
        width: iconZone
      }
    },
    React.createElement(ctx.Registry.Icon, { name: 'dropdown_indicator', size: iconSize, color: presentation.indicator }));

    // Render the error icon while invalid
    const icon = invalid ? React.createElement(View, { style: { marginStart: iconGapEnd } },
      React.createElement(ctx.Registry.Icon, { name: 'invalid', size: iconSize, color: presentation.invalidIcon })) : null;

    // Render the option list while open; it spans the frame border to border,
    // so it pulls itself out by the side borders' thickness
    const edge = presentation.borderSide;
    const openList = state.open ? React.createElement(View, Object.assign({}, select.listProps, {
      style: [{
        left: -edge,
        position: 'absolute',
        right: -edge,
        top: height
      }, list.container, {
        maxHeight: height * ctx.metric('Dropdown', 'listMaxRows') + ctx.metric('Dropdown', 'listPaddingBlock') * 2,
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
      // The divider hides on the first item and on the rows at and after the
      // highlighted or selected row, as the reference's rules suppress it there
      const divider = index !== 0 && index !== state.selectedIndex && index - 1 !== state.selectedIndex &&
        index !== state.highlightedIndex && index - 1 !== state.highlightedIndex;
      return React.createElement(Pressable, Object.assign({ key: item.value }, select.getOptionProps(index), {
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

    // Size the trigger to its widest text, as the reference's field sizes to
    // its widest option, so the frame does not change width with the selection
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
      labelled ? React.createElement(Text, Object.assign({}, select.labelProps, {
        // The 'above' label takes the inset the reference's inline label gains
        // from its line box; the floating label sits inside the frame instead
        style: ctx.enum('anatomy.label') === 'above' ? [presentation.label, { marginTop: ctx.metric('Dropdown', 'labelInset') }] : presentation.label
      }), props.label) : null,
      React.createElement(View, { style: frame },
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

  DropdownComponent.displayName = 'Dropdown';

  return DropdownComponent;

}

Dropdown.spec = SPEC;
