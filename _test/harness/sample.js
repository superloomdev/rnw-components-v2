// Info: Sample mounting, shared by every consumer (browser showcase,
// Node gates, demo walker). A sample state carries `props` for the
// component and, optionally, `wrappers`: an array of `{ component,
// props }` descriptors naming registry factories, first entry outermost.
// Wrappers are catalog composition metadata - never component props -
// and only the consumers interpret them.


/********************************************************************
Build the element a sample state describes: the named component from
`state.props`, wrapped in `state.wrappers` applied from last to first
so the first descriptor lands outermost.

@param {Object} React    - React
@param {Object} Registry - The system's registry of components
@param {String} name     - The component the sample mounts
@param {Object} state    - Sample state { label, props, wrappers? }

@return {Object} - React element
*********************************************************************/
export function createSampleElement (React, Registry, name, state) {

  let element = React.createElement(Registry[name], state.props);
  const wrappers = Array.isArray(state.wrappers) ? state.wrappers : [];
  for (let i = wrappers.length - 1; i >= 0; i = i - 1) {
    const descriptor = wrappers[i];
    const factory = descriptor && typeof descriptor.component === 'string'
      ? Registry[descriptor.component]
      : undefined;
    if (factory === undefined) {
      throw new TypeError('sample wrapper "' + (descriptor && descriptor.component) + '" of ' + name + ' / ' + state.label + ' is not in the registry');
    }
    element = React.createElement(factory, descriptor.props || {}, element);
  }

  return element;

}
