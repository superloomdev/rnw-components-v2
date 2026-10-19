// Info: FilterableMultiSelect composite. The query-bearing form of the
// family's multiple-choice field: the control is an editable input whose
// text filters the open list without touching the selected values; a count
// member in the frame clears them. Composes the same `useMultiSelect`
// behavior and shared parts as the press-only owner, with the filterable
// flag set.

import SPEC from './spec.filterable-multi-select.js';
import createMultiSelectComponent from './multi-select-parts.js';


/********************************************************************
FilterableMultiSelect factory.

@param {Object} ctx - Component context

@return {Function} - The FilterableMultiSelect component
*********************************************************************/
export default function FilterableMultiSelect (ctx) {

  return createMultiSelectComponent('FilterableMultiSelect', true, 'filterable-multi-select')(ctx);

}

FilterableMultiSelect.spec = SPEC;
