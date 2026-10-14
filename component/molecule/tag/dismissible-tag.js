// Info: DismissibleTag molecule. A Tag with a close control at its end:
// the `anatomy.tag_close` enum picks the drawing - `circle` mounts a
// circular button of the tag's height (the primary's filter tag), `inset`
// mounts the close glyph on the trailing-action layer circle the second
// system's input chip draws. The control names itself `title`, shows it in
// a compact tooltip and calls `onClose` on press.
//
// Behavior: `useButton` on the close control - hover, press and focus drive
// the face's paint. The tag's label is not interactive; the close control
// is the only target, its pressable a transparent layer of the platform's
// minimum target centered on the face.
//
// Accessibility: the control is a button named by `title`; the tooltip
// describes it. `disabled` disables the control and redraws the tag.

import SPEC from './spec.dismissible-tag.js';

// The default close control name (the primary's `title` default)
const DEFAULT_TITLE = 'Dismiss';


/********************************************************************
DismissibleTag factory.

@param {Object} ctx - Component context

@return {Function} - The DismissibleTag component
*********************************************************************/
export default function DismissibleTag (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;


  /********************************************************************
  DismissibleTag component.

  @param {Object} props - See `api.dismissible-tag.js`

  @return {Object} - React element
  *********************************************************************/
  function DismissibleTagComponent (props) {

    // Init the label, the hue, the close anatomy and the interaction state
    const text = Utils.isString(props.text) ? props.text : '';
    const type = Utils.isString(props.type) ? props.type : null;
    const disabled = props.disabled === true;
    const title = Utils.isString(props.title) ? props.title : DEFAULT_TITLE;
    const inset = ctx.enum('anatomy.tag_close') === 'inset';
    const button = useButton({ accessibilityLabel: title, disabled: disabled, onPress: props.onClose });
    const state = button.state;
    const live = state.disabled !== true;
    const hovered = live && state.hovered === true;
    const pressed = live && state.pressed === true;
    const focused = live && state.focused === true;

    // The face: a square of the tag's height for `circle`; the second
    // system's trailing action layers a circle of 4/3 the icon under the
    // glyph (`chips/internal/_trailing-icon.scss`) for `inset` - capped at
    // the tag's height and centered on it, so the glyph's box never over-
    // flows the tag
    const iconSize = ctx.metric('DismissibleTag', 'closeIconSize');
    const tagHeight = ctx.metric('DismissibleTag', props.size === 'sm' ? 'heightSmall' : props.size === 'lg' ? 'heightLarge' : 'height');
    const faceSide = inset ? Math.min(iconSize * 4 / 3, tagHeight) : tagHeight;

    // The gap ahead of the control; the `circle` small size widens it by
    // half the height drop from `md` (the primary's five at `sm`). For
    // `inset` the face is the layer circle centered on the glyph: it over-
    // hangs the icon by the bleed on both sides, so the gap narrows by the
    // bleed and the face reaches that far past the inset padding
    const bleed = inset ? (faceSide - iconSize) / 2 : 0;
    const gap = ctx.metric('DismissibleTag', 'closeGap') - bleed + (inset || props.size !== 'sm'
      ? 0
      : (ctx.metric('DismissibleTag', 'height') - ctx.metric('DismissibleTag', 'heightSmall')) / 2);

    // The face fill: `circle` paints its hover cell - the hue's for a typed
    // tag, the close cell for a neutral one - and its primary draws no
    // pressed fill, so the hover stays through a press; `inset` layers the
    // close hover cell while hovered and the theme's interactive layer
    // while pressed, as the second's trailing action does
    const fill = !live ? undefined
      : pressed && inset ? ctx.color('tag_interactive_layer_active')
        : hovered ? ctx.color(inset || type === null ? 'tag_close_container_hover' : 'tag_hover_' + type)
          : undefined;

    // The ring: `circle` draws the primary's inset shadow in the close
    // focus ring color on any focus; `inset` draws the tag family's outline
    // ring on the action circle, as the second's focus ring does
    const ring = focused
      ? (inset
        ? ctx.focusRing('tag', { focused: true, focusVisible: state.focusVisible })
        : { boxShadow: 'inset 0 0 0 ' + ctx.metric('DismissibleTag', 'focusRingWidth') + 'px ' + ctx.color('tag_close_focus_ring') })
      : {};

    // The glyph: the close icon at the theme's close icon size, in the
    // disabled icon leaf or the label's own (the hue's for a typed tag)
    const glyphLeaf = disabled ? 'tag_icon_disabled' : type === null ? 'tag_label' : 'tag_color_' + type;

    // Render the control: the painted circle face, its glyph and the
    // transparent pressable the target rule asks for, wrapped in the
    // tooltip that names it
    const control = React.createElement(View, {
      testID: 'tag-close-face',
      style: [Object.assign({
        alignItems: 'center',
        alignSelf: inset ? 'center' : undefined,
        backgroundColor: fill,
        borderRadius: faceSide / 2,
        height: faceSide,
        justifyContent: 'center',
        marginEnd: -bleed,
        marginStart: gap,
        width: faceSide
      }, ring)]
    },
    React.createElement(ctx.Registry.Icon, {
      color: glyphLeaf,
      name: 'close',
      size: iconSize
    }),
    React.createElement(Pressable, Object.assign({}, button.rootProps, {
      style: ctx.pressTarget({ height: faceSide, width: faceSide })
    })));

    return React.createElement(ctx.Registry.Tag, {
      children: text,
      disabled: disabled,
      icon: props.icon,
      labelLeaf: type === null && !disabled ? 'tag_dismissible_label' : undefined,
      paddingEnd: inset ? ctx.metric('DismissibleTag', 'closeInset') : 0,
      size: props.size,
      testID: props.testID,
      trailing: React.createElement(ctx.Registry.Tooltip, {
        align: 'bottom',
        compact: true,
        label: title,
        leaveDelayMs: 0
      }, control),
      type: type === null ? undefined : type
    });

  }

  DismissibleTagComponent.displayName = 'DismissibleTag';

  return DismissibleTagComponent;

}

DismissibleTag.spec = SPEC;
