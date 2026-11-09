// Info: PaginationNav molecule. A row of page buttons with overflow
// pickers and previous/next ghost buttons. First and last pages always
// show; the cuts fold the middle into overflow selects. The active page
// is `aria-current="page"` with the indicator bar; a polite live region
// announces "Page n of m".
//
// Behavior: `useControllableState` resolves `page`; the cuts are
// upstream's calculateCuts verbatim.
//
// Accessibility: `navigation` role; the live region announces the page.
import SPEC from './spec.pagination-nav.js';

export default function PaginationNav (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useControllableState } = ctx.behaviors;

  // Upstream PaginationNav.js:49-67 calculateCuts, verbatim
  function calculateCuts (page, totalItems, itemsDisplayedOnPage, splitPoint) {
    if (itemsDisplayedOnPage >= totalItems) {
      return { front: 0, back: 0 };
    }
    const split = splitPoint || Math.ceil(itemsDisplayedOnPage / 2) - 1;
    let frontHidden = page + 1 - split;
    let backHidden = totalItems - page - (itemsDisplayedOnPage - split) + 1;
    if (frontHidden <= 1) {
      backHidden -= frontHidden <= 0 ? Math.abs(frontHidden) + 1 : 0;
      frontHidden = 0;
    }
    if (backHidden <= 1) {
      frontHidden -= backHidden <= 0 ? Math.abs(backHidden) + 1 : 0;
      backHidden = 0;
    }
    return { front: frontHidden, back: backHidden };
  }

  function PaginationNavComponent (props) {
    const totalItems = Utils.isNumber(props.totalItems) ? props.totalItems : 0;
    const itemsShown = Utils.isNumber(props.itemsShown) ? props.itemsShown : 10;
    const loop = props.loop === true;
    const pair = useControllableState({ defaultValue: Utils.isNumber(props.defaultPage) ? props.defaultPage : 0, onChange: props.onChange, value: props.page });
    const page = Math.min(Math.max(pair[0], 0), Math.max(totalItems - 1, 0));
    const setPage = pair[1];
    // itemsShown honoured when >= 4 and the window is wider than sm;
    // else the per-size fallback
    const [navWidth, setNavWidth] = React.useState(undefined);
    const isSm = Utils.isNumber(navWidth) && navWidth < ctx.metric('PaginationNav', 'breakpointSm');
    const numberOfPages = props.size === 'sm' ? (itemsShown === 4 ? 4 : 5) : props.size === 'md' ? Math.min(Math.max(itemsShown, 4), 7) : 4;
    const displayed = itemsShown >= 4 && !isSm ? itemsShown : numberOfPages;
    const cuts = calculateCuts(page, totalItems, displayed);
    const height = ctx.metric('PaginationNav', props.size === 'sm' ? 'heightSmall' : props.size === 'md' ? 'heightMedium' : 'height');
    // One page button or the overflow select for a hidden range
    const pageButton = function (index) {
      const active = index === page;
      const interaction = 'page-' + index;
      return React.createElement(Pressable, {
        accessibilityRole: 'button',
        dataSet: { part: 'page' },
        'aria-current': active ? 'page' : undefined,
        key: interaction,
        onPress: function () {
          if (!active) {
            setPage(index);
          }
        },
        style: function (state) {
          return [{
            alignItems: 'center',
            backgroundColor: state.hovered === true ? ctx.color('pagination_nav_page_container_hover') : undefined,
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: height,
            minWidth: height,
            outlineColor: state.focused === true ? ctx.color('pagination_nav_focus') : undefined,
            outlineStyle: state.focused === true ? 'solid' : undefined,
            outlineWidth: state.focused === true ? ctx.metric('PaginationNav', 'focusWidth') : undefined,
            paddingInline: ctx.metric('PaginationNav', 'paddingInline')
          }];
        }
      },
      React.createElement(View, { style: { alignItems: 'center', flexGrow: 1, justifyContent: 'center' } },
        React.createElement(Text, { style: [{ color: ctx.color('pagination_nav_page_label') }, ctx.typeStyle(active ? 'pagination_nav_page_active' : 'pagination_nav_page')] }, String(index + 1))),
      React.createElement(View, { dataSet: { part: 'activeBar' }, style: { alignSelf: 'center', backgroundColor: active ? ctx.color('pagination_nav_indicator') : 'transparent', height: ctx.metric('PaginationNav', 'indicatorHeight'), width: ctx.metric('PaginationNav', 'indicatorWidth') } }));
    };
    const overflow = function (hidden, hiddenPages) {
      return React.createElement(ctx.Registry.Select, {
        inline: true,
        items: hiddenPages.map(function (i) {
          return { label: String(i + 1), value: String(i) };
        }),
        key: 'overflow-' + hidden,
        onChange: function (v) {
          setPage(Number(v));
        },
        placeholder: '…'
      });
    };
    // The row: first page, front overflow, the visible middle, back
    // overflow, the last page
    const items = [];
    items.push(pageButton(0));
    const firstMiddle = cuts.front;
    const lastMiddle = totalItems - 1 - cuts.back;
    if (cuts.front > 0) {
      items.push(overflow('front', Array.from({ length: cuts.front }, function (_, i) {
        return i + 1;
      })));
    }
    for (let i = firstMiddle; i <= lastMiddle; i = i + 1) {
      if (i > 0 && i < totalItems - 1) {
        items.push(pageButton(i));
      }
    }
    if (cuts.back > 0) {
      items.push(overflow('back', Array.from({ length: cuts.back }, function (_, i) {
        return lastMiddle + 1 + i;
      })));
    }
    if (totalItems > 1) {
      items.push(pageButton(totalItems - 1));
    }
    const dirButton = function (icon, atEnd, next) {
      return React.createElement(ctx.Registry.IconButton, {
        align: 'top',
        disabled: atEnd,
        icon: icon,
        kind: 'ghost',
        label: icon === 'caret_left' ? 'Previous page' : 'Next page',
        size: props.size === 'sm' ? 'sm' : props.size === 'md' ? 'md' : 'lg',
        onPress: function () {
          setPage(next);
        }
      });
    };
    const prevEnd = page <= 0 && !loop;
    const nextEnd = page >= totalItems - 1 && !loop;
    return React.createElement(View, {
      accessibilityRole: 'navigation',
      dataSet: { part: 'nav' },
      onLayout: function (e) {
        const w = e.nativeEvent.layout.width; if (w !== navWidth) {
          setNavWidth(w);
        }
      },
      style: { alignItems: 'center', flexDirection: 'row' },
      testID: props.testID
    },
    dirButton('caret_left', prevEnd, loop && page <= 0 ? totalItems - 1 : page - 1),
    items,
    dirButton('caret_right', nextEnd, loop && page >= totalItems - 1 ? 0 : page + 1),
    React.createElement(Text, {
      'aria-live': 'polite',
      style: { height: 0, overflow: 'hidden', position: 'absolute', width: 0 }
    }, 'Page ' + (page + 1) + ' of ' + totalItems));
  }

  PaginationNavComponent.displayName = 'PaginationNav';
  return PaginationNavComponent;
}
PaginationNav.spec = SPEC;
