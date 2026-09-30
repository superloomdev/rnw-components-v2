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
  // draws the outline of an outlined kind; `shadow` lifts the kind
  const KINDS = Object.freeze({
    primary: { rest: 'button_primary', hover: 'button_primary_hover', active: 'button_primary_active', content: 'text_on_color' },
    secondary: { rest: 'button_secondary', hover: 'button_secondary_hover', active: 'button_secondary_active', content: 'text_on_color' },
    tertiary: { rest: null, hover: 'button_tertiary_hover', active: 'button_tertiary_active', content: 'button_tertiary', engaged: 'text_inverse', border: 'button_tertiary' },
    ghost: { rest: null, hover: 'background_hover', active: 'background_active', content: 'link_primary' },
    danger: { rest: 'button_danger_primary', hover: 'button_danger_hover', active: 'button_danger_active', content: 'text_on_color' },
    danger_tertiary: { rest: null, hover: 'button_danger_hover', active: 'button_danger_active', content: 'button_danger_secondary', engaged: 'text_on_color', border: 'button_danger_secondary' },
    danger_ghost: { rest: null, hover: 'button_danger_hover', active: 'button_danger_active', content: 'button_danger_secondary', engaged: 'text_on_color' },
    tonal: { rest: 'layer_accent_01', hover: 'layer_accent_hover_01', active: 'layer_accent_active_01', content: 'text_primary' },
    elevated: { rest: 'layer_01', hover: 'layer_hover_01', active: 'layer_active_01', content: 'interactive', shadow: 'shadow.level_01' }
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
  keeps the kind's shape (filled or not, outlined or not) and drops its
  shadow.

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
      border: Utils.isString(kind.border) ? 'border_disabled' : undefined
    };

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
    const palette = getPalette(kind, state.disabled);
    const height = ctx.metric('Button', SIZES[props.size] || 'height');
    const radius = ctx.metric('Button', 'radius');

    // Read the theme's press presentation; a selected button shows its pressed fill
    const press = ctx.pressPresentation({
      disabled: state.disabled,
      focused: state.focused,
      hovered: state.hovered,
      pressed: state.pressed || state.selected
    }, palette);
    const contentLeaf = press.engaged && Utils.isString(palette.engaged) ? palette.engaged : palette.content;

    // The shadow of a lifted kind, when enabled
    const shadow = Utils.isString(palette.shadow) ? ctx.token(palette.shadow) : null;

    // Render the trailing icon when one is named
    const iconSize = ctx.metric('Button', 'iconSize');
    const icon = Utils.isString(props.icon) ? React.createElement(View, {
      style: { end: ctx.metric('Button', 'iconInset'), position: 'absolute' }
    }, React.createElement(ctx.Registry.Icon, { name: props.icon, size: iconSize, color: contentLeaf })) : null;

    // Render the root, the state layer, the label and the icon
    return React.createElement(Pressable, Object.assign({}, button.rootProps, {
      accessibilityLabel: Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : button.rootProps.accessibilityLabel,
      testID: props.testID,
      style: [
        {
          alignItems: 'center',
          alignSelf: 'flex-start',
          borderColor: Utils.isString(palette.border) ? ctx.color(palette.border) : 'transparent',
          borderRadius: radius,
          borderWidth: ctx.metric('Button', 'borderWidth'),
          flexDirection: 'row',
          height: height,
          paddingEnd: ctx.metric('Button', 'paddingEnd'),
          paddingStart: ctx.metric('Button', 'paddingStart')
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
      style: [ctx.typeStyle('body_compact_01'), { color: ctx.color(contentLeaf) }]
    }, props.children),
    icon);

  }

  ButtonComponent.displayName = 'Button';

  return ButtonComponent;

}

Button.spec = SPEC;
