// Info: BreadcrumbItem member. One `li` inside the breadcrumb's ordered
// list: an `href` item is a `ctx.Registry.Link` (`visited` keeping the
// link colors), an item without one plain link-styled text; the current
// page is `aria-current="page"` in `color.breadcrumb_current` with no
// underline. The separator `/` follows every item (the last one only
// without `noTrailingSlash`), the `control.breadcrumb_gap` (`_small`) gap on
// both its sides in `color.breadcrumb_separator`. An `overflow` item
// composes `ctx.Registry.OverflowMenu`: the `overflow` glyph in the
// breadcrumb trigger box, moved `control.breadcrumb_overflow_icon_offset`
// down, ink `color.breadcrumb_overflow_icon` / `_hover` / `_active` and
// no fill; focus draws the 1 px `color.focus` outline plus the underline
// bar; the menu opens `{ top: 10, left: -13 }` off the trigger with the
// `control.breadcrumb_overflow_caret_size` caret in
// `color.breadcrumb_overflow_caret` and no connector. The last item takes
// no end gap (`_breadcrumb.scss:88-91`). A composing parent may draw an
// icon link (`icon`: the glyph alone, `label` its name and its tooltip),
// keep an item's room without drawing it (`hidden`), place it in its own
// line box (`offsetTop`, `boxHeight`) and read its width (`onLayout`).
// It must be composed inside Breadcrumb.

import SPEC from './spec.breadcrumb-item.js';


/********************************************************************
BreadcrumbItem factory.

@param {Object} ctx - Component context

@return {Function} - The BreadcrumbItem component
*********************************************************************/
export default function BreadcrumbItem (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  BreadcrumbItem component.

  @param {Object} props - See `api.breadcrumb-item.js`

  @return {Object} - React element
  *********************************************************************/
  function BreadcrumbItemComponent (props) {

    // Init the size and the gap cell the separator and the item read
    const small = props.size === 'sm';
    const metrics = {
      caretSize: ctx.metric('BreadcrumbItem', 'caretSize'),
      gap: Utils.isNumber(props.gap) ? props.gap : ctx.metric('BreadcrumbItem', small ? 'gapSmall' : 'gap'),
      linkMinWidthSmall: ctx.metric('BreadcrumbItem', 'linkMinWidthSmall'),
      overflowHeight: ctx.metric('BreadcrumbItem', small ? 'overflowHeightSmall' : 'overflowHeight'),
      overflowIconOffset: ctx.metric('BreadcrumbItem', 'overflowIconOffset'),
      overflowUnderlineWidth: ctx.metric('BreadcrumbItem', 'overflowUnderlineWidth'),
      overflowWidth: ctx.metric('BreadcrumbItem', 'overflowWidth')
    };
    const type = Utils.isString(props.typeLeaf) ? props.typeLeaf : small ? 'breadcrumb_small' : 'breadcrumb';
    const current = props.isCurrentPage === true;
    // Stacked lines keep each target to its own line: a row of
    // `control.breadcrumb_stacked_item_min_height` (0 keeps the upstream
    // line, the form classes the target floor); where the row holds the
    // floor the target fills it, else it stays at its line
    const stacked = props.stacked === true;
    const stackedMinHeight = ctx.metric('BreadcrumbItem', 'stackedMinHeight');
    const lineTarget = stacked && stackedMinHeight < ctx.metric('BreadcrumbItem', 'targetMin');

    // The content: the overflow menu, the link or the link-styled text
    let content;
    if (Utils.isArray(props.overflow)) {
      content = React.createElement(ctx.Registry.OverflowMenu, {
        caret: { colorLeaf: 'breadcrumb_overflow_caret', offsetX: metrics.overflowUnderlineWidth + 2, size: metrics.caretSize },
        connector: false,
        fillActiveLeaf: null,
        fillHoverLeaf: null,
        fillLeaf: null,
        focusRingLeaf: 'focus',
        focusRingOffset: 0,
        focusRingWidth: ctx.token('control.link_focus_width'),
        // The underline is 1 px tall, 2 px above the trigger's bottom, as upstream
        focusUnderline: { activeLeaf: 'text_primary', colorLeaf: 'focus', hoverLeaf: 'link_primary_hover', offsetStart: 2, offsetTop: metrics.overflowHeight - 3, width: metrics.overflowUnderlineWidth },
        icon: 'overflow',
        iconActiveLeaf: 'breadcrumb_overflow_icon_active',
        iconColor: 'breadcrumb_overflow_icon',
        iconDescription: 'More pages',
        iconHoverLeaf: 'breadcrumb_overflow_icon_hover',
        iconOffset: metrics.overflowIconOffset,
        iconSize: ctx.metric('BreadcrumbItem', 'iconSize'),
        items: props.overflow.map(function (entry) {
          return { href: entry.href, label: entry.label, onPress: entry.onPress };
        }),
        menuOffset: { left: -13, top: 10 },
        size: small ? 'sm' : 'md',
        triggerBlockExpansion: lineTarget ? 'none' : undefined,
        triggerHeight: metrics.overflowHeight,
        triggerWidth: metrics.overflowWidth
      });
    } else if (Utils.isString(props.icon)) {
      content = React.createElement(ctx.Registry.Tooltip, { align: 'right', label: props.label },
        React.createElement(ctx.Registry.Link, {
          accessibilityLabel: props.label,
          blockExpansion: lineTarget ? 'none' : undefined,
          href: props.href,
          icon: props.icon,
          iconColorLeaf: props.iconColorLeaf,
          onPress: props.onPress,
          size: small ? 'sm' : 'md',
          typeLeaf: type
        }, ''));
    } else if (Utils.isString(props.href)) {
      content = React.createElement(ctx.Registry.Link, {
        'aria-current': current ? 'page' : undefined,
        blockExpansion: lineTarget ? 'none' : undefined,
        href: props.href,
        minWidth: small ? metrics.linkMinWidthSmall : undefined,
        onPress: props.onPress,
        size: small ? 'sm' : 'md',
        typeLeaf: type,
        visited: props.visited === true
      }, props.label);
    } else {
      content = React.createElement(Text, {
        'aria-current': current ? 'page' : undefined,
        dir: 'auto',
        style: [ctx.typeStyle(type), { color: ctx.color(current ? 'breadcrumb_current' : 'link_primary'), textDecorationLine: 'none' }]
      }, props.label);
    }

    // Render the `li`: the content plus the separator, the gap on both
    // sides of it; `last` keeps its separator unless `noTrailingSlash` and
    // takes no end gap
    const separator = props.last === true && props.noTrailingSlash === true ? null
      : React.createElement(Text, {
        'aria-hidden': 'true',
        dir: 'auto',
        style: [ctx.typeStyle(type), { color: ctx.color('breadcrumb_separator'), marginStart: metrics.gap }]
      }, '/');
    const hidden = props.hidden === true;
    return React.createElement(View, {
      'aria-hidden': hidden ? true : undefined,
      onLayout: props.onLayout,
      role: 'listitem',
      style: {
        alignItems: Utils.isNumber(props.offsetTop) ? 'flex-start' : 'center',
        flexDirection: 'row',
        height: Utils.isNumber(props.boxHeight) ? props.boxHeight : undefined,
        marginEnd: props.last === true ? 0 : metrics.gap,
        marginTop: Utils.isNumber(props.offsetTop) ? props.offsetTop : undefined,
        minHeight: stacked && stackedMinHeight > 0 ? stackedMinHeight : undefined,
        opacity: hidden ? 0 : undefined
      }
    }, content, separator);

  }

  BreadcrumbItemComponent.displayName = 'BreadcrumbItem';

  return BreadcrumbItemComponent;

}

BreadcrumbItem.spec = SPEC;
