// Info: SideNavLinkText member. A side navigation link's text
// (`ui-shell/side-nav/_side-nav.scss:364-375`): one line truncated at its
// end, `type.side_nav_link` (`type.side_nav_menu_link` in a menu, but a
// current link's text keeps the heavier set, `:325-334`) in
// `color.side_nav_link_label`, `color.side_nav_link_label_hover` under the
// pointer and `color.side_nav_link_label_selected` when current
// (`:174-183,388-392`). In a navigation narrower than full (a closed rail,
// a 0-wide one) it is not drawn: upstream's run lies past the edge,
// clipped. It must be composed inside a SideNavLink or a SideNavMenuItem.

import SPEC from './spec.side-nav-link-text.js';
import { createLinkContext } from './side-nav-context.js';


/********************************************************************
SideNavLinkText factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavLinkText component
*********************************************************************/
export default function SideNavLinkText (ctx) {

  const React = ctx.React;
  const { Text } = ctx.ReactNative;
  const LinkContext = createLinkContext(ctx);


  /********************************************************************
  SideNavLinkText component.

  @param {Object} props - See `api.side-nav-link-text.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavLinkTextComponent (props) {

    const link = React.useContext(LinkContext);
    let color = 'side_nav_link_label';
    if (link.current === true) {
      color = 'side_nav_link_label_selected';
    } else if (link.hovered === true) {
      color = 'side_nav_link_label_hover';
    }
    return React.createElement(Text, {
      dir: 'auto',
      numberOfLines: 1,
      style: [ctx.typeStyle(link.inMenu === true && link.current !== true ? 'side_nav_menu_link' : 'side_nav_link'), { color: ctx.color(color), flexShrink: 1, opacity: link.collapsed === true ? 0 : 1 }]
    }, props.children);

  }

  SideNavLinkTextComponent.displayName = 'SideNavLinkText';

  return SideNavLinkTextComponent;

}

SideNavLinkText.spec = SPEC;
