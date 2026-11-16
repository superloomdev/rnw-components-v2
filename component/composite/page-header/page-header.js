// Info: PageHeader composite. The page's header stack: the breadcrumb
// row (with overflow), the title row (icon + heading + page actions),
// subtitle and tags; a collapsed bar tracks `scrollY`.
// Composes Breadcrumb/OverflowMenu, Heading, Button/IconButton, TagSet.
//
// Layout (`PageHeader/_page-header.scss`, probe `PageHeader.json` at 1280):
// the content sits inside the inline padding (breadcrumb items, title and
// page actions 32 in from each edge); without a breadcrumb row the title
// row starts 32 down (`:410-412`); the last row is followed by a buffer (32 after the
// title row, 16 after a subtitle or the content row, 16 before tags); a 1 px
// rule closes the header (`:114`).
import SPEC from './spec.page-header.js';

export default function PageHeader (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;

  function PageHeaderComponent (props) {
    const pad = ctx.metric('PageHeader', 'paddingInline');
    const rowGap = ctx.metric('PageHeader', 'rowGap');
    const collapsed = props.collapseHeader === true || (Utils.isNumber(props.scrollY) && props.scrollY > 0);
    const crumbs = Utils.isArray(props.breadcrumbs) ? props.breadcrumbs : [];
    const actions = Utils.isArray(props.pageActions) ? props.pageActions : [];
    const tags = Utils.isArray(props.tags) ? props.tags : [];
    const hasCrumbs = !collapsed && !Utils.isEmptyArray(crumbs);
    // Below md the window is narrow and the row follows the action-bar
    // rules instead (`PageHeader.tsx:787-788`); an unknown window is not
    const viewport = ctx.behaviors.useViewportSize();
    const narrow = viewport.width > 0 && viewport.width < ctx.metric('PageHeader', 'bpMd');
    // The breadcrumb row: the trail spans the breadcrumb column, 12 below
    // the row's top in the header's own label-01 type and 4 gaps
    // (`_page-header.scss:277-285,320-324,333-347`; fidelity breadcrumb y 12,
    // height 15.98, width 1216 without page actions)
    const trail = hasCrumbs ? React.createElement(ctx.Registry.Breadcrumb, {
      gap: ctx.metric('PageHeader', 'breadcrumbGap'),
      items: crumbs.map(function (c) {
        return { href: c.href, label: c.label };
      }),
      typeLeaf: 'page_header_breadcrumb'
    }) : null;
    // With page actions and no action bar the row is the breadcrumb
    // section's share of the content width plus both gutters (`:167-171`),
    // and its breadcrumb column the same share of the row beside the
    // action column (`:232-242,299-304`), inside its gutter halves (probe
    // default: row 748.8, column 449.28, list 417.28 at 1280)
    const half = ctx.metric('PageHeader', 'gutter') / 2;
    const share = (ctx.metric('PageHeader', 'breadcrumbRatio') * 100) + '%';
    const split = trail !== null && !narrow && !Utils.isEmptyArray(actions);
    const breadcrumb = hasCrumbs ? React.createElement(View, {
      dataSet: { part: 'breadcrumb' },
      style: { minHeight: ctx.metric('PageHeader', 'breadcrumbHeight'), paddingTop: ctx.metric('PageHeader', 'breadcrumbPaddingTop') }
    }, split ? React.createElement(View, { dataSet: { part: 'breadcrumbRow' }, style: { marginEnd: -half, marginStart: -half } },
      React.createElement(View, { style: { width: share } },
        React.createElement(View, { dataSet: { part: 'breadcrumbColumn' }, style: { paddingEnd: half, paddingStart: half, width: share } }, trail))) : trail) : null;
    // The title column and the page actions share the row; below the
    // available width the actions wrap under the title (`:439-447,494-506`)
    const titleRow = React.createElement(View, {
      dataSet: { part: 'titleRow' },
      style: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hasCrumbs ? 0 : ctx.metric('PageHeader', 'titleOffsetNoBreadcrumb') }
    },
    React.createElement(View, { dataSet: { part: 'title' }, style: { alignItems: 'center', flexDirection: 'row', flexShrink: 1, minHeight: ctx.metric('PageHeader', 'titleMinHeight') } },
      // The icon sits the theme's offset below the title's center
      // (`_page-header.scss:487-495`; fidelity titleIcon y 44.78)
      Utils.isString(props.titleIcon) ? React.createElement(View, { dataSet: { part: 'titleIcon' }, style: { marginEnd: ctx.metric('PageHeader', 'titleIconGap'), transform: [{ translateY: ctx.metric('PageHeader', 'titleIconOffset') }] } },
        React.createElement(ctx.Registry.Icon, { color: 'page_header_title', name: props.titleIcon, size: ctx.metric('PageHeader', 'titleIconSize') })) : null,
      React.createElement(Text, { dataSet: { part: 'titleText' }, style: [{ color: ctx.color('page_header_title'), flexShrink: 1 }, ctx.typeStyle('page_header_title')] }, props.title)),
    !Utils.isEmptyArray(actions) ? React.createElement(View, { dataSet: { part: 'actions' }, style: { flexDirection: 'row', flexWrap: 'wrap' } },
      actions.map(function (a, i) {
        return React.createElement(ctx.Registry.Button, { children: a.label, key: i, kind: a.kind || 'primary', onPress: a.onPress, size: 'md' });
      })) : null);
    // The subtitle's fractional line height is presented as the unitless
    // ratio, as upstream's (fidelity subtitle y 89 vs 88 under a px height)
    const subtitle = !collapsed && Utils.isString(props.subtitle) ? React.createElement(Text, { dataSet: { part: 'subtitle' }, style: [{ color: ctx.color('page_header_subtitle'), marginTop: ctx.metric('PageHeader', 'subtitleGap') }, ctx.textPresentation(ctx.typeStyle('page_header_subtitle'))] }, props.subtitle) : null;
    // The content row: 16 under the title row, 8 under a subtitle (`:589-601`)
    const available = !collapsed && props.children !== undefined && props.children !== null ? React.createElement(View, {
      dataSet: { part: 'available' },
      style: { marginTop: subtitle !== null ? ctx.metric('PageHeader', 'subtitleGap') : rowGap }
    }, Utils.isString(props.children) ? React.createElement(Text, { style: [{ color: ctx.color('page_header_subtitle') }, ctx.typeStyle('body_compact_01')] }, props.children) : props.children) : null;
    const tagRow = !collapsed && !Utils.isEmptyArray(tags) ? React.createElement(View, { dataSet: { part: 'tags' }, style: { flexDirection: 'row', flexWrap: 'wrap', height: ctx.metric('PageHeader', 'tagsHeight'), marginStart: -ctx.metric('PageHeader', 'tagsPaddingBlock') } },
      tags.map(function (t, i) {
        return React.createElement(ctx.Registry.Tag, { children: t.label, key: i, type: t.type });
      })) : null;
    const lastIsTitle = subtitle === null && available === null;
    const buffer = React.createElement(View, { style: { height: lastIsTitle && tagRow === null ? ctx.metric('PageHeader', 'bufferTitle') : rowGap } });
    return React.createElement(View, {
      dataSet: { part: 'root' },
      style: {
        backgroundColor: props.withoutBackground === true ? 'transparent' : ctx.color('page_header_container'),
        borderBottomColor: ctx.color('page_header_divider'),
        borderBottomWidth: props.withoutBackground === true ? 0 : 1,
        paddingEnd: pad, paddingStart: pad
      },
      testID: props.testID
    },
    // The drawn fill is the `::before` layer at full opacity over the
    // container's own fill (`:88-101,131-134`, background opacity 1 unless
    // `withoutBackground`; probe: root background white, paint layer-01)
    props.withoutBackground === true ? null : React.createElement(View, { 'aria-hidden': true, pointerEvents: 'none', style: { backgroundColor: ctx.color('page_header_container_scrolled'), bottom: 0, end: 0, position: 'absolute', start: 0, top: 0 } }),
    breadcrumb, titleRow, subtitle, available, buffer, tagRow);
  }

  PageHeaderComponent.displayName = 'PageHeader';
  return PageHeaderComponent;
}
PageHeader.spec = SPEC;
