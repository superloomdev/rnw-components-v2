// Info: Shared multiple-choice field parts for the family's MultiSelect and
// FilterableMultiSelect owners. One renderer draws both: a field root
// holding the label, the frame (an in-flow row of the optional selection
// count member and the control - a pressable combobox for the press-only
// owner, the injected text input for the editable one - plus the absolute
// invalid icon and caret seats) and a helper or error message; while open,
// the option list sits below the frame on the theme's `list` role cells,
// scrolled by a real ScrollView the behavior's measured scrollProps drive.
// Every value, query, open, focus and scroll answer comes from
// `useMultiSelect`; this file owns only geometry and naming.
//
// Private to the family; nothing here is a registry row or a public export.


/********************************************************************
Build one multiple-choice field component for its owning factory. Called
once inside the owner, never during render.

@param {String}  owner     - Spec name holding the owner's metrics
@param {Boolean} filterable - The editable-query control when true
@param {String}  prefix    - The owner's testID prefix

@return {Function} - `(ctx) => Component`
*********************************************************************/
export default function createMultiSelectComponent (owner, filterable, prefix) {

  return function buildComponent (ctx) {

    const React = ctx.React;
    const Utils = ctx.Utils;
    const { Pressable, ScrollView, Text, View } = ctx.ReactNative;
    const NativeTextInput = ctx.ReactNative.TextInput;
    const { getA11yLive, getA11yState, useA11yId, useAnchoredPosition, useLiveRegionHost,
      useMultiSelect, useOverlay, usePopoverDismiss } = ctx.behaviors;

    // Size -> height metric in the spec sheet
    const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


    /********************************************************************
    Multiple-choice field component.

    @param {Object} props - See the owner's api file

    @return {Object} - React element
    *********************************************************************/
    function MultiSelectComponent (props) {

      // Init the behavior and its state; the owner flag picks the control
      // face. All hooks mount unconditionally
      const multi = useMultiSelect(Object.assign({}, props, { filterable: filterable }));
      const state = multi.state;
      const liveRegion = useLiveRegionHost();
      const messageId = useA11yId(prefix + '-message');
      const rootRef = React.useRef(null);
      const frameRef = React.useRef(null);
      const contentRef = React.useRef(null);
      const open = state.open === true;
      const disabled = state.disabled === true;
      const invalid = state.invalid === true;
      const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);
      const displayed = multi.items;
      const selectedSet = new Set(multi.selectedValues);
      const hasCount = state.selectedCount > 0;

      // Announce a committed count change through the live-region host; a
      // native platform's behavior announcer already spoke and leaves the
      // host's polite message empty, so the element never double-announces
      const announcement = state.announcement;
      React.useEffect(function () {
        if (Utils.isString(announcement) && !Utils.isEmptyString(announcement)) {
          liveRegion.announce(announcement, 'polite');
        }
      }, [announcement, liveRegion.announce]);

      // Read the geometry and the theme's field presentation as the select
      // member; while the open list carries the highlight the field's own
      // ring rests
      const height = ctx.metric(owner, SIZES[props.size] || 'height');
      const iconSize = ctx.metric(owner, 'iconSize');
      const iconZone = ctx.metric(owner, 'iconZone');
      const iconInset = ctx.metric(owner, 'iconInset');
      const invalidIconInset = ctx.metric(owner, 'invalidIconInset');
      const checkboxSize = ctx.metric(owner, 'checkboxSize');
      const surface = Utils.isString(props.surface) ? props.surface
        : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
      const presentation = ctx.fieldPresentation({
        disabled: disabled,
        focused: state.focused === true,
        // The source keeps the normal field ring while the open list
        // carries the highlight - it only shrinks it; the frame pass
        // below performs that reduction
        highlighted: false,
        // The editable anatomy keeps the field fill on hover; only the
        // press-only owner's frame paints the hover cell
        hovered: filterable !== true && state.hovered === true,
        invalid: invalid,
        open: open,
        populated: state.populated === true
      }, {
        member: 'select',
        height: height,
        radius: ctx.metric(owner, 'radius'),
        surface: surface,
        trailing: true
      });

      // The frame zeroes its inline padding so the in-flow row places the
      // count member and the control itself; an open underline frame redraws
      // its bottom edge in the subtle border color, as the family's
      // dropdown does
      const underline = ctx.enum('feedback.field') === 'underline';
      const restingEdge = ctx.metric(owner, 'restingEdge');
      const frameBottom = Utils.isNumber(presentation.frame.borderBottomWidth) ? presentation.frame.borderBottomWidth : 0;
      const contentHeight = underline ? height - frameBottom : height - 2 * presentation.borderSide;
      const frame = Object.assign({}, presentation.frame, { paddingEnd: 0, paddingStart: 0 },
        open && underline
          ? { borderBottomColor: ctx.color('border_subtle_01'), borderBottomWidth: restingEdge }
          : {});
      // The press-only owner's reference wraps its row at the field height -
      // the source's content-plus-resting-edge calc lands on exactly that;
      // the editable form and every outline row ends at the content edge
      const wrapperHeight = underline && !filterable ? height : contentHeight;

      // While open with an option carrying the active descendant the
      // source draws the field's ring at the partial width and its own
      // negative offset, beside the option's highlight; a frame the
      // presentation gave no solid outline keeps exactly that answer
      if (open === true && state.highlightedIndex >= 0 && frame.outlineStyle === 'solid') {
        const partialWidth = ctx.metric(owner, 'highlightedFieldRingWidth');
        Object.assign(frame, { outlineOffset: -partialWidth, outlineWidth: partialWidth });
      }

      // The theme's list presentation; the rows take the field's own
      // height, as the reference sizes its list rows with its size
      const list = ctx.listPresentation({
        itemHeight: height,
        paddingInline: ctx.metric(owner, 'rowPaddingInline'),
        dividerWidth: ctx.metric(owner, 'rowDividerWidth'),
        paddingBlock: ctx.metric(owner, 'listPaddingBlock'),
        radius: ctx.metric(owner, 'listRadius'),
        level: ctx.metric(owner, 'listLevel')
      });
      const optionTextInset = ctx.metric(owner, 'optionTextInset');
      const inputPaddingEnd = invalid
        ? ctx.metric(owner, 'inputPaddingEndInvalid') : ctx.metric(owner, 'inputPaddingEnd');

      // The frame owns the hover: moving between the row's children never
      // clears it, so the control's own pointer bindings move up to it
      const frameHover = filterable
        ? { onPointerEnter: multi.inputProps.onPointerEnter, onPointerLeave: multi.inputProps.onPointerLeave }
        : { onPointerEnter: multi.triggerProps.onPointerEnter, onPointerLeave: multi.triggerProps.onPointerLeave };
      const controlProps = Object.assign({}, filterable ? multi.inputProps : multi.triggerProps);
      delete controlProps.onPointerEnter;
      delete controlProps.onPointerLeave;

      // The message below: the error while invalid, else the helper
      const message = invalid && Utils.isString(props.invalidText) ? props.invalidText
        : Utils.isString(props.helperText) ? props.helperText : null;

      // The count member: the source's high-contrast tag answers on the
      // existing inverse-surface leaves through the dismissible tag's
      // composition seams; its clear stays outside the control so a press
      // never also toggles the list
      const count = !hasCount ? null : React.createElement(View, {
        style: { marginEnd: ctx.metric(owner, 'countEnd'), marginStart: ctx.metric(owner, 'countStart') }
      },
      React.createElement(ctx.Registry.DismissibleTag, {
        closeGap: ctx.metric(owner, 'countCloseGap'),
        paddingStart: ctx.metric(owner, 'countPaddingStart'),
        containerLeaf: disabled ? 'layer_01' : 'background_inverse',
        labelLeaf: disabled ? 'text_disabled' : 'text_inverse',
        iconLeaf: disabled ? 'icon_disabled' : 'icon_inverse',
        closeHoverLeaf: 'background_inverse_hover',
        closeFocusLeaf: 'focus_inverse',
        size: props.size,
        tooltip: false,
        text: String(state.selectedCount),
        title: multi.clearProps.accessibilityLabel,
        disabled: disabled,
        onClose: multi.clearProps.onPress,
        testID: prefix + '-count'
      }));

      // The caret seat: an absolute iconZone square at the end inset,
      // centered on the wrapper. The press-only owner's sits inside its
      // trigger after the value - decorative and pointer-transparent there,
      // the trigger being the one activation and the focus target a
      // mouse-down lands on; the editable owner's stays a sibling carrying
      // the toggle pressable, an input cannot hold children
      const caret = React.createElement(View, {
        testID: prefix + '-caret',
        pointerEvents: filterable ? undefined : 'none',
        style: {
          alignItems: 'center',
          height: iconZone,
          justifyContent: 'center',
          position: 'absolute',
          end: iconInset,
          top: (wrapperHeight - iconZone) / 2,
          transform: open ? [{ rotate: '180deg' }] : [],
          width: iconZone
        }
      },
      React.createElement(ctx.Registry.Icon, { name: 'dropdown_indicator', size: iconSize, color: presentation.indicator }),
      filterable === true ? React.createElement(Pressable, Object.assign({}, multi.toggleProps, {
        style: ctx.pressTarget({ height: iconZone, width: iconZone })
      })) : null);

      // The control: the press-only owner's combobox trigger draws a
      // one-line field value, or the editable owner's injected input holds
      // the query; neither holds the caret or error icon in its text flow
      const fieldPaddingInline = ctx.token('control.field_padding_inline');
      const control = filterable
        ? React.createElement(NativeTextInput, Object.assign({}, controlProps, {
          accessibilityLabel: props.accessibilityLabel,
          'aria-describedby': message === null ? undefined : messageId,
          // The DOM click and a native press-in are the input's press and
          // the key event arrives as onKeyPress: the hook's handlers still
          // own the answers
          onClick: controlProps.onPress,
          onKeyPress: controlProps.onKeyDown,
          onPressIn: controlProps.onPress,
          placeholder: presentation.placeholder === true || !labelled
            ? (Utils.isString(props.placeholder) ? props.placeholder : '') : undefined,
          placeholderTextColor: presentation.placeholderColor,
          testID: prefix + '-trigger',
          style: [presentation.value, {
            alignSelf: 'stretch',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: ctx.metric(owner, 'inputEdge'),
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            opacity: labelled && !presentation.placeholder ? 0 : 1,
            outlineStyle: 'none',
            paddingEnd: inputPaddingEnd,
            paddingStart: hasCount ? 0 : fieldPaddingInline
          }]
        }))
        : React.createElement(Pressable, Object.assign({}, controlProps, getA11yState({ invalid: invalid ? true : undefined }), {
          accessibilityLabel: props.accessibilityLabel,
          'aria-describedby': message === null ? undefined : messageId,
          testID: prefix + '-trigger',
          // The focus ring is drawn on the frame, so the trigger itself
          // shows none
          style: {
            alignItems: 'center',
            alignSelf: 'stretch',
            flexBasis: 'auto',
            flexDirection: 'row',
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            outlineStyle: 'none',
            paddingEnd: inputPaddingEnd,
            paddingStart: hasCount ? 0 : fieldPaddingInline,
            position: 'relative'
          }
        }),
        React.createElement(Text, {
          numberOfLines: 1,
          testID: prefix + '-value',
          // A list box's prompt is its placeholder in the field's own ink;
          // under a floating label it stays in the tree, undrawn
          style: [presentation.value, {
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            opacity: !state.populated && labelled && ctx.enum('anatomy.label') === 'floating' ? 0 : 1
          }]
        }, Utils.isString(props.placeholder) ? props.placeholder : ''),
        caret);

      // The error icon seat: absolute at its inset, centered on the
      // frame's content height
      const icon = !invalid ? null : React.createElement(View, {
        testID: prefix + '-invalid',
        style: {
          alignItems: 'center',
          height: iconSize,
          justifyContent: 'center',
          position: 'absolute',
          end: invalidIconInset,
          top: (contentHeight - iconSize) / 2,
          width: iconSize
        }
      },
      React.createElement(ctx.Registry.Icon, { name: 'invalid', size: iconSize, color: presentation.invalidIcon }));

      // The frame is the open list's anchor: where an overlay host is
      // mounted the list renders through it on the layer style the
      // positioner returns; unhosted it keeps its inline seat below the
      // frame and a global click outside the root requests the close
      const edge = presentation.borderSide;
      const anchored = useAnchoredPosition({
        anchor: frameRef,
        // The same content-edge placement the inline seat uses: the wrapper
        // extent relative to the frame's own height, plus the outline's side
        // border the layered list covers where a frame draws one
        offset: wrapperHeight + (underline ? 0 : edge) - height,
        placement: 'bottom-start',
        track: open
      });
      React.useEffect(function () {
        if (open) {
          anchored.measure();
        }
      }, [open, anchored.measure]);

      // The list registers with the overlay host while open; the host
      // calls `render` after this component has returned
      const overlay = useOverlay({
        isOpen: open,
        name: owner,
        onClose: function () {
          multi.setOpen(false);
        },
        render: function () {
          return listElement;
        }
      });
      // Only the unhosted global-click effect is consumed: its returned
      // root/content props are DOM-only (`contains` on blur) and native
      // View refs do not supply them, so nothing is bound
      usePopoverDismiss({
        contentRef: contentRef,
        onRequestClose: function () {
          multi.setOpen(false);
        },
        open: open && overlay.hosted !== true,
        rootRef: rootRef,
        triggerRef: multi.inputRef
      });

      // The listbox spans the frame border to border - it pulls itself out
      // by the side borders' thickness - and scrolls on a real ScrollView
      // the behavior's measured props drive; every row reports its own
      // layout by value through the hook
      const listPaddingBlock = ctx.metric(owner, 'listPaddingBlock');
      const listMaxHeight = height * ctx.metric(owner, 'listMaxRows');
      const listElement = open ? React.createElement(View, Object.assign({}, multi.listProps, {
        ref: contentRef,
        testID: prefix + '-list',
        style: [overlay.hosted === true
          ? Object.assign({}, anchored.layerStyle, {
            left: anchored.layerStyle.left - edge,
            transform: [{ translateX: (anchored.shift || { x: 0 }).x + '%' }, { translateY: (anchored.shift || { y: 0 }).y + '%' }],
            width: anchored.anchor === null ? undefined : anchored.anchor.width + 2 * edge
          })
          : {
            left: -edge,
            position: 'absolute',
            right: -edge,
            top: wrapperHeight
          }, list.container, {
          maxHeight: listMaxHeight + 2 * listPaddingBlock
        }]
      }),
      React.createElement(ScrollView, Object.assign({}, multi.scrollProps, {
        testID: prefix + '-scroll',
        style: { flexGrow: 0, maxHeight: listMaxHeight }
      }),
      displayed.map(function (item, index) {
        const itemDisabled = item.disabled === true;
        const chosen = selectedSet.has(item.value);
        const highlighted = index === state.highlightedIndex;
        // The source's first highlighted row draws its own mounted border
        // instead of the generic row outline when the count member shows
        const firstRing = highlighted === true && index === 0 && hasCount;
        const itemState = function (interaction) {
          return {
            disabled: itemDisabled,
            highlighted: highlighted === true,
            hovered: interaction.hovered === true,
            pressed: interaction.pressed === true,
            selected: chosen
          };
        };
        // The divider hides on the first row and on the rows at and after
        // a highlighted or selected row, as the family's dropdown does
        const divider = index !== 0 && index !== state.highlightedIndex &&
          index - 1 !== state.highlightedIndex && !chosen &&
          !(index > 0 && selectedSet.has(displayed[index - 1].value));
        return React.createElement(Pressable, Object.assign({}, multi.getOptionProps(index), {
          'aria-label': item.label,
          tabIndex: -1,
          style: function (interaction) {
            const painted = list.item(itemState(interaction));
            // The mounted first-row border replaces the generic ring only:
            // the row keeps its real highlighted fill and ink
            return firstRing === true
              ? Object.assign({}, painted, { outlineStyle: 'none', outlineWidth: 0 })
              : painted;
          }
        }),
        // The decorative checkbox member: pointer-transparent and hidden
        // from assistive technology, keeping the controlled paint; the
        // host's row answers input and focus
        React.createElement(View, {
          'aria-hidden': true,
          pointerEvents: 'none',
          style: {
            height: checkboxSize,
            position: 'absolute',
            start: ctx.metric(owner, 'rowPaddingInline'),
            top: (height - checkboxSize) / 2 - ctx.metric('Checkbox', 'boxInsetTop'),
            width: checkboxSize + ctx.metric('Checkbox', 'boxInsetStart')
          }
        },
        React.createElement(ctx.Registry.Checkbox, {
          checked: chosen,
          disabled: disabled || itemDisabled,
          label: '',
          presentationOnly: true
        })),
        React.createElement(View, {
          dataSet: { part: 'option-content' },
          style: list.option(divider)
        },
        React.createElement(Text, {
          numberOfLines: 1,
          style: [list.label(itemState({})), { marginStart: optionTextInset }]
        }, item.label)),
        firstRing === true ? React.createElement(View, {
          pointerEvents: 'none',
          style: {
            borderBottomWidth: ctx.token('control.field_focus_width'),
            borderColor: ctx.color('field_focus_ring'),
            borderLeftWidth: ctx.token('control.field_focus_width'),
            borderRightWidth: ctx.token('control.field_focus_width'),
            borderTopWidth: ctx.metric(owner, 'firstRingTopWidth'),
            bottom: 0,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          }
        }) : null);
      }))) : null;

      // Render the root, the label, the frame with its row, the message and
      // the hidden live region the committed announcements play through
      return React.createElement(View, Object.assign({}, multi.rootProps, {
        ref: rootRef,
        testID: props.testID,
        style: [{ position: 'relative' }, presentation.root]
      }),
      labelled ? React.createElement(Text, Object.assign({}, multi.labelProps, {
        testID: prefix + '-label',
        // The 'above' label takes the inset the reference's inline label
        // gains from its line box; the floating label sits inside instead
        style: ctx.enum('anatomy.label') === 'above'
          ? [presentation.label, { marginTop: ctx.metric(owner, 'labelInset') }]
          : presentation.label
      }), props.label) : null,
      React.createElement(View, Object.assign({}, frameHover, {
        ref: frameRef,
        testID: prefix + '-frame',
        style: frame
      }),
      React.createElement(View, {
        style: {
          alignItems: 'center',
          alignSelf: 'flex-start',
          flexBasis: 'auto',
          flexDirection: 'row',
          flexGrow: 1,
          flexShrink: 1,
          // A minimum, not a fixed height: a scaled text run grows the row.
          // The press-only owner wraps the border strip, so its floor is
          // the field height; the negative margin takes that strip back out
          // of the content box so the frame itself does not grow. Every
          // other row floors at the content edge and the margin is zero
          minHeight: wrapperHeight,
          marginBottom: contentHeight - wrapperHeight,
          minWidth: 0,
          position: 'relative'
        }
      },
      count,
      control,
      icon,
      filterable === true ? caret : null),
      overlay.hosted === true ? null : listElement),
      message === null ? null : React.createElement(Text, {
        nativeID: messageId,
        testID: prefix + '-message',
        style: presentation.message
      }, message),
      React.createElement(Text, Object.assign({}, getA11yLive({ live: 'polite', atomic: true }), {
        style: {
          height: ctx.metric(owner, 'announceSize'),
          opacity: 0,
          overflow: 'hidden',
          position: 'absolute',
          width: ctx.metric(owner, 'announceSize')
        }
      }), liveRegion.state.politeMessage));

    }

    MultiSelectComponent.displayName = owner;

    return MultiSelectComponent;

  };

}
