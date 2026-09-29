// Info: Heading hierarchy behavior.
//
// Section nesting advances a universal heading level that descendants
// read to publish heading semantics. The level itself is structure, not
// appearance, so it lives in the behavior layer: every component consumes the
// same hierarchy rather than recomputing or ignoring it.


/********************************************************************
Build the heading behaviors for one component system.

@param {Object} deps - { React }

@return {Object} - { HeadingLevelContext, useHeadingLevel, useSectionLevel,
  HeadingLevelProvider }
*********************************************************************/
export default function createHeadingBehaviors (deps) {

  const React = deps.React;


  const HeadingLevelContext = React.createContext(1);
  HeadingLevelContext.displayName = 'HeadingLevelContext';


  /********************************************************************
  Read the current heading level.

  @return {Number} - Active heading level (1 through 6)
  *********************************************************************/
  function useHeadingLevel () {

    return React.useContext(HeadingLevelContext);

  }


  /********************************************************************
  Resolve the heading level one section deeper than the current context,
  clamped to the ARIA range. An explicit override must already be a valid
  level; anything else fails synchronously with a named TypeError.

  @param {Number} [levelOverride] - Explicit heading level (1 through 6)

  @return {Number} - Heading level for this section (1 through 6)
  *********************************************************************/
  function useSectionLevel (levelOverride) {

    const parentLevel = useHeadingLevel();
    if (levelOverride !== undefined &&
        (!Number.isInteger(levelOverride) || levelOverride < 1 || levelOverride > 6)) {
      throw new TypeError('Section level must be an integer from 1 through 6');
    }
    const level = levelOverride === undefined ? parentLevel + 1 : levelOverride;
    return Math.min(level, 6);

  }


  /********************************************************************
  Publish a heading level to descendants.

  @param {Object} props - { level, children }

  @return {Object} - Context provider element
  *********************************************************************/
  function HeadingLevelProvider ({ level, children }) {

    return React.createElement(
      HeadingLevelContext.Provider,
      { value: level },
      children
    );

  }


  return {
    HeadingLevelContext: HeadingLevelContext,
    useHeadingLevel: useHeadingLevel,
    useSectionLevel: useSectionLevel,
    HeadingLevelProvider: HeadingLevelProvider
  };

}
