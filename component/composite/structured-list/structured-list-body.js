// Info: StructuredListBody member. The list's body row group
// (`structured-list/_structured-list.scss:171-174`): its rows from `rows`
// (`{ id, cells }`), then its children, each row told the row before it
// (whose hover or selection colors its rule). The
// body draws the last row's closing rule (`:79-82`) in
// `color.structured_list_border`, in the last row's hover or selected fill
// when it has one (`:94-125`): upstream's collapsed borders give each row
// half of the rule on either side, so the body keeps the rows' boxes at one
// rule each. It must be composed inside StructuredListWrapper.

import SPEC from './spec.structured-list-body.js';
import { createTableContext } from './structured-list-context.js';


/********************************************************************
StructuredListBody factory.

@param {Object} ctx - Component context

@return {Function} - The StructuredListBody component
*********************************************************************/
export default function StructuredListBody (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const TableContext = createTableContext(ctx);


  /********************************************************************
  StructuredListBody component.

  @param {Object} props - See `api.structured-list-body.js`

  @return {Object} - React element
  *********************************************************************/
  function StructuredListBodyComponent (props) {

    const table = React.useContext(TableContext);

    // The rows: data first, then the children
    const data = Utils.isArray(props.rows) ? props.rows.filter(Utils.isObject).map(function (row, index) {
      return React.createElement(ctx.Registry.StructuredListRow, { cells: row.cells, id: row.id, key: Utils.isString(row.id) ? row.id : 'row-' + index });
    }) : [];
    const rows = data.concat(React.Children.toArray(props.children)).filter(function (element) {
      return React.isValidElement(element);
    });
    const ids = rows.map(function (element, index) {
      return Utils.isString(element.props.id) ? element.props.id : 'row-' + index;
    });
    if (table !== null) {
      table.order.current = ids;
    }
    const drawn = rows.map(function (element, index) {
      return React.cloneElement(element, { id: ids[index], previousId: index === 0 ? null : ids[index - 1] });
    });

    // The closing rule takes the last row's selected or hover fill
    const lastId = Utils.isEmptyArray(ids) ? null : ids[ids.length - 1];
    let rule = 'structured_list_border';
    if (table !== null && table.selection && lastId !== null) {
      if (table.hovered === lastId && table.selected !== lastId) {
        rule = 'structured_list_row_container_hover';
      } else if (table.selected === lastId) {
        rule = 'structured_list_row_container_selected';
      }
    }
    return React.createElement(View, {
      dataSet: { part: 'rowGroup' },
      role: 'rowgroup',
      testID: props.testID,
      style: { borderBottomColor: ctx.color(rule), borderBottomWidth: Utils.isEmptyArray(rows) ? 0 : ctx.metric('StructuredListBody', 'ruleWidth') }
    }, drawn);

  }

  StructuredListBodyComponent.displayName = 'StructuredListBody';
  return StructuredListBodyComponent;

}

StructuredListBody.spec = SPEC;
