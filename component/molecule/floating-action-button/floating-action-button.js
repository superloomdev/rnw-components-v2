// Info: FloatingActionButton molecule. A raised button holding one icon
// token, optionally extended with a label, for a screen's primary action.
// It reads the theme's `fab` role cells per kind for the container fill,
// the icon and label ink, and the interaction layers; the elevation is the
// family's own shadow token pair; and the press draws the theme's
// `feedback.press` through `ctx.pressPresentation`.

import SPEC from './spec.floating-action-button.js';


/********************************************************************
FloatingActionButton factory.

@param {Object} ctx - Component context

@return {Function} - The FloatingActionButton component
*********************************************************************/
export default function FloatingActionButton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;

  // The kinds the roster admits; the first names the default
  const KINDS = Object.freeze(['surface', 'primary', 'secondary', 'tertiary']);

  // Size -> side, radius and icon-size metrics in the spec sheet
  const SIZES = Object.freeze({ sm: 'sizeSmall', md: 'size', lg: 'sizeLarge' });
  const RADII = Object.freeze({ sm: 'radiusSmall', md: 'radius', lg: 'radiusLarge' });


  /********************************************************************
  FloatingActionButton component.

  @param {Object} props - See `api.floating-action-button.js`

  @return {Object} - React element
  *********************************************************************/
  function FloatingActionButtonComponent (props) {

    // A bare icon button must carry its accessible name
    const extended = Utils.isString(props.label) && !Utils.isEmptyString(props.label);
    if (extended !== true && !(Utils.isString(props.accessibilityLabel) && !Utils.isEmptyString(props.accessibilityLabel))) {
      throw new TypeError('FloatingActionButton: a label-less button requires `accessibilityLabel`');
    }

    // Init the behavior and its state; the extended label or the explicit
    // accessibilityLabel names the button
    const button = useButton(Object.assign({}, props, { accessibilityLabel: extended ? props.label : props.accessibilityLabel }));
    const state = button.state;

    // Init the kind, the size (the extended form is always the medium one)
    // and the container's side and corner
    const kind = Utils.inArray(KINDS, props.kind) ? props.kind : KINDS[0];
    const size = extended ? 'md' : (Utils.inArray(['sm', 'md', 'lg'], props.size) ? props.size : 'md');
    const side = ctx.metric('FloatingActionButton', SIZES[size]);
    const radius = ctx.metric('FloatingActionButton', RADII[size]);
    const iconSize = ctx.metric('FloatingActionButton', size === 'lg' ? 'iconSizeLarge' : 'iconSize');

    // The press: the theme's `feedback.press` through the context, fed the
    // family's cells directly - the resting and interaction fills live in
    // different leaf families (container vs layer), so no single prefix
    // names them both
    const press = ctx.pressPresentation(state, null, {
      colors: {
        '': 'fab_' + kind + '_container',
        _hover: 'fab_' + kind + '_layer_hover',
        _active: 'fab_' + kind + '_layer_active',
        _focus: 'fab_' + kind + '_container',
        _disabled: 'fab_' + kind + '_container',
        _selected: 'fab_' + kind + '_container'
      },
      separateLayers: true
    });

    // The elevation: the resting shadow everywhere but hover, which reads
    // the hover shadow; a press while hovered keeps the resting shadow
    const shadow = ctx.token(state.hovered === true && state.pressed !== true ? 'shadow.fab_hover' : 'shadow.fab');

    // The focus ring: the button family's ring over a painted face
    const ring = ctx.focusRing('button', state, 0, { gap: true });

    // The face: a square at the size's side, or a row sized to the icon, the
    // gap and the label between the extended paddings
    const faceStyle = extended === true
      ? {
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: radius,
        flexDirection: 'row',
        height: side,
        justifyContent: 'center',
        paddingEnd: ctx.metric('FloatingActionButton', 'extendedPaddingEnd'),
        paddingStart: ctx.metric('FloatingActionButton', 'extendedPadding')
      }
      : {
        alignItems: 'center',
        borderRadius: radius,
        height: side,
        justifyContent: 'center',
        width: side
      };

    // The icon and, extended, the label in the kind's ink and the family's
    // type set; the icon's transition matches the family's fast motion
    const icon = React.createElement(ctx.Registry.Icon, {
      name: props.icon,
      size: iconSize,
      color: 'fab_' + kind + '_icon'
    });
    const label = extended === true ? React.createElement(Text, {
      numberOfLines: 1,
      style: [ctx.typeStyle('fab_label'), { color: ctx.color('fab_' + kind + '_icon'), marginStart: ctx.metric('FloatingActionButton', 'labelGap') }]
    }, props.label) : null;

    // The button: the face carries the container and all of its paint; the
    // state layer covers the face; the pressable is a transparent layer over
    // the face no smaller than the platform's minimum interactive target -
    // `null` covers the extended face exactly, as its width is content-sized
    const element = React.createElement(View, {
      style: { alignSelf: 'flex-start', height: side }
    },
    React.createElement(View, {
      testID: 'fab-face',
      style: [faceStyle, press.container, shadow, ring]
    },
    press.hoverLayer === undefined ? null : React.createElement(View, {
      style: [{ borderRadius: radius, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, press.hoverLayer]
    }),
    React.createElement(View, {
      style: [{ borderRadius: radius, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, press.layer]
    }),
    icon, label),
    React.createElement(Pressable, Object.assign({}, button.rootProps, {
      testID: props.testID,
      style: extended === true ? ctx.pressTarget(null) : ctx.pressTarget({ height: side, width: side })
    })));

    return element;

  }

  FloatingActionButtonComponent.displayName = 'FloatingActionButton';

  return FloatingActionButtonComponent;

}

FloatingActionButton.spec = SPEC;
