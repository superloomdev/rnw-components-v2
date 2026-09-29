// Info: Behavior composer. Builds every headless behavior for one component
// system from the injected dependencies and returns them as one frozen map.
//
// Behaviors own state, keyboard, focus and accessibility props. They own no
// appearance: no color, size, radius, border, font, token read or design
// system name appears in this directory, and the purity test enforces it.
// Hooks that own state publish `stateKeys`; a component consumes `state` and
// never recomputes it.
//
// Nothing here imports React or React Native. Both arrive through the
// component system (`shared_libs.React`, `shared_libs.ReactNative`), so the
// library shares the host's single instance of each and the tests can hand
// in the web build without a module-resolution hook.

import createA11yBehaviors from './a11y.js';
import createCompoundBehaviors from './compound.js';
import createControlsBehaviors from './controls.js';
import createFocusBehaviors from './focus.js';
import createHeadingBehaviors from './heading.js';
import createKeyboardBehaviors from './keyboard.js';
import createLocalBehaviors from './local.js';
import createMenuBehaviors from './menu.js';
import createOverlayBehaviors from './overlay.js';
import createPickersBehaviors from './pickers.js';
import createPositioningBehaviors from './positioning.js';
import createPressBehaviors from './press.js';
import createRovingBehaviors from './roving.js';
import createStateBehaviors from './state.js';
import createUtilitiesBehaviors from './utilities.js';


/********************************************************************
Build every behavior for one component system.

@param {Object} deps             - Injected dependencies
@param {Object} deps.React       - The host's React
@param {Object} deps.ReactNative - The host's React Native (or the web build)
@param {Object} deps.Utils       - helper-utils
@param {Object} deps.platform    - From `component/platform.js`

@return {Object} - Frozen map of every behavior, keyed by name
*********************************************************************/
export default function createBehaviors (deps) {

  // Validate the injected dependencies
  for (const name of ['React', 'ReactNative', 'Utils', 'platform']) {
    if (deps === undefined || deps === null || deps[name] === undefined || deps[name] === null) {
      throw new TypeError('createBehaviors requires deps.' + name);
    }
  }

  // Init the state primitives first; local behaviors compose them
  const state = createStateBehaviors(deps);

  // Build every family from the same dependencies
  const families = [
    createA11yBehaviors(deps),
    createCompoundBehaviors(deps),
    createControlsBehaviors(deps),
    createFocusBehaviors(deps),
    createHeadingBehaviors(deps),
    createKeyboardBehaviors(deps),
    createLocalBehaviors(Object.assign({}, deps, { useControllableState: state.useControllableState })),
    createMenuBehaviors(deps),
    createOverlayBehaviors(deps),
    createPickersBehaviors(deps),
    createPositioningBehaviors(deps),
    createPressBehaviors(deps),
    createRovingBehaviors(deps),
    state,
    createUtilitiesBehaviors(deps)
  ];

  // Merge into one map, refusing a duplicate name
  const behaviors = {};
  for (const family of families) {
    for (const name of Object.keys(family)) {
      if (name in behaviors) {
        throw new TypeError('createBehaviors: duplicate behavior name "' + name + '"');
      }
      behaviors[name] = family[name];
    }
  }

  // Return the frozen map
  return Object.freeze(behaviors);

}
