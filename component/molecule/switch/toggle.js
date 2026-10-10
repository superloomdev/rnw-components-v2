// Info: Toggle molecule. A pressable label over an appearance row holding
// the pill track and the on/off text. The track draws its border only
// while unchecked; the handle is a disc centered inside a track-height
// square anchored at the unchecked or checked end. A press toggles the
// switch. The theme's `switch` role cells supply outline, track, handle,
// layer, mark and focus colors; `anatomy.switch_handle` decides whether a
// pressed or checked handle changes size or only slides,
// `anatomy.switch_state_text` decides whether the on/off text renders,
// and `anatomy.switch_edge` decides whether the track's edge is a border
// that costs room or a skin that does not.

import SPEC from './spec.js';


/********************************************************************
Toggle factory.

@param {Object} ctx - Component context

@return {Function} - The Toggle component
*********************************************************************/
export default function Toggle (ctx) {

  const React = ctx.React;
  const { Pressable, Text, View } = ctx.ReactNative;
  const Icon = ctx.Registry.Icon;
  const { useControllableState, useInteractionState, getA11yState, getA11yRelation, useA11yId } = ctx.behaviors;


  /********************************************************************
  Toggle component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggleComponent (props) {

    // Init the state: checked is controllable, the rest is interaction
    const disabled = props.disabled === true;
    const [checked, setChecked] = useControllableState({ value: props.checked, defaultValue: false, onChange: props.onChange });
    const selected = checked === true;
    const interaction = useInteractionState({ disabled: disabled, onPress: function () {
      setChecked(!checked);
    } });
    const state = interaction.state;
    const small = props.size === 'sm';

    // Read the geometry through the spec sheet
    const trackWidth = ctx.metric('Toggle', small ? 'trackWidthSmall' : 'trackWidth');
    const trackHeight = ctx.metric('Toggle', small ? 'trackHeightSmall' : 'trackHeight');
    const layerSize = ctx.metric('Toggle', 'layerSize');
    const outlineWidth = ctx.metric('Toggle', 'outlineWidth');

    // The press presentation supplies the track's container fragment and
    // the phase in effect; the selected variants live under a longer prefix
    const prefix = selected ? 'switch_track_selected' : 'switch_track';
    const press = ctx.pressPresentation({ hovered: state.hovered, pressed: state.pressed, focused: state.focused, disabled: state.disabled }, prefix);
    const phase = press.phase;
    const handleLeaf = 'switch_handle' + (selected ? '_selected' : '') + phase;
    const outlineLeaf = 'switch_outline' + phase;

    // The theme's handle anatomy: `fixed` reads the base size in every
    // state, `grows` reads the pressed and selected sizes
    const grows = ctx.enum('anatomy.switch_handle') === 'grows';
    const sizeKey = small ? 'handleSizeSmall' : 'handleSize';
    const handleSize = !grows ? ctx.metric('Toggle', sizeKey)
      : state.pressed ? ctx.metric('Toggle', sizeKey + 'Pressed')
        : selected ? ctx.metric('Toggle', sizeKey + 'Selected')
          : ctx.metric('Toggle', sizeKey);

    // The handle slides inside a track-height square anchored at the
    // unchecked or checked end; the state layer centers on that zone.
    // Where `anatomy.switch_edge` says `skin` the track's edge is painted on
    // a skin, so it costs no room: absolute children measure from the
    // track's outer edge, and the border width comes back out
    const border = selected ? 0 : outlineWidth;
    const inset = ctx.enum('anatomy.switch_edge') === 'skin' ? border : 0;
    const zoneX = selected ? trackWidth - trackHeight : 0;
    const handleX = zoneX + (trackHeight - handleSize) / 2 - inset;
    const handleY = (trackHeight - handleSize) / 2 - inset;
    const layerOffset = (trackHeight - layerSize) / 2 - inset;

    // The state layer is the disc over the handle zone and reads its own
    // cells; only the `ripple` press presentation draws it. It stays in the
    // tree the way the second reference keeps its ripple element: hidden,
    // not undisplayed
    const layerLeaf = 'switch_layer_' + (selected ? 'selected_' : '') + (state.pressed ? 'active' : 'hover');
    const layerLive = ctx.enum('feedback.press') === 'ripple' && !state.disabled && (state.pressed || state.hovered);

    // The focus ring is an outline on the track itself: both references
    // wrap the track, and the track's own radius makes the outline a pill.
    // The first reference draws it on press too, so a press keeps it
    const ring = ctx.focusRing('switch', { focused: state.focused || state.pressed, focusVisible: state.focusVisible });

    // The slide: `grows` also animates the size; `fixed` moves position only
    const duration = ctx.token('motion.duration_moderate_02') + 'ms';
    const easing = 'cubic-bezier(' + ctx.token('motion.easing_standard_productive').join(', ') + ')';
    const slide = {
      transitionDuration: duration,
      transitionProperty: grows ? 'left, width, height, background-color' : 'left, background-color',
      transitionTimingFunction: easing
    };

    // The small variant draws the checked mark through the icon registry;
    // it is pinned at the checked end's zone center and only shown once
    // checked, the way the first reference draws it
    const markSize = ctx.metric('Toggle', 'handleSizeSmall') - ctx.metric('Toggle', 'markInset') * 2;
    const markX = trackWidth - trackHeight + (trackHeight - markSize) / 2 - inset;

    // The on/off text renders only where the theme shows it
    const stateText = ctx.enum('anatomy.switch_state_text') === 'shown';

    // Render the field: the label, then the track row with the on/off text
    const labelId = useA11yId('toggle');
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, getA11yState({ checked: selected, disabled: disabled || undefined }), getA11yRelation({ labelledby: labelId }), {
      accessibilityRole: 'switch',
      disabled: disabled,
      onKeyDown: function (event) {
        // The web press responder activates on Enter only; the switch
        // pattern toggles on Space, so Space is handled here
        if (disabled || event.key !== ' ') {
          return;
        }
        event.preventDefault();
        setChecked(!checked);
      },
      testID: props.testID,
      // The focus ring is drawn on the track, so the field itself shows
      // none. It hugs its content the way the upstream label wraps its
      // inline grid, and keeps the strut that inline box leaves under the
      // regular row; the small row's grid baseline absorbs it
      style: {
        alignSelf: 'flex-start',
        flexDirection: 'column',
        outlineStyle: 'none',
        paddingBottom: small ? 0 : ctx.metric('Toggle', 'labelStrut'),
        width: 'max-content'
      }
    }),
    React.createElement(Text, {
      nativeID: labelId,
      style: [ctx.typeStyle('label01'), {
        color: ctx.color(state.disabled ? 'text_disabled' : 'text_secondary'),
        marginBottom: ctx.metric('Toggle', 'labelGap')
      }]
    }, props.label),
    React.createElement(View, { style: { alignItems: 'center', flexDirection: 'row' } },
      React.createElement(View, {
        style: [press.container, {
          borderColor: ctx.color(outlineLeaf),
          borderRadius: ctx.metric('Toggle', 'trackRadius'),
          borderWidth: selected ? 0 : outlineWidth,
          height: trackHeight,
          width: trackWidth
        }, ring]
      },
      // The state layer lies over the handle zone and under the handle
      React.createElement(View, {
        style: [{
          borderRadius: ctx.metric('Toggle', 'layerRadius'),
          height: layerSize,
          left: zoneX + layerOffset,
          pointerEvents: 'none',
          position: 'absolute',
          top: layerOffset,
          width: layerSize
        }, { backgroundColor: ctx.color(layerLeaf), display: state.disabled ? 'none' : 'flex', visibility: layerLive ? 'visible' : 'hidden' }]
      }),
      React.createElement(View, {
        style: [{
          alignItems: 'center',
          backgroundColor: ctx.color(handleLeaf),
          borderRadius: ctx.metric('Toggle', 'handleRadius'),
          height: handleSize,
          justifyContent: 'center',
          left: handleX,
          position: 'absolute',
          top: handleY,
          width: handleSize
        }, slide]
      }),
      small ? React.createElement(Icon, {
        color: state.disabled ? 'switch_mark_disabled' : 'switch_mark',
        name: 'switch_checked_indicator',
        size: markSize,
        style: {
          left: markX,
          position: 'absolute',
          top: (trackHeight - markSize) / 2 - inset,
          visibility: selected ? 'visible' : 'hidden'
        }
      }) : null),
      // The on/off text element is always in the tree so the accessibility
      // answer is the same under every template; `hidden` only unmounts it
      // visually
      React.createElement(Text, {
        'aria-hidden': true,
        style: [ctx.typeStyle('body01'), {
          color: ctx.color(state.disabled ? 'text_disabled' : 'text_primary'),
          display: stateText ? 'flex' : 'none',
          marginStart: ctx.metric('Toggle', 'stateTextGap')
        }]
      }, selected ? props.onText : props.offText)));

  }

  ToggleComponent.displayName = 'Toggle';

  return ToggleComponent;

}

Toggle.spec = SPEC;
