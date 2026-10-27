// Source: _test/fidelity.spec.js (Material parts, verbatim from 7f2bd93)

// --- _test/fidelity.spec.js:2-3 ---
// reference it has (the primary under the carbon template, the second under
// the material template) and under each template's light and dark scheme:

// --- _test/fidelity.spec.js:9-9 ---
// template, component or harness defect. A masked omission (`second.omit`,

// --- _test/fidelity.spec.js:36-36 ---
    const sets = (NO_PRIMARY.has(component.name) ? [] : ['primary']).concat(component.reference.second ? ['second'] : []);
