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
    const height = Utils.isNumber(props.height) ? props.height : ctx.metric('Tag', props.size === 'sm' ? 'heightSmall' : large ? 'heightLarge' : 'height');

    // The colors in effect: a composing parent's leaf, or the disabled
    // cells, or the hue's cells where a type names one, or the neutral tag
    // cells
    const computed = disabled
      ? { container: 'tag_container_disabled', label: 'tag_label_disabled', outline: 'tag_outline_disabled', icon: 'tag_icon_disabled' }
      : {
        container: type === null ? 'tag_container' : 'tag_background_' + type,
        label: type === null ? 'tag_label' : 'tag_color_' + type,
        outline: 'tag_outline',
        icon: type === null ? 'tag_icon' : 'tag_color_' + type
      };
    const leaf = {
      container: Utils.isString(props.containerLeaf) ? props.containerLeaf : computed.container,
      icon: Utils.isString(props.iconLeaf) ? props.iconLeaf : computed.icon,
      label: Utils.isString(props.labelLeaf) ? props.labelLeaf : computed.label,
      outline: computed.outline
    };

    // The inline padding: the icon inset shortens the start, the large size
    // widens both ends, as the references draw it
    const width = ctx.metric('Tag', 'outlineWidth');
    // A hidden icon seat mounts the tree but takes no space, so the icon
    // padding answers a drawn icon, not a mounted one (the selectable
    // tag's hidden selected mark)
    const paddingStart = Utils.isNumber(props.paddingStart) ? props.paddingStart
      : Utils.isString(props.icon) && props.iconHidden !== true
        ? ctx.metric('Tag', large ? 'paddingInlineLargeIcon' : 'paddingInlineIcon')
        : ctx.metric('Tag', large ? 'paddingInlineLarge' : 'paddingInline');

    // A composing parent's outline (the interactive tags): `outlineInLayout`
    // draws it as a real border the box grows by, as the primary's
    // border-box tags do; otherwise the outline is the inset shadow the
    // tag's own outline uses, moving nothing
    const outlined = Utils.isNumber(props.outlineWidth);
    const inLayout = outlined && props.outlineInLayout === true;
    const outlineWidth = outlined ? props.outlineWidth : width;
    const outlineLeaf = Utils.isString(props.outlineLeaf) ? props.outlineLeaf : leaf.outline;

    // Render the container, the icon and the label. The root does not
    // clip: a press target wider than the tag inside it would be scrolled
    // into view by a pointer move or a focus(), shifting the content. The
    // label sits in a clip seat: a type whose line box stands taller than
    // the tag (the second system's small chip) must not paint outside the
    // tag's box, and the seat keeps the line centered where it stood
    return React.createElement(View, {
      testID: props.testID || 'tag',
      style: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: ctx.color(leaf.container),
        borderColor: inLayout ? ctx.color(outlineLeaf) : undefined,
        borderRadius: ctx.metric('Tag', 'radius'),
        borderWidth: inLayout ? props.outlineWidth : undefined,
        boxShadow: !inLayout && outlineWidth > 0 ? 'inset 0 0 0 ' + outlineWidth + 'px ' + ctx.color(outlineLeaf) : undefined,
        flexDirection: 'row',
        minHeight: height,
        minWidth: ctx.metric('Tag', 'heightLarge'),
        overflow: 'visible',
        paddingEnd: Utils.isNumber(props.paddingEnd) ? props.paddingEnd : ctx.metric('Tag', large ? 'paddingInlineLarge' : 'paddingInline'),
        paddingStart: paddingStart
      }
    },
    // The icon seat mounts under every theme where a parent asks for it:
    // `iconHidden` mounts it undrawn (no space), so the element tree is the
    // same whichever anatomy a theme picks - as the list's hidden mark seat
    Utils.isString(props.icon) ? React.createElement(View, {
      style: { display: props.iconHidden === true ? 'none' : 'flex', paddingEnd: ctx.metric('Tag', 'iconGap') }
    }, React.createElement(ctx.Registry.Icon, {
      name: props.icon,
      size: ctx.metric('Tag', 'iconSize'),
      color: leaf.icon
    })) : null,
    React.createElement(View, {
      style: {
        alignSelf: 'stretch',
        flexShrink: 1,
        justifyContent: 'center',
        minWidth: 0,
        overflow: 'hidden'
      }
    }, React.createElement(Text, {
      numberOfLines: 1,
      style: [ctx.typeStyle('tag_label'), { color: ctx.color(leaf.label) }]
    }, props.children)),
    props.trailing === undefined || props.trailing === null ? null : props.trailing);

  }

  TagComponent.displayName = 'Tag';

  return TagComponent;

}

Tag.spec = SPEC;
