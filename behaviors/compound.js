// Info: Context factory for compound components.
//
// A compound component (Tabs/Tab, Accordion/AccordionItem, Menu/MenuItem)
// coordinates parent and child through a context, never through child
// inspection or cloneElement - those break the moment a child is wrapped
// in memo or forwardRef.
//
// The context defaults to undefined so the consumer hook can detect
// "rendered outside its Provider" and throw a TypeError naming the
// required parent, turning a blank render into a clear boot-time error.


/********************************************************************
Build the compound behaviors for one component system.

@param {Object} deps - { React }

@return {Object} - { createCompoundContext, getCompoundContext }
*********************************************************************/
export default function createCompoundBehaviors (deps) {

  const React = deps.React;

  // Named contexts are cached per system: the same name always returns the
  // same { Provider, useContext, Context } triple within this instance. A
  // Map keeps '__proto__' and 'toString' ordinary names, not inherited
  // dictionary members
  const compoundContexts = new Map();


  /********************************************************************
  Create a { Provider, useContext, Context } triple bound to a display
  name. The returned useContext throws when no Provider is mounted.

  @param {String} displayName - Human-readable name for error messages

  @return {Object} - { Provider, useContext, Context }
  *********************************************************************/
  function createCompoundContext (displayName) {

    const Context = React.createContext(undefined);
    Context.displayName = displayName + 'Context';

    const useContext = function () {

      const value = React.useContext(Context);

      // An invalid compound tree fails during render, before commit
      if (value === undefined) {
        throw new TypeError(
          displayName + ': this component must be rendered inside a ' +
          displayName + ' Provider. Rendering it standalone is not supported.'
        );
      }

      return value;

    };

    return {
      Provider: Context.Provider,
      useContext: useContext,
      Context: Context
    };

  }


  /********************************************************************
  Return the named compound context for this system, building it on
  first use. The same name reuses one context inside one system; a
  different name or a different system returns an isolated triple. A
  fresh triple remains available through createCompoundContext.

  @param {String} displayName - Human-readable name for error messages

  @return {Object} - { Provider, useContext, Context }
  *********************************************************************/
  function getCompoundContext (displayName) {

    if (!compoundContexts.has(displayName)) {
      compoundContexts.set(displayName, createCompoundContext(displayName));
    }

    return compoundContexts.get(displayName);

  }


  return {
    createCompoundContext: createCompoundContext,
    getCompoundContext: getCompoundContext
  };

}
