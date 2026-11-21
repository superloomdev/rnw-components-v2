// Info: Breadcrumb molecule. A `nav` landmark (`accessibilityLabel`,
// default `Breadcrumb`) holding an ordered list; each `items` entry goes
// through `ctx.Registry.BreadcrumbItem` with the `last`, `noTrailingSlash`
// and `size` composition props: `{ label, href, isCurrentPage }` for a
// link or link-styled text, `{ overflow: [{ label, href, onPress }] }`
// for the overflow menu. The separators are the item's own; the list
// carries `type.breadcrumb` (`_small`). A composing parent may name its own
// type set and gap (`typeLeaf`, `gap`), which reach every item.

import SPEC from './spec.breadcrumb.js';


/********************************************************************
Breadcrumb factory.

@param {Object} ctx - Component context

@return {Function} - The Breadcrumb component
*********************************************************************/
export default function Breadcrumb (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  Breadcrumb component.

  @param {Object} props - See `api.breadcrumb.js`

  @return {Object} - React element
  *********************************************************************/
  function BreadcrumbComponent (props) {

    // Init the items, the size and a composing parent's type set
    const items = Utils.isArray(props.items) ? props.items : [];
    const small = props.size === 'sm';
    const type = Utils.isString(props.typeLeaf) ? props.typeLeaf : small ? 'breadcrumb_small' : 'breadcrumb';

    // Render the landmark and its ordered list; the last item and
    // `noTrailingSlash` tell the members where the separators stop
    return React.createElement(View, {
      accessibilityLabel: Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : 'Breadcrumb',
      role: 'navigation',
      style: ctx.typeStyle(type),
      testID: props.testID
    },
    React.createElement(View, {
      role: 'list',
      style: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }
    },
    items.map(function (item, index) {
      return React.createElement(ctx.Registry.BreadcrumbItem, Object.assign({
        gap: props.gap,
        key: index,
        last: index === items.length - 1,
        noTrailingSlash: props.noTrailingSlash === true,
        size: props.size,
        typeLeaf: props.typeLeaf
      }, item));
    })));

  }

  BreadcrumbComponent.displayName = 'Breadcrumb';

  return BreadcrumbComponent;

}

Breadcrumb.spec = SPEC;
