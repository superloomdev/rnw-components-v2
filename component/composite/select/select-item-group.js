// Info: SelectItemGroup composite member. A group label row above its
// SelectItems inside Select's open list: the header names the group through
// `aria-labelledby`, draws no divider and is no option; a group entry's
// `disabled` disables every option the group renders.

import SPEC from './spec.select-item-group.js';


/********************************************************************
SelectItemGroup factory.

@param {Object} ctx - Component context

@return {Function} - The SelectItemGroup component
*********************************************************************/
export default function SelectItemGroup (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useA11yId, getA11yRelation } = ctx.behaviors;


  /********************************************************************
  SelectItemGroup component.

  @param {Object} props - See `api.select-item-group.js`

  @return {Object} - React element
  *********************************************************************/
  function SelectItemGroupComponent (props) {

    const headerId = useA11yId('select-item-group');
    const disabled = props.disabled === true;
    const header = React.createElement(View, {
      key: 'header',
      style: {
        height: ctx.metric('SelectItemGroup', 'headerHeight'),
        justifyContent: 'center',
        paddingLeft: ctx.metric('SelectItemGroup', 'headerPaddingInline'),
        paddingRight: ctx.metric('SelectItemGroup', 'headerPaddingInline')
      }
    },
    React.createElement(ctx.Registry.Text, {
      breakMode: 'tail',
      color: disabled ? 'list_item_label_disabled' : 'select_group_label',
      id: headerId,
      type: 'select_group_label'
    }, props.label));

    // Composed inside Select, the parent built the options; standalone the
    // group renders its own items as SelectItems
    const options = Utils.isArray(props.options) ? props.options
      : (Utils.isArray(props.items) ? props.items : []).map(function (item, index) {
        return React.createElement(ctx.Registry.SelectItem, {
          key: item.value,
          label: item.label,
          value: item.value,
          disabled: disabled || item.disabled === true,
          divider: index !== 0
        });
      });

    return React.createElement(View, Object.assign({
      role: 'group',
      testID: props.testID
    }, getA11yRelation({ labelledby: headerId })), [header].concat(options));

  }

  SelectItemGroupComponent.displayName = 'SelectItemGroup';

  return SelectItemGroupComponent;

}

SelectItemGroup.spec = SPEC;
