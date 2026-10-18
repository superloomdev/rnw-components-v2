// Info: SelectableTag molecule. A Tag rendered as a toggle button: press
// flips the selected state (controllable through `selected` /
// `defaultSelected` / `onChange`), the selected fill is the theme's
// selected inverse and, where `anatomy.tag_selected_mark` shows one, the
// leading icon becomes the selected mark. The tag's face is measured at
// layout; the pressable is a transparent layer of the platform's minimum
// target centered on it, as IconButton's is.
//
// Behavior: `useButton` on the overlay pressable; `useControllableState`
// resolves `selected` against `defaultSelected`.
//
// Accessibility: the pressable is a button named by the tag's label and
// announced pressed or not (`aria-pressed`).

import SPEC from './spec.selectable-tag.js';


/********************************************************************
SelectableTag factory.

@param {Object} ctx - Component context

@return {Function} - The SelectableTag component
*********************************************************************/
export default function SelectableTag (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const { useButton, useControllableState } = ctx.behaviors;


  /********************************************************************
  SelectableTag component.

  @param {Object} props - See `api.selectable-tag.js`

  @return {Object} - React element
  *********************************************************************/
  function SelectableTagComponent (props) {

    // Init the selected state and the press behavior; the tag's label names
    // the button
    const pair = useControllableState({
      defaultValue: props.defaultSelected === true,
      onChange: props.onChange,
      value: props.selected
    });
    const selected = pair[0] === true;
    const setSelected = pair[1];
    const button = useButton(Object.assign({}, props, {
      accessibilityLabel: Utils.isString(props.text) ? props.text : undefined,
      onPress: function () {
        setSelected(!selected);
      }
    }));
    const state = button.state;
    const disabled = state.disabled === true;
    const live = !disabled;
    const [faceSize, onLayout] = ctx.useFaceSize();

    // The leaves the Tag draws: the selectable cells per state; a press
    // paints the theme's selectable layer where it draws one
    const containerLeaf = disabled && selected ? 'tag_selectable_container_selected_disabled'
      : disabled ? 'tag_container_disabled'
        : selected ? (live && (state.hovered === true || state.pressed === true) ? 'tag_selectable_container_selected_hover' : 'tag_selectable_container_selected')
          : live && (state.hovered === true || state.pressed === true) ? 'tag_selectable_container_hover'
            : 'tag_selectable_container';
    const textLeaf = disabled && selected ? 'tag_selectable_label_selected_disabled'
      : disabled ? 'tag_label_disabled'
        : selected ? 'tag_selectable_label_selected' : 'tag_selectable_label';
    const borderLeaf = disabled ? 'tag_interactive_outline_disabled' : 'tag_selectable_outline';

    // The mark: where the theme shows one it replaces the caller's icon
    // while selected, as the second's filter chip swaps in its checkmark.
    // With no caller icon its seat mounts under every template and only its
    // drawing changes (the list's hidden-mark pattern), so the element tree
    // is the same everywhere and a `hidden` anatomy takes no space
    const markShown = ctx.enum('anatomy.tag_selected_mark') === 'shown';
    const hiddenSeat = selected && !markShown && !Utils.isString(props.icon);
    const icon = hiddenSeat || (selected && markShown) ? 'selected_indicator' : props.icon;

    // The tag with the real border the interactive tags draw (the selected
    // tag drops it where the theme says); the pressed layer covers the face
    // in the theme's selectable layer color; the ring sits on the root
    return React.createElement(View, {
      onLayout: onLayout,
      style: [{ alignSelf: 'flex-start', borderRadius: ctx.metric('Tag', 'radius') }, ctx.focusRing('tag', state)]
    },
    React.createElement(ctx.Registry.Tag, {
      children: Utils.isString(props.text) ? props.text : '',
      containerLeaf: containerLeaf,
      disabled: props.disabled === true,
      height: props.size === 'sm' ? ctx.metric('SelectableTag', 'interactiveHeightSmall') : undefined,
      icon: icon,
      iconHidden: hiddenSeat,
      iconLeaf: textLeaf,
      labelLeaf: textLeaf,
      outlineInLayout: ctx.enum('anatomy.tag_interactive_outline') === 'border',
      outlineLeaf: borderLeaf,
      outlineWidth: ctx.metric('SelectableTag', selected ? 'outlineWidthSelected' : 'outlineWidth'),
      size: props.size
    }),
    React.createElement(View, {
      style: {
        backgroundColor: live && state.pressed === true
          ? ctx.color(selected ? 'tag_selectable_layer_active' : 'tag_selectable_layer_unselected_active') : undefined,
        borderRadius: ctx.metric('Tag', 'radius'),
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        right: 0,
        top: 0
      }
    }),
    React.createElement(Pressable, Object.assign({}, button.rootProps, {
      'aria-pressed': selected,
      testID: props.testID,
      style: ctx.pressTarget(faceSize)
    })));

  }

  SelectableTagComponent.displayName = 'SelectableTag';

  return SelectableTagComponent;

}

SelectableTag.spec = SPEC;
