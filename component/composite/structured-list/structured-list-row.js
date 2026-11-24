// Info: StructuredListRow member. One row of the list
// (`structured-list/_structured-list.scss:71-150`): its cells from `cells`
// (a string, or `{ text, noWrap }`), then its children, side by side at the
// table's column widths. A body row draws a rule above it in
// `border.width_01` and `color.structured_list_border`; a head row none.
// In a selection list a body row is pressed to select it, takes
// `color.structured_list_row_container_selected` when selected and
// `color.structured_list_row_container_hover` under the pointer when not
// (its cells' labels `color.structured_list_cell_label_selected` in both),
// lends either fill to the next row's rule (`:94-125`; the pointer's wins,
// `:103-111` outranks `:120-124`), holds at least
// `control.structured_list_row_min_height`, and draws its hidden radio
// (StructuredListInput) unless a child is one, with the marker the list
// names: 'radio' a leading glyph cell, 'check' a trailing checkmark cell.
// While its radio holds focus a radio row draws the `border.width_02` ring
// in `color.focus` inside its box below its rule, when it is selected or no row is
// (`StructuredList.js` Row `--focused-within`): a check row never does, as
// upstream's `onFocus` reads the row's own `selection`. It must be composed
// inside StructuredListWrapper.

import SPEC from './spec.structured-list-row.js';
import { createCellContext, createRowContext, createTableContext } from './structured-list-context.js';


/********************************************************************
StructuredListRow factory.

@param {Object} ctx - Component context

@return {Function} - The StructuredListRow component
*********************************************************************/
export default function StructuredListRow (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const { focusNode, useInteractionState } = ctx.behaviors;
  const TableContext = createTableContext(ctx);
  const RowContext = createRowContext(ctx);
  const CellContext = createCellContext(ctx);
  const NO_TABLE = Object.freeze({ hovered: null, marker: null, selected: null, selection: false });


  /********************************************************************
  StructuredListRow component.

  @param {Object} props - See `api.structured-list-row.js`

  @return {Object} - React element
  *********************************************************************/
  function StructuredListRowComponent (props) {

    // Init the row's place in the list
    const context = React.useContext(TableContext);
    const table = context === null ? NO_TABLE : context;
    const head = props.head === true;
    const id = Utils.isString(props.id) ? props.id : null;
    const selectable = table.selection === true && !head && id !== null;
    const [focused, setFocused] = React.useState(false);
    const select = function () {
      table.select(id);
      focusNode(table.inputs[id]);
    };
    const interaction = useInteractionState({ disabled: !selectable, onPress: selectable ? select : undefined });
    const hovered = selectable && interaction.state.hovered === true;

    // Tell the list which row the pointer is over: the next row's rule
    // takes its fill
    const setHovered = table.setHovered;
    const hoveredId = table.hovered;
    React.useEffect(function () {
      if (!selectable) {
        return;
      }
      if (hovered && hoveredId !== id) {
        setHovered(id);
      } else if (!hovered && hoveredId === id) {
        setHovered(null);
      }
    }, [hovered, hoveredId, id, selectable, setHovered]);

    // The fill, the rule above and the ring
    const own = table.selected !== null && table.selected === id;
    const previous = Utils.isString(props.previousId) ? props.previousId : null;
    const previousHovered = selectable && previous !== null && table.hovered === previous && table.selected !== previous;
    const previousSelected = selectable && previous !== null && table.selected === previous;
    let fill = 'transparent';
    if (selectable && own) {
      fill = ctx.color('structured_list_row_container_selected');
    } else if (hovered) {
      fill = ctx.color('structured_list_row_container_hover');
    }
    let rule = 'structured_list_border';
    if (previousHovered || (hovered && !own)) {
      rule = 'structured_list_row_container_hover';
    } else if (selectable && (own || previousSelected)) {
      rule = 'structured_list_row_container_selected';
    }
    const ring = selectable && table.marker === 'radio' && focused && (table.selected === null || own);
    const focusWidth = ctx.metric('StructuredListRow', 'focusWidth');

    // The cells: a radio marker first, the data cells, then the children;
    // a selectable row without a radio child draws its own
    const data = Utils.isArray(props.cells) ? props.cells.map(function (cell, index) {
      const text = Utils.isObject(cell) ? cell.text : cell;
      return React.createElement(ctx.Registry.StructuredListCell, { head: head, key: 'cell-' + index, noWrap: Utils.isObject(cell) && cell.noWrap === true }, text);
    }) : [];
    const children = React.Children.toArray(props.children).filter(function (element) {
      return React.isValidElement(element);
    });
    const isInput = function (element) {
      return element.type === ctx.Registry.StructuredListInput;
    };
    const cells = data.concat(children.filter(function (element) {
      return !isInput(element);
    }));
    const inputs = children.filter(isInput);
    const radio = table.marker === 'radio' && (selectable || head);
    const placed = cells.map(function (element, index) {
      return React.createElement(CellContext.Provider, { key: element.key === null ? 'cell-' + index : element.key, value: { column: index, first: !radio && index === 0 } }, element);
    });
    const markerCell = function (marker) {
      return React.createElement(CellContext.Provider, { key: 'marker-' + marker, value: { column: marker, first: marker === 'radio' } },
        React.createElement(ctx.Registry.StructuredListCell, { head: head, marker: marker }));
    };
    const drawn = [].concat(
      radio ? [markerCell('radio')] : [],
      placed,
      selectable && Utils.isEmptyArray(inputs) ? [React.createElement(ctx.Registry.StructuredListInput, { key: 'input' })] : inputs,
      selectable && table.marker === 'check' ? [markerCell('check')] : []
    );

    // The row context: what the cells draw and what the radio drives
    const value = {
      active: selectable && (own || hovered),
      checked: own,
      head: head,
      id: id,
      setFocused: setFocused
    };
    const style = {
      backgroundColor: fill,
      borderTopColor: ctx.color(rule),
      borderTopWidth: head ? 0 : ctx.metric('StructuredListRow', 'ruleWidth'),
      flexDirection: 'row',
      minHeight: selectable ? ctx.metric('StructuredListRow', 'minHeight') : undefined,
      position: 'relative'
    };
    // The ring lies inside the row below its rule: upstream's outline is
    // inset from a box whose collapsed rule sits above it (pixel probe
    // 2026-11-24: upstream's ring at rows 1-2 under the rule at 0), so it
    // is drawn on the row's padding box, not as the row's outline
    const ringLayer = ring ? React.createElement(View, {
      'aria-hidden': true,
      dataSet: { part: 'ring' },
      key: 'ring',
      pointerEvents: 'none',
      style: { borderColor: ctx.color('focus'), borderWidth: focusWidth, bottom: 0, end: 0, position: 'absolute', start: 0, top: 0 }
    }) : null;
    const content = React.createElement(RowContext.Provider, { value: value }, drawn, ringLayer);
    if (!selectable) {
      return React.createElement(View, { dataSet: { part: head ? 'headRow' : 'row' }, role: 'row', testID: props.testID, style: style }, content);
    }
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      dataSet: { part: 'row' },
      role: 'row',
      tabIndex: -1,
      testID: props.testID,
      style: style
    }), content);

  }

  StructuredListRowComponent.displayName = 'StructuredListRow';
  return StructuredListRowComponent;

}

StructuredListRow.spec = SPEC;
