// Info: PasswordInput molecule, the text-input family's secure member. The
// shared field anatomy - label, frame (input, invalid icon), message - plus
// one trailing action that reveals or hides the value. Revealing changes
// nothing else: value, caret and validation keep their owners. The action's
// painted face sits on the field's edge under the theme's
// `anatomy.field_action` choice, its invisible press target never smaller
// than the platform's minimum.
//
// Behavior: `useTextField` owns text, focus, hover and validation;
// `useDisclosure` owns visibility (`visible`/`defaultVisible`/
// `onVisibilityChange`); `useButton` owns the action's press state.

import SPEC from './spec.password-input.js';
import createFieldParts from './field-parts.js';


/********************************************************************
PasswordInput factory.

@param {Object} ctx - Component context

@return {Function} - The PasswordInput component
*********************************************************************/
export default function PasswordInput (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useTextField, useButton, useDisclosure } = ctx.behaviors;
  const { renderField, FieldAction, actionGeometry } = createFieldParts(ctx);

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });

  // The toggle's palette: the password action's own container cells
  const PALETTE = Object.freeze({
    '': null,
    _active: 'password_toggle_container_active',
    _disabled: null,
    _focus: null,
    _hover: 'password_toggle_container_hover',
    _selected: null
  });


  /********************************************************************
  PasswordInput component.

  @param {Object} props - See `api.password-input.js`

  @return {Object} - React element
  *********************************************************************/
  function PasswordInputComponent (props) {

    // Init the behaviors and their state; a disabled field is never invalid
    const field = useTextField(Object.assign({}, props, { invalid: props.invalid === true && props.disabled !== true }));
    const state = field.state;
    const invalid = state.invalid;
    const visibility = useDisclosure({
      open: props.visible,
      defaultOpen: props.defaultVisible === true,
      onOpenChange: props.onVisibilityChange,
      disabled: state.disabled
    });
    const visible = visibility.state.open;
    const actionLabel = visible
      ? (Utils.isString(props.hidePasswordLabel) ? props.hidePasswordLabel : 'Hide password')
      : (Utils.isString(props.showPasswordLabel) ? props.showPasswordLabel : 'Show password');
    const toggle = useButton({
      accessibilityLabel: actionLabel,
      disabled: state.disabled,
      onPress: visibility.toggle
    });

    // Read the geometry and the theme's field presentation
    const height = ctx.metric('PasswordInput', SIZES[props.size] || 'height');
    const geometry = actionGeometry('PasswordInput', height);
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled,
      focused: state.focused,
      hovered: state.hovered,
      invalid: invalid,
      populated: state.populated
    }, {
      member: 'text_input',
      height: height,
      radius: ctx.metric('PasswordInput', 'radius'),
      surface: surface,
      trailing: true
    });

    // The frame's end padding is one action slot in from the outer edge;
    // while invalid the in-flow error icon lands just inside it, leaving the
    // text the slot, the icon and the icon's gap, as the primary lays it out
    const reserve = geometry.slotWidth - presentation.borderSide;

    // The action on the frame's end edge, wrapped in the naming tooltip.
    // The field-high slot gives the tooltip's anchor a real box - an
    // absolutely-seated child would leave the anchor zero height and drop
    // the bubble over the face - so the action runs in-flow inside it
    const action = React.createElement(View, {
      style: { end: 0, height: height, position: 'absolute', top: 0, width: geometry.slotWidth }
    }, React.createElement(ctx.Registry.Tooltip, {
      align: Utils.isString(props.tooltipAlign) ? props.tooltipAlign : 'bottom-end',
      compact: true,
      label: actionLabel
    }, React.createElement(FieldAction, {
      button: toggle,
      geometry: geometry,
      height: height,
      icon: visible ? 'visibility_off' : 'visibility_on',
      iconColor: state.disabled ? 'field_indicator_disabled' : 'field_indicator',
      palette: PALETTE,
      seated: false,
      testID: 'password-toggle'
    })));

    return renderField({
      owner: 'PasswordInput',
      props: props,
      field: field,
      presentation: presentation,
      frameStyle: { paddingEnd: reserve },
      inputProps: { secureTextEntry: !visible },
      overlays: action
    });

  }

  PasswordInputComponent.displayName = 'PasswordInput';

  return PasswordInputComponent;

}

PasswordInput.spec = SPEC;
