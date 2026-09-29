// Info: The component context: the one seam between a built theme and the
// components. Every value a component draws passes through here as a token
// read (`token`, `color`, `typeStyle`, `metric`), every shape choice as an
// enum read (`enum`), every glyph as an icon read (`icon`). A read of a
// token the theme lacks throws; nothing falls back, nothing substitutes.
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
    focusPresentation: focusPresentation,
    icon: icon,
    metric: metric,
    token: token,
    typeStyle: typeStyle
  });

}
