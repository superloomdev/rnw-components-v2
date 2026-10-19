// Info: MultiSelect composite. A field whose pressable combobox opens a
// multiple-choice list: each option row carries a decorative checkbox
// member and toggles its own value without closing; a count member in the
// frame clears the selection; committed count changes announce through the
// live region. Composes the `useMultiSelect` behavior for values, open,
// keyboard traversal and measured scrolling, and draws the theme's
// `feedback.field` frame, `anatomy.label` placement, `field` role cells as
// the select member and `list` role cells for the open list. Shares its
// renderer with the filterable owner through the family's parts factory.

import SPEC from './spec.multi-select.js';
import createMultiSelectComponent from './multi-select-parts.js';


/********************************************************************
MultiSelect factory.

@param {Object} ctx - Component context

@return {Function} - The MultiSelect component
*********************************************************************/
export default function MultiSelect (ctx) {

  return createMultiSelectComponent('MultiSelect', false, 'multi-select')(ctx);

}

MultiSelect.spec = SPEC;
