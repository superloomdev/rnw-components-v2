// Info: Accessibility translation primitives for components.
//
// These functions map semantic state to aria-* props. They translate and
// omit; they never decide validity. Only null and undefined are omitted -
// false, 0, and the empty string are caller data and pass through
// unchanged, so a translator can never silently discard an authored value.
//
// IDs come from React useId: stable per mounted component and safe under
// hydration, replacing the old loader-global monotonic counter.


/********************************************************************
Build the a11y behaviors for one component system.

@param {Object} deps - { Utils, React }

@return {Object} - { getA11yState, getA11yValue, getA11yRelation, getA11yPosition,
  getA11yLive, useA11yId }
*********************************************************************/
export default function createA11yBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;


  const STATE_KEYS = {
    checked: 'aria-checked',
    disabled: 'aria-disabled',
    expanded: 'aria-expanded',
    selected: 'aria-selected',
    invalid: 'aria-invalid',
    required: 'aria-required',
    readonly: 'aria-readonly',
    busy: 'aria-busy',
    pressed: 'aria-pressed',
    current: 'aria-current',
    hidden: 'aria-hidden',
    modal: 'aria-modal'
  };

  const VALUE_KEYS = {
    min: 'aria-valuemin',
    max: 'aria-valuemax',
    now: 'aria-valuenow',
    text: 'aria-valuetext'
  };

  const RELATION_KEYS = {
    controls: 'aria-controls',
    describedby: 'aria-describedby',
    labelledby: 'aria-labelledby',
    owns: 'aria-owns',
    activedescendant: 'aria-activedescendant'
  };

  const POSITION_KEYS = {
    colspan: 'aria-colspan',
    posinset: 'aria-posinset',
    setsize: 'aria-setsize',
    level: 'aria-level'
  };

  const LIVE_KEYS = {
    live: 'aria-live'
  };


  /********************************************************************
  Emit the aria-* props for the given key map, omitting only null and
  undefined values.

  @param {Object} opts - Caller's semantic options, or null/undefined
  @param {Object} keys - Option name to aria-* key map

  @return {Object} - The translated props
  *********************************************************************/
  function emit (opts, keys) {

    if (Utils.isNullOrUndefined(opts)) {
      return {};
    }

    const props = {};
    const names = Object.keys(keys);
    for (let i = 0; i < names.length; i++) {
      const value = opts[names[i]];
      if (!Utils.isNullOrUndefined(value)) {
        props[keys[names[i]]] = value;
      }
    }

    return props;

  }


  /********************************************************************
  Semantic state -> aria state props. checked accepts true | false |
  'mixed'; current accepts the token strings or a boolean.

  @param {Object} opts - { checked, disabled, expanded, selected, invalid,
    required, readonly, busy, pressed, current, hidden, modal }

  @return {Object} - aria-* state props
  *********************************************************************/
  function getA11yState (opts) {

    return emit(opts, STATE_KEYS);

  }


  /********************************************************************
  Range value -> aria value props, for slider/progressbar/spinbutton.

  @param {Object} opts - { min, max, now, text }

  @return {Object} - aria-* value props
  *********************************************************************/
  function getA11yValue (opts) {

    return emit(opts, VALUE_KEYS);

  }


  /********************************************************************
  Relationship ids -> aria relation props.

  @param {Object} opts - { controls, describedby, labelledby, owns,
    activedescendant }

  @return {Object} - aria-* relation props
  *********************************************************************/
  function getA11yRelation (opts) {

    return emit(opts, RELATION_KEYS);

  }


  /********************************************************************
  Position in set -> aria position props, for list/option/step semantics
  and table cell span.

  @param {Object} opts - { colspan, posinset, setsize, level }

  @return {Object} - aria-* position props
  *********************************************************************/
  function getA11yPosition (opts) {

    return emit(opts, POSITION_KEYS);

  }


  /********************************************************************
  Live region -> aria live props plus the pinned React Native Web atomic
  bridge. The pinned host view emits the atomic attribute only from the
  accessibilityAtomic prop, so callers pass the full semantic input and
  the translator returns the standardized live prop alongside that
  bridge; a raw aria-atomic key is never emitted.

  @param {Object} opts - { live, atomic }

  @return {Object} - aria-* live props plus the RNW atomic bridge
  *********************************************************************/
  function getA11yLive (opts) {

    const props = emit(opts, LIVE_KEYS);

    if (!Utils.isNullOrUndefined(opts) && !Utils.isNullOrUndefined(opts.atomic)) {
      return Object.assign(props, {
        accessibilityAtomic: opts.atomic
      });
    }

    return props;

  }


  /********************************************************************
  Stable, hydration-safe id for labelledby/describedby wiring.

  @param {String} [prefix] - Id prefix, defaults to 'sl'

  @return {String} - "<prefix>-<useId>"
  *********************************************************************/
  function useA11yId (prefix) {

    const id = React.useId();

    return (prefix || 'sl') + '-' + id;

  }


  return {
    getA11yState: getA11yState,
    getA11yValue: getA11yValue,
    getA11yRelation: getA11yRelation,
    getA11yPosition: getA11yPosition,
    getA11yLive: getA11yLive,
    useA11yId: useA11yId
  };

}
