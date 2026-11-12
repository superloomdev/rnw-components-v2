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
    const breadcrumb = hasCrumbs ? React.createElement(View, {
      dataSet: { part: 'breadcrumb' },
      style: { justifyContent: 'center', minHeight: ctx.metric('PageHeader', 'breadcrumbHeight') }
    }, React.createElement(ctx.Registry.Breadcrumb, { items: crumbs.map(function (c) {
      return { children: c.label, href: c.href };
    }) })) : null;
    // The title column and the page actions share the row; below the
    // available width the actions wrap under the title (`:439-447,494-506`)
    const titleRow = React.createElement(View, {
      dataSet: { part: 'titleRow' },
      style: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hasCrumbs ? 0 : ctx.metric('PageHeader', 'titleOffsetNoBreadcrumb') }
    },
    React.createElement(View, { dataSet: { part: 'title' }, style: { alignItems: 'center', flexDirection: 'row', flexShrink: 1, minHeight: ctx.metric('PageHeader', 'titleMinHeight') } },
      Utils.isString(props.titleIcon) ? React.createElement(View, { dataSet: { part: 'titleIcon' }, style: { marginEnd: ctx.metric('PageHeader', 'titleIconGap') } },
        React.createElement(ctx.Registry.Icon, { color: 'page_header_title', name: props.titleIcon, size: ctx.metric('PageHeader', 'titleIconSize') })) : null,
      React.createElement(Text, { dataSet: { part: 'titleText' }, style: [{ color: ctx.color('page_header_title'), flexShrink: 1 }, ctx.typeStyle('page_header_title')] }, props.title)),
    !Utils.isEmptyArray(actions) ? React.createElement(View, { dataSet: { part: 'actions' }, style: { flexDirection: 'row', flexWrap: 'wrap' } },
      actions.map(function (a, i) {
        return React.createElement(ctx.Registry.Button, { children: a.label, key: i, kind: a.kind || 'primary', onPress: a.onPress, size: 'md' });
      })) : null);
    const subtitle = !collapsed && Utils.isString(props.subtitle) ? React.createElement(Text, { dataSet: { part: 'subtitle' }, style: [{ color: ctx.color('page_header_subtitle'), marginTop: ctx.metric('PageHeader', 'subtitleGap') }, ctx.typeStyle('page_header_subtitle')] }, props.subtitle) : null;
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
