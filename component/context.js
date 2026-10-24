// Info: The component context: the one seam between a built theme and the
// components. Every value a component draws passes through here as a token
// read (`token`, `color`, `typeStyle`, `metric`), every shape choice as an
// enum read (`enum`), every glyph as an icon read (`icon`). A read of a
// token the theme lacks throws; nothing falls back, nothing substitutes.
// The presentations (`focusRing`, `pressPresentation`, `fieldPresentation`)
// implement every value of an enum once and read the theme's role cells for
// each state, as style fragments, so every component that shows focus,
// press or a field frame draws the theme's choice the same way.
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
@param {Object} [options]  - { level, behaviors }: the painted level this
                             context reads tokens at (default 1) and the
                             already-built behavior map every level shares

@return {Object} - The frozen context
*********************************************************************/
export default function createContext (Lib, config, built, breakpoint, platform, contract, specs, Registry, options) {

  const Utils = Lib.Utils;
  const flat = built.tokens;

  // The level-bound token maps the built theme carries, and this context's
  // own painted level; an absent `levels` field reads as an empty map
  const leveled = built.levels;
  const level = options === undefined || options === null || options.level === undefined ? 1 : options.level;

  // The interactive target floor and the text scale: the theme's
  // `control.target_min` (the host's chosen form class moves it) and the
  // host's `textScale` clamped to `control.text_scale_max`
  const targetMin = token('control.target_min');
  const requestedScale = config === undefined || config === null || config.textScale === undefined ? 1 : config.textScale;
  const textScale = Math.min(Math.max(requestedScale, 1), token('control.text_scale_max'));


  /********************************************************************
  Read one token by its full dotted name at a painted level: the level's
  own reading when the built theme carries one for it, else the base map.
  The fallback is only between a contextual override and its base value,
  never between token names.

  @param {Number} readLevel - Painted level (1 reads the base map)
  @param {String} name      - e.g. 'spacing.spacing_05'

  @return {*} - The emitted value
  *********************************************************************/
  function tokenAt (readLevel, name) {

    // Validate the name is a string
    if (!Utils.isString(name)) {
      throw new TypeError('ctx.tokenAt requires a token name string');
    }

    // Read the level's own value when the theme carries one
    const scoped = leveled === undefined || leveled === null ? undefined : leveled[readLevel];
    const value = scoped === undefined || scoped === null || scoped[name] === undefined ? flat[name] : scoped[name];

    // A missing token is a defect, never a fallback
    if (value === undefined) {
      throw new TypeError('token "' + name + '" is not in the theme');
    }

    // Return the value
    return value;

  }


  /********************************************************************
  Read one token by its full dotted name at this context's fixed level.

  @param {String} name - e.g. 'spacing.spacing_05'

  @return {*} - The emitted value
  *********************************************************************/
  function token (name) {

    return tokenAt(level, name);

  }


  /********************************************************************
  Read a color token by its leaf name at a painted level.

  @param {Number} readLevel - Painted level (1 reads the base map)
  @param {String} name      - e.g. 'interactive'

  @return {String} - The color
  *********************************************************************/
  function colorAt (readLevel, name) {

    return tokenAt(readLevel, 'color.' + name);

  }


  /********************************************************************
  Read a color token by its leaf name at this context's fixed level.

  @param {String} name - e.g. 'interactive'

  @return {String} - The color
  *********************************************************************/
  function color (name) {

    return colorAt(level, name);

  }


  /********************************************************************
  Read a type set by its leaf name and resolve its family token, so the
  result spreads straight into a Text style. On native the emitted
  lineHeight is resolved on the host's physical pixel grid through the
  injected `PixelRatio.roundToNearestPixel`: Android's CustomLineHeightSpan
  ceils a fractional height on every text line, so the style must carry
  what the grid will draw. The token, the built theme and the web result
  all keep the raw number; web's `textPresentation` renders it as the
  unitless CSS ratio, which keeps fractional products on the subpixel
  grid. A native host without the injected PixelRatio cannot draw text;
  asking for a type style is then a hard error, never a guessed grid.

  @param {String} name - e.g. 'body01'

  @return {Object} - { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight }
  *********************************************************************/
  function typeStyle (name) {

    // Read the type set
    const set = token('type.' + name);

    // Apply the host's text scale, clamped to the theme's declared maximum;
    // scaling size, line height and tracking together keeps the web
    // line-height ratio and every derived geometry intact
    const fontSize = set.fontSize * textScale;
    let lineHeight = set.lineHeight * textScale;
    const letterSpacing = set.letterSpacing * textScale;

    // Resolve lineHeight on the host's physical pixel grid on native only
    if (platform.isNative) {
      const pixelRatio = Lib.ReactNative && Lib.ReactNative.PixelRatio;
      if (Utils.isNullOrUndefined(pixelRatio) || !Utils.isFunction(pixelRatio.roundToNearestPixel)) {
        throw new TypeError('ctx.typeStyle on native requires Lib.ReactNative.PixelRatio.roundToNearestPixel');
      }
      lineHeight = Lib.ReactNative.PixelRatio.roundToNearestPixel(lineHeight);
      if (!Utils.isNumber(lineHeight) || !Number.isFinite(lineHeight)) {
        throw new TypeError('Lib.ReactNative.PixelRatio.roundToNearestPixel returned a non-finite lineHeight for "' + name + '"');
      }
    }

    // Return the style with the family token resolved
    return {
      fontFamily: token('font.family.' + set.fontFamily),
      fontSize: fontSize,
      fontWeight: set.fontWeight,
      letterSpacing: letterSpacing,
      lineHeight: lineHeight
    };

  }


  /********************************************************************
  Turn a type style into the platform's final text presentation. Web
  renders lineHeight as the unitless CSS ratio, which keeps fractional
  products on the subpixel grid; native keeps the number typeStyle already
  resolved on the host's physical pixel grid. The source style is not
  changed.

  @param {Object} style - A typeStyle result

  @return {Object} - A fresh style for the text element
  *********************************************************************/
  function textPresentation (style) {

    if (Utils.isNullOrUndefined(style) || !Utils.isNumber(style.lineHeight) || !Utils.isNumber(style.fontSize) || style.fontSize === 0) {
      throw new TypeError('ctx.textPresentation requires a style with numeric fontSize and lineHeight');
    }

    return Object.assign({}, style, {
      lineHeight: platform.split({
        web: String(style.lineHeight / style.fontSize),
        native: style.lineHeight
      })
    });

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
  The focus ring a family draws, from the theme's role grid: its width,
  offset (negative draws it inside the edge) and color, and for a button
  the page-color line some systems draw inside the ring. A field shows its
  focus on any focus; a button or a selection control shows it on any focus
  or on keyboard focus only, as `feedback.focus_trigger` says. A ring of
  width 0 draws nothing.

  @param {String}  family  - 'field' | 'button' | 'selection'
  @param {Object}  state   - { focused, focusVisible }
  @param {Number}  [border] - The control's own border width (a button's
                              inner line sits inside it)
  @param {Object}  [options] - { gap }: `gap === false` draws no page-color
                              separating line inside the ring;
                              `offset` overrides the family's focus-offset cell
                              (a member's own answer, like the tag close's 0)

  @return {Object} - Style fragment, empty when no ring shows
  *********************************************************************/
  function focusRing (family, state, border, options) {

    // The ring shows on focus; outside the field family only on keyboard focus when the theme says so
    const keyboardOnly = family !== 'field' && enumValue('feedback.focus_trigger') === 'keyboard';
    const shows = state.focused === true && (!keyboardOnly || state.focusVisible === true);
    const width = token('control.' + family + '_focus_width');
    if (!shows || width === 0) {
      return {};
    }

    // The ring, at its offset from the edge
    const offset = options !== undefined && Utils.isNumber(options.offset) ? options.offset : token('control.' + family + '_focus_offset');
    const ringColor = color(family + '_focus_ring');
    if (family !== 'button' || offset >= 0) {
      return { outlineColor: ringColor, outlineOffset: offset, outlineStyle: 'solid', outlineWidth: width };
    }

    // A button ring drawn inside the edge paints the border, then the rest of
    // its width and the page-color line as inset shadows inside the border.
    // `options.gap === false` draws no separating line - the reference omits
    // it on a face that draws neither fill nor border; `options.gapWidth`
    // replaces the family's gap cell (a kind's own answer, the quick action's)
    const inner = Math.max(0, width - (border || 0));
    const gap = options !== undefined && options.gap === false ? 0
      : options !== undefined && Utils.isNumber(options.gapWidth) ? options.gapWidth
        : token('control.' + family + '_focus_gap_width');
    const layers = [];
    if (inner > 0) {
      layers.push('inset 0 0 0 ' + inner + 'px ' + ringColor);
    }
    if (gap > 0) {
      layers.push('inset 0 0 0 ' + (inner + gap) + 'px ' + color('button_focus_gap'));
    }

    return Utils.isEmptyArray(layers) ? { borderColor: ringColor } : { borderColor: ringColor, boxShadow: layers.join(', ') };

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
  The press presentation the theme chose for a control whose fills are
  role cells, as two style fragments: one for the container and one for
  the state layer every such control always mounts, so the element tree
  never depends on the theme. The fill in each state is the theme's own
  cell (`<prefix>` + '', '_hover', '_active', '_focus', '_disabled'); under
  `highlight` the container paints it, under `ripple` a state layer over
  the resting container paints it, under `opacity` the resting container
  fades by the theme's state opacity. A disabled control paints its
  disabled cell and shows no hover or press.

  @param {Object}  state                   - { hovered, pressed, focused, disabled, selected }
  @param {String}  prefix                  - The fill cell's leaf prefix, e.g. 'button_primary_container'
  @param {Object}  [options]               - Optional overrides
  @param {Object}  [options.colors]        - An explicit map naming a leaf per
                                           phase ('', '_hover', '_active',
                                           '_focus', '_disabled', '_selected');
                                           every key must be present, and a
                                           null leaf paints nothing
  @param {Boolean} [options.separateLayers] - Split hover and active into two
                                           mounted layers, matching the
                                           reference's ripple paint order

  @return {Object} - { container, layer, phase } (`hoverLayer` joins when
                     separateLayers is set); `phase` names the state whose
                     cells are in effect ('', '_hover', '_active', '_focus',
                     '_disabled' or '_selected'), so a component reads its
                     label and border cells for the same state
  *********************************************************************/
  function pressPresentation (state, prefix, options) {

    // Init the theme's choice and the state in effect. `phase` names the
    // dominant identity state - a selected control keeps its selected cells
    // through hover and press, as the references' `*-selected` paint wins -
    // while `interaction` follows the live pointer or focus for the layer
    const mode = enumValue('feedback.press');
    const live = state.disabled !== true;
    const interaction = !live ? '_disabled'
      : state.pressed === true ? '_active'
        : state.hovered === true ? '_hover'
          : state.focused === true ? '_focus' : '';
    const phase = !live ? '_disabled' : state.selected === true ? '_selected' : interaction;
    const rest = state.selected === true && live ? '_selected' : !live ? '_disabled' : '';

    // An explicit color map replaces the prefix convention: each phase key
    // must exist so a missing mapping fails loudly, and a null leaf is a
    // deliberate "paints nothing", not a missing cell
    const PHASE_KEYS = ['', '_hover', '_active', '_focus', '_disabled', '_selected'];
    const map = options !== undefined && options !== null && options.colors !== undefined ? options.colors : null;
    if (map !== null) {
      if (!Utils.isObject(map)) {
        throw new TypeError('ctx.pressPresentation colors must be an object');
      }
      for (const key of PHASE_KEYS) {
        if (!(key in map)) {
          throw new TypeError('ctx.pressPresentation colors must map every phase; missing "' + key + '"');
        }
        if (map[key] !== null && !Utils.isString(map[key])) {
          throw new TypeError('ctx.pressPresentation colors must name a color leaf or null');
        }
      }
    }
    const fillOf = function (ph) {
      const leaf = map === null ? prefix + ph : map[ph];
      return leaf === null ? 'transparent' : color(leaf);
    };
    const fill = fillOf(phase);
    const hiddenLayer = { opacity: 0, pointerEvents: 'none' };
    const separate = options !== undefined && options !== null && options.separateLayers === true;

    // Highlight: the container's own fill follows the state
    if (mode === 'highlight') {
      const result = {
        container: Object.assign({ backgroundColor: fill }, transition('background-color')),
        layer: hiddenLayer,
        phase: phase
      };
      if (separate) {
        result.hoverLayer = hiddenLayer;
      }
      return result;
    }

    // Opacity: the resting fill, faded by the theme's state opacity
    if (mode === 'opacity') {
      const fade = interaction === '_active' ? token('state.pressed_opacity') : interaction === '_hover' ? token('state.hover_opacity') : 0;
      const result = {
        container: Object.assign({ backgroundColor: fillOf(rest), opacity: 1 - fade }, transition('opacity')),
        layer: hiddenLayer,
        phase: phase
      };
      if (separate) {
        result.hoverLayer = hiddenLayer;
      }
      return result;
    }

    // Ripple: the interaction's fill drawn as a layer over the resting
    // container - a selected control keeps its resting fill under the layer.
    // With separateLayers the active and hover fills mount as two layers so
    // a hover fill survives while a press is in flight, like the reference
    const result = {
      container: { backgroundColor: fillOf(rest) },
      layer: separate
        ? Object.assign({ backgroundColor: fillOf('_active'), opacity: live && state.pressed === true ? 1 : 0, pointerEvents: 'none' }, transition('opacity'))
        : Object.assign({ backgroundColor: fillOf(interaction), opacity: live && !Utils.isEmptyString(interaction) ? 1 : 0, pointerEvents: 'none' }, transition('opacity')),
      phase: phase
    };
    if (separate) {
      result.hoverLayer = Object.assign({ backgroundColor: fillOf('_hover'), opacity: live && state.hovered === true ? 1 : 0, pointerEvents: 'none' }, transition('opacity'));
    }
    return result;

  }


  /********************************************************************
  The pressable style over a painted face: a transparent layer centered on
  the face and no smaller than the theme's `control.target_min`. A `null`
  face - before the face's first layout - covers the face exactly. An
  `inlineExpansion` of 'start' or 'end' pushes the minimum out through the
  face's named logical edge instead of centering, so two adjacent faces can
  share one minimum-width boundary without overlapping.

  @param {Object} face                          - { width, height }, or null
  @param {Object} [options]                     - Optional overrides
  @param {String} [options.inlineExpansion]     - 'center' (default), 'start' or 'end'

  @return {Object} - Style fragment
  *********************************************************************/
  function pressTarget (face, options) {

    const expansion = options === undefined || options === null || options.inlineExpansion === undefined
      ? 'center'
      : options.inlineExpansion;
    if (!Utils.inArray(['center', 'start', 'end'], expansion)) {
      throw new TypeError('ctx.pressTarget inlineExpansion must be "center", "start" or "end"');
    }

    if (face === null) {
      return { bottom: 0, left: 0, outlineStyle: 'none', position: 'absolute', right: 0, top: 0 };
    }

    const width = Math.max(targetMin, face.width);
    const height = Math.max(targetMin, face.height);
    const style = {
      height: height,
      outlineStyle: 'none',
      position: 'absolute',
      top: -(height - face.height) / 2,
      width: width
    };
    if (expansion === 'center') {
      style.left = -(width - face.width) / 2;
    } else {
      // 'start' ends the target flush with the face's logical end edge;
      // 'end' starts it flush with the face's logical start edge
      style.start = expansion === 'start' ? face.width - width : 0;
    }
    return style;

  }


  /********************************************************************
  The `onLayout` + state pair for a face whose size is not known up front:
  the measured size and the handler to hang on the face's layout event,
  updating only when width or height change.

  @return {Array} - [{ width, height } | null, onLayout]
  *********************************************************************/
  function useFaceSize () {

    const [faceSize, setFaceSize] = Lib.React.useState(null);
    const onLayout = function (event) {
      const layout = event.nativeEvent.layout;
      if (faceSize === null || faceSize.width !== layout.width || faceSize.height !== layout.height) {
        setFaceSize({ width: layout.width, height: layout.height });
      }
    };
    return [faceSize, onLayout];

  }


  /********************************************************************
  The list presentation the theme chose: the container and item cells of an
  option or menu list. The container carries the list's fill, corner, block
  padding and shadow; an item is a height, a fill for its state (`hover`,
  `active`, `selected`, `selected` + `hover`, none for a disabled item) and
  an inner option block that draws the divider between items inside the
  item's inline padding, leaving the mark's room at its end where the theme
  marks the selected item (`anatomy.list_selected_mark`).

  @param {Object} options - { itemHeight, paddingInline, dividerWidth,
                            paddingBlock, radius, level, markRoom, mark }:
                            `mark` reads the theme's `anatomy.list_selected_mark`;
                            absent or false draws no mark and reads no enum

  @return {Object} - { mark, container, item, option, label, markStyle }
  *********************************************************************/
  function listPresentation (options) {

    const mark = options.mark === true ? enumValue('anatomy.list_selected_mark') : 'hidden';
    // The pointer's hover and the keyboard's highlight are distinct states:
    // a highlighted row draws the field's focus ring, no fill of its own; a
    // highlighted selected row keeps its selected fill, where a hovered one
    // draws the selected-hover fill
    const fill = function (state) {
      if (state.disabled === true) {
        return null;
      }
      if (state.pressed === true) {
        return 'list_item_container_active';
      }
      if (state.selected === true) {
        return state.hovered === true ? 'list_item_container_selected_hover' : 'list_item_container_selected';
      }
      return state.hovered === true ? 'list_item_container_hover' : null;
    };
    const labelLeaf = function (state) {
      return state.disabled === true ? 'list_item_label_disabled'
        : state.selected === true ? 'list_item_label_selected'
          : state.hovered === true ? 'list_item_label_hover' : 'list_item_label';
    };
    return Object.freeze({
      // 'shown' draws the selected item's mark; 'hidden' mounts the seat undrawn
      mark: mark,
      container: Object.assign({
        backgroundColor: color('list_container'),
        borderRadius: options.radius,
        paddingBottom: options.paddingBlock,
        paddingTop: options.paddingBlock,
        zIndex: options.level
      }, token('shadow.list')),
      item: function (state) {
        const leaf = fill(state);
        // The keyboard's highlight carries the control's focus ring: while
        // the list is open the field's ring moves onto the highlighted row
        const ring = state.highlighted === true ? focusRing('field', { focused: true }) : {};
        return Object.assign({ height: options.itemHeight, justifyContent: 'stretch' }, leaf === null ? {} : { backgroundColor: color(leaf) }, ring);
      },
      // The item's inner block carries the divider line at its top: the
      // caller decides it draws (the reference hides it on the first item and
      // around the highlighted or selected row); the bottom edge is declared
      // transparent, as the reference's option block is
      option: function (divider) {
        return {
          borderBottomColor: 'transparent',
          borderBottomWidth: options.dividerWidth,
          borderTopColor: divider === true ? color('list_item_divider') : 'transparent',
          borderTopWidth: options.dividerWidth,
          justifyContent: 'center',
          marginHorizontal: options.paddingInline,
          paddingEnd: mark === 'shown' ? options.markRoom : 0,
          flex: 1
        };
      },
      labelLeaf: labelLeaf,
      label: function (state) {
        return Object.assign({}, typeStyle('list_item'), { color: color(labelLeaf(state)) });
      },
      markStyle: { end: options.paddingInline, position: 'absolute' }
    });

  }


  /********************************************************************
  The field presentation the theme chose: the frame `feedback.field`
  draws (a filled underline or an outline) and the label placement
  `anatomy.label` draws, every color, width, space and type set from the
  theme's `field` role cells for the field's state. The label keeps its
  place in the element tree (the first child of the field root); only its
  style moves it, so the accessibility tree never depends on the theme. A
  floating label rests inside the frame and rises into its top border,
  occluding it with the surface color, when the field is focused or
  populated. A member whose reference distinguishes it from the family
  reads its own cell (`text_input_container_hover`,
  `select_outline_disabled`).

  @param {Object} state   - { focused, hovered, disabled, invalid, populated,
                            highlighted }: `highlighted` marks that the open
                            list carries the highlight, moving the field's
                            ring onto the highlighted option
  @param {Object} options - { member, height, radius, surface, trailing }: the
                            member ('text_input' | 'select'), the field's own
                            height and radius, the color leaf it sits on and
                            whether a trailing icon sits in the frame

  @return {Object} - { root, frame, label, message, raised, placeholder,
                     value, placeholderColor, indicator, invalidIcon, iconGap };
                     `message` styles the helper or error text with its color
                     for the state (`messageInvalid` while invalid)
  *********************************************************************/
  function fieldPresentation (state, options) {

    // Init the theme's choices and the state in effect. An open outline field
    // draws its active (focus) presentation whether or not it is focused; an
    // open underline field keeps its resting fill under the pointer, its list
    // open over it
    const mode = enumValue('feedback.field');
    const placement = enumValue('anatomy.label');
    const disabled = state.disabled === true;
    const invalid = !disabled && state.invalid === true;
    const open = state.open === true;
    const focused = !disabled && (state.focused === true || (open && mode === 'outline'));
    const hovered = !disabled && state.hovered === true && !(open && mode === 'underline');
    const member = options.member;
    const cell = function (base, stateful) {
      if (disabled) {
        return base + '_disabled';
      }
      if (invalid && stateful !== false) {
        return base + '_invalid' + (focused ? '_focus' : hovered ? '_hover' : '');
      }
      return base + (focused ? '_focus' : hovered ? '_hover' : '');
    };

    // Frame colors and widths for the state; an owner may name a dedicated
    // outline leaf that applies only while disabled
    const outline = disabled && Utils.isString(options.outlineDisabled) ? options.outlineDisabled
      : disabled && member !== 'text_input' ? member + '_outline_disabled' : cell('field_outline');
    const container = disabled ? 'field_container_disabled'
      : hovered ? (member === 'select' ? 'field_container_hover' : member + '_container_hover') : 'field_container';
    const width = token(focused ? 'control.field_outline_width_focus' : 'control.field_outline_width');
    const paddingInline = token('control.field_padding_inline');
    const paddingEnd = options.trailing === true ? token('control.field_icon_inset') : paddingInline;

    // Frame: shared geometry, then the mode's border; a focused or invalid frame draws its ring
    const frame = {
      alignItems: 'center',
      backgroundColor: color(container),
      borderColor: color(outline),
      borderRadius: options.radius,
      flexDirection: 'row',
      // A minimum, not a fixed height: a scaled text run grows the field
      minHeight: options.height,
      position: 'relative'
    };
    if (mode === 'underline') {
      Object.assign(frame, { borderBottomWidth: width, paddingEnd: paddingEnd, paddingStart: paddingInline });
    } else {
      // The borders sit inside the inline padding, so the text starts where the padding says
      Object.assign(frame, { borderWidth: width, paddingEnd: paddingEnd - width, paddingStart: paddingInline - width });
    }
    // The ring moves onto the highlighted option while the open list carries
    // the highlight; the field itself draws none then
    const ring = focusRing('field', { focused: focused && !(open && state.highlighted === true) });
    const invalidRing = token('control.field_invalid_ring_width');
    if (!Utils.isEmptyObject(ring)) {
      Object.assign(frame, ring);
    } else if (invalid && invalidRing > 0) {
      Object.assign(frame, { outlineColor: color('field_ring_invalid'), outlineOffset: -invalidRing, outlineStyle: 'solid', outlineWidth: invalidRing });
    }

    // Text colors and the message for the state
    const labelColor = color(cell('field_label'));
    const message = Object.assign({}, typeStyle('field_helper'), {
      color: color(disabled ? 'field_helper_disabled' : invalid ? 'field_message_invalid' : 'field_helper'),
      marginStart: token('control.field_message_inset'),
      marginTop: token('control.field_message_gap')
    });
    const shared = {
      value: Object.assign({}, typeStyle(member === 'text_area' ? 'text_area_value' : 'field_value'), { color: color(disabled ? 'field_value_disabled' : 'field_value') }),
      placeholderColor: color(disabled ? 'field_placeholder_disabled' : 'field_placeholder'),
      // A focused select's indicator reads its member cell, where the reference distinguishes it
      indicator: member === 'select' && focused && !invalid ? 'select_indicator_focus' : cell('field_indicator'),
      invalidIcon: 'field_invalid_icon' + (focused ? '_focus' : hovered ? '_hover' : ''),
      iconGap: token('control.field_icon_gap'),
      message: message,
      // The side borders' current thickness; an absolutely-anchored list
      // spans border to border by pulling itself out that far
      borderSide: mode === 'outline' ? width : 0
    };

    // Above: the label sits over the frame in the flow
    if (placement === 'above') {
      return Object.assign(shared, {
        root: {},
        frame: frame,
        label: Object.assign({}, typeStyle('field_label'), { color: labelColor, marginBottom: token('spacing.spacing_03') }),
        raised: false,
        placeholder: true
      });
    }

    // Floating: the root reserves half the raised label above the frame, so
    // the label straddles the top border inside the field's own bounds; an
    // open field raises its label whether or not it is focused
    const raised = focused || state.populated === true || open;
    const inset = token('spacing.spacing_02');
    const small = typeStyle('field_label_raised');
    const resting = typeStyle('field_label');
    const reserve = small.lineHeight / 2;
    const label = raised
      ? Object.assign({}, small, {
        backgroundColor: color(options.surface),
        left: paddingInline - inset,
        paddingHorizontal: inset,
        top: 0
      })
      : Object.assign({}, resting, {
        left: paddingInline,
        top: reserve + (options.height - resting.lineHeight) / 2
      });

    // Return the floating presentation; the placeholder shows once raised
    return Object.assign(shared, {
      root: { paddingTop: reserve },
      frame: frame,
      label: Object.assign(label, { color: labelColor, pointerEvents: 'none', position: 'absolute', zIndex: 1 }),
      raised: raised,
      placeholder: raised
    });

  }


  // Behaviors are built once per system from the same dependencies; the
  // level-2 and level-3 contexts reuse the level-1 map, contexts and all,
  // so a behavior's identity never depends on the painted level
  const behaviors = options === undefined || options === null || options.behaviors === undefined
    ? createBehaviors({
      React: Lib.React,
      ReactNative: Lib.ReactNative,
      Utils: Utils,
      Debug: Lib.Debug,
      platform: platform
    })
    : options.behaviors;


  /********************************************************************
  A text component wrapper that switches the OS's own font scaling off: the
  context already applies the host's `textScale` to every type set, so the
  platform must not scale again. A caller's own `allowFontScaling` prop
  still wins.

  @param {Object} TextComponent - The injected React Native text component

  @return {Function} - The wrapped component
  *********************************************************************/
  function withoutOsFontScaling (TextComponent) {

    if (Utils.isNullOrUndefined(TextComponent)) {
      return TextComponent;
    }

    function OsScalingOff (props) {
      return Lib.React.createElement(TextComponent, Object.assign({ allowFontScaling: false }, props));
    }

    OsScalingOff.displayName = 'OsScalingOff(' + (TextComponent.displayName || TextComponent.name || 'Text') + ')';

    return OsScalingOff;

  }

  // On native, OS font scaling is switched off centrally; on the web the
  // injected React Native is the web build, which knows no such prop
  const reactNative = platform.isNative
    ? Object.assign({}, Lib.ReactNative, {
      Text: withoutOsFontScaling(Lib.ReactNative.Text),
      TextInput: withoutOsFontScaling(Lib.ReactNative.TextInput)
    })
    : Lib.ReactNative;

  // The host's system-widget adapters and its diagnostic sink; `adapters`
  // is an optional shared_lib ({ Switch, DateTimePicker, ... } - the
  // components a `system` anatomy enum chooses instead of the drawn half)
  const adapters = Lib.adapters === undefined ? {} : Lib.adapters;
  const reportedDiagnostics = Lib.reportedDiagnostics;


  /********************************************************************
  Report one diagnostic to the host through `config.onDiagnostic`, once per
  system build per distinct record. A host that declares no sink still gets
  the fallback behavior the reporter chose.

  @param {Object} record - e.g. { code, adapter, component }
  *********************************************************************/
  function diagnostic (record) {

    const key = JSON.stringify(record);
    if (reportedDiagnostics.has(key)) {
      return;
    }
    reportedDiagnostics.add(key);
    if (Utils.isFunction(config === undefined || config === null ? undefined : config.onDiagnostic)) {
      config.onDiagnostic(record);
    }

  }


  return Object.freeze({
    React: Lib.React,
    ReactNative: reactNative,
    Svg: Lib.Svg,
    Utils: Utils,
    Debug: Lib.Debug,
    Registry: Registry,
    behaviors: behaviors,
    breakpoint: breakpoint,
    config: Object.freeze(Object.assign({}, config)),
    platform: platform,
    level: level,
    LayerContext: behaviors.LayerContext,
    DisabledContext: behaviors.DisabledContext,
    adapters: Object.freeze(adapters),
    color: color,
    colorAt: colorAt,
    diagnostic: diagnostic,
    enum: enumValue,
    fieldPresentation: fieldPresentation,
    focusRing: focusRing,
    listPresentation: listPresentation,
    icon: icon,
    metric: metric,
    pressPresentation: pressPresentation,
    pressTarget: pressTarget,
    textPresentation: textPresentation,
    token: token,
    tokenAt: tokenAt,
    typeStyle: typeStyle,
    useFaceSize: useFaceSize
  });

}
