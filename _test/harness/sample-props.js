// Info: Measured-page sample props. A state the reference re-opens by
// click must not mount its panel early: a measured cell drops the
// sample's seeded `open` so both pages open the panel by the same click
// at the same pinned scroll. The contact sheet and every host keep the
// seeded `open`.


/********************************************************************
Drop the seeded `open` prop from a sample state when the reference
re-opens that state by click.

@param {Object} reference - The component's reference entry (or none)
@param {String} label     - The sample state's label
@param {Object} props     - The sample state's props

@return {Object} - The props, or a copy without `open`
*********************************************************************/
export function measuredProps (reference, label, props) {

  if (reference === undefined || reference === null || reference.reopen === undefined || !Array.isArray(reference.reopen.states) ||
      reference.reopen.states.indexOf(label) === -1 ||
      props === undefined || props === null || props.open !== true) {
    return props;
  }
  const next = Object.assign({}, props);
  delete next.open;
  return next;

}
