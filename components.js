// Info: Library entry point. `createSystem` turns a built theme and a map of
// component factories into a registry of ready components, after checking
// that the theme carries every token the library requires and was built for
// the native projection (React Native Web is the web projection; a theme
// built for 'web' carries unit strings React Native cannot draw).
//
// Nothing here imports React, React Native or react-native-svg. The host's
// loader imports each once and passes them in `shared_libs`, so the library
// shares the host's single instance of every framework.

import createContext from './component/context.js';
import createPlatform from './component/platform.js';
import { REQUIRED_ICONS, REQUIRED_TOKENS, SUPPORTED_TOKENS } from './component/contract.js';

export { REQUIRED_ICONS, REQUIRED_TOKENS, SUPPORTED_TOKENS };

const REQUIRED_LIBS = ['React', 'ReactNative', 'Svg', 'Utils', 'Debug', 'Themer'];

// Finding codes from Themer.validateContract that concern token presence.
// Value-shape findings are the template's concern: the engine checks template
// literal shapes, and a built theme carries emitted shapes (a type set is
// `{ fontSize, ... }` once emitted, not `{ type_set: true, ... }`).
const PRESENCE_CODES = ['CONTRACT_MISSING_TOKEN', 'CONTRACT_UNKNOWN_TOKEN'];


/********************************************************************
Build one component system.

@param {Object} shared_libs - Lib container; requires React, ReactNative,
                              Svg, Utils, Debug, Themer
@param {Object} config      - Library config (reserved; frozen onto ctx)
@param {Object} built       - `Themer.buildTheme(template, layers, 'native')`
@param {String} breakpoint  - A `breakpoint.*` leaf name from the contract
@param {Object} factories   - Component name -> factory `(ctx) => Component`;
                              a factory may carry `.spec` (its spec sheet)

@return {Object} - Frozen registry: component name -> React component
*********************************************************************/
export function createSystem (shared_libs, config, built, breakpoint, factories) {

  // Validate the helpers first; every later check is made with them
  if (shared_libs === undefined || shared_libs === null ||
      shared_libs.Utils === undefined || shared_libs.Utils === null) {
    throw new TypeError('createSystem requires shared_libs.Utils');
  }
  const Utils = shared_libs.Utils;

  // Validate the remaining injected libraries; one error names every gap
  const missingLibs = REQUIRED_LIBS.filter(function (name) {
    return Utils.isNullOrUndefined(shared_libs[name]);
  });
  if (!Utils.isEmptyArray(missingLibs)) {
    throw new TypeError('createSystem requires shared_libs.' + missingLibs.join(', shared_libs.'));
  }

  // Init the dependency container
  const Lib = {
    React: shared_libs.React,
    ReactNative: shared_libs.ReactNative,
    Svg: shared_libs.Svg,
    Utils: shared_libs.Utils,
    Debug: shared_libs.Debug,
    Themer: shared_libs.Themer
  };

  // Validate the built theme shape
  if (Utils.isNullOrUndefined(built) || !Utils.isObject(built.tokens)) {
    throw new TypeError('createSystem requires a built theme with a tokens map');
  }

  // Validate the factories map
  if (Utils.isNullOrUndefined(factories) || !Utils.isObject(factories)) {
    throw new TypeError('createSystem requires a factories map');
  }

  // Validate the breakpoint against the contract's breakpoint tokens
  const contract = Lib.Themer.getContract();
  const breakpoints = Object.keys(contract.tokens).filter(function (name) {
    return name.indexOf('breakpoint.') === 0;
  }).map(function (name) {
    return name.slice('breakpoint.'.length);
  });
  if (!Utils.inArray(breakpoints, breakpoint)) {
    throw new TypeError('breakpoint must be one of ' + breakpoints.join(', '));
  }

  // Validate token presence through the engine; one error names every gap
  const report = Lib.Themer.validateContract(built, {
    required: REQUIRED_TOKENS,
    supported: SUPPORTED_TOKENS
  });
  const presence = report.errors.filter(function (entry) {
    return Utils.inArray(PRESENCE_CODES, entry.code);
  });
  if (!Utils.isEmptyArray(presence)) {
    throw new TypeError('theme is missing required tokens: ' + presence.map(function (entry) {
      return entry.token;
    }).join(', '));
  }

  // Validate every required token carries a value; the engine reports a
  // key whose rule resolved to nothing as present, so this closes that gap
  const empty = REQUIRED_TOKENS.filter(function (name) {
    return built.tokens[name] === undefined;
  });
  if (!Utils.isEmptyArray(empty)) {
    throw new TypeError('theme resolves required tokens to no value: ' + empty.join(', '));
  }

  // Validate the native projection: a dimension token must be a number
  const dimension = Object.keys(contract.meta).find(function (name) {
    return contract.meta[name].group === 'dimension' && built.tokens[name] !== undefined;
  });
  if (dimension !== undefined && !Utils.isNumber(built.tokens[dimension])) {
    throw new TypeError('theme must be built with the native projection; "' + dimension + '" is ' +
      JSON.stringify(built.tokens[dimension]) + ', not a number');
  }

  // Validate every required icon is present and an icon literal
  const missingIcons = REQUIRED_ICONS.filter(function (name) {
    const literal = built.tokens['icon.' + name];
    return Utils.isNullOrUndefined(literal) || literal.icon !== true;
  });
  if (!Utils.isEmptyArray(missingIcons)) {
    throw new TypeError('theme is missing required icons: ' + missingIcons.join(', '));
  }

  // Init the platform answer, the spec sheets and the registry
  const platform = createPlatform(Lib.ReactNative, Utils);
  const names = Object.keys(factories);
  const specs = {};
  for (const name of names) {
    if (!Utils.isFunction(factories[name])) {
      throw new TypeError('factory "' + name + '" must be a function');
    }
    if (factories[name].spec !== undefined) {
      specs[name] = factories[name].spec;
    }
  }
  const Registry = {};

  // Build the context, then every component; a factory may read the
  // registry lazily at render time, so build order does not matter
  const ctx = createContext(Lib, config, built, breakpoint, platform, contract, specs, Registry);
  for (const name of names) {
    Registry[name] = factories[name](ctx);
  }

  // Report the unsupported-token count at debug level; warnings are informational
  Lib.Debug.debug('createSystem built ' + names.length + ' components; ' +
    report.warnings.length + ' theme tokens outside the supported set');

  // Return the frozen registry
  return Object.freeze(Registry);

}
