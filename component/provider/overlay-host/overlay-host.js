// Info: OverlayHost provider. Mounts once at the app root and owns the
// overlay layer stack: every open overlay registers itself through
// `useOverlay` and renders inside the layer root in registration order.
// On a native platform this is how an overlay leaves its parent's bounds
// and clipping, and why its coordinates are window coordinates; without a
// host an overlay renders in place (a `fixed` layer still escapes on the
// web; a native one stays inside its parent). The host owns membership
// and order only - geometry and z-order stay with the layers.

import SPEC from './spec.js';


/********************************************************************
OverlayHost factory.

@param {Object} ctx - Component context

@return {Function} - The OverlayHost component
*********************************************************************/
export default function OverlayHost (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { OverlayContext, useOverlayHost } = ctx.behaviors;


  /********************************************************************
  OverlayHost component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function OverlayHostComponent (props) {

    // Init the host: the layer stack, the layer root's window origin and the
    // context the overlays register with
    const host = useOverlayHost();
    const layerRootRef = React.useRef(null);

    // Render the app, then the layer root over it: the registered layers in
    // registration order. `box-none` lets the empty root pass touches through
    return React.createElement(OverlayContext.Provider, { value: host.contextValue },
      // A bare string child renders through the registry Text: a raw string
      // beside the View layer root crashes a native render
      Utils.isString(props.children) ? React.createElement(ctx.Registry.Text, {}, props.children) : props.children,
      React.createElement(View, {
        onLayout: function (event) {
          const layout = event && event.nativeEvent ? event.nativeEvent.layout : undefined;
          if (layout !== undefined && layout !== null) {
            // The layer root's laid-out box is the space a hosted layer
            // covers and is positioned against
            host.setSize({ width: layout.width, height: layout.height });
          }
          const node = layerRootRef.current;
          if (node !== null && typeof node.measureInWindow === 'function') {
            // The layer root's window position is the origin a native
            // anchored layer subtracts from its window coordinates
            node.measureInWindow(function (x, y) {
              host.setOrigin({ x: x, y: y });
            });
          }
        },
        pointerEvents: 'box-none',
        ref: layerRootRef,
        style: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
        testID: props.testID
      }, host.layers.map(function (layer) {
        return React.createElement(React.Fragment, { key: layer.id }, layer.render());
      })));

  }

  OverlayHostComponent.displayName = 'OverlayHost';

  return OverlayHostComponent;

}

OverlayHost.spec = SPEC;
