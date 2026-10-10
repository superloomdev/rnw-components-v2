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

@return {Object} - { useEscapeKey }
*********************************************************************/
export default function createKeyboardBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;


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


  return {
    useEscapeKey: useEscapeKey
  };

}
