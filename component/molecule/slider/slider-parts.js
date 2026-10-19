// Info: Shared slider paint for the live control and its skeleton. The
// track group - inactive bar, center tick, filled portion, state layers,
// focus answer and handle face - is one drawing over the theme's slider
// cells, so the skeleton reuses it with a full fill and a centered,
// non-interactive handle. `composePaintGroup` factors a common alpha out
// of a set of already-resolved color strings so the disabled paint fades
// as one group: the second reference paints its whole disabled host at
// 0.38 and compensates the inactive track back to its own share, which a
// per-element opacity would paint as a darker overlap.
//
// Private to the family; nothing here is a registry row or a public
// export.


/********************************************************************
Parse one resolved color string into channels and alpha. The contract's
colors arrive as six- or eight-digit hex strings or an alpha-carrying
function string; anything else is refused rather than guessed.

@param {String} value - Resolved color string

@return {Object} - { r, g, b, a }
*********************************************************************/
function parseColor (value) {

  if (typeof value !== 'string') {
    throw new TypeError('composePaintGroup: color must be a string');
  }
  const hex = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/.exec(value);
  if (hex !== null) {
    return {
      r: parseInt(hex[1], 16),
      g: parseInt(hex[2], 16),
      b: parseInt(hex[3], 16),
      a: hex[4] === undefined ? 1 : parseInt(hex[4], 16) / 255
    };
  }
  const rgba = /^rgba\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/.exec(value);
  if (rgba !== null) {
    const parsed = {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: Number(rgba[4])
    };
    if (parsed.r < 0 || parsed.r > 255 || parsed.g < 0 || parsed.g > 255 ||
      parsed.b < 0 || parsed.b > 255 || parsed.a < 0 || parsed.a > 1) {
      throw new TypeError('composePaintGroup: out-of-range color "' + value + '"');
    }
    return parsed;
  }
  throw new TypeError('composePaintGroup: unsupported color "' + value + '"');

}


/********************************************************************
Two lowercase hex digits for one byte channel.

@param {Number} channel - Channel value, rounded to a byte

@return {String}
*********************************************************************/
function hexByte (channel) {

  const byte = Math.round(channel);
  return (byte < 16 ? '0' : '') + byte.toString(16);

}


/********************************************************************
Factor the shared alpha out of a set of resolved colors: the returned
`opacity` is the largest alpha (1 when every color is opaque or fully
transparent) and EVERY color is re-encoded with its channels and its
alpha divided by that factor, so the group as a whole can carry
`opacity` without any overlap inside it being faded twice - including
the maximum-alpha children, which an untouched string would double-fade.
A group opacity of 1 preserves the original strings untouched. Derived
colors are emitted as '#rrggbbaa', which the component gate supports.

@param {Object} map - { name: colorString }

@return {Object} - { opacity, colors: { name: colorString } }
*********************************************************************/
export function composePaintGroup (map) {

  const parsed = {};
  let opacity = 0;
  for (const name of Object.keys(map)) {
    parsed[name] = parseColor(map[name]);
    opacity = Math.max(opacity, parsed[name].a);
  }
  if (opacity === 0) {
    opacity = 1;
  }
  const colors = {};
  for (const name of Object.keys(map)) {
    const part = parsed[name];
    colors[name] = opacity === 1 ? map[name]
      : '#' + hexByte(part.r) + hexByte(part.g) + hexByte(part.b) +
        hexByte(255 * part.a / opacity);
  }
  return { opacity: opacity, colors: colors };

}


/********************************************************************
Build the slider paint for one component system. Called once inside each
owning factory, never during render.

@param {Object} ctx - Component context

@return {Object} - { trackPaint }
*********************************************************************/
export default function createSliderParts (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  The track group's paint: inactive bar, center tick and filled portion,
  then the state layers, the focus answer and the handle face. `hostWidth`
  is the measured host width; pass `percent: true` to draw the same paint
  at a ratio-1 fill and a centered face over an unknown (flex-shrunk)
  host - the skeleton's case. Everything is accessibility-hidden and
  pointer-transparent; the semantic thumb is the caller's sibling.

  @param {String}  owner               - Spec name the metrics resolve under
  @param {Object}  options
  @param {String}  options.prefix      - testID prefix ('slider', 'slider-skeleton')
  @param {Number}  [options.hostWidth] - Painted host width in px
  @param {Boolean} [options.percent]   - Center the face at 50% and stretch
                                         the fill between the track insets
  @param {Number}  [options.ratio]     - Fill/thumb ratio in [0, 1]
  @param {Object}  [options.state]     - { disabled, focused, focusVisible,
                                         hovered, pressed }
  @param {Boolean} [options.layers]    - Mount the state layers and the
                                         outline focus circle (live only)

  @return {Array} - React elements, keyed, in paint order
  *********************************************************************/
  function trackPaint (owner, options) {

    const prefix = options.prefix;
    const state = options.state || {};
    const disabled = state.disabled === true;
    const focused = state.focused === true && !disabled;
    const pressed = state.pressed === true && !disabled;
    const hovered = state.hovered === true && !disabled;
    const layers = options.layers === true;
    const percent = options.percent === true;

    // Shared geometry
    const height = ctx.metric(owner, 'height');
    const trackHeight = ctx.metric(owner, 'trackHeight');
    const trackRadius = ctx.metric(owner, 'trackRadius');
    const trackInset = ctx.metric(owner, 'trackInset');
    const handleInset = ctx.metric(owner, 'handleInset');
    const baseSize = ctx.metric(owner, 'handleSize');
    const activeSize = ctx.metric(owner, 'handleSizeActive');
    const tickWidth = ctx.metric(owner, 'tickWidth');
    const tickHeight = ctx.metric(owner, 'tickHeight');
    const tickGap = ctx.metric(owner, 'tickGap');
    const ratio = Utils.isNumber(options.ratio) ? options.ratio : 0;
    const hostWidth = Utils.isNumber(options.hostWidth) ? options.hostWidth : 0;
    const trackTop = (height - trackHeight) / 2;

    // The disabled paint composes per the theme's explicit anatomy:
    // 'grouped' factors one shared opacity so the overlap never doubles,
    // 'independent' lets each layer keep its own alpha exactly as the
    // source paints it. The enabled paint is never factored - a
    // translucent enabled color keeps its own alpha
    const nubLeaf = disabled ? 'slider_disabled' : focused ? 'slider_handle_focus' : 'slider_handle';
    const colors = {
      fill: ctx.color(disabled ? 'slider_disabled' : focused ? 'slider_track_filled_focus' : 'slider_track_filled'),
      nub: ctx.color(nubLeaf),
      track: ctx.color(disabled ? 'slider_track_disabled' : 'slider_track')
    };
    const grouped = disabled && ctx.enum('anatomy.slider_disabled_paint') === 'grouped';
    const group = grouped ? composePaintGroup(colors) : { opacity: 1, colors: colors };

    // Handle center and fill extent, in the host's coordinate space
    const handleCenter = handleInset + Math.max(0, hostWidth - 2 * handleInset) * ratio;
    const paintedWidth = Math.max(0, hostWidth - 2 * trackInset);
    const fillWidth = ratio >= 1 ? paintedWidth
      : Math.min(Math.max(handleCenter - trackInset, 0), paintedWidth);

    const inactive = React.createElement(View, {
      'aria-hidden': true,
      key: 'inactive',
      pointerEvents: 'none',
      testID: prefix + '-inactive',
      style: {
        backgroundColor: group.colors.track,
        borderRadius: trackRadius,
        end: trackInset,
        height: trackHeight,
        position: 'absolute',
        start: trackInset,
        top: trackTop
      }
    });

    const fill = React.createElement(View, {
      'aria-hidden': true,
      key: 'filled',
      pointerEvents: 'none',
      testID: prefix + '-filled',
      style: percent
        ? {
          backgroundColor: group.colors.fill,
          borderRadius: trackRadius,
          end: trackInset,
          height: trackHeight,
          position: 'absolute',
          start: trackInset,
          top: trackTop
        }
        : {
          backgroundColor: group.colors.fill,
          borderRadius: trackRadius,
          height: trackHeight,
          position: 'absolute',
          start: trackInset,
          top: trackTop,
          width: fillWidth
        }
    });

    // The tick hangs its bottom one hairline gap above the track's top
    // edge; a zero-height cell leaves it mounted but undrawn. It reads
    // slider_track even while disabled - the source's disabled track
    // pseudo keeps its explicitly authored border-subtle color - and it
    // mounts BELOW the nub so it never stripes the face
    const tick = React.createElement(View, {
      'aria-hidden': true,
      key: 'tick',
      pointerEvents: 'none',
      testID: prefix + '-tick',
      style: {
        backgroundColor: ctx.color('slider_track'),
        height: tickHeight,
        marginStart: -tickWidth / 2,
        position: 'absolute',
        start: 50 + '%',
        top: trackTop - tickGap - tickHeight,
        width: tickWidth
      }
    });

    // The handle face grows by the theme's active ratio under any live
    // interaction state and shrinks its focus discs with it; a disabled
    // nub never grows
    const scale = !disabled && (hovered || focused || pressed) && activeSize !== baseSize
      ? activeSize / baseSize
      : 1;
    // Inset anatomy paints the focus as concentric discs: ring-colored
    // face, page-colored gap, focus-colored core - only while focused and
    // not pressed, and only when the trigger policy shows the focus
    const focusAnatomy = ctx.enum('anatomy.slider_focus');
    const focusShown = focused && (ctx.enum('feedback.focus_trigger') !== 'keyboard' || state.focusVisible === true);
    const insetFocus = focusAnatomy === 'inset' && focusShown && !pressed;
    // The source's pressed state paints an inset stroke over the scaled
    // face; the parent's transform scales the border like its shadow does
    const insetPressed = focusAnatomy === 'inset' && pressed;
    const focusWidth = !(insetFocus || insetPressed) ? 0 : ctx.metric(owner, 'focusWidth');
    const focusGapWidth = !insetFocus ? 0 : ctx.metric(owner, 'focusGapWidth');
    // The inset discs stay mounted under every state and anatomy - the
    // tree never reshapes - and hide unless this is the inset focused,
    // unpressed answer
    const faceChildren = [
      React.createElement(View, {
        key: 'gap',
        style: {
          backgroundColor: ctx.color('slider_handle_gap_focus'),
          borderRadius: (baseSize - 2 * focusWidth) / 2,
          bottom: focusWidth,
          display: insetFocus ? undefined : 'none',
          left: focusWidth,
          position: 'absolute',
          right: focusWidth,
          top: focusWidth
        }
      }),
      React.createElement(View, {
        key: 'inner',
        style: {
          backgroundColor: ctx.color('slider_handle_focus'),
          borderRadius: (baseSize - 2 * (focusWidth + focusGapWidth)) / 2,
          bottom: focusWidth + focusGapWidth,
          display: insetFocus ? undefined : 'none',
          left: focusWidth + focusGapWidth,
          position: 'absolute',
          right: focusWidth + focusGapWidth,
          top: focusWidth + focusGapWidth
        }
      }),
      React.createElement(View, {
        key: 'pressed-ring',
        style: {
          backgroundColor: 'transparent',
          borderColor: ctx.color('slider_focus_ring'),
          borderRadius: baseSize / 2,
          borderWidth: focusWidth,
          bottom: 0,
          display: insetPressed ? undefined : 'none',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0
        }
      })
    ];
    const face = React.createElement(View, {
      'aria-hidden': true,
      key: 'face',
      pointerEvents: 'none',
      testID: prefix + '-thumb-face',
      style: [percent
        ? { height: baseSize, marginStart: -baseSize / 2, position: 'absolute', start: 50 + '%', top: (height - baseSize) / 2, width: baseSize }
        : { height: baseSize, start: handleCenter - baseSize / 2, position: 'absolute', top: (height - baseSize) / 2, width: baseSize },
      {
        backgroundColor: insetFocus ? ctx.color('slider_focus_ring') : group.colors.nub,
        borderRadius: baseSize / 2
      },
      ctx.token(disabled ? 'shadow.slider_handle_disabled' : 'shadow.slider_handle'),
      scale === 1 ? null : { transform: [{ scale: scale }] }]
    }, faceChildren);

    // The state-layer seat: three mounted discs - hover, focus, pressed -
    // so the hover persists under the press, as the source ripple does.
    // The host hides while disabled, like the mounted-but-idle ripple;
    // the hover disc follows hovered alone - a touch press must not
    // invent a hover wash under its active wash
    const layerSize = layers ? ctx.metric(owner, 'stateLayerSize') : 0;
    const layerBox = !layers ? null : React.createElement(View, {
      'aria-hidden': true,
      key: 'layers',
      pointerEvents: 'none',
      testID: prefix + '-state-layer',
      style: {
        display: disabled ? 'none' : undefined,
        height: layerSize,
        start: handleCenter - layerSize / 2,
        position: 'absolute',
        top: (height - layerSize) / 2,
        width: layerSize
      }
    },
    React.createElement(View, {
      style: {
        backgroundColor: ctx.color('slider_state_layer_hover'),
        borderRadius: layerSize / 2,
        bottom: 0,
        left: 0,
        opacity: hovered ? 1 : 0,
        position: 'absolute',
        right: 0,
        top: 0
      }
    }),
    React.createElement(View, {
      style: {
        backgroundColor: ctx.color('slider_state_layer_focus'),
        borderRadius: layerSize / 2,
        bottom: 0,
        left: 0,
        opacity: focusShown ? 1 : 0,
        position: 'absolute',
        right: 0,
        top: 0
      }
    }),
    React.createElement(View, {
      style: {
        backgroundColor: ctx.color('slider_state_layer_active'),
        borderRadius: layerSize / 2,
        bottom: 0,
        left: 0,
        opacity: pressed ? 1 : 0,
        position: 'absolute',
        right: 0,
        top: 0
      }
    }));

    // The outline anatomy's separate focus circle, centered on the handle
    // and never scaled with the nub. It mounts under both anatomies so the
    // accessibility tree never differs between themes, and stays
    // display-none unless the outline anatomy actually shows the focus,
    // matching the reference ring's resting state
    const outlineFocus = focusAnatomy === 'outline' && focusShown;
    const focusSize = layers && focusAnatomy === 'outline' ? ctx.metric(owner, 'focusSize') : 0;
    const focusRing = !layers ? null : React.createElement(View, {
      'aria-hidden': true,
      key: 'focus',
      pointerEvents: 'none',
      testID: prefix + '-outer-focus',
      style: [{
        borderRadius: focusSize / 2,
        display: outlineFocus ? undefined : 'none',
        height: focusSize,
        start: handleCenter - focusSize / 2,
        position: 'absolute',
        top: (height - focusSize) / 2,
        width: focusSize
      }, outlineFocus ? ctx.focusRing('slider', state) : null]
    });

    // The group fades only the shared paint; the tick keeps its own color
    const paintGroup = React.createElement(View, {
      'aria-hidden': true,
      key: 'paint',
      pointerEvents: 'none',
      style: {
        bottom: 0,
        left: 0,
        opacity: group.opacity,
        position: 'absolute',
        right: 0,
        top: 0
      }
    }, inactive, fill, layerBox, focusRing, face);

    return [tick, paintGroup];

  }


  return {
    trackPaint: trackPaint
  };

}
