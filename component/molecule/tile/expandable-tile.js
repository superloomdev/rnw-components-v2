// Info: ExpandableTile molecule. A Tile whose top stays the button: the
// whole face toggles between the folded height (the above-the-fold
// content's laid-out height plus the tile padding, overridable by
// `tileMaxHeight` / `tilePadding`) and the content height. When the
// content holds its own controls (`interactive`), the chevron alone is
// the toggle and the face does not hover.
//
// Behavior: `useInteractionState` gives the pressable's prop getters and
// state; `useControllableState` resolves `expanded` against
// `defaultExpanded` / `onToggle`.
//
// Accessibility: `button` with `aria-expanded`; the chevron is a labelled
// button in the interactive mode.
import SPEC from './spec.expandable-tile.js';


/********************************************************************
ExpandableTile factory.

@param {Object} ctx - Component context

@return {Function} - The ExpandableTile component
*********************************************************************/
export default function ExpandableTile (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useControllableState, useInteractionState } = ctx.behaviors;


  /********************************************************************
  ExpandableTile component.

  @param {Object} props - See `api.expandable-tile.js`

  @return {Object} - React element
  *********************************************************************/
  function ExpandableTileComponent (props) {

    // Init the expanded state and the press behavior
    const pair = useControllableState({
      defaultValue: props.defaultExpanded === true,
      onChange: props.onToggle,
      value: props.expanded
    });
    const expanded = pair[0] === true;
    const setExpanded = pair[1];
    const disabled = props.disabled === true;
    const interactive = props.interactive === true;
    const interaction = useInteractionState({
      disabled: disabled,
      onPress: function () {
        setExpanded(!expanded);
      }
    });
    const state = interaction.state;

    // The measured fold and the collapsed cap
    const [aboveHeight, setAboveHeight] = React.useState(0);
    const padding = ctx.metric('ExpandableTile', 'padding');
    const baseHeight = Utils.isNumber(props.tileMaxHeight) && props.tileMaxHeight > 0
      ? props.tileMaxHeight : aboveHeight;
    const pad = Utils.isNumber(props.tilePadding) && props.tilePadding > 0 ? props.tilePadding : padding * 2;

    // The face colors and the ring
    const live = !disabled && interactive !== true;
    const focusWidth = ctx.metric('ExpandableTile', 'focusWidth');
    const ring = state.focused === true ? {
      outlineColor: ctx.color('tile_focus'),
      outlineOffset: -focusWidth,
      outlineStyle: 'solid',
      outlineWidth: focusWidth
    } : {};
    const backgroundColor = live && (state.hovered === true || state.pressed === true)
      ? ctx.color('tile_container_hover') : ctx.color('tile_container');

    // The content nodes
    const chevronGlyph = React.createElement(ctx.Registry.Icon, {
      color: 'tile_chevron',
      name: 'chevron_down',
      size: ctx.metric('ExpandableTile', 'chevronSize'),
      style: [{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }]
    });
    const seatStyle = {
      alignItems: 'center',
      height: ctx.metric('ExpandableTile', 'chevronSeat'),
      justifyContent: 'center',
      bottom: 0,
      position: 'absolute',
      end: 0,
      width: ctx.metric('ExpandableTile', 'chevronSeat')
    };
    const above = React.createElement(View, {
      onLayout: function (event) {
        const next = event === null || event === undefined || event.nativeEvent === undefined ? 0 : event.nativeEvent.layout.height;
        if (next !== aboveHeight) {
          setAboveHeight(next);
        }
      }
    },
    Utils.isString(props.children)
      ? React.createElement(Text, { style: [{ color: ctx.color('tile_label') }, ctx.typeStyle('tile')] }, props.children)
      : props.children);
    // The fold renders collapsed as upstream: mounted but invisible and
    // out of the accessibility tree; expanding fades it in
    const below = React.createElement(View, {
      accessibilityElementsHidden: !expanded,
      'aria-hidden': expanded ? undefined : true,
      style: { opacity: expanded ? 1 : 0 }
    },
    Utils.isString(props.below)
      ? React.createElement(Text, { style: [{ color: ctx.color('tile_label') }, ctx.typeStyle('tile')] }, props.below)
      : props.below);
    const boxStyle = [{
      backgroundColor: backgroundColor,
      minHeight: ctx.metric('ExpandableTile', 'minHeight'),
      minWidth: ctx.metric('ExpandableTile', 'minWidth'),
      overflow: expanded ? undefined : 'hidden',
      maxHeight: expanded ? undefined : baseHeight + pad,
      padding: padding
    }, ring];

    // In the interactive mode the chevron alone takes the toggle
    if (interactive) {
      return React.createElement(View, {
        style: boxStyle,
        testID: props.testID
      },
      above, below,
      React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
        accessibilityLabel: Utils.isString(props.chevronLabel) ? props.chevronLabel : 'Toggle tile',
        accessibilityRole: 'button',
        'aria-expanded': expanded,
        'aria-disabled': disabled ? true : undefined,
        disabled: disabled,
        style: seatStyle
      }), chevronGlyph));
    }

    // Render the whole face as the toggle; the chevron seat rides along
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      accessibilityRole: 'button',
      'aria-expanded': expanded,
      'aria-disabled': disabled ? true : undefined,
      disabled: disabled,
      style: boxStyle,
      testID: props.testID
    }),
    above, below,
    React.createElement(View, { style: [seatStyle, { pointerEvents: 'none' }] }, chevronGlyph));

  }

  ExpandableTileComponent.displayName = 'ExpandableTile';
  return ExpandableTileComponent;

}
ExpandableTile.spec = SPEC;
