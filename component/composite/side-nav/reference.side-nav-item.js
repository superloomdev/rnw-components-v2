// Info: SideNavItem measurement reference. Upstream draws an
// `li.cds--side-nav__item` holding text in the navigation's inherited
// color and the page's default type (no rule of the item's), in the
// navigation and list the sample's wrappers name; the item's box is
// compared but its height.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SideNavItem, null, props.children);
  },
  parts: Object.freeze({
    // The height is the text's line: upstream's item has no text rule and
    // its text takes the page's default type, ours the navigation's
    item: Object.freeze({ upstream: 'li.cds--side-nav__item', ours: 'nav [role="listitem"]', measure: 'box', compare: ['x', 'y', 'width', 'backgroundColor'], except: ['height'] })
  })
});
