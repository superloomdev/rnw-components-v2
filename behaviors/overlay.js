// Info: Overlay behavior core - host registration and layer membership.
//
// A host owns an ordered stack of overlay layers; an overlay component
// registers itself while open. This layer owns no presentation: it returns
// no zIndex, geometry, or stack offset. Which layer paints on top, and how
// it looks, is the component's or provider's decision - the behavior answers
// only "am I hosted, under which id, and am I the topmost layer".
//
// IDs come from a monotonic counter, never from stack length: removing a
// non-tail layer must not make the next registration reuse a live id.


/********************************************************************
Build the overlay behaviors for one component system.

@param {Object} deps - { Utils, React }

@return {Object} - { OverlayContext, useOverlayHost, useOverlay }
*********************************************************************/
export default function createOverlayBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;


  /********************************************************************
  Overlay context. The default value means no host is mounted: hosted is
  false and register is a no-op returning null, so an overlay rendered
  outside a host simply never gets a layer.

  @type {Object}
  *********************************************************************/
  const OverlayContext = React.createContext({
    hosted: false,
    layers: [],
    register: function () {
      return null;
    },
    unregister: function () {}
  });


  /********************************************************************
  Host-side hook: owns the layer stack and the context value a provider
  publishes.

  @return {Object} - { contextValue, layers }
  *********************************************************************/
  function useOverlayHost () {

    const nextIdRef = React.useRef(0);
    const [layers, setLayers] = React.useState([]);

    const register = React.useCallback(function (layer) {
      const id = nextIdRef.current;
      nextIdRef.current += 1;
      setLayers(function (current) {
        return current.concat(Object.assign({}, layer, { id: id }));
      });

      return id;
    }, []);

    const unregister = React.useCallback(function (id) {
      setLayers(function (current) {
        return current.filter(function (layer) {
          return layer.id !== id;
        });
      });
    }, []);

    const contextValue = React.useMemo(function () {
      return {
        hosted: true,
        layers: layers,
        register: register,
        unregister: unregister
      };
    }, [layers, register, unregister]);

    return {
      contextValue: contextValue,
      layers: layers
    };

  }


  /********************************************************************
  The painted boundary of one registered layer.

  A layer delegates to the overlay's latest options through a ref. That
  ref is written during the overlay's own render, which happens AFTER the
  host's render has already invoked this view - so the view subscribes to
  a per-commit version bump and repaints itself with the current options.
  Without the subscription the layer would lag the overlay by one commit.

  @param {Object} props - { store, optionsRef }

  @return {Object} - the overlay's rendered children
  *********************************************************************/
  function OverlayLayerView (props) {

    React.useSyncExternalStore(
      props.store.subscribe,
      props.store.getVersion,
      props.store.getVersion
    );

    return props.optionsRef.current.render();

  }


  /********************************************************************
  Overlay-side hook: registers the overlay with the host while open.

  The registered layer delegates trap/onClose/render through a latest-value
  ref, so a fresh inline closure from the consumer never causes a
  re-registration: the effect depends only on open state and host identity.
  A per-commit version bump repaints the mounted layer view with whatever
  the ref then holds.

  @param {Object} options
  @param {Boolean}  options.isOpen  - Whether the overlay is open
  @param {Boolean}  [options.trap]  - Whether the layer traps focus
  @param {Function} options.onClose - Called on Escape/outside dismissal
  @param {Function} options.render  - Returns the overlay children

  @return {Object} - { hosted, layerId, isTopmost }
  *********************************************************************/
  function useOverlay (options) {

    const isOpen = options.isOpen;

    // Capture only what the effect needs; depending on the whole context
    // object would re-run the effect on every layers change.
    const ctx = React.useContext(OverlayContext);
    const hosted = ctx.hosted === true;
    const register = ctx.register;
    const unregister = ctx.unregister;
    const layers = ctx.layers;

    const layerIdRef = React.useRef(null);

    // Latest-value box updated every render: the host always reads the
    // current options through the registered layer's delegators.
    const optionsRef = React.useRef(null);
    optionsRef.current = {
      trap: options.trap,
      onClose: options.onClose,
      render: options.render
    };

    // Version store each mounted layer view subscribes to. Bumped after
    // every commit so the view repaints the options the ref now holds.
    const storeRef = React.useRef(null);
    if (storeRef.current === null) {
      const listeners = new Set();
      const store = {
        version: 0,
        subscribe: function (listener) {
          listeners.add(listener);

          return function () {
            listeners.delete(listener);
          };
        },
        getVersion: function () {
          return store.version;
        },
        notify: function () {
          store.version += 1;
          listeners.forEach(function (listener) {
            listener();
          });
        }
      };
      storeRef.current = store;
    }

    React.useEffect(function () {
      storeRef.current.notify();
    });

    React.useEffect(function () {

      if (isOpen && hosted) {
        layerIdRef.current = register({
          get trap () {
            return optionsRef.current.trap;
          },
          get onClose () {
            return optionsRef.current.onClose;
          },
          render: function () {
            return React.createElement(OverlayLayerView, {
              store: storeRef.current,
              optionsRef: optionsRef
            });
          }
        });
      }

      return function () {
        if (layerIdRef.current !== null) {
          unregister(layerIdRef.current);
          layerIdRef.current = null;
        }
      };

    }, [isOpen, hosted, register, unregister]);

    const isTopmost = layerIdRef.current !== null
      && !Utils.isEmptyArray(layers)
      && layers[layers.length - 1].id === layerIdRef.current;

    return {
      hosted: hosted,
      layerId: layerIdRef.current,
      isTopmost: isTopmost
    };

  }


  return {
    OverlayContext: OverlayContext,
    useOverlayHost: useOverlayHost,
    useOverlay: useOverlay
  };

}
