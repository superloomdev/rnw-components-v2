// Info: ExpandableSearch molecule. A search field that opens from a
// magnifier action: collapsed it draws only the trigger, expanded the full
// Search, with focus moving to the input on open and back to the trigger
// after an Escape collapse. It composes Registry.Search with the
// expandable composition props, so the behavior contract lives in one
// place.
//
// Behavior: `useDisclosure` owns `expanded` (controlled or uncontrolled,
// default collapsed); Search owns the rest.

import SPEC from './spec.expandable-search.js';


/********************************************************************
ExpandableSearch factory.

@param {Object} ctx - Component context

@return {Function} - The ExpandableSearch component
*********************************************************************/
export default function ExpandableSearch (ctx) {

  const React = ctx.React;
  const { useDisclosure } = ctx.behaviors;


  /********************************************************************
  ExpandableSearch component.

  @param {Object} props - See `api.expandable-search.js`

  @return {Object} - React element
  *********************************************************************/
  function ExpandableSearchComponent (props) {

    const disclosure = useDisclosure({
      open: props.expanded,
      onOpenChange: props.onExpandedChange,
      disabled: props.disabled
    });
    const open = disclosure.state.open;
    const inputRef = React.useRef(null);
    const triggerRef = React.useRef(null);
    // A USER expand request asks for input focus once the field mounts; a
    // controlled prop change alone never steals it
    const focusRequest = React.useRef(false);
    const requestExpand = function () {
      focusRequest.current = true;
      disclosure.open();
    };

    // The input mounts on open; focus it only for a user's expand request
    React.useEffect(function () {
      if (open && focusRequest.current === true) {
        focusRequest.current = false;
        if (inputRef.current !== null && typeof inputRef.current.focus === 'function') {
          inputRef.current.focus();
        }
      }
    }, [open]);

    return React.createElement(ctx.Registry.Search, {
      accessibilityLabel: props.accessibilityLabel,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
      expanded: open,
      inputRef: inputRef,
      label: props.label,
      // The expandable member's disabled icon reads the indicator's
      // disabled leaf, not the plain search's on-color-disabled
      leadingIconDisabledColor: 'field_indicator_disabled',
      onBlur: props.onBlur,
      onChangeText: props.onChangeText,
      onClear: props.onClear,
      onCollapseRequest: disclosure.close,
      onExpand: requestExpand,
      onFocus: props.onFocus,
      onSubmit: props.onSubmit,
      placeholder: props.placeholder,
      size: props.size,
      surface: props.surface,
      testID: props.testID,
      triggerRef: triggerRef,
      value: props.value
    });

  }

  ExpandableSearchComponent.displayName = 'ExpandableSearch';

  return ExpandableSearchComponent;

}

ExpandableSearch.spec = SPEC;
