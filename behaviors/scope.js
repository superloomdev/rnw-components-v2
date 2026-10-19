// Info: Structural scope contexts - the painted layer level and the
// inherited disabled flag.
//
// These are structure, not theme values: a Layer raises the surface level
// of everything inside it, and a FormGroup disables its descendants as
// one. Both answers travel down the tree to components built by any level
// context, so they live here beside the other shared behaviors rather
// than in one component. The registry reads them unconditionally, so the
// defaults below are what a component sees outside any provider.


/********************************************************************
Build the scope contexts for one component system.

@param {Object} deps - { React }

@return {Object} - { LayerContext, DisabledContext }
*********************************************************************/
export default function createScopeBehaviors (deps) {

  const React = deps.React;


  // Painted layer level: 1 is the page surface; a Layer providers 2 or 3
  const LayerContext = React.createContext(1);
  LayerContext.displayName = 'LayerContext';

  // Inherited disabled: an enclosing group has disabled its descendants
  const DisabledContext = React.createContext(false);
  DisabledContext.displayName = 'DisabledContext';


  return {
    LayerContext: LayerContext,
    DisabledContext: DisabledContext
  };

}
