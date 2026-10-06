// Info: Button molecule. A pressable root with the label and an optional
// trailing Icon; composes the `useButton` behavior for press, hover,
// focus, selected and disabled, and draws the theme's `feedback.press`
// choice through the context's press presentation. The kind picks a
// palette of color leaves; the size picks a height metric.

import SPEC from './spec.js';


/********************************************************************
Button factory.

@param {Object} ctx - Component context

@return {Function} - The Button component
*********************************************************************/
export default function Button (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;

  // Kind -> palette of color leaves. `rest` null draws no fill; `engaged`
  // replaces the content color while a highlight fill is shown; `border`
  // draws the outline of an outlined kind; `shadow` lifts the kind;
  // `inline` kinds reserve no trailing icon slot and set the icon after
  // the label
  const KINDS = Object.freeze({
    primary: { rest: 'button_primary', hover: 'button_primary_hover', active: 'button_primary_active', content: 'text_on_color' },
    secondary: { rest: 'button_secondary', hover: 'button_secondary_hover', active: 'button_secondary_active', content: 'text_on_color' },
    tertiary: { rest: null, hover: 'button_tertiary_hover', active: 'button_tertiary_active', content: 'button_tertiary', engaged: 'text_inverse', border: 'button_tertiary' },
    ghost: { rest: null, hover: 'background_hover', active: 'background_active', content: 'link_primary', inline: true },
    danger: { rest: 'button_danger_primary', hover: 'button_danger_hover', active: 'button_danger_active', content: 'text_on_color' },
    danger_tertiary: { rest: null, hover: 'button_danger_hover', active: 'button_danger_active', content: 'button_danger_secondary', engaged: 'text_on_color', border: 'button_danger_secondary' },
    danger_ghost: { rest: null, hover: 'button_danger_hover', active: 'button_danger_active', content: 'button_danger_secondary', engaged: 'text_on_color', inline: true },
    tonal: { rest: 'button_tonal', hover: 'button_tonal_hover', active: 'button_tonal_active', content: 'text_on_button_tonal' },
    elevated: { rest: 'button_elevated', hover: 'button_elevated_hover', active: 'button_elevated_active', content: 'link_primary', shadow: 'shadow.level_01' }
  });

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({
    xs: 'heightXsmall',
    sm: 'heightSmall',
    md: 'heightMedium',
    lg: 'height',
    xl: 'heightXlarge',
    '2xl': 'height2xlarge'
  });


  /********************************************************************
  The palette in effect: the kind's own, or the disabled palette, which
  keeps the kind's shape (filled or not, outlined or not, inline or not)
  and drops its shadow. A disabled filled kind draws its border in the
  disabled fill.

  @param {Object}  kind     - A KINDS entry
  @param {Boolean} disabled - Whether the button is disabled

  @return {Object} - Palette
  *********************************************************************/
  function getPalette (kind, disabled) {

    // An enabled button uses its kind's palette
    if (!disabled) {
      return kind;
    }

    // A disabled button keeps its shape in the disabled colors
    const filled = !Utils.isNullOrUndefined(kind.rest);
    const fill = filled ? 'button_disabled' : null;

    return {
      rest: fill,
      hover: fill,
      active: fill,
      content: filled ? 'text_on_color_disabled' : 'text_disabled',
      border: filled ? 'button_disabled' : Utils.isString(kind.border) ? 'border_disabled' : undefined,
      inline: kind.inline
    };

  }


  /********************************************************************
  The palette of a selected button: the selected fill with the primary
  content color, over the kind's own hover and active fills. One
  recipe for every kind, from the theme's selected-surface tokens.

  @param {Object} palette - The palette in effect

  @return {Object} - Palette
  *********************************************************************/
  function getSelectedPalette (palette) {

    return Object.assign({}, palette, { rest: 'background_selected', content: 'text_primary', engaged: undefined });

  }


  /********************************************************************
  Button component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ButtonComponent (props) {

    // Init the behavior and its state
    const button = useButton(props);
    const state = button.state;

    // Init the kind, its palette and the size
    const kind = KINDS[props.kind] || KINDS.primary;
    const resting = getPalette(kind, state.disabled);
    const palette = state.selected && !state.disabled ? getSelectedPalette(resting) : resting;
    const height = ctx.metric('Button', SIZES[props.size] || 'height');
    const radius = ctx.metric('Button', 'radius');

    // Read the theme's press presentation over the palette in effect
    const press = ctx.pressPresentation({
      disabled: state.disabled,
      focused: state.focused,
      hovered: state.hovered,
      pressed: state.pressed
    }, palette);
    const contentLeaf = press.engaged && Utils.isString(palette.engaged) ? palette.engaged : palette.content;

    // The shadow of a lifted kind, when enabled
    const shadow = Utils.isString(palette.shadow) ? ctx.token(palette.shadow) : null;

    // The label is centered up to the default height; a taller button keeps
    // the label where the default height puts it, at the top
    const labelStyle = ctx.typeStyle('button_label');
    const borderWidth = ctx.metric('Button', 'borderWidth');
    const labelTop = (Math.min(height, ctx.metric('Button', 'height')) - labelStyle.lineHeight) / 2 - borderWidth;

    // Render the icon when one is named: at the trailing edge, or after the label for an inline kind.
    // A trailing icon needs its inset, its size and a gap before it; a kind whose end padding
    // reserves less than that widens to fit (one reference reserves a slot, the other does not)
    const iconSize = ctx.metric('Button', 'iconSize');
    const hasIcon = Utils.isString(props.icon);
    const slot = ctx.metric('Button', 'iconInset') + iconSize + ctx.metric('Button', 'iconGap') - borderWidth;
    const paddingEnd = palette.inline === true ? ctx.metric('Button', 'paddingStart')
      : hasIcon ? Math.max(ctx.metric('Button', 'paddingEnd'), slot) : ctx.metric('Button', 'paddingEnd');
    const iconPlace = palette.inline === true
      ? { marginStart: ctx.metric('Button', 'iconGap'), marginTop: (labelStyle.lineHeight - iconSize) / 2 }
      : { end: ctx.metric('Button', 'iconInset'), position: 'absolute', top: labelTop + (labelStyle.lineHeight - iconSize) / 2 };
    const icon = hasIcon ? React.createElement(View, { style: iconPlace },
      React.createElement(ctx.Registry.Icon, { name: props.icon, size: iconSize, color: contentLeaf })) : null;

    // Render the root, the state layer, the label and the icon
    return React.createElement(Pressable, Object.assign({}, button.rootProps, {
      accessibilityLabel: Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : button.rootProps.accessibilityLabel,
      testID: props.testID,
      style: [
        {
          alignItems: 'flex-start',
          alignSelf: 'flex-start',
          borderColor: Utils.isString(palette.border) ? ctx.color(palette.border) : 'transparent',
          borderRadius: radius,
          borderWidth: borderWidth,
          flexDirection: 'row',
          height: height,
          paddingEnd: paddingEnd,
          paddingStart: ctx.metric('Button', 'paddingStart'),
          paddingTop: labelTop
        },
        press.container,
        shadow,
        ctx.focusPresentation(state.focused)
      ]
    }),
    React.createElement(View, {
      style: [{ borderRadius: radius, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, press.layer]
    }),
    React.createElement(Text, {
      numberOfLines: 1,
      style: [labelStyle, { color: ctx.color(contentLeaf) }]
    }, props.children),
    icon);

  }

  ButtonComponent.displayName = 'Button';

  return ButtonComponent;

}

Button.spec = SPEC;
