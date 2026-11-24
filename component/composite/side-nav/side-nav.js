// Info: SideNav composite. The UI shell's side navigation: a `navigation`
// landmark in flow beside the page, as wide as it is drawn, on
// `color.side_nav_container`. The drawn width follows the window and the
// props (`ui-shell/side-nav/_side-nav.scss:30-117`): open,
// `control.side_nav_width`; closed, a rail is `control.side_nav_rail_width`,
// a fixed or not persistent navigation is not drawn, and a persistent one
// is `control.side_nav_width` from `breakpoint.lg`, read from the window,
// and not drawn below it. Open below lg and not fixed it lays
// `color.side_nav_overlay` over the window from its own top
// (`:77-101`); pressing it calls `onOverlayClick`. A rail opens while the
// pointer is over it; Escape closes. It draws its `items` in one
// SideNavItems, then its children.

import SPEC from './spec.side-nav.js';
import { createNavigationContext } from './side-nav-context.js';


/********************************************************************
SideNav factory.

@param {Object} ctx - Component context

@return {Function} - The SideNav component
*********************************************************************/
export default function SideNav (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const { useEscapeKey, useViewportSize } = ctx.behaviors;
  const NavigationContext = createNavigationContext(ctx);


  /********************************************************************
  SideNav component.

  @param {Object} props - See `api.side-nav.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavComponent (props) {

    // The open state: the caller's when `expanded` is given
    const controlled = typeof props.expanded === 'boolean';
    const [own, setOwn] = React.useState(props.defaultExpanded === true);
    const [pointed, setPointed] = React.useState(false);
    const expanded = controlled ? props.expanded : own;
    const rail = props.isRail === true;
    const fixed = props.isFixedNav === true;
    const onToggle = props.onToggle;
    const toggle = React.useCallback(function (value) {
      if (!controlled) {
        setOwn(value);
      }
      if (Utils.isFunction(onToggle)) {
        onToggle(value);
      }
    }, [controlled, onToggle]);
    useEscapeKey(function () {
      setPointed(false);
      toggle(false);
    }, expanded || pointed);

    // The drawn width, in the cascade's order (`_side-nav.scss:30-117`):
    // open is full (`:73-75`); closed, fixed is moved out (`:114-117`), not
    // persistent is 0 (`:69-71`), a rail is the rail (`:65-67`), else full
    // from lg and 0 below it (`:48-55`); an unknown window is wide
    const viewport = useViewportSize();
    const wide = !(viewport.width > 0 && viewport.width < ctx.metric('SideNav', 'bpLg'));
    const open = expanded || (rail && pointed);
    const full = ctx.metric('SideNav', 'width');
    let width = 0;
    if (open) {
      width = full;
    } else if (!fixed && props.isPersistent !== false) {
      width = rail ? ctx.metric('SideNav', 'railWidth') : wide ? full : 0;
    }

    // Open below lg, the overlay covers the window from the navigation's
    // top, under it (`:90-101`)
    const overlay = open && !fixed && !wide ? React.createElement(Pressable, {
      'aria-hidden': true,
      accessibilityRole: 'none',
      dataSet: { part: 'overlay' },
      focusable: false,
      key: 'overlay',
      onPress: props.onOverlayClick,
      style: { backgroundColor: ctx.color('side_nav_overlay'), height: viewport.height, position: 'absolute', start: 0, top: 0, width: viewport.width }
    }) : null;
    const entries = Utils.isArray(props.items) && !Utils.isEmptyArray(props.items)
      ? React.createElement(ctx.Registry.SideNavItems, { items: props.items, key: 'items' })
      : null;
    const context = React.useMemo(function () {
      return Object.freeze({ expanded: open, hasIcon: false, inMenu: false, isRail: rail, large: false });
    }, [open, rail]);

    return React.createElement(NavigationContext.Provider, { value: context },
      React.createElement(View, {
        'aria-label': props.accessibilityLabel,
        onPointerEnter: rail ? function () {
          setPointed(true);
        } : undefined,
        onPointerLeave: rail ? function () {
          setPointed(false);
        } : undefined,
        role: 'navigation',
        testID: props.testID,
        style: { position: 'relative', width: width, zIndex: ctx.metric('SideNav', 'level') }
      },
      overlay,
      React.createElement(View, {
        key: 'panel',
        style: { backgroundColor: ctx.color('side_nav_container'), flexGrow: 1, overflow: 'hidden', width: width }
      }, entries, props.children)));

  }

  SideNavComponent.displayName = 'SideNav';

  return SideNavComponent;

}

SideNav.spec = SPEC;
