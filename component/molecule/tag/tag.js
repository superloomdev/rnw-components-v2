// Info: Tag molecule. A short, non-interactive label, optionally with a
// leading icon, drawn in the theme's `tag` role cells: the neutral cells at
// rest, or the hue cells a `type` names. Every color and metric comes from
// the theme; `type.tag_label` is the type. The theme's outline is painted as
// an inset shadow, so it never moves the text where the references draw it
// as an overlay.
//
// Behavior: none - a tag does not take focus or respond to input; `disabled`
// only redraws it. Ownership: this file is structure and presentation only.
//
// Accessibility: the label text is the accessible name; the icon is
// decorative. A tag is not a control, so it carries no role.

import SPEC from './spec.js';


/********************************************************************
Tag factory.

@param {Object} ctx - Component context

@return {Function} - The Tag component
*********************************************************************/
export default function Tag (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  Tag component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function TagComponent (props) {

    // Init the type, the state and the size
    const type = Utils.isString(props.type) ? props.type : null;
    const disabled = props.disabled === true;
    const large = props.size === 'lg';
    const height = ctx.metric('Tag', props.size === 'sm' ? 'heightSmall' : large ? 'heightLarge' : 'height');

    // The colors in effect: the disabled cells, or the hue's cells where a
    // type names one, or the neutral tag cells
    const leaf = disabled
      ? { container: 'tag_container_disabled', label: 'tag_label_disabled', outline: 'tag_outline_disabled', icon: 'tag_icon_disabled' }
      : {
        container: type === null ? 'tag_container' : 'tag_background_' + type,
        label: type === null ? 'tag_label' : 'tag_color_' + type,
        outline: 'tag_outline',
        icon: type === null ? 'tag_icon' : 'tag_color_' + type
      };

    // The inline padding: the icon inset shortens the start, the large size
    // widens both ends, as the references draw it
    const width = ctx.metric('Tag', 'outlineWidth');
    const paddingStart = Utils.isString(props.icon)
      ? ctx.metric('Tag', large ? 'paddingInlineLargeIcon' : 'paddingInlineIcon')
      : ctx.metric('Tag', large ? 'paddingInlineLarge' : 'paddingInline');

    // Render the container, the icon and the label. The outline is an inset
    // shadow: a border would shift the content and grow the box where the
    // references' outlines do neither
    return React.createElement(View, {
      testID: props.testID || 'tag',
      style: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: ctx.color(leaf.container),
        borderRadius: ctx.metric('Tag', 'radius'),
        boxShadow: width > 0 ? 'inset 0 0 0 ' + width + 'px ' + ctx.color(leaf.outline) : undefined,
        flexDirection: 'row',
        height: height,
        minWidth: ctx.metric('Tag', 'heightLarge'),
        overflow: 'hidden',
        paddingEnd: ctx.metric('Tag', large ? 'paddingInlineLarge' : 'paddingInline'),
        paddingStart: paddingStart
      }
    },
    Utils.isString(props.icon) ? React.createElement(View, {
      style: { paddingEnd: ctx.metric('Tag', 'iconGap') }
    }, React.createElement(ctx.Registry.Icon, {
      name: props.icon,
      size: ctx.metric('Tag', 'iconSize'),
      color: leaf.icon
    })) : null,
    React.createElement(Text, {
      numberOfLines: 1,
      style: [ctx.typeStyle('tag_label'), { color: ctx.color(leaf.label) }]
    }, props.children));

  }

  TagComponent.displayName = 'Tag';

  return TagComponent;

}

Tag.spec = SPEC;
