// Info: ButtonSet molecule. A row (or column, when `stacked`) of Buttons
// built from `items` data, each filling a seat that shares the row up to the
// set's item width; a separator line sits at every seat's leading edge,
// recolored for a disabled item and suppressed next to a focused one
// (tracked through the items' focus callbacks). A `fluid` set end-aligns
// seats of a quarter of the row, sorts them by kind and, measured by the
// row's own width, halves two items, widens one, or stacks the column.
//
// Behavior: item focus tracked through each Button's `onFocus`/`onBlur`
// (the `useButton` props), for the separator's focus suppression.
//
// Accessibility: a plain container; the Buttons keep their own roles and
// names, the separators draw no tree.

import SPEC from './spec.button-set.js';


/********************************************************************
ButtonSet factory.

@param {Object} ctx - Component context

@return {Function} - The ButtonSet component
*********************************************************************/
export default function ButtonSet (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;

  // A percent unit built from a number, since a bare digit-percent literal
  // is a forbidden unit string
  const PCT = '%';

  // Kind -> order priority in a fluid set; a kind absent here sorts as 4
  const KIND_ORDER = Object.freeze({
    ghost: 1,
    danger_ghost: 2,
    tertiary: 3,
    danger: 5,
    primary: 6
  });

  // The kinds a fluid set treats as ghost: they grow free of the ceiling
  // and take the fluid ghost start padding
  const FLUID_GHOSTS = Object.freeze(['ghost', 'danger_ghost']);


  /********************************************************************
  ButtonSet component.

  @param {Object} props - See `api.button-set.js`

  @return {Object} - React element
  *********************************************************************/
  function ButtonSetComponent (props) {

    // Init the items, the measured width and the focused seat
    const items = Utils.isArray(props.items) ? props.items : [];
    const [width, setWidth] = React.useState(null);
    const [focusedIndex, setFocusedIndex] = React.useState(null);

    // Init the theme's set metrics
    const itemMax = ctx.metric('ButtonSet', 'itemMaxWidth');
    const gap = ctx.metric('ButtonSet', 'gap');
    const separatorWidth = ctx.metric('ButtonSet', 'separatorWidth');
    const fluidMin = ctx.metric('ButtonSet', 'fluidMinWidth');
    const fluidMax = ctx.metric('ButtonSet', 'fluidMaxWidth');
    const fluidGhostStart = ctx.metric('ButtonSet', 'fluidGhostPaddingStart');
    const columnGhostStart = ctx.metric('ButtonSet', 'columnGhostPaddingStart');

    // The fluid layout from the measured row width and the count: a row
    // narrower than every item's floor stacks into a column; two items in a
    // row up to four floors halve the row each; a lone item up to three
    // floors takes the row
    const fluid = props.fluid === true;
    const column = fluid && width !== null && width <= items.length * fluidMin;
    const half = fluid && !column && items.length === 2 && width !== null && width <= 4 * fluidMin;
    const full = fluid && !column && items.length === 1 && width !== null && width <= 3 * fluidMin;
    const stacked = props.stacked === true || column;

    // The items' order: as given, unless fluid sorts them by kind - the
    // kind priority ascending, reversed while the set is stacked
    const ordered = !fluid ? items : items.slice().sort(function (a, b) {
      const pa = KIND_ORDER[a && a.kind] || 4;
      const pb = KIND_ORDER[b && b.kind] || 4;
      return stacked ? pb - pa : pa - pb;
    });

    // Render the root and a seat per item: the button fills its seat and the
    // separator, mounted on every seat but the first, draws at its leading
    // edge - over the previous seat
    return React.createElement(View, {
      onLayout: function (event) {
        const layout = event && event.nativeEvent ? event.nativeEvent.layout : undefined;
        if (layout !== undefined && layout !== null && Utils.isNumber(layout.width)) {
          setWidth(function (previous) {
            return previous === layout.width ? previous : layout.width;
          });
        }
      },
      testID: props.testID,
      style: {
        alignSelf: 'stretch',
        flexDirection: stacked ? 'column' : 'row',
        gap: gap,
        justifyContent: fluid && !stacked ? 'flex-end' : 'flex-start'
      }
    }, ordered.map(function (item, index) {

      const ghostish = Utils.inArray(FLUID_GHOSTS, item && item.kind);

      // The seat's share of the row for the layout the measured width picks
      // A stacked seat stretches the column and keeps its button's height:
      // a zero basis would shrink it to nothing in a container whose own
      // height is indefinite. Every seat is a row so the fill button's zero
      // basis sizes its width while its height can still grow with the label
      const seat = !fluid ? stacked ? {
        alignSelf: 'stretch',
        flexDirection: 'row',
        maxWidth: itemMax,
        position: 'relative'
      } : {
        flexBasis: 0,
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 1,
        maxWidth: itemMax,
        position: 'relative'
      }
        : column ? {
          alignSelf: 'stretch',
          flexDirection: 'row',
          flexGrow: 0,
          flexShrink: 1,
          minWidth: fluidMin,
          position: 'relative',
          width: 100 + PCT
        }
          : full ? {
            flexBasis: 100 + PCT,
            flexDirection: 'row',
            flexGrow: 1,
            flexShrink: 1,
            minWidth: fluidMin,
            position: 'relative'
          }
            : {
              flexBasis: half ? 50 + PCT : 25 + PCT,
              flexDirection: 'row',
              flexGrow: ghostish ? 1 : 0,
              flexShrink: 1,
              maxWidth: half || ghostish ? undefined : fluidMax,
              minWidth: fluidMin,
              position: 'relative'
            };

      // The fluid ghost paddings: the row's own start padding in a fluid
      // row, the tighter column padding once the set has stacked
      const paddingStart = !fluid || !ghostish ? undefined
        : column ? columnGhostStart : fluidGhostStart;

      // The separator's ink: the row or the stacked disabled cell for a
      // disabled item; transparent - still mounted - beside a focused item
      const separator = focusedIndex === index || focusedIndex === index - 1 ? 'transparent'
        : item && item.disabled === true
          ? ctx.color(stacked ? 'button_set_separator_stacked_disabled' : 'button_set_separator_disabled')
          : ctx.color('button_set_separator');
      const separatorStyle = stacked
        ? { backgroundColor: separator, height: separatorWidth, left: 0, position: 'absolute', right: 0, top: -separatorWidth, zIndex: 1 }
        : { backgroundColor: separator, bottom: 0, position: 'absolute', start: -separatorWidth, top: 0, width: separatorWidth, zIndex: 1 };

      return React.createElement(View, { key: index, style: seat },
        React.createElement(ctx.Registry.Button, Object.assign({}, item, {
          fill: true,
          // The set's own focus tracking rides beside an item's callbacks
          onBlur: function (event) {
            setFocusedIndex(function (previous) {
              return previous === index ? null : previous;
            });
            if (typeof item.onBlur === 'function') {
              item.onBlur(event);
            }
          },
          onFocus: function (event) {
            setFocusedIndex(index);
            if (typeof item.onFocus === 'function') {
              item.onFocus(event);
            }
          },
          paddingStart: paddingStart
        })),
        index === 0 ? null : React.createElement(View, { 'aria-hidden': true, style: separatorStyle }));

    }));

  }

  ButtonSetComponent.displayName = 'ButtonSet';

  return ButtonSetComponent;

}

ButtonSet.spec = SPEC;
