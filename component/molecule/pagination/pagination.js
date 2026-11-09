// Info: Pagination molecule. A bar that pages through a list: a page-size
// inline select with its label on the left, a page select, the item count
// and the previous/next ghost IconButtons on the right. Below the collapse
// width only the count and the buttons show.
//
// Behavior: `useControllableState` resolves `page`; a page-size change
// resets to page 1.
//
// Accessibility: the buttons name themselves through their tooltips; the
// selects are the Select's own inline form.
import SPEC from './spec.pagination.js';

export default function Pagination (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { useControllableState } = ctx.behaviors;

  function PaginationComponent (props) {
    const pageSizes = Utils.isArray(props.pageSizes) && !Utils.isEmptyArray(props.pageSizes) ? props.pageSizes : [10];
    const pageSize = Utils.isNumber(props.pageSize) ? props.pageSize : pageSizes[0];
    const pagesUnknown = props.pagesUnknown === true;
    const disabled = props.disabled === true;
    const totalItems = Utils.isNumber(props.totalItems) ? props.totalItems : undefined;
    const totalPages = totalItems === undefined ? 0 : Math.max(Math.ceil(totalItems / pageSize), 1);
    const emit = function (next) {
      if (typeof props.onChange === 'function') {
        props.onChange(next);
      }
    };
    const pair = useControllableState({ defaultValue: 1, onChange: function (next) {
      emit({ page: next, pageSize: pageSize });
    }, value: props.page });
    const page = Math.min(Math.max(pair[0], 1), Math.max(totalPages, 1));
    const setPage = pair[1];
    // The size-driven height and the collapse measure
    const [barWidth, setBarWidth] = React.useState(undefined);
    const height = ctx.metric('Pagination', props.size === 'sm' ? 'heightSmall' : props.size === 'lg' ? 'heightLarge' : 'height') + ctx.metric('Pagination', 'dividerWidth');
    const collapsed = Utils.isNumber(barWidth) && barWidth < ctx.metric('Pagination', 'collapseWidth');
    // The range text (upstream defaults)
    const itemRangeText = typeof props.itemRangeText === 'function' ? props.itemRangeText : function (min, max, total) {
      return min + '–' + max + ' of ' + total + ' items';
    };
    const itemText = typeof props.itemText === 'function' ? props.itemText : function (min, max) {
      return min + '–' + max + ' items';
    };
    const countText = pagesUnknown || !totalItems
      ? (totalItems === 0 ? itemRangeText(0, 0, 0) : itemText(pageSize * (page - 1) + 1, page * pageSize))
      : itemRangeText(Math.min(pageSize * (page - 1) + 1, totalItems), Math.min(page * pageSize, totalItems), totalItems);
    // The selects' items
    const Select = ctx.Registry.Select;
    const selectProps = { inline: true, paddingEnd: ctx.metric('Pagination', 'selectPaddingEnd'), paddingStart: ctx.metric('Pagination', 'selectPaddingStart'), hoverLeaf: 'pagination_select_container_hover', disabled: disabled };
    const sizeSelect = React.createElement(Select, Object.assign({}, selectProps, {
      items: pageSizes.map(function (v) {
        return { label: String(v), value: String(v) };
      }),
      onChange: function (v) {
        emit({ page: 1, pageSize: Number(v) });
      },
      value: String(pageSize)
    }));
    const pageSelect = pagesUnknown === true ? null : React.createElement(Select, Object.assign({}, selectProps, {
      items: Array.from({ length: totalPages }, function (_, i) {
        return { label: String(i + 1), value: String(i + 1) };
      }),
      onChange: function (v) {
        setPage(Number(v));
      },
      value: String(page)
    }));
    // The buttons: ghost IconButtons with the divider at their start
    const button = function (icon, label, atEnd, onPress) {
      return React.createElement(View, { dataSet: { part: 'button' }, style: { borderStartColor: ctx.color('pagination_divider'), borderStartWidth: ctx.metric('Pagination', 'dividerWidth'), height: height } },
        React.createElement(ctx.Registry.IconButton, {
          align: 'top',
          disabled: disabled || atEnd,
          icon: icon,
          kind: 'ghost',
          label: label,
          onPress: onPress,
          size: props.size === 'sm' ? 'sm' : props.size === 'lg' ? 'lg' : 'md'
        }));
    };
    const label = Utils.isString(props.itemsPerPageText) ? props.itemsPerPageText : 'Items per page:';
    const type = ctx.typeStyle('pagination');
    return React.createElement(View, {
      onLayout: function (e) {
        const w = e.nativeEvent.layout.width; if (w !== barWidth) {
          setBarWidth(w);
        }
      },
      style: { alignItems: 'center', backgroundColor: ctx.color('pagination_container'), borderTopColor: ctx.color('pagination_divider'), borderTopWidth: ctx.metric('Pagination', 'dividerWidth'), flexDirection: 'row', height: height, justifyContent: 'space-between', marginEnd: ctx.metric('Pagination', 'dividerWidth') },
      dataSet: { part: 'root' },
      testID: props.testID
    },
    collapsed !== true ? React.createElement(View, { dataSet: { part: 'left' }, style: { alignItems: 'center', flexDirection: 'row', minHeight: height, paddingStart: ctx.metric('Pagination', 'paddingInline') } },
      React.createElement(Text, { dataSet: { part: 'text' }, style: [{ color: ctx.color('pagination_label') }, type] }, label),
      sizeSelect) : null,
    React.createElement(View, { dataSet: { part: 'right' }, style: { alignItems: 'center', borderStartColor: ctx.color('pagination_divider'), borderStartWidth: ctx.metric('Pagination', 'dividerWidth'), flexDirection: 'row', minHeight: height } },
      collapsed !== true ? pageSelect : null,
      React.createElement(Text, { dataSet: { part: 'count' }, style: [{ color: ctx.color('pagination_count_label'), marginStart: ctx.metric('Pagination', 'textGap') }, type] }, countText),
      button('caret_left', Utils.isString(props.backwardText) ? props.backwardText : 'Previous page', page <= 1, function () {
        setPage(page - 1);
      }),
      button('caret_right', Utils.isString(props.forwardText) ? props.forwardText : 'Next page', pagesUnknown !== true && page >= totalPages, function () {
        setPage(page + 1);
      })));
  }

  PaginationComponent.displayName = 'Pagination';
  return PaginationComponent;
}
Pagination.spec = SPEC;
