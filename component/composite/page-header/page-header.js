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
//
// Fit (`BreadcrumbWithOverflow.js` `checkFullyVisibleBreadcrumbItems`,
// `ButtonSetWithOverflow.js` `checkFullyVisibleItems`): one `onLayout`
// pass over the trail's room, each trail item, the title row and each
// page action, no hidden sizing copies. The trail ends in the title,
// hidden but keeping its room (`PageHeaderUtils.js` the breadcrumb item
// for the title); it keeps the last item, then the first, then items
// n-1, n-2 ... while they fit beside the overflow item, which sits after
// the first item, or first when one item fits. The page actions are a
// button set while their widths fit the actions' room and one menu
// button when they do not, at every width.
import SPEC from './spec.page-header.js';

export default function PageHeader (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;

  /********************************************************************
  The trail's fit: how many entries show beside the overflow item.

  @param {Number[]} widths - [overflow item, ...entries], each with its gap
  @param {Number}   space  - The trail's room

  @return {Number} - The entries shown, at least 1
  *********************************************************************/
  function fitCount (widths, space) {

    // The order items claim room: the last, the first, then n-1, n-2 ...
    const count = widths.length;
    const order = function (i) {
      return i === 0 ? count - 1 : i === 1 ? 1 : count - i;
    };
    let fit = 0;
    let room = space;
    for (let i = 0; i < count - 1; i++) {
      if (room < widths[order(i)]) {
        break;
      }
      room -= widths[order(i)];
      fit += 1;
    }

    // Short of all: give back items until the overflow item fits
    if (fit < count - 1) {
      while (fit > 0 && room < widths[0]) {
        fit -= 1;
        room += widths[order(fit)];
      }
    }
    return fit <= 1 ? 1 : fit;

  }

  function PageHeaderComponent (props) {
    const pad = ctx.metric('PageHeader', 'paddingInline');
    const rowGap = ctx.metric('PageHeader', 'rowGap');
    const collapsed = props.collapseHeader === true || (Utils.isNumber(props.scrollY) && props.scrollY > 0);
    const crumbs = Utils.isArray(props.breadcrumbs) ? props.breadcrumbs : [];
    const actions = Utils.isArray(props.pageActions) ? props.pageActions : [];
    const tags = Utils.isArray(props.tags) ? props.tags : [];
    const hasCrumbs = !collapsed && !Utils.isEmptyArray(crumbs);
    // Measured: the trail's room, the title row, and each trail item and
    // page action by key (a hidden item keeps its last width)
    const [trailRoom, setTrailRoom] = React.useState(-1);
    const [rowWidth, setRowWidth] = React.useState(-1);
    const sizes = React.useRef({});
    const [, setMeasureTick] = React.useState(0);
    const record = function (key) {
      return function (e) {
        const width = e.nativeEvent.layout.width;
        if (sizes.current[key] !== width) {
          sizes.current[key] = width;
          setMeasureTick(function (n) {
            return n + 1;
          });
        }
      };
    };
    // Below md the window is narrow and the row follows the action-bar
    // rules instead (`PageHeader.tsx:787-788`); an unknown window is not
    const viewport = ctx.behaviors.useViewportSize();
    const narrow = viewport.width > 0 && viewport.width < ctx.metric('PageHeader', 'bpMd');
    // Below md the grid has no margin (the grid `_config.scss:40-43`, `sm`),
    // so the content sits the column's gutter half in (probe at 375: 16)
    const half = ctx.metric('PageHeader', 'gutter') / 2;
    const inset = narrow ? half : pad;
    const narrowGap = ctx.metric('PageHeader', 'narrowGap');
    // The breadcrumb row: the trail spans the breadcrumb column, 12 below
    // the row's top in the header's own label-01 type and 4 gaps
    // (`_page-header.scss:277-285,320-324,333-347`; fidelity breadcrumb y 12,
    // height 15.98, width 1216 without page actions). Its entries end in
    // the hidden title; each width counts its gap, as upstream adds the
    // first item's margins to every one
    const gap = ctx.metric('PageHeader', 'breadcrumbGap');
    const entries = crumbs.map(function (c, i) {
      return { href: c.href, key: 'crumb:' + i + ':' + c.label, label: c.label, onPress: c.onPress };
    }).concat([{ hidden: true, isCurrentPage: true, key: 'title:' + props.title, label: props.title }]);
    const widths = [sizes.current.overflow].concat(entries.map(function (e) {
      return sizes.current[e.key];
    }));
    const measured = trailRoom >= 0 && widths.every(Utils.isNumber);
    let shown = entries.map(function (e) {
      return Object.assign({ onLayout: record(e.key) }, e);
    });
    if (!measured) {
      // The overflow item is measured once, hidden after the title
      shown.push({ hidden: true, key: 'overflow-seat', onLayout: record('overflow'), overflow: [] });
    } else {
      const count = fitCount(widths.map(function (w) {
        return w + gap;
      }), trailRoom);
      const position = count > 1 ? 1 : 0;
      const gathered = shown.splice(position, entries.length - count);
      if (!Utils.isEmptyArray(gathered)) {
        shown.splice(position, 0, {
          key: 'overflow',
          onLayout: record('overflow'),
          overflow: gathered.map(function (e) {
            return { href: e.href, label: e.label, onPress: e.onPress };
          })
        });
      }
    }
    // Below md only the back link to the last breadcrumb and the hidden
    // title draw (`_breadcrumb-with-overflow.scss:66-75`,
    // `BreadcrumbWithOverflow.js` `backItem`): the arrow in `icon_primary`
    // (`:49-55`), its box placed in the list's line box (probe
    // `PageHeader@375`: list 18.875 high, the back link 1.906 down)
    const last = crumbs[crumbs.length - 1];
    if (narrow && hasCrumbs && Utils.isString(last.href) && Utils.isString(last.label)) {
      shown = [{
        boxHeight: ctx.metric('PageHeader', 'backHeight'),
        href: last.href,
        icon: 'arrow_left',
        iconColorLeaf: 'icon_primary',
        label: last.label,
        offsetTop: ctx.metric('PageHeader', 'backOffset'),
        onPress: last.onPress
      }];
    }
    const trail = hasCrumbs ? React.createElement(View, {
      dataSet: { part: 'trail' },
      onLayout: function (e) {
        setTrailRoom(e.nativeEvent.layout.width);
      }
    }, React.createElement(ctx.Registry.Breadcrumb, {
      gap: gap,
      items: shown,
      typeLeaf: 'page_header_breadcrumb'
    })) : null;
    // With page actions and no action bar the row is the breadcrumb
    // section's share of the content width plus both gutters (`:167-171`),
    // and its breadcrumb column the same share of the row beside the
    // action column (`:232-242,299-304`), inside its gutter halves (probe
    // default: row 748.8, column 449.28, list 417.28 at 1280). Below md the
    // row carries the action-bar class with or without page actions
    // (`PageHeader.js:310`) and spans the row: its breadcrumb column takes
    // the `_sm` share (`:38,287-297`; probe at 375: column 240, list 208)
    const ratio = ctx.metric('PageHeader', 'breadcrumbRatio');
    const share = ((narrow ? ctx.metric('PageHeader', 'breadcrumbRatioSm') : ratio) * 100) + '%';
    const split = trail !== null && (narrow || !Utils.isEmptyArray(actions));
    const breadcrumb = hasCrumbs ? React.createElement(View, {
      dataSet: { part: 'breadcrumb' },
      style: { minHeight: ctx.metric('PageHeader', 'breadcrumbHeight'), paddingTop: ctx.metric('PageHeader', 'breadcrumbPaddingTop') }
    }, split ? React.createElement(View, { dataSet: { part: 'breadcrumbRow' }, style: { marginEnd: -half, marginStart: -half } },
      React.createElement(View, { style: { width: narrow ? '100%' : share } },
        React.createElement(View, { dataSet: { part: 'breadcrumbColumn' }, style: { paddingEnd: half, paddingStart: half, width: share } }, trail))) : trail) : null;
    // The page actions' room: the right section's share of the row widened
    // by the gutter (`:498-507`, 40 % at md and up), the whole row below md
    const gutter = ctx.metric('PageHeader', 'gutter');
    const actionRoom = rowWidth < 0 ? -1 : narrow ? rowWidth : (1 - ratio) * (rowWidth + gutter) - gutter;
    const actionWidths = actions.map(function (a, i) {
      return sizes.current['action:' + i + ':' + a.label];
    });
    const asMenu = actionRoom >= 0 && actionWidths.every(Utils.isNumber) && actionWidths.reduce(function (sum, w) {
      return sum + w;
    }, 0) > actionRoom;
    // The menu lists the actions in reverse; `danger` stays danger, every
    // other kind is the default item (`ButtonSetWithOverflow.js` `AButtonMenu`)
    const actionSet = asMenu ? React.createElement(ctx.Registry.MenuButton, {
      items: actions.slice().reverse().map(function (a) {
        return { danger: a.kind === 'danger', label: a.label, onPress: a.onPress };
      }),
      kind: 'primary',
      label: Utils.isString(props.pageActionsOverflowLabel) ? props.pageActionsOverflowLabel : 'More actions',
      // The header's menu drops the trigger's 12rem floor
      // (`_page-header.scss:710-713`; probe at 375: 162.73)
      minWidth: 0,
      onChange: function (entry) {
        if (Utils.isFunction(entry.onPress)) {
          entry.onPress();
        }
      },
      size: 'md'
    }) : actions.map(function (a, i) {
      return React.createElement(View, { dataSet: { part: 'action' }, key: i, onLayout: record('action:' + i + ':' + a.label) },
        React.createElement(ctx.Registry.Button, { children: a.label, kind: a.kind || 'primary', onPress: a.onPress, size: 'md' }));
    });
    // The title column and the page actions share the row; below the
    // available width the actions wrap under the title (`:439-447,494-506`).
    // Below md the row sits under the action bar: 16 below the breadcrumb
    // row, without the 2 lift the wide row takes (`:379-382,388-391`; the
    // centered 40 line stands for that lift), the title takes the whole
    // row (`:440-447`) and the actions their own line 16 below it,
    // start-aligned (`:494-506`, `PageHeader.js:387` `rightAlign`)
    const titleRow = React.createElement(View, {
      dataSet: { part: 'titleRow' },
      onLayout: function (e) {
        setRowWidth(e.nativeEvent.layout.width);
      },
      style: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hasCrumbs ? (narrow ? narrowGap : 0) : ctx.metric('PageHeader', 'titleOffsetNoBreadcrumb') }
    },
    React.createElement(View, { dataSet: { part: 'title' }, style: { alignItems: 'center', flexDirection: 'row', flexShrink: 1, minHeight: ctx.metric('PageHeader', 'titleMinHeight'), transform: narrow ? [{ translateY: -ctx.metric('PageHeader', 'titleLift') }] : undefined, width: narrow ? '100%' : undefined } },
      // The icon sits the theme's offset below the title's center
      // (`_page-header.scss:487-495`; fidelity titleIcon y 44.78)
      Utils.isString(props.titleIcon) ? React.createElement(View, { dataSet: { part: 'titleIcon' }, style: { marginEnd: ctx.metric('PageHeader', 'titleIconGap'), transform: [{ translateY: ctx.metric('PageHeader', 'titleIconOffset') }] } },
        React.createElement(ctx.Registry.Icon, { color: 'page_header_title', name: props.titleIcon, size: ctx.metric('PageHeader', 'titleIconSize') })) : null,
      React.createElement(Text, { dataSet: { part: 'titleText' }, style: [{ color: ctx.color('page_header_title'), flexShrink: 1 }, ctx.typeStyle('page_header_title')] }, props.title)),
    // At md and up the row's 2 lift (`:376-382` translateY($spacing-01))
    // moves the actions with it (fidelity actions y 42 at 1280)
    !Utils.isEmptyArray(actions) ? React.createElement(View, { dataSet: { part: 'actions' }, style: narrow ? { flexDirection: 'row', flexWrap: 'nowrap', marginTop: narrowGap } : { flexDirection: 'row', flexWrap: 'nowrap', transform: [{ translateY: ctx.metric('PageHeader', 'titleLift') }] } },
      actionSet) : null);
    // The subtitle's fractional line height is presented as the unitless
    // ratio, as upstream's (fidelity subtitle y 89 vs 88 under a px height)
    const subtitle = !collapsed && Utils.isString(props.subtitle) ? React.createElement(Text, { dataSet: { part: 'subtitle' }, style: [{ color: ctx.color('page_header_subtitle'), marginTop: ctx.metric('PageHeader', 'subtitleGap') }, ctx.textPresentation(ctx.typeStyle('page_header_subtitle'))] }, props.subtitle) : null;
    // The content row: 16 under the title row, 8 under a subtitle (`:589-601`)
    const available = !collapsed && props.children !== undefined && props.children !== null ? React.createElement(View, {
      dataSet: { part: 'available' },
      style: { marginTop: subtitle !== null ? ctx.metric('PageHeader', 'subtitleGap') : rowGap }
    }, Utils.isString(props.children) ? React.createElement(Text, { style: [{ color: ctx.color('page_header_subtitle') }, ctx.typeStyle('body_compact_01')] }, props.children) : props.children) : null;
    // The tags are a TagSet in the right section's alt share of the row
    // widened by the gutter, inside the column's start half and the
    // `padding-inline-end` of the tags column (`_page-header.scss:39,641-663`,
    // flex 1 0 25 % at every width): 264 at 1280, 32 in a 320 body, where
    // only the overflow tag shows (probe at 375: `+2`)
    const tagRoom = rowWidth < 0 ? undefined : (1 - ctx.metric('PageHeader', 'breadcrumbRatioSm')) * (rowWidth + gutter) - half - ctx.metric('PageHeader', 'tagsPaddingEnd');
    const tagRow = !collapsed && !Utils.isEmptyArray(tags) ? React.createElement(View, { dataSet: { part: 'tags' }, style: { height: ctx.metric('PageHeader', 'tagsHeight'), marginStart: -ctx.metric('PageHeader', 'tagsPaddingBlock'), width: tagRoom } },
      React.createElement(ctx.Registry.TagSet, {
        tags: tags.map(function (t) {
          return { label: t.label, type: t.type };
        })
      })) : null;
    const lastIsTitle = subtitle === null && available === null;
    const buffer = React.createElement(View, { style: { height: lastIsTitle && tagRow === null ? ctx.metric('PageHeader', 'bufferTitle') : rowGap } });
    return React.createElement(View, {
      dataSet: { part: 'root' },
      style: {
        backgroundColor: props.withoutBackground === true ? 'transparent' : ctx.color('page_header_container'),
        borderBottomColor: ctx.color('page_header_divider'),
        borderBottomWidth: props.withoutBackground === true ? 0 : 1,
        paddingEnd: inset, paddingStart: inset
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
