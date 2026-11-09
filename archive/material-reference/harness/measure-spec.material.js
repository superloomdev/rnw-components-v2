// Source: _test/measure.spec.js (Material parts, verbatim from 7f2bd93)

// --- _test/measure.spec.js:13-19 ---
// silent. Rows whose `reference.js` carries a `second` block are measured
// the same way against the second reference (the Material web components,
// themed from the material template) under the material template; a part
// may name the properties it compares (`compare`) where the two anatomies
// split one box across elements. Every primary part is measured against the
// second reference too, or listed in `second.omit` with its reason and the
// upstream selector that must keep drawing nothing. An omission marked

// --- _test/measure.spec.js:57-60 ---
const SECOND_TEMPLATE = 'material';
// The second reference paints some colors as a role at an element opacity, where a template
// states the same color as rgba: the CSS of a shadow is the fidelity gate's pixels, and a text
// color is compared as its ink (the color at the opacity it is painted at)

// --- _test/measure.spec.js:74-74 ---
@param {Object} reference - The reference block (primary or second)

// --- _test/measure.spec.js:274-385 ---
test.describe('measure: second reference', function () {

  const withSecond = components.filter(function (component) {
    return component.reference !== null && component.reference.second !== undefined;
  });

  test('every row with a second twin carries a second reference block', function () {
    const twinned = built.filter(function (row) {
      return row.material_twin !== 'none' && row.reference.kind === 'render-web';
    }).map(function (row) {
      return row.name;
    });
    expect(withSecond.map(function (component) {
      return component.name;
    }).sort()).toEqual(twinned.sort());
  });

  // A part left out of the second comparison is a part nothing checks there: each one
  // carries its reason and the upstream selector that proves the reason still holds
  test('every primary part is measured against the second reference or omitted with a reason', function () {
    expect(withSecond.length).toBeGreaterThanOrEqual(1);
    const problems = [];
    for (const component of withSecond) {
      const second = component.reference.second;
      const omit = second.omit || {};
      for (const part of Object.keys(component.reference.parts)) {
        if (second.parts[part] === undefined && omit[part] === undefined) {
          problems.push(component.name + ' / ' + part + ': neither measured nor omitted');
        }
      }
      for (const part of Object.keys(omit)) {
        if (second.parts[part] !== undefined) {
          problems.push(component.name + ' / ' + part + ': both measured and omitted');
        }
        if (typeof omit[part].reason !== 'string' || omit[part].reason.length === 0) {
          problems.push(component.name + ' / ' + part + ': omitted with no reason');
        }
        if (typeof omit[part].upstream !== 'string' || omit[part].upstream.length === 0) {
          problems.push(component.name + ' / ' + part + ': omitted with no upstream selector');
        }
        if (omit[part].mask !== undefined && omit[part].mask !== true) {
          problems.push(component.name + ' / ' + part + ': mask is true or absent');
        }
      }
    }
    expect(problems, 'primary parts the second reference does not account for').toEqual([]);
  });

  for (const component of withSecond) {
    test(component.name + ': parts match the second reference', async function ({ page }) {
      const parts = component.reference.second.parts;
      const reference = await openReference(page, component.name, 'second');
      expect(reference.errors).toEqual([]);
      expect(reference.cells, component.name + ': the second reference page drew no state').toBeGreaterThanOrEqual(1);
      const upstream = await readParts(page, component.name, parts, 'upstream', component.reference.second.origin, { extended: true, pauseAnimations: component.reference.second.pauseAnimations === true });
      await rereadReopened(page, component, component.reference.second, 'upstream', true, upstream);
      const upstreamDrawn = await drawnParts(page, component, component.reference.second, 'upstream', true, upstream);
      expect(upstreamDrawn.failures, component.name + ': declared targets missing upstream').toEqual([]);

      // An omitted part must still draw nothing upstream; the moment it does, its omission is stale
      const omit = component.reference.second.omit || {};
      const probes = {};
      for (const part of Object.keys(omit)) {
        probes[part] = { upstream: omit[part].upstream, measure: 'box' };
      }
      const probed = await readParts(page, component.name, probes, 'upstream');
      const drawnOmissions = Object.keys(probes).filter(function (part) {
        return Object.keys(probed).some(function (state) {
          return probed[state][part] !== null && probed[state][part].visible === true;
        });
      });
      expect(drawnOmissions, component.name + ': omitted parts the second reference draws; measure them').toEqual([]);
      const opened = await openShowcase(page, SECOND_TEMPLATE, component.name, { measure: true, hosted: false });
      expect(opened.status.errors).toEqual([]);
      const ours = await readParts(page, component.name, parts, 'ours', component.reference.second.origin, { extended: true, pauseAnimations: component.reference.second.pauseAnimations === true });
      await rereadReopened(page, component, component.reference.second, 'ours', true, ours);
      const undrawn = Object.keys(parts).filter(function (part) {
        return !upstreamDrawn.drawn.has(part);
      });
      expect(undrawn, component.name + ': parts the second reference never draws').toEqual([]);
      test.info().annotations.push({ type: 'measure', description: component.name + ' (second): ' + Object.keys(upstream).length + ' states measured; unmeasured ' + JSON.stringify(reference.unmeasured) });

      // A disagreement an expected gap explains (a queued contract request or template
      // finding) is set aside; a gap that no longer reproduces is stale and fails
      const gaps = GAPS.filter(function (gap) {
        return gap.check === 'measure-second' && gap.component === component.name;
      });
      // Colors are compared as painted: a box color at its element's opacity, a text color as its ink
      const lines = findDisagreements(ours, upstream, parts, ['ink'], AS_PAINTED);
      const explained = function (line) {
        return gaps.find(function (gap) {
          const inState = !gap.states || gap.states.some(function (state) {
            return line.indexOf(state + ' / ') === 0;
          });
          return inState && (line.indexOf(' / ' + gap.part + ' / ' + gap.property + ':') !== -1 || (gap.property === '*' && line.indexOf(' / ' + gap.part + ' / ') !== -1) || (gap.property === '*' && line.indexOf(' / ' + gap.part + ': ') !== -1));
        });
      };
      const stale = gaps.filter(function (gap) {
        return !lines.some(function (line) {
          return explained(line) === gap;
        });
      });
      expect(stale.map(function (gap) {
        return gap.part + ' / ' + gap.property + ' (' + gap.request + ')';
      }), component.name + ': expected gaps that no longer reproduce; remove them').toEqual([]);
      test.info().annotations.push({ type: 'measure', description: component.name + ' (second): ' + lines.filter(explained).length + ' disagreement(s) explained by ' + gaps.length + ' expected gap(s)' });
      expect(lines.filter(function (line) {
        return !explained(line);
      }), component.name + ' differs from the second reference').toEqual([]);
    });
  }

