// Info: SideNavItem measurement reference. Upstream draws an
// `li.cds--side-nav__item` holding text in the navigation's inherited
// color and the page's type, in the navigation and list the sample's
// wrappers name.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SideNavItem, null, props.children);
  },
  parts: Object.freeze({
    item: Object.freeze({ upstream: 'li.cds--side-nav__item', ours: 'nav [role="listitem"]', measure: 'box' }),
    text: Object.freeze({ upstream: 'li.cds--side-nav__item', ours: 'nav [role="listitem"] > [dir="auto"]', measure: 'text' })
  })
});
