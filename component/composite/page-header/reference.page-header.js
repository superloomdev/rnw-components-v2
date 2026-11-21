// Info: PageHeader measurement reference - the product-patterns PageHeader:
// the breadcrumb row, the title row, subtitle and tags. The mount passes
// what the probe mount passes: a row's prop only when the state draws it,
// breadcrumbs as `{ href, key, label, title }`, actions with their kind.
export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 1280 }),
  // Below md the header follows its action-bar rules, read from the window
  // (`PageHeader.js:207` `innerWidth / 16 < md`, `_page-header.scss:283-297`): the
  // narrow set draws a 320 body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  mount: function (React, upstream, props) {
    // The header reads its nearest scrolling ancestor's offset as its own
    // scroll (`PageHeader.js:179` `useNearestScroll`,
    // `scrollableAncestor.js`): a cell far down the reference page read the
    // window's and drew the scrolled header. Its own clipping box (a
    // scrollable ancestor to that test, never a scrollbar) keeps every cell
    // at scroll top, as the sample is
    // A sample names a row's list only when the state draws it
    return React.createElement('div', { style: { overflow: 'hidden' } }, React.createElement(upstream.PageHeader, {
      breadcrumbs: props.breadcrumbs ? props.breadcrumbs.map(function (c, i) {
        return { href: c.href, key: 'b' + i, label: c.label, title: c.label };
      }) : undefined,
      children: typeof props.children === 'string' ? React.createElement('div', { style: upstream.fixtureTextStyle('bodyCompact01') }, props.children) : undefined,
      collapseHeader: props.collapseHeader === true ? true : undefined,
      pageActions: props.pageActions ? props.pageActions.map(function (a, i) {
        return { key: 'a' + i, kind: a.kind || 'primary', label: a.label, onClick: function () {} };
      }) : undefined,
      pageActionsOverflowLabel: props.pageActionsOverflowLabel,
      subtitle: props.subtitle,
      tags: props.tags ? props.tags.map(function (t) {
        return { label: t.label, type: t.type };
      }) : undefined,
      title: typeof props.titleIcon === 'string' ? { icon: upstream.icon(props.titleIcon), text: props.title } : props.title
    }));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.c4p--page-header', ours: ':scope > div', measure: 'box' }),
    // The overflow-aware breadcrumb, button set and tag set keep hidden
    // sizing copies offscreen ahead of the drawn ones (probe: x -1212,
    // -463, -1216 first), so a part reads the drawn breadcrumb and the
    // drawn page actions only and the tags are left to the perceptual
    // gate. The hidden copy's list sits in a bare `nav` inside the hidden
    // container (`BreadcrumbWithOverflow.js:56-60`); the drawn list's `nav`
    // carries the container class itself (`:151-155`)
    breadcrumb: Object.freeze({ upstream: '.c4p--page-header__breadcrumb-row nav.c4p--breadcrumb-with-overflow__breadcrumb-container > .cds--breadcrumb', ours: '[data-part="breadcrumb"] [role="list"]', measure: 'box', optional: true }),
    title: Object.freeze({ upstream: '.c4p--page-header__titleText', ours: '[data-part="titleText"]', measure: 'text' }),
    // The drawn page actions in the title row: the button set, or the menu
    // button when the set does not fit (`ButtonSetWithOverflow.js:137-141`;
    // the copy in the breadcrumb row is hidden, `_page-header.scss:549-552`)
    actions: Object.freeze({ upstream: '.c4p--page-header__title-row .c4p--button-set-with-overflow__button-container--visible', ours: '[data-part="actions"]', measure: 'box', optional: true }),
    titleIcon: Object.freeze({ upstream: '.c4p--page-header__title-icon', ours: '[data-part="titleIcon"] svg', measure: 'box', optional: true }),
    // The subtitle column holds its text in a span (`PageHeader.js:344`)
    subtitle: Object.freeze({ upstream: '.c4p--page-header__subtitle-text', ours: '[data-part="subtitle"]', measure: 'text', optional: true })
  })
});
