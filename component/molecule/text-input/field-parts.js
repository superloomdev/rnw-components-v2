// Info: Shared field anatomy for the text-input family. `renderField` draws
// the family's element tree - root, label, frame (input, invalid icon and
// the owner's supplied nodes) and message - from the caller's own
// `useTextField` result and field presentation, so every member owns its
// hooks but shares one tree. `actionGeometry` resolves the member's action
// metrics under the theme's `anatomy.field_action` choice, and `FieldAction`
// draws one action seat: the painted face and a centered or sided invisible
// press target that never shrinks below the platform's minimum. Private to
// the family; nothing here is a registry row or a public export.


/********************************************************************
Build the field parts for one component system. Called once inside each
owning factory, never during render.

@param {Object} ctx - Component context

@return {Object} - { renderField, FieldAction, actionGeometry }
*********************************************************************/
export default function createFieldParts (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View, Pressable } = ctx.ReactNative;
  const NativeTextInput = ctx.ReactNative.TextInput;


  /********************************************************************
  The action's geometry under the theme's `anatomy.field_action` choice.
  `square` paints a field-high square flush with the frame's edge;
  `icon_button` paints a circle clamped to the field height, insetting its
  glyph by the member's action inset. `slotWidth` is the inline room the
  action's slot reserves; `faceEndInset` is how far the painted face sits
  in from its seat's named edge.

  @param {String} owner  - Spec name holding the action metrics
  @param {Number} height - The field's height

  @return {Object} - { faceSize, slotWidth, glyphInset, radius, faceEndInset, iconSize }
  *********************************************************************/
  function actionGeometry (owner, height) {

    const iconSize = ctx.metric(owner, 'iconSize');
    const actionInset = ctx.metric(owner, 'actionInset');
    const actionSize = ctx.metric(owner, 'actionSize');
    const actionGap = ctx.metric(owner, 'actionGap');

    if (ctx.enum('anatomy.field_action') === 'square') {
      return {
        faceEndInset: 0,
        faceSize: height,
        glyphInset: (height - iconSize) / 2,
        iconSize: iconSize,
        radius: ctx.metric(owner, 'squareRadius'),
        slotWidth: height
      };
    }

    const faceSize = Math.min(actionSize, height);
    return {
      faceEndInset: actionInset + iconSize / 2 - faceSize / 2,
      faceSize: faceSize,
      glyphInset: actionInset,
      iconSize: iconSize,
      radius: ctx.metric(owner, 'roundRadius'),
      slotWidth: actionInset + iconSize + actionGap
    };

  }


  /********************************************************************
  One field action: a borderless seat of `slotWidth` holding the painted
  face and the invisible press target as siblings, with a focus-ring
  sibling painted over the face between them. The face's own border
  contains an inner paint box, so a declared edge (the search clear's
  transparent border) never shifts the glyph and the opaque paint never
  covers the ring. The action owns no hooks - the parent built `button`
  with `useButton` unconditionally and passes its result in.

  @param {Object} props
  @param {Object} props.button            - useButton result (required)
  @param {Object} props.geometry          - actionGeometry result (required)
  @param {Number} props.height            - The field's height (required)
  @param {Object} props.palette           - Color map for pressPresentation
  @param {String} props.icon              - Semantic icon name
  @param {String} [props.iconColor]       - Icon color leaf for the state
  @param {String} [props.edge='end']      - The frame edge the seat hugs
  @param {String} [props.testID]          - Test id; `-face`, `-paint` and
                                          `-focus` join it
  @param {Number} [props.edgeWidth=0]     - Declared face border width
  @param {Object} [props.edgeStyle]       - Painted edges merged on the face
  @param {Object} [props.hoverRule]       - { color, width } inset bottom
                                          line drawn while hovered
  @param {String} [props.targetExpansion] - pressTarget inlineExpansion
  @param {Number} [props.tabIndex]        - Forwarded to the pressable
  @param {Object} [props.buttonRef]       - Forwarded to the pressable
  @param {Boolean}[props.hidden]          - Draws nothing and takes no input
  @param {Boolean}[props.seated]          - Defaults true: the seat anchors
                                          itself to its edge of the overlay
                                          box; false leaves an in-flow seat
                                          for an owner-positioned group

  @return {Object} - React element
  *********************************************************************/
  function FieldAction (props) {

    if (Utils.isNullOrUndefined(props.button) || Utils.isNullOrUndefined(props.button.state)) {
      throw new TypeError('FieldAction requires a useButton result');
    }
    if (Utils.isNullOrUndefined(props.geometry) || !Utils.isNumber(props.height)) {
      throw new TypeError('FieldAction requires actionGeometry and the field height');
    }

    const button = props.button;
    const state = button.state;
    const g = props.geometry;
    const edge = props.edge === 'start' ? 'start' : 'end';
    const edgeWidth = Utils.isNumber(props.edgeWidth) ? props.edgeWidth : 0;
    const hidden = props.hidden === true;
    const square = ctx.enum('anatomy.field_action') === 'square';
    const press = ctx.pressPresentation(state, '', { colors: props.palette, separateLayers: true });
    // The ring is a sibling over the painted face, never inside the paint
    // clip and never under the face's own fills
    const ring = ctx.focusRing('button', state, edgeWidth, { gap: false });

    // The paint box fills the face's padding box, inside its border, and
    // clips the state layers to the face's own corners
    const innerRadius = Math.max(0, g.radius - edgeWidth);
    const paint = React.createElement(View, {
      testID: props.testID === undefined ? undefined : props.testID + '-paint',
      style: [
        {
          alignItems: 'center',
          borderRadius: innerRadius,
          bottom: 0,
          justifyContent: 'center',
          left: 0,
          overflow: 'hidden',
          position: 'absolute',
          right: 0,
          top: 0
        },
        press.container
      ]
    },
    press.hoverLayer === undefined ? null : React.createElement(View, {
      style: [{ borderRadius: innerRadius, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, press.hoverLayer]
    }),
    React.createElement(View, {
      style: [{ borderRadius: innerRadius, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, press.layer]
    }),
    React.createElement(ctx.Registry.Icon, {
      name: props.icon,
      size: g.iconSize,
      color: props.iconColor
    }),
    props.hoverRule === undefined ? null : React.createElement(View, {
      // The hover's inset bottom line paints inside the box; it is not a
      // border, so the glyph's geometry never moves. A rule is the square
      // anatomy's seam only; the element mounts under every theme so the
      // accessibility tree does not change shape with it
      style: {
        backgroundColor: props.hoverRule.color,
        bottom: 0,
        end: 0,
        height: props.hoverRule.width,
        opacity: square && state.hovered === true && state.disabled !== true ? 1 : 0,
        position: 'absolute',
        start: 0
      }
    })
    );

    const face = React.createElement(View, {
      testID: props.testID === undefined ? undefined : props.testID + '-face',
      style: [
        {
          borderColor: 'transparent',
          borderRadius: g.radius,
          borderWidth: edgeWidth,
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0
        },
        props.edgeStyle
      ]
    }, paint);

    // The ring paints as a sibling over every face fill and rule; mounted
    // under every theme and state so the tree's shape never moves with it
    const focus = React.createElement(View, {
      pointerEvents: 'none',
      testID: props.testID === undefined ? undefined : props.testID + '-focus',
      style: [
        {
          borderColor: 'transparent',
          borderRadius: g.radius,
          borderWidth: edgeWidth,
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0
        },
        ring
      ]
    });

    const target = React.createElement(Pressable, Object.assign({}, button.rootProps, {
      'aria-hidden': hidden ? true : undefined,
      ref: props.buttonRef,
      tabIndex: hidden ? -1 : props.tabIndex,
      testID: props.testID,
      style: ctx.pressTarget({ height: g.faceSize, width: g.faceSize }, { inlineExpansion: props.targetExpansion })
    }));

    // The face and its target are siblings in a box of the face's own
    // geometry, anchored to the seat's named edge
    const faceBox = React.createElement(View, {
      style: [
        { height: g.faceSize, position: 'absolute', top: (props.height - g.faceSize) / 2, width: g.faceSize },
        edge === 'end' ? { end: g.faceEndInset } : { start: g.faceEndInset }
      ]
    }, face, focus, target);

    // A hidden action holds its slot but draws and answers nothing
    return React.createElement(View, {
      'aria-hidden': hidden ? true : undefined,
      style: [
        props.seated === false
          ? { height: props.height, width: g.slotWidth }
          : { bottom: 0, position: 'absolute', top: 0, width: g.slotWidth },
        edge === 'end' ? { end: 0 } : { start: 0 },
        hidden ? { opacity: 0, pointerEvents: 'none' } : null
      ]
    }, faceBox);

  }


  /********************************************************************
  Render the shared field anatomy - root, label, frame and message - from
  the owner's behavior result and presentation. The renderer owns the
  input's placeholder, name/ref and style; the owner's supplied semantic
  props apply first and `field.inputProps` after them, so the behavior's
  own contract always wins. `label` keeps its floating placeholder and
  value rules whether or not `renderLabel` draws it. `leading`, `trailing`
  and `overlays` are private renderer arguments, not public props: leading
  and trailing are in-flow frame children, overlays a layer stretched over
  the frame's outer border box.

  @param {Object}  options                 - Field drawing request
  @param {String}  options.owner           - Spec name for the invalid icon size
  @param {Object}  options.props           - The owner's public props
  @param {Object}  options.field           - The owner's useTextField result
  @param {Object}  options.presentation    - The owner's fieldPresentation result
  @param {Boolean} [options.renderLabel]   - false skips the label element
  @param {Boolean} [options.renderMessage] - false skips the message element
  @param {Boolean} [options.renderInvalidIcon] - false skips the in-flow
                                               error icon (an owner drawing
                                               its own overlay supplies it)
  @param {Object}  [options.inputRef]      - Input host ref
  @param {Object}  [options.inputProps]    - Owner semantic input props
  @param {Object}  [options.inputStyle]    - Merged last on the input
  @param {Object}  [options.frameStyle]    - Merged last on the frame
  @param {Object}  [options.rootStyle]     - Merged last on the root
  @param {Number}  [options.iconGap]       - Invalid icon's start margin;
                                           the presentation's iconGap
  @param {String}  [options.placeholderColor] - Placeholder ink; the
                                           presentation's placeholderColor
  @param {Object}  [options.rootProps]     - Merged first on the root
  @param {Object}  [options.leading]       - In-flow node before the input
  @param {Object}  [options.trailing]      - In-flow node after the invalid icon
  @param {Object}  [options.overlays]      - Nodes over the frame's border box

  @return {Object} - React element
  *********************************************************************/
  function renderField (options) {

    const props = options.props;
    const field = options.field;
    const presentation = options.presentation;
    const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);
    const invalid = field.state.invalid === true;

    // Render the error icon while invalid, unless the owner draws its own
    const iconGap = Utils.isNumber(options.iconGap) ? options.iconGap : presentation.iconGap;
    const icon = invalid && options.renderInvalidIcon !== false ? React.createElement(View, { style: { marginStart: iconGap } },
      React.createElement(ctx.Registry.Icon, { name: 'invalid', size: ctx.metric(options.owner, 'iconSize'), color: presentation.invalidIcon })) : null;

    // Render the message below: the error while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? props.invalidText
      : Utils.isString(props.helperText) ? props.helperText : null;

    // The overlays stretch over the frame's outer border box; pointer events
    // pass through the gaps between their drawn nodes
    const overlays = options.overlays === undefined || options.overlays === null ? null
      : React.createElement(View, {
        pointerEvents: 'box-none',
        style: {
          bottom: -presentation.borderSide,
          end: -presentation.borderSide,
          position: 'absolute',
          start: -presentation.borderSide,
          top: -presentation.borderSide
        }
      }, options.overlays);

    return React.createElement(View, Object.assign({}, options.rootProps, field.rootProps, { style: [{ position: 'relative' }, presentation.root, options.rootStyle] }),
      options.renderLabel === false || !labelled ? null : React.createElement(Text, Object.assign({}, field.labelProps, { style: presentation.label }), props.label),
      React.createElement(View, { style: [presentation.frame, options.frameStyle] },
        options.leading === undefined ? null : options.leading,
        React.createElement(NativeTextInput, Object.assign({}, options.inputProps, field.inputProps, {
          accessibilityLabel: props.accessibilityLabel,
          placeholder: presentation.placeholder || !labelled ? props.placeholder : undefined,
          placeholderTextColor: Utils.isString(options.placeholderColor) ? options.placeholderColor : presentation.placeholderColor,
          ref: options.inputRef,
          testID: props.testID,
          style: [presentation.value, {
            alignSelf: 'stretch',
            backgroundColor: 'transparent',
            // While a floating label rests over the empty field the input draws nothing, as the label covers it
            opacity: labelled && !presentation.placeholder ? 0 : 1,
            // Grow from the input's own width, not from zero: native layout gives
            // `flex: 1` a zero basis, which collapses the field inside a container
            // that sizes to its content
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            outlineStyle: 'none'
          }, options.inputStyle]
        })),
        icon,
        options.trailing === undefined ? null : options.trailing,
        overlays
      ),
      options.renderMessage === false || message === null ? null : React.createElement(Text, { style: presentation.message }, message)
    );

  }


  return {
    FieldAction: FieldAction,
    actionGeometry: actionGeometry,
    renderField: renderField
  };

}
