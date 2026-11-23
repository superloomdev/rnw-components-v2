// Info: HeaderSideNavItems member. The header's links again, for the side
// navigation of a narrow window: below `breakpoint.lg`, read from the
// window, a list of HeaderMenuItem lines (`stacked`) from `items`, then its
// children, with `control.header_side_nav_items_space` under it; with
// `hasDivider` a `border.width_01` rule in `color.header_border` halfway
// into that space, `control.header_side_nav_divider_inset` in from each
// side (`_side-nav.scss:466-486`). From lg it draws nothing: the header's
// own menu bar shows the links.

import SPEC from './spec.header-side-nav-items.js';


/********************************************************************
HeaderSideNavItems factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderSideNavItems component
*********************************************************************/
export default function HeaderSideNavItems (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useViewportSize } = ctx.behaviors;


  /********************************************************************
  HeaderSideNavItems component.

  @param {Object} props - See `api.header-side-nav-items.js`

  @return {Object|null} - React element, or null from `breakpoint.lg`
  *********************************************************************/
  function HeaderSideNavItemsComponent (props) {

    // From lg the list is not drawn; an unknown window is wide
    const viewport = useViewportSize();
    if (!(viewport.width > 0 && viewport.width < ctx.metric('HeaderSideNavItems', 'bpLg'))) {
      return null;
    }
    const items = Utils.isArray(props.items) ? props.items : [];
    const inset = ctx.metric('HeaderSideNavItems', 'inset');

    return React.createElement(View, {
      role: 'list',
      testID: props.testID,
      style: { marginBottom: ctx.metric('HeaderSideNavItems', 'space'), position: 'relative' }
    },
    items.map(function (item, index) {
      return React.createElement(ctx.Registry.HeaderMenuItem, { href: item.href, isActive: item.isActive, key: index, onPress: item.onPress, stacked: true }, item.label);
    }),
    props.children,
    props.hasDivider === true ? React.createElement(View, {
      'aria-hidden': true,
      key: 'divider',
      style: { backgroundColor: ctx.color('header_border'), bottom: -inset, end: inset, height: ctx.metric('HeaderSideNavItems', 'ruleWidth'), position: 'absolute', start: inset }
    }) : null);

  }

  HeaderSideNavItemsComponent.displayName = 'HeaderSideNavItems';

  return HeaderSideNavItemsComponent;

}

HeaderSideNavItems.spec = SPEC;
