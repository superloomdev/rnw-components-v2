// Info: SelectableTile molecule. A Tile that toggles its own selection like
// a checkbox: the whole face takes the press, a corner mark announces the
// state and a one-point border draws only in the selected cells. The mark
// stays mounted under every state so the box never reflows.
//
// Behavior: `useInteractionState` gives the pressable's prop getters and
// state; `useControllableState` resolves `selected` against
// `defaultSelected` / `onChange`.
//
// Accessibility: `checkbox` role with `aria-checked`; the content names
// the option and `aria-disabled` marks the disabled face.
import SPEC from './spec.selectable-tile.js';


/********************************************************************
SelectableTile factory.

@param {Object} ctx - Component context

@return {Function} - The SelectableTile component
*********************************************************************/
export default function SelectableTile (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useControllableState, useInteractionState } = ctx.behaviors;


  /********************************************************************
  SelectableTile component.

  @param {Object} props - See `api.selectable-tile.js`

  @return {Object} - React element
  *********************************************************************/
  function SelectableTileComponent (props) {

    // Init the checked state and the press behavior
    const pair = useControllableState({
      defaultValue: props.defaultSelected === true,
      onChange: props.onChange,
      value: props.selected
    });
    const selected = pair[0] === true;
    const setSelected = pair[1];
    const disabled = props.disabled === true;
    const interaction = useInteractionState({
      disabled: disabled,
      onPress: function () {
        setSelected(!selected);
      }
    });
    const state = interaction.state;

    // The box, its border and the ring; the border keeps its width under
    // every state and draws the selected cells or stands transparent, as
    // upstream's invisible border does
    const live = !disabled;
    const focusWidth = ctx.metric('SelectableTile', 'focusWidth');
    const ring = state.focused === true ? {
      outlineColor: ctx.color('tile_focus'),
      outlineOffset: -focusWidth,
      outlineStyle: 'solid',
      outlineWidth: focusWidth
    } : {};
    const borderColor = selected === true
      ? ctx.color(disabled ? 'tile_border_selected_disabled' : 'tile_border_selected')
      : 'transparent';
    const markColor = disabled ? 'tile_mark_disabled' : selected ? 'tile_mark_selected' : 'tile_mark';

    // Render the pressable, the content and the corner mark
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      accessibilityRole: 'checkbox',
      'aria-checked': selected,
      'aria-disabled': disabled ? true : undefined,
      disabled: disabled,
      style: [{
        backgroundColor: live && (state.hovered === true || state.pressed === true)
          ? ctx.color('tile_container_hover') : ctx.color('tile_container'),
        borderColor: borderColor,
        borderWidth: ctx.metric('SelectableTile', 'borderWidth'),
        minHeight: ctx.metric('SelectableTile', 'minHeight'),
        minWidth: ctx.metric('SelectableTile', 'minWidth'),
        padding: ctx.metric('SelectableTile', 'padding'),
        paddingEnd: ctx.metric('SelectableTile', 'markSpace')
      }, ring],
      testID: props.testID
    }),
    Utils.isString(props.children)
      ? React.createElement(Text, {
        style: [{ color: ctx.color(disabled ? 'tile_label_disabled' : 'tile_label') }, ctx.typeStyle('tile')]
      }, props.children)
      : props.children,
    React.createElement(View, {
      style: {
        height: ctx.metric('SelectableTile', 'markSize'),
        pointerEvents: 'none',
        position: 'absolute',
        end: ctx.metric('SelectableTile', 'markInset'),
        top: ctx.metric('SelectableTile', 'markInset'),
        width: ctx.metric('SelectableTile', 'markSize')
      }
    }, React.createElement(ctx.Registry.Icon, {
      color: markColor,
      name: selected ? 'checkbox' : 'checkbox_unchecked',
      size: ctx.metric('SelectableTile', 'markSize')
    })));

  }

  SelectableTileComponent.displayName = 'SelectableTile';
  return SelectableTileComponent;

}
SelectableTile.spec = SPEC;
