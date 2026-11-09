// Info: RadioTile molecule. A selectable tile that acts as one radio
// option inside a TileGroup: the face takes the press, the corner mark
// shows the checked state and a one-point border draws the selected
// cells. Standalone it toggles to checked; a group injects `checked`,
// `onChange`, `focusable` and `onGroupFocus`.
//
// Behavior: `useInteractionState` gives the pressable's prop getters and
// state; `useControllableState` resolves `checked` against the group's
// injected value.
//
// Accessibility: `radio` with `aria-checked`; the content names the
// option and the tile holds its tab stop (the group's roving index).
import SPEC from './spec.radio-tile.js';


/********************************************************************
RadioTile factory.

@param {Object} ctx - Component context

@return {Function} - The RadioTile component
*********************************************************************/
export default function RadioTile (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useControllableState, useInteractionState } = ctx.behaviors;


  /********************************************************************
  RadioTile component.

  @param {Object} props - See `api.radio-tile.js`

  @return {Object} - React element
  *********************************************************************/
  function RadioTileComponent (props) {

    // Init the checked state and the press behavior; a radio only selects
    const pair = useControllableState({
      defaultValue: props.defaultChecked === true,
      onChange: props.onChange,
      value: props.checked
    });
    const checked = pair[0] === true;
    const setChecked = pair[1];
    const disabled = props.disabled === true;
    const interaction = useInteractionState({
      disabled: disabled,
      onFocus: props.onGroupFocus,
      onPress: function () {
        setChecked(true);
      }
    });
    const state = interaction.state;

    // The box, the border, the ring and the mark
    const live = !disabled;
    const focusWidth = ctx.metric('RadioTile', 'focusWidth');
    const ring = state.focused === true ? {
      outlineColor: ctx.color('tile_focus'),
      outlineOffset: -focusWidth,
      outlineStyle: 'solid',
      outlineWidth: focusWidth
    } : {};
    const borderColor = checked
      ? ctx.color(disabled ? 'tile_border_selected_disabled' : 'tile_border_selected')
      : 'transparent';
    const markColor = disabled ? 'tile_mark_disabled' : checked ? 'tile_mark_selected' : 'tile_mark';

    // Render the pressable, the content and the corner mark (its seat
    // stays mounted; the glyph shows only while checked, as upstream's
    // hidden checkmark does)
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      accessibilityRole: 'radio',
      'aria-checked': checked,
      'aria-disabled': disabled ? true : undefined,
      disabled: disabled,
      ref: props.itemRef,
      style: [{
        backgroundColor: live && (state.hovered === true || state.pressed === true)
          ? ctx.color('tile_container_hover') : ctx.color('tile_container'),
        borderColor: borderColor,
        borderWidth: ctx.metric('RadioTile', 'borderWidth'),
        minHeight: ctx.metric('RadioTile', 'minHeight'),
        minWidth: ctx.metric('RadioTile', 'minWidth'),
        padding: ctx.metric('RadioTile', 'padding'),
        paddingEnd: ctx.metric('RadioTile', 'markSpace')
      }, ring],
      tabIndex: disabled ? -1 : props.focusable === false ? -1 : 0,
      testID: props.testID
    }),
    Utils.isString(props.children)
      ? React.createElement(Text, {
        style: [{ color: ctx.color(disabled ? 'tile_label_disabled' : 'tile_label') }, ctx.typeStyle('tile')]
      }, props.children)
      : props.children,
    React.createElement(View, {
      style: {
        height: ctx.metric('RadioTile', 'markSize'),
        opacity: checked ? 1 : 0,
        pointerEvents: 'none',
        position: 'absolute',
        end: ctx.metric('RadioTile', 'markInset'),
        top: ctx.metric('RadioTile', 'markInset'),
        width: ctx.metric('RadioTile', 'markSize')
      }
    }, React.createElement(ctx.Registry.Icon, {
      color: markColor,
      name: 'checkmark_filled',
      size: ctx.metric('RadioTile', 'markSize')
    })));

  }

  RadioTileComponent.displayName = 'RadioTile';
  return RadioTileComponent;

}
RadioTile.spec = SPEC;
