// Info: ContainedList composite. A labelled `list` (`aria-labelledby` the
// header) inside a container: a header in the kind's cells (`on-page`
// `size.size_large`, `disclosed` `control.contained_list_header_height_disclosed`),
// an optional search under the header that filters the items by label
// itself, and items through `ctx.Registry.ContainedListItem`. The list
// draws no outer margin - adjacent on-page lists' `control.contained_list_gap`
// is the host's.

import SPEC from './spec.contained-list.js';


/********************************************************************
ContainedList factory.

@param {Object} ctx - Component context

@return {Function} - The ContainedList component
*********************************************************************/
export default function ContainedList (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;

  const SIZES = Object.freeze(['lg', 'md', 'sm', 'xl']);


  /********************************************************************
  ContainedList component.

  @param {Object} props - See `api.contained-list.js`

  @return {Object} - React element
  *********************************************************************/
  function ContainedListComponent (props) {

    // Init the kind, size and metrics
    const size = Utils.inArray(SIZES, props.size) ? props.size : 'lg';
    const disclosed = props.kind === 'disclosed';
    const metrics = {
      headerHeightDisclosed: ctx.metric('ContainedList', 'headerHeightDisclosed'),
      headerHeight: ctx.token('size.size_large'),
      paddingInline: ctx.metric('ContainedList', 'paddingInline')
    };

    // Detect the search action: it renders under the header and filters
    const isSearch = props.action === 'search' || (React.isValidElement(props.action) && (props.action.type === ctx.Registry.Search || props.action.type === ctx.Registry.ExpandableSearch));
    const [query, setQuery] = React.useState('');
    const onQuery = function (event) {
      setQuery(event && event.target ? event.target.value : event);
    };

    // Build the header in the kind's cells
    const labelId = (props.testID || 'contained-list') + '-label';
    const header = React.createElement(View, { style: { backgroundColor: ctx.color(disclosed ? 'contained_list_header_container_disclosed' : 'contained_list_header_container'), borderBottomColor: ctx.color('contained_list_divider'), borderBottomWidth: ctx.token('border.width_01'), height: disclosed ? metrics.headerHeightDisclosed : metrics.headerHeight, justifyContent: 'center', paddingStart: metrics.paddingInline } },
      React.createElement(Text, { nativeID: labelId, style: [ctx.typeStyle(disclosed ? 'contained_list_header_disclosed' : 'contained_list_header'), { color: ctx.color(disclosed ? 'contained_list_header_label_disclosed' : 'contained_list_header_label') }] }, props.label));

    // Build the search row under the header
    const search = isSearch === true ? React.createElement(View, { style: { backgroundColor: ctx.color('contained_list_search_container'), borderBottomColor: ctx.color('contained_list_search_border'), borderBottomWidth: ctx.token('border.width_01') } },
      props.action === 'search'
        ? React.createElement(ctx.Registry.Search, { label: 'Search', onChangeText: onQuery })
        : React.cloneElement(props.action, { onChangeText: onQuery })) : null;

    // Build the items, filtered by the search query on the label
    const entries = Utils.isObject(props.items) ? props.items : [];
    const shown = isSearch === true ? entries.filter(function (entry) {
      return Utils.isObject(entry) && Utils.isString(entry.label) && entry.label.toLowerCase().includes(query.toLowerCase());
    }) : entries;
    const items = React.createElement(View, { accessibilityLabelledBy: labelId, accessibilityRole: 'list' },
      shown.map(function (entry, index) {
        return React.createElement(ctx.Registry.ContainedListItem, {
          action: entry.action, disabled: entry.disabled, icon: entry.icon, inset: props.isInset === true,
          key: index, label: entry.label, last: index === shown.length - 1, onPress: entry.onPress, size: size, testID: props.testID
        });
      }));

    // Return the container
    return React.createElement(View, { testID: props.testID }, header, search, props.action !== undefined && isSearch !== true ? props.action : null, items);
  }

  ContainedListComponent.displayName = 'ContainedList';
  return ContainedListComponent;
}
ContainedList.spec = SPEC;
