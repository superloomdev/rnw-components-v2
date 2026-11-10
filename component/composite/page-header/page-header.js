// Info: PageHeader composite. The page's header stack: the breadcrumb
// row (with overflow), the title row (icon + heading + page actions),
// subtitle and tags; a collapsed bar tracks `scrollY`.
// Composes Breadcrumb/OverflowMenu, Heading, Button/IconButton, TagSet.
import SPEC from './spec.page-header.js';

export default function PageHeader (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;

  function PageHeaderComponent (props) {
    const pad = ctx.metric('PageHeader', 'paddingInline');
    const collapsed = props.collapseHeader === true || (Utils.isNumber(props.scrollY) && props.scrollY > 0);
    const crumbs = Utils.isArray(props.breadcrumbs) ? props.breadcrumbs : [];
    const actions = Utils.isArray(props.pageActions) ? props.pageActions : [];
    const tags = Utils.isArray(props.tags) ? props.tags : [];
    const breadcrumb = !Utils.isEmptyArray(crumbs) ? React.createElement(View, {
      dataSet: { part: 'breadcrumb' },
      style: { height: ctx.metric('PageHeader', 'breadcrumbHeight'), justifyContent: 'center', marginBottom: 2 }
    }, React.createElement(ctx.Registry.Breadcrumb, { items: crumbs.map(function (c) {
      return { children: c.label, href: c.href };
    }) })) : null;
    const titleRow = React.createElement(View, {
      dataSet: { part: 'title' },
      style: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: Utils.isEmptyArray(crumbs) ? 34 : 0, minHeight: ctx.metric('PageHeader', 'titleMinHeight') }
    },
    React.createElement(View, { style: { alignItems: 'center', flexDirection: 'row' } },
      Utils.isString(props.titleIcon) ? React.createElement(View, { dataSet: { part: 'titleIcon' }, style: { marginEnd: ctx.metric('PageHeader', 'titleIconGap') } },
        React.createElement(ctx.Registry.Icon, { color: 'page_header_title', name: props.titleIcon, size: ctx.metric('PageHeader', 'titleIconSize') })) : null,
      React.createElement(Text, { dataSet: { part: 'titleText' }, style: [{ color: ctx.color('page_header_title') }, ctx.typeStyle('page_header_title')] }, props.title)),
    !Utils.isEmptyArray(actions) ? React.createElement(View, { dataSet: { part: 'actions' }, style: { flexDirection: 'row' } },
      actions.map(function (a, i) {
        return React.createElement(ctx.Registry.Button, { key: i, kind: a.kind || 'primary', label: a.label, onPress: a.onPress, size: 'md' });
      })) : null);
    const rows = collapsed ? [titleRow] : [breadcrumb, titleRow];
    const subtitle = !collapsed && Utils.isString(props.subtitle) ? React.createElement(Text, { dataSet: { part: 'subtitle' }, style: [{ color: ctx.color('page_header_subtitle'), marginTop: ctx.metric('PageHeader', 'subtitleGap') }, ctx.typeStyle('page_header_subtitle')] }, props.subtitle) : null;
    const tagRow = !collapsed && !Utils.isEmptyArray(tags) ? React.createElement(View, { dataSet: { part: 'tags' }, style: { flexDirection: 'row', height: 44, marginEnd: -16, marginStart: -16, paddingEnd: ctx.metric('PageHeader', 'tagsPaddingEnd'), paddingStart: 16 } },
      tags.map(function (t, i) {
        return React.createElement(ctx.Registry.Tag, { children: t.label, key: i });
      })) : null;
    return React.createElement(View, {
      dataSet: { part: 'root' },
      style: {
        backgroundColor: props.withoutBackground === true ? 'transparent' : (collapsed ? ctx.color('page_header_container_scrolled') : ctx.color('page_header_container')),
        gap: ctx.metric('PageHeader', 'rowGap'),
        paddingEnd: pad, paddingStart: pad
      },
      testID: props.testID
    }, rows, subtitle, tagRow);
  }

  PageHeaderComponent.displayName = 'PageHeader';
  return PageHeaderComponent;
}
PageHeader.spec = SPEC;
