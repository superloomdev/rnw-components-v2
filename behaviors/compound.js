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

@return {Object} - { createCompoundContext }
*********************************************************************/
export default function createCompoundBehaviors (deps) {

  const React = deps.React;


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


  return {
    createCompoundContext: createCompoundContext
  };

}
