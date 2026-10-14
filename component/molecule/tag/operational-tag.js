// Info: OperationalTag molecule. A Tag rendered as a pressable button: the
// tag keeps its hue's fill, border and label while a press paints the
// theme's interactive layer over it and focus draws the tag family's ring.
// The tag's face is measured at layout; the pressable is a transparent layer
// of the platform's minimum target centered on it, as IconButton's is.
//
// Behavior: `useButton` on the overlay pressable - hover swaps the
// container's leaf for the hue's hover cell, a press draws the interactive
// layer, and `onPress` fires the operation.
//
// Accessibility: the pressable is a button named by the tag's label.

import SPEC from './spec.operational-tag.js';


/********************************************************************
OperationalTag factory.

@param {Object} ctx - Component context

@return {Function} - The OperationalTag component
*********************************************************************/
export default function OperationalTag (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;


  /********************************************************************
  OperationalTag component.

  @param {Object} props - See `api.operational-tag.js`

  @return {Object} - React element
  *********************************************************************/
  function OperationalTagComponent (props) {

    // Init the behavior, the hue and the interaction state; the tag's label
    // names the button
    const button = useButton(Object.assign({}, props, { accessibilityLabel: Utils.isString(props.text) ? props.text : undefined }));
    const state = button.state;
    const type = Utils.isString(props.type) ? props.type : null;
    const disabled = state.disabled === true;
    const live = !disabled;
    const [faceSize, onLayout] = ctx.useFaceSize();

    // The leaves the Tag draws: the hue's own where a type names one, the
    // neutral tag cells without one; the hue's hover while hovered (a
    // press keeps it - the primary draws no pressed fill, its layer paints
    // instead), the disabled cells when disabled
    const containerLeaf = disabled ? 'tag_container_disabled'
      : live && state.hovered === true ? (type === null ? 'tag_container_hover' : 'tag_hover_' + type)
        : (type === null ? 'tag_container' : 'tag_background_' + type);
    const textLeaf = disabled ? 'tag_label_disabled' : type === null ? 'tag_label' : 'tag_color_' + type;
    const iconLeaf = type === null
      ? (disabled ? 'tag_icon_disabled' : 'tag_icon')
      : textLeaf;
    const borderLeaf = disabled ? 'tag_interactive_outline_disabled' : type === null ? 'tag_interactive_outline' : 'tag_border_' + type;

    // The tag with the real border the interactive tags draw; the pressed
    // layer covers the face in the theme's interactive layer color, the
    // ring sits on the root and follows the tag's corner
    return React.createElement(View, {
      onLayout: onLayout,
      style: [{ alignSelf: 'flex-start', borderRadius: ctx.metric('Tag', 'radius') }, ctx.focusRing('tag', state)]
    },
    React.createElement(ctx.Registry.Tag, {
      children: Utils.isString(props.text) ? props.text : '',
      containerLeaf: containerLeaf,
      disabled: props.disabled === true,
      height: props.size === 'sm' ? ctx.metric('OperationalTag', 'interactiveHeightSmall') : undefined,
      icon: props.icon,
      iconLeaf: iconLeaf,
      labelLeaf: textLeaf,
      outlineInLayout: ctx.enum('anatomy.tag_interactive_outline') === 'border',
      outlineLeaf: borderLeaf,
      outlineWidth: ctx.metric('OperationalTag', 'outlineWidth'),
      size: props.size
    }),
    React.createElement(View, {
      style: {
        backgroundColor: live && state.pressed === true ? ctx.color('tag_interactive_layer_active') : undefined,
        borderRadius: ctx.metric('Tag', 'radius'),
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        right: 0,
        top: 0
      }
    }),
    React.createElement(Pressable, Object.assign({}, button.rootProps, {
      testID: props.testID,
      style: ctx.pressTarget(faceSize)
    })));

  }

  OperationalTagComponent.displayName = 'OperationalTag';

  return OperationalTagComponent;

}

OperationalTag.spec = SPEC;
