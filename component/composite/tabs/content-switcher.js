// Info: ContentSwitcher - a row of segments where exactly one is selected:
// `role="tablist"` of `Switch` (text) or `IconSwitch` (icon) members, arrows
// and Home/End rove the focus and select, per upstream's segmented control.

import API from './api.content-switcher.js';
import SPEC from './spec.content-switcher.js';


/********************************************************************
ContentSwitcher factory.

@param {Object} ctx - Component context

@return {Function} - The ContentSwitcher component
*********************************************************************/
export default function ContentSwitcher (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;
  const { useRovingTabIndex, useTabsState } = ctx.behaviors;


  function ContentSwitcherComponent (props) {

    const items = ctx.Utils.isArray(props.items) ? props.items : [];
    const tabs = useTabsState({
      defaultSelectedIndex: props.defaultSelectedIndex,
      onChange: props.onChange,
      selectedIndex: props.selectedIndex
    });
    const selectedIndex = tabs.state.selectedIndex;
    const size = props.size || 'md';
    const heightKey = size === 'sm' ? 'sizeSmall' : size === 'lg' ? 'sizeLarge' : 'sizeMedium';
    const separatorMode = ctx.enum('anatomy.content_switcher_separator');
    const selectedMark = ctx.enum('anatomy.content_switcher_selected_mark');

    const select = function (index) {
      if (items[index] && items[index].disabled === true) {
        return;
      }
      tabs.setActiveIndex(index);
      tabs.setSelectedIndex(index);
    };
    const move = function (next) {
      const diff = next - tabs.state.activeIndex;
      const dir = Math.abs(diff) === 1 ? Math.sign(diff) : diff > 0 ? -1 : 1;
      let target = next;
      for (let step = 0; step < items.length && items[target] && items[target].disabled === true; step = step + 1) {
        target = (target + dir + items.length) % items.length;
      }
      if (!(items[target] && items[target].disabled === true)) {
        select(target);
      }
    };
    const roving = useRovingTabIndex({
      count: items.length,
      activeIndex: tabs.state.activeIndex,
      onActiveIndexChange: move,
      orientation: 'horizontal'
    });

    const lowContrast = props.lowContrast === true;
    const iconOnly = items.every(function (i) {
      return i.icon !== undefined && i.text === undefined;
    });

    return React.createElement(View, Object.assign({}, roving.containerProps, {
      role: 'tablist',
      accessibilityLabel: props.accessibilityLabel,
      testID: props.testID,
      style: {
        alignSelf: iconOnly ? 'flex-start' : 'stretch',
        flexGrow: iconOnly ? 0 : 1,
        backgroundColor: lowContrast ? ctx.color('content_switcher_low_contrast_container') : 'transparent',
        borderRadius: ctx.metric('ContentSwitcher', 'radius'),
        outlineColor: ctx.color(items.some(function (i) {
          return i.disabled === true;
        }) ? 'content_switcher_outline_disabled' : lowContrast ? 'content_switcher_low_contrast_outline' : 'content_switcher_outline'),
        outlineOffset: -ctx.metric('ContentSwitcher', 'outlineWidth'),
        outlineStyle: 'solid',
        outlineWidth: ctx.metric('ContentSwitcher', 'outlineWidth'),
        flexDirection: 'row',
        height: ctx.metric('ContentSwitcher', heightKey),
        overflow: 'hidden'
      }
    }),
    items.map(function (item, index) {
      const iconOnly = item.icon !== undefined && item.text === undefined;
      const Member = iconOnly ? ctx.Registry.IconSwitch : ctx.Registry.Switch;
      const separator = separatorMode === 'short' && index > 0
        && index !== selectedIndex && index - 1 !== selectedIndex;
      const fullSeparator = separatorMode === 'full';
      return React.createElement(Member, {
        active: index === tabs.state.activeIndex,
        disabled: item.disabled === true,
        icon: item.icon,
        index: index,
        key: index,
        label: iconOnly ? item.label : undefined,
        first: index === 0,
        flex: iconOnly !== true,
        last: index === items.length - 1,
        lowContrast: lowContrast,
        onSelect: function () {
          select(index);
        },
        selected: index === selectedIndex,
        selectedMark: selectedMark === 'shown',
        separator: separator === true || fullSeparator === true,
        separatorFull: fullSeparator === true,
        segmentHeight: ctx.metric('ContentSwitcher', heightKey),
        radius: ctx.metric('ContentSwitcher', 'radius'),
        size: size,
        text: item.text
      });
    }));

  }

  ContentSwitcherComponent.displayName = 'ContentSwitcher';

  return ContentSwitcherComponent;

}

ContentSwitcher.api = API;
ContentSwitcher.spec = SPEC;
