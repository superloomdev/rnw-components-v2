// Info: StructuredListInput member. A selection row's radio
// (`StructuredList.js` Input: an `input type="radio"` with the
// visually-hidden class): no box of its own, a point at the row's start
// that takes focus and announces the row's selection. Pressed, or Space,
// it selects its row; the arrow keys select the next or previous row and
// move focus to its radio, as a radio group does. While it holds focus its
// row may draw the focus ring (StructuredListRow). A row draws one unless
// a child is one. It must be composed inside a StructuredListRow of a
// selection list.

import SPEC from './spec.structured-list-input.js';
import { createRowContext, createTableContext } from './structured-list-context.js';


/********************************************************************
StructuredListInput factory.

@param {Object} ctx - Component context

@return {Function} - The StructuredListInput component
*********************************************************************/
export default function StructuredListInput (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable } = ctx.ReactNative;
  const { getA11yState, usePressKeys } = ctx.behaviors;
  const TableContext = createTableContext(ctx);
  const RowContext = createRowContext(ctx);
  const STEPS = Object.freeze({ ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1 });


  /********************************************************************
  StructuredListInput component.

  @param {Object} props - See `api.structured-list-input.js`

  @return {Object} - React element
  *********************************************************************/
  function StructuredListInputComponent (props) {

    const table = React.useContext(TableContext);
    const row = React.useContext(RowContext);
    const id = row.id;
    const inputRef = React.useRef(null);
    const inputs = table === null ? null : table.inputs;

    // The list finds a row's radio to move focus to it
    React.useEffect(function () {
      if (inputs === null || id === null) {
        return undefined;
      }
      inputs[id] = inputRef.current;
      return function () {
        if (inputs[id] === inputRef.current) {
          delete inputs[id];
        }
      };
    }, [inputs, id]);

    const select = function () {
      if (table !== null && id !== null) {
        table.select(id);
      }
    };
    const keys = usePressKeys({ role: 'radio', onActivate: select });
    const onKeyDown = function (event) {
      const delta = STEPS[event.key];
      if (delta !== undefined && table !== null && id !== null) {
        event.preventDefault();
        table.step(id, delta);
        return;
      }
      keys.onKeyDown(event);
    };
    const setFocused = typeof row.setFocused === 'function' ? row.setFocused : function () {};
    return React.createElement(Pressable, Object.assign(getA11yState({ checked: row.checked === true }), {
      'aria-label': Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : id === null ? undefined : id,
      onBlur: function () {
        setFocused(false);
      },
      onFocus: function () {
        setFocused(true);
      },
      onKeyDown: onKeyDown,
      onPress: select,
      ref: inputRef,
      accessibilityRole: 'radio',
      tabIndex: 0,
      testID: props.testID,
      style: { height: 1, opacity: 0, overflow: 'hidden', position: 'absolute', start: 0, top: 0, width: 1 }
    }));

  }

  StructuredListInputComponent.displayName = 'StructuredListInput';
  return StructuredListInputComponent;

}

StructuredListInput.spec = SPEC;
