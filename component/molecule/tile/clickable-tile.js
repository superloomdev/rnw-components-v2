// Info: ClickableTile molecule. A Tile that acts as one link or press
// target: the whole face takes the press, the hover paints the layer's
// hover cell and the ring draws the tile's own focus cells inside the
// box. An optional corner icon seats in the bottom end; a disabled tile
// hides it and takes no press.
//
// Behavior: `useButton` gives the pressable's prop getters and state.
//
// Accessibility: `link` with an `href`, `button` without; the content
// names the target and `aria-disabled` marks the disabled face.
import SPEC from './spec.clickable-tile.js';


/********************************************************************
ClickableTile factory.

@param {Object} ctx - Component context

@return {Function} - The ClickableTile component
*********************************************************************/
export default function ClickableTile (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;


  /********************************************************************
  ClickableTile component.

  @param {Object} props - See `api.clickable-tile.js`

  @return {Object} - React element
  *********************************************************************/
  function ClickableTileComponent (props) {

    // Init the press behavior; the tile's content names the target
    const disabled = props.disabled === true;
    const button = useButton(Object.assign({}, props, {
      disabled: disabled,
      onPress: disabled ? undefined : props.onPress
    }));
    const state = button.state;

    // The box and its state colors; the ring draws inside the edge, as
    // upstream's inset outline does
    const live = !disabled;
    const focused = state.focused === true;
    const pressed = state.pressed === true;
    // The ring and the pressed label are the link's cells: upstream the
    // tile is an `a.cds--link` and its focus/active rules beat the tile's
    const ring = focused === true ? {
      outlineColor: ctx.color('link_focus_ring'),
      outlineOffset: -ctx.metric('ClickableTile', 'focusWidth'),
      outlineStyle: 'solid',
      outlineWidth: ctx.metric('ClickableTile', 'focusWidth')
    } : {};
    const backgroundColor = live && (state.hovered === true || state.pressed === true)
      ? ctx.color('tile_container_hover') : ctx.color('tile_container');

    // Render the pressable, the content and the corner icon seat; the icon
    // mounts only when it draws (never on the disabled face)
    return React.createElement(Pressable, Object.assign({}, button.rootProps, {
      accessibilityRole: Utils.isString(props.href) ? 'link' : 'button',
      'aria-disabled': disabled ? true : undefined,
      disabled: disabled,
      href: disabled ? undefined : props.href,
      style: [{
        backgroundColor: backgroundColor,
        minHeight: ctx.metric('ClickableTile', 'minHeight'),
        minWidth: ctx.metric('ClickableTile', 'minWidth'),
        padding: ctx.metric('ClickableTile', 'padding')
      }, ring],
      testID: props.testID
    }),
    Utils.isString(props.children)
      ? React.createElement(Text, {
        style: [{
          color: ctx.color(disabled ? 'tile_label_disabled' : live && pressed ? 'link_label_active' : 'tile_label'),
          textDecorationLine: live && (focused || pressed) ? 'underline' : 'none'
        }, ctx.typeStyle('tile')]
      }, props.children)
      : props.children,
    Utils.isString(props.icon) && !disabled
      ? React.createElement(View, {
        style: {
          bottom: ctx.metric('ClickableTile', 'iconInset'),
          height: ctx.metric('ClickableTile', 'iconSize'),
          pointerEvents: 'none',
          position: 'absolute',
          end: ctx.metric('ClickableTile', 'iconInset'),
          width: ctx.metric('ClickableTile', 'iconSize')
        }
      }, React.createElement(ctx.Registry.Icon, {
        color: 'tile_icon',
        name: props.icon,
        size: ctx.metric('ClickableTile', 'iconSize')
      }))
      : null);

  }

  ClickableTileComponent.displayName = 'ClickableTile';
  return ClickableTileComponent;

}
ClickableTile.spec = SPEC;
