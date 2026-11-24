// Info: StructuredListHead member. The list's head row group
// (`structured-list/_structured-list.scss:152-155`): it draws one head row
// from `columns` (StructuredListRow `head`, a head StructuredListCell per
// label), then its children. It must be composed inside
// StructuredListWrapper.

import SPEC from './spec.structured-list-head.js';


/********************************************************************
StructuredListHead factory.

@param {Object} ctx - Component context

@return {Function} - The StructuredListHead component
*********************************************************************/
export default function StructuredListHead (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  StructuredListHead component.

  @param {Object} props - See `api.structured-list-head.js`

  @return {Object} - React element
  *********************************************************************/
  function StructuredListHeadComponent (props) {

    const row = Utils.isArray(props.columns) ? React.createElement(ctx.Registry.StructuredListRow, { head: true, key: 'row' },
      props.columns.map(function (label, index) {
        return React.createElement(ctx.Registry.StructuredListCell, { head: true, key: index }, label);
      })) : null;
    return React.createElement(View, { dataSet: { part: 'head' }, role: 'rowgroup', testID: props.testID }, row, props.children);

  }

  StructuredListHeadComponent.displayName = 'StructuredListHead';
  return StructuredListHeadComponent;

}

StructuredListHead.spec = SPEC;
