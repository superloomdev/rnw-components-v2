// Info: Expected-gap consumption (FIDELITY RULES 5). A disagreement line a
// queued contract request or template finding explains is set aside; a
// gap entry that no longer reproduces is stale and fails until removed.
// Entries match a line on component, part and property ('*' covers every
// property of the part); an entry may restrict to named states.

/********************************************************************
Whether a gap applies to a fidelity set: an entry names its `set`, and one
without names the primary set; a check run with no set (measure) takes
every entry.

@param {Object} gap   - An expected-gaps.json entry
@param {String} [set] - The fidelity set ('primary' or 'narrow')

@return {Boolean} - True when the gap applies
*********************************************************************/
function inSet (gap, set) {
  return set === undefined || (gap.set === undefined ? 'primary' : gap.set) === set;
}


export function explainDisagreements (lines, gaps, component, check, set) {
  const mine = gaps.filter(function (gap) {
    return gap.check === check && gap.component === component && inSet(gap, set);
  });
  const matches = function (line, gap) {
    const inState = gap.states === undefined || gap.states.some(function (state) {
      return line.indexOf(state + ' / ') === 0;
    });
    const onPart = line.indexOf(' / ' + gap.part + ' / ') !== -1;
    const onProperty = gap.property === '*'
      ? line.indexOf(' / ' + gap.part + ': ') !== -1 || line.indexOf(' / ' + gap.part + ' / ') !== -1
      : line.indexOf(' / ' + gap.part + ' / ' + gap.property + ':') !== -1;
    return inState && (onPart && (gap.property === '*' || line.indexOf(' / ' + gap.part + ' / ' + gap.property + ':') !== -1) || gap.property === '*' && onProperty);
  };
  const unexplained = [];
  const explained = [];
  for (const line of lines) {
    if (mine.some(function (gap) { return matches(line, gap); })) {
      explained.push(line);
    } else {
      unexplained.push(line);
    }
  }
  const stale = mine.filter(function (gap) {
    return lines.every(function (line) { return matches(line, gap) !== true; });
  });
  return { unexplained: unexplained, explained: explained, stale: stale };
}


/********************************************************************
Explain perceptual-budget lines (fidelity.spec.js's 'N% > M%' over lines):
an entry { check, component, part: '*', property: 'perceptual' } covers
every state whose name the line leads with, or only `states` when given.
A gap that no longer reproduces is stale and fails until removed.

@param {Array}  lines     - 'state: N% > M%' strings
@param {Array}  gaps      - expected-gaps.json entries
@param {String} component - the component name
@param {String} check     - the check this gate runs ('fidelity')

@return {Object} - { unexplained, explained, stale }
*********************************************************************/
export function explainBudgetLines (lines, gaps, component, check, set) {
  const mine = gaps.filter(function (gap) {
    return gap.check === check && gap.component === component && gap.property === 'perceptual' && gap.part === '*' && inSet(gap, set);
  });
  const matches = function (line, gap) {
    const key = String(line).split(':')[0];
    return gap.states === undefined || gap.states.indexOf(key) !== -1;
  };
  const unexplained = [];
  const explained = [];
  for (const line of lines) {
    if (mine.some(function (gap) { return matches(line, gap); })) {
      explained.push(line);
    } else {
      unexplained.push(line);
    }
  }
  const stale = mine.filter(function (gap) {
    return lines.every(function (line) { return matches(line, gap) !== true; });
  });
  return { unexplained: unexplained, explained: explained, stale: stale };
}
