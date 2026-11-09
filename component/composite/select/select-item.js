// Info: SelectItem composite member. One option row of Select's open list:
// a pressable row whose fill the state paints, the divider hairline above
// every row but the first, and the one-line label. Select composes it with
// the behavior's option props; standalone the row names itself an option.

import SPEC from './spec.select-item.js';


/********************************************************************
SelectItem factory.

@param {Object} ctx - Component context

@return {Function} - The SelectItem component
*********************************************************************/
export default function SelectItem (ctx) {

  const React = ctx.React;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { getA11yState } = ctx.behaviors;


  /********************************************************************
  SelectItem component.

  @param {Object} props - See `api.select-item.js`

  @return {Object} - React element
  *********************************************************************/
  function SelectItemComponent (props) {

    // Read the list presentation with the owner's metrics
    const list = ctx.listPresentation({
      itemHeight: ctx.metric('Select', 'itemHeight'),
      paddingInline: ctx.metric('Select', 'itemPaddingInline'),
      dividerWidth: ctx.metric('Select', 'itemDividerWidth'),
      paddingBlock: ctx.metric('Select', 'listPaddingBlock'),
      radius: ctx.metric('Select', 'listRadius'),
      level: ctx.metric('Select', 'listLevel')
    });
    const itemState = function (interaction) {
      return {
        disabled: props.disabled === true,
        highlighted: props.highlighted === true,
        hovered: interaction.hovered === true,
        pressed: interaction.pressed === true,
        selected: props.selected === true
      };
    };
    // Composed inside Select the option props carry the role and the state;
    // standalone the row answers them from its own props through the a11y seam
    const a11y = getA11yState({ disabled: props.disabled === true, selected: props.selected === true });
    return React.createElement(Pressable, Object.assign({
      role: 'option',
      'aria-disabled': a11y['aria-disabled'],
      'aria-selected': a11y['aria-selected'],
      disabled: props.disabled === true ? true : undefined,
      testID: props.testID
    }, props.optionProps, {
      style: function (interaction) {
        return list.item(itemState(interaction));
      }
    }),
    React.createElement(View, { style: list.option(props.divider === true) },
      React.createElement(Text, {
        numberOfLines: 1,
        style: list.label(itemState({}))
      }, props.label)));

  }

  SelectItemComponent.displayName = 'SelectItem';

  return SelectItemComponent;

}

SelectItem.spec = SPEC;
