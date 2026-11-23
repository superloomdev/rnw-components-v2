// Info: HeaderMenu member. One `li` of the header's menu bar holding a
// title that opens a list of links under it: the title is the menu bar
// link's seat (`control.header_menu_item_padding_inline`, the focus border,
// the `type.header_menu_item` label in `color.header_menu_item_label` over
// `color.header_menu_item_container`, `_hover`, `_active`) with the
// `chevron_down` arrow at `size.icon_01` in `color.header_menu_arrow`,
// `control.header_menu_arrow_gap` after the label. A press, Enter or Space
// opens it: the title takes `color.header_menu_container`, the arrow turns
// over, and the `control.header_menu_width` list hangs from the title's
// bottom start on the same fill with `shadow.header_menu`, its rows
// HeaderMenuItem `inMenu`. Escape closes it and returns focus to the
// title; focus leaving the menu closes it. A closed menu holding a current
// link (or `isActive`) draws its title current. It must be composed inside
// Header, in HeaderNavigation.

import SPEC from './spec.header-menu.js';


/********************************************************************
HeaderMenu factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderMenu component
*********************************************************************/
export default function HeaderMenu (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { focusNode, nodeContains, useEscapeKey, useInteractionState } = ctx.behaviors;


  /********************************************************************
  HeaderMenu component.

  @param {Object} props - See `api.header-menu.js`

  @return {Object} - React element
  *********************************************************************/
  function HeaderMenuComponent (props) {

    // Init the open state, the interaction state and the refs focus needs
    const [open, setOpen] = React.useState(false);
    const rootRef = React.useRef(null);
    const titleRef = React.useRef(null);
    const items = Utils.isArray(props.items) ? props.items : [];

    // Focus that leaves the menu closes it (`HeaderMenu.tsx` `handleOnBlur`)
    const onBlur = function (event) {
      const next = event === undefined || event === null || event.nativeEvent === undefined ? undefined : event.nativeEvent.relatedTarget;
      if (next === null || next === undefined || !nodeContains(rootRef.current, next)) {
        setOpen(false);
      }
    };
    const interaction = useInteractionState({
      onBlur: onBlur,
      onPress: function () {
        setOpen(function (previous) {
          return !previous;
        });
      }
    });
    const state = interaction.state;

    // Escape closes the open menu and gives the title its focus back
    useEscapeKey(function () {
      setOpen(false);
      focusNode(titleRef.current);
    }, open);

    // A closed menu holding a current link draws its title current
    const descendantCurrent = items.some(function (item) {
      return item.isActive === true;
    });
    const current = props.isActive === true || (descendantCurrent && !open);
    const focusWidth = ctx.metric('HeaderMenu', 'focusWidth');
    const phase = state.pressed ? 'active' : state.hovered ? 'hover' : 'enabled';
    const fill = open ? ctx.color('header_menu_container') : ctx.color(ctx.stateLeaf('header_menu_item_container', phase));
    const labelLeaf = open ? 'header_menu_item_label' : state.pressed ? 'header_menu_item_label_active' : state.hovered ? 'header_menu_item_label_hover' : 'header_menu_item_label';

    // The title: the label, the arrow (turned over while open,
    // `_header.scss:357-360`) and the current bar under it
    const title = React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      'aria-expanded': open,
      'aria-haspopup': 'menu',
      'aria-label': props.accessibilityLabel,
      accessibilityRole: 'link',
      key: 'title',
      onKeyDown: function (event) {
        if (event.key === ' ') {
          event.preventDefault();
          setOpen(function (previous) {
            return !previous;
          });
        }
      },
      ref: titleRef,
      testID: props.testID,
      style: {
        alignItems: 'center',
        backgroundColor: fill,
        borderColor: state.focused ? ctx.color('focus') : 'transparent',
        borderWidth: focusWidth,
        flexDirection: 'row',
        flexGrow: 1,
        outlineStyle: 'none',
        paddingHorizontal: ctx.metric('HeaderMenu', 'paddingInline'),
        position: 'relative'
      }
    }),
    React.createElement(Text, {
      dir: 'auto',
      key: 'label',
      numberOfLines: 1,
      style: [ctx.typeStyle('header_menu_item'), { color: ctx.color(labelLeaf) }]
    }, props.menuLinkName),
    React.createElement(View, {
      key: 'arrow',
      style: { marginStart: ctx.metric('HeaderMenu', 'arrowGap'), transform: [{ rotate: (open ? 180 : 0) + 'deg' }] }
    }, React.createElement(ctx.Registry.Icon, { color: 'header_menu_arrow', name: 'chevron_down', size: ctx.metric('HeaderMenu', 'arrowSize') })),
    current ? React.createElement(View, {
      'aria-hidden': true,
      key: 'indicator',
      style: { backgroundColor: ctx.color('header_menu_item_indicator'), bottom: -focusWidth, end: -focusWidth, height: ctx.metric('HeaderMenu', 'indicatorWidth'), position: 'absolute', start: -focusWidth }
    }) : null);

    // The open list hangs from the title's bottom start (`_header.scss:369-381`)
    const list = open ? React.createElement(View, {
      'aria-label': Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : props.menuLinkName,
      key: 'menu',
      role: 'list',
      style: Object.assign({
        backgroundColor: ctx.color('header_menu_container'),
        flexDirection: 'column',
        position: 'absolute',
        start: 0,
        top: '100%',
        width: ctx.metric('HeaderMenu', 'menuWidth')
      }, ctx.token('shadow.header_menu'))
    }, items.map(function (item, index) {
      return React.createElement(ctx.Registry.HeaderMenuItem, {
        href: item.href,
        inMenu: true,
        isActive: item.isActive,
        key: index,
        onBlur: onBlur,
        onPress: item.onPress
      }, item.label);
    })) : null;

    return React.createElement(View, {
      ref: rootRef,
      role: 'listitem',
      style: { flexDirection: 'row', position: 'relative', zIndex: open ? 1 : undefined }
    }, title, list);

  }

  HeaderMenuComponent.displayName = 'HeaderMenu';

  return HeaderMenuComponent;

}

HeaderMenu.spec = SPEC;
