// Info: Global Escape-key dismissal behavior.
//
// Escape dismissal is universal shell behavior: dismissible layers,
// expanded navigation, and open disclosures all close on Escape and
// must clean up their listener. The component supplies the callback and an
// optional event source; this hook owns listener lifecycle and latest
// callback delegation.


/********************************************************************
Build the keyboard behaviors for one component system.

@param {Object} deps - { Utils, React }

@return {Object} - { useEscapeKey, getSearchHandlers }
*********************************************************************/
export default function createKeyboardBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;

  const { isNullOrUndefined } = Utils;


  /********************************************************************
  Invoke the latest onEscape callback when the source dispatches an
  Escape keydown. The listener attaches only while active and always
  removes the exact handler it added.

  @param {Function} onEscape      - Escape callback (latest wins)
  @param {Boolean}  [active=true] - Attach the listener only while true
  @param {Object}   [source]      - Event source; defaults to document

  @return {void}
  *********************************************************************/
  function useEscapeKey (onEscape, active = true, source) {

    const callbackRef = React.useRef(onEscape);
    callbackRef.current = onEscape;

    React.useEffect(function () {

      if (!active) {
        return undefined;
      }

      const explicit = !Utils.isNullOrUndefined(source);
      const resolvedSource = explicit
        ? source
        : (typeof document === 'undefined' ? undefined : document);
      if (Utils.isNullOrUndefined(resolvedSource)) {
        return undefined;
      }
      if (typeof resolvedSource.addEventListener !== 'function' ||
          typeof resolvedSource.removeEventListener !== 'function') {
        // A caller-supplied source that cannot take listeners is a
        // programmer error; a document without listener APIs is a host
        // that cannot dispatch Escape, so there is nothing to listen for.
        if (!explicit) {
          return undefined;
        }
        throw new TypeError('useEscapeKey: source must provide addEventListener and removeEventListener');
      }

      const handler = function (event) {
        if (event.key === 'Escape') {
          if (typeof callbackRef.current === 'function') {
            callbackRef.current(event);
          }
        }
      };
      resolvedSource.addEventListener('keydown', handler);
      return function () {
        resolvedSource.removeEventListener('keydown', handler);
      };

    }, [active, source]);

  }


  /********************************************************************
  Wire the shared search keyboard contract as pure event handlers: the
  clear action empties the field and returns focus to the input, Escape
  clears a populated field or asks a collapsed owner to close, and
  submitting reports the current text. A disabled field answers none
  of them.

  @param {Object}   options                  - Search wiring
  @param {Boolean}  options.populated        - The field holds text
  @param {Boolean}  options.disabled         - The field is disabled
  @param {Function} [options.onChangeText]   - Text setter
  @param {Function} [options.onClear]        - Clear notification
  @param {Function} [options.onCollapseRequest] - Empty-Escape request
  @param {Function} [options.onSubmit]       - Submission callback
  @param {String}   [options.value]          - Current text
  @param {Object}   [options.inputRef]       - Input host ref

  @return {Object} - { clear, onKeyPress, onSubmitEditing }
  *********************************************************************/
  function getSearchHandlers (options) {

    if (isNullOrUndefined(options)) {
      throw new TypeError('getSearchHandlers requires options');
    }

    const disabled = options.disabled === true;

    const focusInput = function () {
      const ref = options.inputRef;
      const input = isNullOrUndefined(ref) ? undefined : ref.current;
      if (!isNullOrUndefined(input) && typeof input.focus === 'function') {
        input.focus();
      }
    };

    const clear = function () {
      if (disabled) {
        return;
      }
      if (typeof options.onChangeText === 'function') {
        options.onChangeText('');
      }
      if (typeof options.onClear === 'function') {
        options.onClear();
      }
      focusInput();
    };

    const onKeyPress = function (event) {
      if (disabled) {
        return;
      }
      const key = isNullOrUndefined(event)
        ? undefined
        : (event.key !== undefined ? event.key
          : (isNullOrUndefined(event.nativeEvent) ? undefined : event.nativeEvent.key));
      if (key !== 'Escape') {
        return;
      }
      // Escape is claimed by the search contract: populated clears, an
      // empty field asks its expandable owner to collapse
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (options.populated === true) {
        clear();
        return;
      }
      if (typeof options.onCollapseRequest === 'function') {
        options.onCollapseRequest();
      }
    };

    const onSubmitEditing = function () {
      if (disabled) {
        return;
      }
      if (typeof options.onSubmit === 'function') {
        options.onSubmit(options.value);
      }
    };

    return {
      clear: clear,
      onKeyPress: onKeyPress,
      onSubmitEditing: onSubmitEditing
    };

  }


  return {
    useEscapeKey: useEscapeKey,
    getSearchHandlers: getSearchHandlers
  };

}
