// Info: The component context: the one seam between a built theme and the
// components. Every value a component draws passes through here as a token
// read (`token`, `color`, `typeStyle`, `metric`), every shape choice as an
// enum read (`enum`), every glyph as an icon read (`icon`). A read of a
// token the theme lacks throws; nothing falls back, nothing substitutes.
// The presentations (`focusPresentation`, `pressPresentation`,
// `fieldPresentation`) implement every value of an enum once, as style
// fragments, so every component that shows focus, press or a field frame
// draws the theme's choice the same way.
//
// The context also carries the injected frameworks (`React`, `ReactNative`,
// `Svg`), the helpers, the platform answer, the behaviors and the registry,
// so a component factory receives one argument and imports nothing.

import createBehaviors from '../behaviors/index.js';


/********************************************************************
Build the context every component factory receives.

@param {Object} Lib        - { React, ReactNative, Svg, Utils, Debug, Themer }
@param {Object} config     - Library config (frozen copy is exposed)
@param {Object} built      - `Themer.buildTheme(template, layers, 'native')`
@param {String} breakpoint - Current breakpoint name (a `breakpoint.*` leaf)
@param {Object} platform   - From `component/platform.js`
@param {Object} contract   - `Themer.getContract()`
@param {Object} specs      - Component name -> spec sheet (metric -> token rule)
@param {Object} Registry   - The registry the components are added to

@return {Object} - The frozen context
*********************************************************************/
export default function createContext (Lib, config, built, breakpoint, platform, contract, specs, Registry) {

  const Utils = Lib.Utils;
  const flat = built.tokens;


  /********************************************************************
  Read one token by its full dotted name.

  @param {String} name - e.g. 'spacing.spacing_05'

  @return {*} - The emitted value
  *********************************************************************/
  function token (name) {

    // Validate the name is a string
    if (!Utils.isString(name)) {
      throw new TypeError('ctx.token requires a token name string');
    }

    // Read the value
    const value = flat[name];

    // A missing token is a defect, never a fallback
    if (value === undefined) {
      throw new TypeError('token "' + name + '" is not in the theme');
    }

    // Return the value
    return value;

  }


  /********************************************************************
  Read a color token by its leaf name.

  @param {String} name - e.g. 'interactive'

  @return {String} - The color
  *********************************************************************/
  function color (name) {

    return token('color.' + name);

  }


  /********************************************************************
  Read a type set by its leaf name and resolve its family token, so the
  result spreads straight into a Text style.

  @param {String} name - e.g. 'body01'

  @return {Object} - { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight }
  *********************************************************************/
  function typeStyle (name) {

    // Read the type set
    const set = token('type.' + name);

    // Return the style with the family token resolved
    return {
      fontFamily: token('font.family.' + set.fontFamily),
      fontSize: set.fontSize,
      fontWeight: set.fontWeight,
      letterSpacing: set.letterSpacing,
      lineHeight: set.lineHeight
    };

  }


  /********************************************************************
  Resolve a metric of a component through its spec sheet. A spec entry is
  a token name, `{ tokens, operation }` with `sum` or `subtract`, or
  `{ constant }` for the values the roster flags `superloom_decision`.

  @param {String} component - Component name, a key of `specs`
  @param {String} name      - Metric name, a key of that spec sheet

  @return {*} - The resolved value
  *********************************************************************/
  function metric (component, name) {

    // Validate the spec sheet exists
    const spec = specs[component];
    if (Utils.isNullOrUndefined(spec)) {
      throw new TypeError('component "' + component + '" has no spec sheet');
    }

    // Validate the metric exists
    const entry = spec[name];
    if (Utils.isNullOrUndefined(entry)) {
      throw new TypeError('metric "' + component + '.' + name + '" is not in the spec sheet');
    }

    // A plain token name resolves directly
    if (Utils.isString(entry)) {
      return token(entry);
    }

    // A constant is a declared decision, and must be numeric
    if (entry.constant !== undefined) {
      if (!Utils.isNumber(entry.constant)) {
        throw new TypeError('metric "' + component + '.' + name + '" declares a non-numeric constant');
      }
      return entry.constant;
    }

    // A derived metric combines tokens with sum or subtract
    if (!Utils.isArray(entry.tokens) || !Utils.inArray(['sum', 'subtract'], entry.operation)) {
      throw new TypeError('metric "' + component + '.' + name + '" must be a token name, { constant } or { tokens, operation: sum | subtract }');
    }

    // Resolve every operand
    const values = entry.tokens.map(token);
    for (const value of values) {
      if (!Utils.isNumber(value)) {
        throw new TypeError('metric "' + component + '.' + name + '" combines a non-numeric token');
      }
    }

    // Apply the operation
    let result = values[0];
    for (let i = 1; i < values.length; i++) {
      result = entry.operation === 'sum' ? result + values[i] : result - values[i];
    }

    // Return the derived value
    return result;

  }


  /********************************************************************
  Read an enum token and check the theme's choice is one the contract
  lists, so a component's exhaustive switch over the values is sound.

  @param {String} name - Full token name, e.g. 'anatomy.label'

  @return {String} - The chosen value
  *********************************************************************/
  function enumValue (name) {

    // Validate the contract declares this token as an enum
    const definition = contract.tokens[name];
    if (Utils.isNullOrUndefined(definition) || !Utils.isArray(definition.values)) {
      throw new TypeError('token "' + name + '" is not an enum token in the contract');
    }

    // Read the theme's choice
    const value = token(name);

    // Reject a value outside the declared list
    if (!Utils.inArray(definition.values, value)) {
      throw new TypeError('token "' + name + '" is "' + value + '", not one of ' + definition.values.join(', '));
    }

    // Return the choice
    return value;

  }


  /********************************************************************
  Read an icon token and pick the glyph for a size: the set's own glyph
  when it draws one at that size, else the base glyph scaled by viewBox.
  No other icon is ever returned in place of a missing one.

  @param {String} name - Semantic icon name, e.g. 'close'
  @param {Number} size - Rendered size in points

  @return {Object} - { viewBox, paths }
  *********************************************************************/
  function icon (name, size) {

    // Validate the size
    if (!Utils.isNumber(size) || size <= 0) {
      throw new TypeError('ctx.icon requires a positive numeric size');
    }

    // Read the literal
    const literal = token('icon.' + name);
    if (literal.icon !== true) {
      throw new TypeError('token "icon.' + name + '" is not an icon literal');
    }

    // Prefer the set's own glyph at this size
    const variant = Utils.isObject(literal.sizes) ? literal.sizes[String(size)] : undefined;
    if (!Utils.isNullOrUndefined(variant)) {
      return { viewBox: variant.viewBox, paths: variant.paths };
    }

    // Fall through to the base glyph, which the viewBox scales
    return { viewBox: literal.viewBox, paths: literal.paths };

  }


  /********************************************************************
  The focus presentation the theme chose, as a style fragment. Only the
  focused state produces anything; every mode reads its widths and color
  from the theme.

  @param {Boolean} focused - Whether the control is focused

  @return {Object} - Style fragment, empty when not focused
  *********************************************************************/
  function focusPresentation (focused) {

    // Nothing to draw when not focused
    if (focused !== true) {
      return {};
    }

    // Init the theme's choice and its dimensions
    const mode = enumValue('feedback.focus');
    const width = token('focus.width');
    const focusColor = token('color.focus');

    // Inset ring, drawn inside the bounds
    if (mode === 'inset') {
      return { boxShadow: 'inset 0 0 0 ' + width + 'px ' + focusColor };
    }

    // Underline, drawn as the bottom border
    if (mode === 'underline') {
      return { borderBottomWidth: width, borderBottomColor: focusColor };
    }

    // Outline, drawn outside the bounds at the theme's offset
    return {
      outlineColor: focusColor,
      outlineOffset: token('focus.offset'),
      outlineStyle: 'solid',
      outlineWidth: width
    };

  }


  /********************************************************************
  Build the transition fragment every presentation shares: one property,
  the theme's fast duration and its standard easing curve.

  @param {String} property - CSS property that transitions

  @return {Object} - Style fragment
  *********************************************************************/
  function transition (property) {

    return {
      transitionDuration: token('motion.duration_fast_01') + 'ms',
      transitionProperty: property,
      transitionTimingFunction: 'cubic-bezier(' + token('motion.easing_standard_productive').join(', ') + ')'
    };

  }


  /********************************************************************
  The press presentation the theme chose, as two style fragments: one for
  the control's container and one for the state layer the component
  always mounts, so the element tree never depends on the theme. Every
  mode reads its colors, opacities and timing from the theme; a disabled
  control shows no hover or press.

  @param {Object} state   - { hovered, pressed, focused, disabled }
  @param {Object} palette - Color leaves { rest, hover, active, content };
                            a null fill leaf means no fill

  @return {Object} - { container, layer, engaged }; `engaged` is true
                     while a highlight fill replaces the rest fill, so a
                     component can switch content that sits on that fill
  *********************************************************************/
  function pressPresentation (state, palette) {

    // Init the theme's choice and the live interaction state
    const mode = enumValue('feedback.press');
    const live = state.disabled !== true;
    const pressed = live && state.pressed === true;
    const hovered = live && state.hovered === true;

    // Resolve a fill leaf; null draws no fill
    const fill = function (leaf) {
      return Utils.isNullOrUndefined(leaf) ? 'transparent' : color(leaf);
    };

    // Highlight: the container's own fill follows the state
    if (mode === 'highlight') {
      const leaf = pressed ? palette.active : hovered ? palette.hover : palette.rest;
      return {
        container: Object.assign({ backgroundColor: fill(leaf) }, transition('background-color')),
        layer: { display: 'none' },
        engaged: pressed || hovered
      };
    }

    // Opacity: the whole control fades by the theme's state opacity
    if (mode === 'opacity') {
      const fade = pressed ? token('state.pressed_opacity') : hovered ? token('state.hover_opacity') : 0;
      return {
        container: Object.assign({ backgroundColor: fill(palette.rest), opacity: 1 - fade }, transition('opacity')),
        layer: { display: 'none' },
        engaged: false
      };
    }

    // Ripple: a state layer in the content color at the theme's opacity
    const focused = live && state.focused === true;
    const strength = pressed ? token('state.pressed_opacity')
      : hovered ? token('state.hover_opacity')
        : focused ? token('state.focus_opacity') : 0;

    return {
      container: { backgroundColor: fill(palette.rest) },
      layer: Object.assign({ backgroundColor: color(palette.content), opacity: strength, pointerEvents: 'none' }, transition('opacity')),
      engaged: false
    };

  }


  /********************************************************************
  The field presentation the theme chose: the frame `feedback.field`
  draws and the label placement `anatomy.label` draws. The label keeps
  the same place in the element tree under both placements (the first
  child of the field root); only its style moves it, so the accessibility
  tree never depends on the theme. A floating label rests inside the
  frame and rises into its top border, occluding it with the surface
  color, when the field is focused or populated. An invalid underline
  field keeps its border and draws an error ring inside its bounds; an
  invalid outline field draws its border in the error color. A disabled
  field draws its border in `disabledBorder`, a color leaf the field
  chooses; null draws none under `underline`, where the filled frame keeps
  the field's shape, and the disabled border under `outline`, where the
  border is the only thing that draws the frame.

  @param {Object} state   - { focused, hovered, disabled, invalid, populated }
  @param {Object} options - { height, paddingInline, radius, surface, disabledBorder }:
                            the field's own metrics, the color leaf it sits on
                            and its disabled border leaf (default `border_disabled`)

  @return {Object} - { root, frame, label, message, raised, placeholder }; `root`
                     styles the field root (a floating label reserves
                     half its line above the frame); `message` insets the
                     helper or error text
  *********************************************************************/
  function fieldPresentation (state, options) {

    // Init the theme's choices and the shared values
    const mode = enumValue('feedback.field');
    const placement = enumValue('anatomy.label');
    const width = token('border.width_01');
    const disabled = state.disabled === true;
    const invalid = !disabled && state.invalid === true;
    const disabledBorder = options.disabledBorder === undefined || (options.disabledBorder === null && mode === 'outline') ? 'border_disabled' : options.disabledBorder;
    const borderLeaf = disabled ? disabledBorder : invalid && mode === 'outline' ? 'support_error' : 'border_strong_01';
    // An outline frame colors its label with the error while invalid; an underline frame keeps it
    const labelColor = color(disabled ? 'text_disabled' : invalid && mode === 'outline' ? 'text_error' : 'text_secondary');
    // An outline frame insets its message to the text inside the frame; an underline frame starts it at the edge
    const message = { marginStart: mode === 'outline' ? options.paddingInline : 0 };

    // Frame: shared geometry, then the mode's border and fill
    const frame = {
      alignItems: 'center',
      borderColor: Utils.isNullOrUndefined(borderLeaf) ? 'transparent' : color(borderLeaf),
      borderRadius: options.radius,
      flexDirection: 'row',
      height: options.height,
      paddingHorizontal: options.paddingInline
    };
    if (mode === 'underline') {
      Object.assign(frame, {
        backgroundColor: color(!disabled && state.hovered === true ? 'field_hover_01' : 'field_01'),
        borderBottomWidth: width
      });
      if (invalid) {
        const ring = token('border.width_02');
        Object.assign(frame, { outlineColor: color('support_error'), outlineOffset: -ring, outlineStyle: 'solid', outlineWidth: ring });
      }
    } else {
      // The four borders sit inside the inline padding, so the text starts where the padding says
      Object.assign(frame, { backgroundColor: 'transparent', borderWidth: width, paddingHorizontal: options.paddingInline - width });
    }

    // Above: the label sits over the frame in the flow
    if (placement === 'above') {
      return {
        root: {},
        frame: frame,
        message: message,
        label: Object.assign({}, typeStyle('label01'), { color: labelColor, marginBottom: token('spacing.spacing_03') }),
        raised: false,
        placeholder: true
      };
    }

    // Floating: the root reserves half the raised label above the frame, so
    // the label straddles the top border inside the field's own bounds
    const raised = state.focused === true || state.populated === true;
    const inset = token('spacing.spacing_02');
    const small = typeStyle('field_label_raised');
    const body = typeStyle('body_compact_01');
    const reserve = small.lineHeight / 2;
    const label = raised
      ? Object.assign({}, small, {
        backgroundColor: color(options.surface),
        left: options.paddingInline - inset,
        paddingHorizontal: inset,
        top: 0
      })
      : Object.assign({}, body, {
        left: options.paddingInline,
        top: reserve + (options.height - body.lineHeight) / 2
      });

    // Return the floating presentation; the placeholder shows once raised
    return {
      root: { paddingTop: reserve },
      frame: frame,
      message: message,
      label: Object.assign(label, { color: labelColor, pointerEvents: 'none', position: 'absolute', zIndex: 1 }),
      raised: raised,
      placeholder: raised
    };

  }


  // Behaviors are built once per system from the same dependencies
  const behaviors = createBehaviors({
    React: Lib.React,
    ReactNative: Lib.ReactNative,
    Utils: Utils,
    platform: platform
  });


  return Object.freeze({
    React: Lib.React,
    ReactNative: Lib.ReactNative,
    Svg: Lib.Svg,
    Utils: Utils,
    Debug: Lib.Debug,
    Registry: Registry,
    behaviors: behaviors,
    breakpoint: breakpoint,
    config: Object.freeze(Object.assign({}, config)),
    platform: platform,
    color: color,
    enum: enumValue,
    fieldPresentation: fieldPresentation,
    focusPresentation: focusPresentation,
    icon: icon,
    metric: metric,
    pressPresentation: pressPresentation,
    token: token,
    typeStyle: typeStyle
  });

}
