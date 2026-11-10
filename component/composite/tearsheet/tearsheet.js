// Info: Tearsheet composite. A `role="dialog"` container bottom-anchored
// in its layer space over a `dialog_scrim` layer: a header (label,
// heading, description, optional navigation and close IconButton), an
// optional influencer panel, the main content and an action row. Escape
// and the focus trap come from the focus-trap behavior; outside press
// closes only a passive tearsheet (no actions); `onClose` returning
// `false` vetoes the close. The container insets read the tearsheet cells
// of the layer space it covers (D23/D24: no breakpoint read). It enters
// from `min(0.95 x layer height, tearsheet_enter_offset)` below over
// `motion.duration_moderate_02` (reduced motion and the measurement mode
// draw it at rest). Hosted open tearsheets form one stack: at most 3
// render, a level below the top scaled and taller-floored per level.

import SPEC from './spec.tearsheet.js';

// The action draw order: ghost leftmost, primary rightmost (upstream's
// ActionSet order)
const ORDER = { ghost: 1, danger_ghost: 2, tertiary: 3, secondary: 4, danger: 5, primary: 6 };
const STACK_DEPTH = 3;
const STACK_SHRINK = 32;


/********************************************************************
Tearsheet factory.

@param {Object} ctx - Component context

@return {Function} - The Tearsheet component
*********************************************************************/
export default function Tearsheet (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useA11yId, useFocusTrap, useLayerSpace, useOverlay, useReducedMotion, useViewportLayer } = ctx.behaviors;


  /********************************************************************
  Tearsheet component.

  @param {Object} props - See `api.tearsheet.js`

  @return {Object} - React element
  *********************************************************************/
  function TearsheetComponent (props) {

    const open = props.open === true;
    const metrics = {
      actionHeight: ctx.metric('Tearsheet', 'actionHeight'),
      actionMaxWidth: ctx.metric('Tearsheet', 'actionMaxWidth'),
      actionPaddingBottom: ctx.metric('Tearsheet', 'actionPaddingBottom'),
      actionPaddingTop: ctx.metric('Tearsheet', 'actionPaddingTop'),
      borderWidth: ctx.metric('Tearsheet', 'borderWidth'),
      closeIconSize: ctx.metric('Tearsheet', 'closeIconSize'),
      closeSize: ctx.metric('Tearsheet', 'closeSize'),
      descriptionGap: ctx.metric('Tearsheet', 'descriptionGap'),
      descriptionMaxRatio: ctx.metric('Tearsheet', 'descriptionMaxRatio'),
      dividerWidth: ctx.metric('Tearsheet', 'dividerWidth'),
      enterOffset: ctx.metric('Tearsheet', 'enterOffset'),
      headerMinHeight: ctx.metric('Tearsheet', 'headerMinHeight'),
      headerPaddingBlock: ctx.metric('Tearsheet', 'headerPaddingBlock'),
      headerPaddingEnd: ctx.metric('Tearsheet', 'headerPaddingEnd'),
      headerPaddingInline: ctx.metric('Tearsheet', 'headerPaddingInline'),
      influencerWidth: ctx.metric('Tearsheet', 'influencerWidth'),
      influencerWidthWide: ctx.metric('Tearsheet', 'influencerWidthWide'),
      insetInline: ctx.metric('Tearsheet', 'insetInline'),
      insetTop: ctx.metric('Tearsheet', 'insetTop'),
      insetTopLower: ctx.metric('Tearsheet', 'insetTopLower'),
      labelGap: ctx.metric('Tearsheet', 'labelGap'),
      navigationGap: ctx.metric('Tearsheet', 'navigationGap'),
      stackOffset: ctx.metric('Tearsheet', 'stackOffset'),
      stacking: ctx.metric('Tearsheet', 'stacking')
    };
    // A node prop given as a string renders in the fixture body type
    const nodeOf = function (node, key) {
      return Utils.isString(node)
        ? React.createElement(Text, { key: key, style: ctx.typeStyle('body_compact_01') }, node)
        : node;
    };
    const headingId = useA11yId('tearsheet-heading');
    const labelId = useA11yId('tearsheet-label');
    const closeRef = React.useRef(null);
    const firstActionRef = React.useRef(null);

    // The actions in draw order: ghost, secondary, primary
    const actions = (Utils.isArray(props.actions) ? props.actions.slice(0) : []).sort(function (a, b) {
      return (ORDER[(a && a.kind) || 'primary'] || 4) - (ORDER[(b && b.kind) || 'primary'] || 4);
    });
    const passive = Utils.isEmptyArray(actions);
    const hasClose = props.hasCloseIcon === undefined ? passive : props.hasCloseIcon === true;

    // A close request: `onClose` returning false vetoes it
    const requestClose = function () {
      if (typeof props.onClose === 'function' && props.onClose() === false) {
        return;
      }
    };

    // Escape, the tab wrap and the focus memory live in the trap
    // behavior; the open focus lands on the close button when drawn,
    // else the first action button (upstream's claimFocus order)
    const trap = useFocusTrap({
      finalFocusRef: props.returnFocusRef,
      initialFocusRef: hasClose ? closeRef : firstActionRef,
      isOpen: open,
      onClose: requestClose
    });

    // The container's box inside the layer space: the inline inset off
    // each side, the top inset off the top, anchored to the bottom
    const space = useLayerSpace();
    const measured = Utils.isNumber(space.width) && space.width > 0 && Utils.isNumber(space.height) && space.height > 0;
    const insetTop = props.verticalPosition === 'lower' ? metrics.insetTopLower : metrics.insetTop;
    const boxWidth = measured ? space.width - 2 * metrics.insetInline : undefined;
    const boxHeight = measured ? space.height - insetTop : undefined;
    const innerWidth = Utils.isNumber(boxWidth) ? boxWidth - 2 * metrics.borderWidth : undefined;

    // The influencer: left spans the whole body beside main; right sits
    // inside main above the action row
    const hasInfluencer = props.influencer !== undefined && props.influencer !== null;
    const influencerRight = hasInfluencer && props.influencerPosition === 'right';
    const influencerLeft = hasInfluencer && !influencerRight;
    const influencerWidth = props.influencerWidth === 'wide' ? metrics.influencerWidthWide : metrics.influencerWidth;

    // The action row spans main: a quarter each capped at the action
    // max width; a ghost grows into what is left
    const rowWidth = Utils.isNumber(innerWidth)
      ? innerWidth - (influencerLeft ? influencerWidth + metrics.dividerWidth : 0)
      : undefined;
    const seatWidth = Utils.isNumber(rowWidth) ? Math.min(rowWidth * 0.25, metrics.actionMaxWidth) : metrics.actionMaxWidth;

    // The enter motion: from the enter offset below to rest; reduced
    // motion and the measurement mode draw it at rest
    const entered = React.useState(false);
    const reduced = useReducedMotion();
    React.useEffect(function () {
      if (open && !entered[0]) {
        entered[1](true);
      }
    }, [open]);
    const offset = measured ? Math.min(0.95 * space.height, metrics.enterOffset) : metrics.enterOffset;
    const animated = open && offset !== 0 && !reduced;

    // The layer renders through an overlay host where one is mounted;
    // its open Tearsheet layers form the stack
    const overlay = useOverlay({
      isOpen: open,
      name: 'Tearsheet',
      onClose: requestClose,
      render: function () {
        return position > STACK_DEPTH ? null : buildScrim();
      },
      trap: true
    });
    const stack = overlay.hosted && Utils.isArray(overlay.layers)
      ? overlay.layers.filter(function (layer) {
        return layer.name === 'Tearsheet';
      })
      : [];
    const depth = Math.min(stack.length, STACK_DEPTH);
    const index = overlay.hosted ? stack.findIndex(function (layer) {
      return layer.id === overlay.layerId;
    }) : 0;
    const position = index === -1 ? stack.length : index + 1;
    const level = depth - position;
    const scale = level <= 0 ? 1 : (innerWidth - STACK_SHRINK * level) / innerWidth;

    // The header block: label, heading, description, navigation; the
    // close button seats the header end and shortens its end padding
    const headerChildren = [];
    if (Utils.isString(props.label)) {
      headerChildren.push(React.createElement(Text, {
        dataSet: { part: 'label' },
        key: 'label',
        nativeID: labelId,
        style: [ctx.typeStyle('label01'), { color: ctx.color('text_secondary'), marginBottom: metrics.labelGap }]
      }, props.label));
    }
    if (Utils.isString(props.title)) {
      headerChildren.push(React.createElement(View, {
        dataSet: { part: 'heading' },
        key: 'heading'
      }, React.createElement(ctx.Registry.Text, {
        accessibilityRole: 'header',
        color: 'dialog_heading',
        headingLevel: 3,
        id: headingId,
        type: 'tearsheet_heading'
      }, props.title)));
    }
    if (Utils.isString(props.description)) {
      headerChildren.push(React.createElement(Text, {
        dataSet: { part: 'description' },
        key: 'description',
        style: [ctx.typeStyle('tearsheet_description'), { color: ctx.color('dialog_heading'), marginTop: metrics.descriptionGap, maxWidth: String(metrics.descriptionMaxRatio * 100) + '%' }]
      }, props.description));
    }
    if (props.navigation !== undefined && props.navigation !== null) {
      headerChildren.push(React.createElement(View, {
        dataSet: { part: 'navigation' },
        key: 'navigation',
        style: { marginTop: metrics.navigationGap }
      }, nodeOf(props.navigation, 'navigation')));
    }
    const header = React.createElement(View, {
      dataSet: { part: 'header' },
      style: {
        backgroundColor: ctx.color('tearsheet_header_container'),
        borderBottomColor: ctx.color('tearsheet_divider'),
        borderBottomWidth: metrics.dividerWidth,
        minHeight: metrics.headerMinHeight,
        paddingBottom: props.navigation === undefined || props.navigation === null ? metrics.headerPaddingBlock : 0,
        paddingEnd: hasClose ? metrics.headerPaddingEnd : metrics.headerPaddingInline,
        paddingStart: metrics.headerPaddingInline,
        paddingTop: metrics.headerPaddingBlock
      }
    }, headerChildren, props.headerActions !== undefined && props.headerActions !== null ? props.headerActions : null);

    // The influencer panel
    const influencer = !hasInfluencer ? null : React.createElement(View, {
      dataSet: { part: 'influencer' },
      style: {
        backgroundColor: influencerRight ? ctx.color('tearsheet_influencer_container') : undefined,
        borderLeftColor: influencerRight ? ctx.color('tearsheet_divider') : undefined,
        borderLeftWidth: influencerRight ? metrics.dividerWidth : 0,
        borderRightColor: influencerLeft ? ctx.color('tearsheet_divider') : undefined,
        borderRightWidth: influencerLeft ? metrics.dividerWidth : 0,
        width: influencerWidth + metrics.dividerWidth
      }
    }, nodeOf(props.influencer, 'influencer'));

    // The action row: the seat paints the actions container and the top
    // rule under main only; buttons right-aligned, a ghost grows left
    const buttons = actions.map(function (action, i) {
      const ghost = (action && action.kind) === 'ghost';
      return React.createElement(View, {
        key: 'action-' + i,
        style: ghost
          ? { flexBasis: '50%', flexGrow: 1, flexShrink: 1 }
          : { flexBasis: seatWidth, flexGrow: 0, flexShrink: 1, maxWidth: metrics.actionMaxWidth }
      },
      React.createElement(ctx.Registry.Button, {
        buttonRef: i === 0 ? firstActionRef : undefined,
        disabled: action && action.disabled === true,
        fill: true,
        kind: (action && action.kind) || 'primary',
        onPress: function () {
          if (action && typeof action.onPress === 'function') {
            action.onPress();
          }
        },
        paddingBottom: metrics.actionPaddingBottom,
        paddingTop: metrics.actionPaddingTop,
        size: '2xl'
      }, action && action.label));
    });
    const actionRow = Utils.isEmptyArray(actions) ? null : React.createElement(View, {
      dataSet: { part: 'buttonContainer' }
    },
    React.createElement(View, {
      dataSet: { part: 'buttonSet' },
      style: {
        backgroundColor: ctx.color('tearsheet_actions_container'),
        borderTopColor: ctx.color('tearsheet_divider'),
        borderTopWidth: metrics.dividerWidth,
        flexDirection: 'row',
        justifyContent: 'flex-end'
      }
    }, buttons));

    // The close button at the header end
    const close = !hasClose ? null : React.createElement(View, {
      style: { position: 'absolute', right: 16, top: 8 }
    }, React.createElement(View, {
      dataSet: { part: 'close' }
    }, React.createElement(ctx.Registry.IconButton, {
      buttonRef: closeRef,
      icon: 'close',
      iconSize: metrics.closeIconSize,
      kind: 'ghost',
      label: Utils.isString(props.closeIconDescription) ? props.closeIconDescription : 'Close',
      onPress: requestClose,
      size: 'lg'
    })));

    // The main region: the content and the action row, plus a
    // right-positioned influencer inside it
    const main = React.createElement(View, {
      dataSet: { part: 'main' },
      style: { backgroundColor: ctx.color('tearsheet_main_container'), flex: 1 }
    },
    React.createElement(View, {
      style: { flex: 1, flexDirection: 'row' }
    },
    React.createElement(View, {
      dataSet: { part: 'content' },
      style: { flex: 1 }
    }, nodeOf(props.children, 'children')),
    influencerRight ? influencer : null),
    actionRow);

    // The body row under the header: a left influencer beside main
    const body = React.createElement(View, {
      dataSet: { part: 'tearsheetBody' },
      style: { flex: 1, flexDirection: 'row' }
    }, influencerLeft ? influencer : null, main);

    // The container: insets off the layer space, bottom-anchored, the
    // dialog border cells on every side
    const container = React.createElement(View, {
      ref: trap.containerRef,
      'aria-label': Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : undefined,
      'aria-labelledby': Utils.isString(props.accessibilityLabel) ? undefined : (Utils.isString(props.label) ? labelId + ' ' + headingId : headingId),
      'aria-modal': true,
      dataSet: { part: 'container' },
      focusable: true,
      role: 'dialog',
      tabIndex: -1,
      testID: props.testID,
      style: [{
        backgroundColor: ctx.color('dialog_container'),
        borderColor: ctx.color('dialog_border'),
        borderWidth: metrics.borderWidth,
        height: boxHeight === undefined ? undefined : Math.min(boxHeight + (level > 0 ? level * metrics.stackOffset : 0), boxHeight + 3 * metrics.stackOffset),
        left: metrics.insetInline,
        opacity: measured ? undefined : 0,
        outlineStyle: 'none',
        position: 'absolute',
        top: insetTop,
        transform: (animated ? [{ translateY: entered[0] ? 0 : offset }] : []).concat(level > 0 ? [{ scale: scale }] : []),
        transitionDuration: String(ctx.token('motion.duration_moderate_02')) + 'ms',
        transitionProperty: 'transform',
        transitionTimingFunction: 'ease-out',
        width: boxWidth
      }]
    }, header, body, close);

    // The scrim covers the layer space; outside press closes only a
    // passive tearsheet
    const layerStyle = useViewportLayer();

    function buildScrim () {
      return React.createElement(Pressable, {
        dataSet: { part: 'scrim' },
        testID: 'tearsheet-scrim',
        onPress: function (event) {
          if (event.target === event.currentTarget && passive) {
            trap.onOutsidePress();
          }
        },
        style: [layerStyle, {
          backgroundColor: ctx.color('dialog_scrim'),
          zIndex: metrics.stacking
        }]
      }, container);
    }

    if (!open || position > STACK_DEPTH) {
      return null;
    }

    return overlay.hosted ? null : buildScrim();

  }

  TearsheetComponent.displayName = 'Tearsheet';

  return TearsheetComponent;

}

Tearsheet.spec = SPEC;
