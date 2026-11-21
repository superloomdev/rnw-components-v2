// Info: TileGroup molecule. A labelled group of RadioTiles holding one
// selected value: the legend names the group and the group builds a
// RadioTile per `items` entry, injecting `name`, `checked`, `onChange`,
// `focusable` and `onGroupFocus` (the group's roving tab stop and
// arrow-key movement on the web). `disabled` disables every tile - RN
// has no fieldset.
//
// Behavior: `useRadioGroup` owns the selection and the tab stop.
//
// Accessibility: `radiogroup` labelled by the legend; each option keeps
// its `radio` role.
import SPEC from './spec.tile-group.js';


/********************************************************************
TileGroup factory.

@param {Object} ctx - Component context

@return {Function} - The TileGroup component
*********************************************************************/
export default function TileGroup (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { useRadioGroup } = ctx.behaviors;


  /********************************************************************
  TileGroup component.

  @param {Object} props - See `api.tile-group.js`

  @return {Object} - React element
  *********************************************************************/
  function TileGroupComponent (props) {

    // Init the group behavior over the items' values
    const items = Utils.isArray(props.items) ? props.items : [];
    const group = useRadioGroup({
      defaultValue: props.defaultSelected,
      disabled: props.disabled === true,
      items: items.map(function (item) {
        return { disabled: item.disabled === true, value: item.value };
      }),
      onChange: props.onChange,
      value: props.valueSelected
    });

    // Render the group: the legend names it, the keydown moves the
    // selection between the tiles, each item is a RadioTile
    const legendId = 'tile-group-' + (Utils.isString(props.name) ? props.name : 'group');
    return React.createElement(View, {
      accessibilityRole: 'radiogroup',
      'aria-labelledby': Utils.isString(props.legend) ? legendId : undefined,
      onKeyDown: group.containerProps.onKeyDown,
      testID: props.testID
    },
    Utils.isString(props.legend)
      ? React.createElement(Text, {
        id: legendId,
        nativeID: legendId,
        style: [{ color: ctx.color('field_label'), marginBottom: ctx.metric('TileGroup', 'legendGap') }, ctx.typeStyle('field_label')]
      }, props.legend)
      : null,
    items.map(function (item, index) {
      const itemProps = group.getItemProps(index);
      return React.createElement(ctx.Registry.RadioTile, {
        checked: itemProps.checked,
        children: item.children,
        disabled: itemProps.disabled,
        focusable: itemProps.focusable,
        itemRef: itemProps.rootRef,
        key: item.value,
        name: props.name,
        onChange: itemProps.onChange,
        onGroupFocus: itemProps.onGroupFocus,
        value: item.value
      });
    }));

  }

  TileGroupComponent.displayName = 'TileGroup';
  return TileGroupComponent;

}
TileGroup.spec = SPEC;
