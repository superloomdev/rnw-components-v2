// Source: _test/harness/fidelity.js (Material parts, verbatim from 7f2bd93)

// --- _test/harness/fidelity.js:14-14 ---
// the second reference omits with `mask` (it never draws it, ours does by

// --- _test/harness/fidelity.js:27-27 ---
export const TEMPLATE = Object.freeze({ primary: 'carbon', second: 'material' });

// --- _test/harness/fidelity.js:448-467 ---
@param {String} set       - 'primary' | 'second'
@param {String} scheme    - 'light' | 'dark'

@return {Promise<Object>} - { lines, perceptual, states, unmeasured, errors, upstream, ours }
*********************************************************************/
export async function runFidelity (page, component, set, scheme) {

  const reference = set === 'second' ? component.reference.second : component.reference;
  // The omissions masked out of the pixels, measured by the primary part's selector on our side
  const omit = set === 'second' ? (reference.omit || {}) : {};
  const masks = Object.fromEntries(Object.keys(omit).filter(function (name) {
    return omit[name].mask === true;
  }).map(function (name) {
    return [name, component.reference.parts[name]];
  }));
  const status = await openReference(page, component.name, set, scheme);
  const upstream = await collect(page, component, reference, 'upstream');
  const opened = await openShowcase(page, TEMPLATE[set], component.name, { measure: true, scheme: scheme, hosted: false });
  const ours = await collect(page, component, reference, 'ours', masks);
  const anchor = ANCHOR[component.name];
