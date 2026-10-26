// Info: TabList - the tab bar: a `role="tablist"` row of `Tab` (or `IconTab`
// for `iconOnly` items) with the selection indicator, keyboard movement
// (automatic or manual activation), optional close buttons and the overflow
// behavior `anatomy.tab_overflow` names (`buttons` draws the chevron scroll
// buttons when the row overflows; `scroll` just scrolls).

import API from './api.tab-list.js';
import SPEC from './spec.tab-list.js';


/********************************************************************
TabList factory.

@param {Object} ctx - Component context

@return {Function} - The TabList component
*********************************************************************/
export default function TabList (ctx) {

  const React = ctx.React;
  const { Pressable, ScrollView, View } = ctx.ReactNative;
  const { useRovingTabIndex, useTabsState } = ctx.behaviors;

  const TabItem = ctx.Registry.Tab;
  const IconTabItem = ctx.Registry.IconTab;


  /********************************************************************
  TabList component.

  @param {Object} props - See `api.tab-list.js`

  @return {Object} - React element
  *********************************************************************/
  function TabListComponent (props) {

    // Init the items, the shared metrics and the state
    const items = ctx.Utils.isArray(props.items) ? props.items : [];
    const tabs = useTabsState({
      activation: props.activation,
      defaultSelectedIndex: props.defaultSelectedIndex,
      onChange: props.onChange,
      selectedIndex: props.selectedIndex
    });
    const activeIndex = tabs.state.activeIndex;
    const selectedIndex = tabs.state.selectedIndex;
    const contained = props.variant === 'contained';
    const tall = contained && items.some(function (i) {
      return i.secondaryLabel !== undefined;
    });
    const metrics = {
      containedHeight: ctx.metric('TabList', 'containedHeight'),
      containedPaddingBlock: ctx.metric('TabList', 'containedPaddingBlock'),
      content: ctx.enum('anatomy.tab_indicator') === 'content' && !contained,
      height: ctx.metric('TabList', 'height'),
      itemGap: ctx.metric('TabList', 'itemGap'),
      indicatorRadius: ctx.metric('TabList', 'indicatorRadius'),
      indicatorWidth: ctx.metric('TabList', 'indicatorWidth'),
      paddingInline: ctx.metric('TabList', 'paddingInline'),
      separatorWidth: ctx.metric('TabList', 'separatorWidth'),
      trackWidth: ctx.metric('TabList', 'trackWidth')
    };
    const dismissable = props.dismissable === true;

    // Overflow: the theme answers buttons or scroll. Buttons draw the
    // chevron seats only when the row measures wider than the container
    const overflowMode = ctx.enum('anatomy.tab_overflow');
    const scrollRef = React.useRef(null);
    const [boxWidth, setBoxWidth] = React.useState(0);
    const [contentWidth, setContentWidth] = React.useState(0);
    const overflows = overflowMode === 'buttons' && contentWidth > boxWidth + 1;
    const onBoxLayout = function (event) {
      const w = event.nativeEvent.layout.width;
      if (w > 0 && w !== boxWidth) {
        setBoxWidth(w);
      }
    };
    const onContentLayout = function (event) {
      const w = event.nativeEvent.layout.width;
      if (w > 0 && w !== contentWidth) {
        setContentWidth(w);
      }
    };
    const scrollBy = function (dir) {
      const node = scrollRef.current;
      if (node && typeof node.scrollBy === 'function') {
        node.scrollBy({ left: dir * ctx.metric('TabList', 'overflowButtonWidth') * 3 });
      } else if (node && typeof node.scrollTo === 'function') {
        node.scrollTo({ x: dir * ctx.metric('TabList', 'overflowButtonWidth') * 3 });
      }
    };
    const overflowButton = function (dir, hidden) {
      const leaf = contained ? 'tab_contained_overflow_button' : 'tab_overflow_button';
      return React.createElement(Pressable, {
        'aria-hidden': true,
        'aria-label': dir < 0 ? 'Scroll left' : 'Scroll right',
        disabled: hidden,
        onPress: function () {
          scrollBy(dir);
        },
        style: {
          alignItems: 'center',
          backgroundColor: ctx.color(leaf),
          display: hidden === true ? 'none' : 'flex',
          bottom: 0,
          flexShrink: 0,
          top: 0,
          justifyContent: 'center',
          width: ctx.metric('TabList', contained ? 'containedOverflowButtonWidth' : 'overflowButtonWidth')
        }
      }, React.createElement(ctx.Registry.Icon, { color: 'tab_overflow_icon', name: dir < 0 ? 'chevron_left' : 'chevron_right', size: ctx.metric('Tab', 'iconSize') }));
    };

    // Select a tab: the selection follows activation
    const select = function (index) {
      tabs.setActiveIndex(index);
      tabs.setSelectedIndex(index);
    };

    // The roving move skips disabled tabs in the move's direction; manual
    // activation only moves the active index, Enter or Space selects
    const move = function (next) {
      const diff = next - activeIndex;
      const dir = Math.abs(diff) === 1 ? Math.sign(diff) : diff > 0 ? -1 : 1;
      let target = next;
      for (let step = 0; step < items.length && items[target] && items[target].disabled === true; step = step + 1) {
        target = (target + dir + items.length) % items.length;
      }
      if (!(items[target] && items[target].disabled === true)) {
        if (props.activation === 'manual') {
          tabs.moveActiveIndex(target);
        } else {
          select(target);
        }
      }
    };
    const roving = useRovingTabIndex({
      count: items.length,
      activeIndex: activeIndex,
      onActiveIndexChange: move,
      orientation: 'horizontal'
    });
    const close = function (index) {
      if (typeof props.onTabCloseRequest === 'function') {
        props.onTabCloseRequest(index);
      }
    };

    // Render the bar: a scroll row of tabs inside the container
    return React.createElement(View, {
      role: 'none',
      style: { alignSelf: 'flex-start', flexDirection: 'row', position: 'relative' }
    },
    overflowButton(-1, !overflows),
    React.createElement(ScrollView, Object.assign({}, roving.containerProps, {
      horizontal: true,
      onLayout: onBoxLayout,
      role: 'tablist',
      accessibilityLabel: props.accessibilityLabel,
      showsHorizontalScrollIndicator: false,
      testID: props.testID,
      ref: scrollRef,
      style: {
        backgroundColor: ctx.color('tab_container'),
        borderBottomColor: ctx.color('tab_divider'),
        borderBottomWidth: ctx.metric('TabList', 'dividerWidth'),
        flexDirection: 'row',
        flexGrow: 1
      },
      contentContainerStyle: { flexDirection: 'row' }
    }),
    React.createElement(View, { onLayout: onContentLayout, style: { flexDirection: 'row' } },
      items.map(function (item, index) {
        if (item.iconOnly === true) {
          return React.createElement(IconTabItem, {
            active: index === activeIndex,
            icon: item.icon,
            key: index,
            label: item.label,
            listHeight: tall === true ? ctx.metric('TabList', 'containedTallHeight') : contained ? metrics.containedHeight : metrics.height,
            onSelect: function () {
              select(index);
            },
            selected: index === selectedIndex
          });
        }
        return React.createElement(TabItem, {
          active: index === activeIndex,
          afterSelected: index === selectedIndex + 1,
          disabled: item.disabled === true,
          dismissable: dismissable,
          first: index === 0,
          icon: item.icon,
          index: index,
          key: index,
          label: item.label,
          metrics: metrics,
          onClose: close,
          onSelect: function () {
            select(index);
          },
          secondaryLabel: item.secondaryLabel,
          selected: index === selectedIndex,
          tall: tall,
          variant: props.variant
        });
      }))),
    overflowButton(1, !overflows));

  }

  TabListComponent.displayName = 'TabList';

  return TabListComponent;

}

TabList.api = API;
TabList.spec = SPEC;
