// Info: Expected-gap consumption (FIDELITY RULES 5). A disagreement line a
// queued contract request or template finding explains is set aside; a
// gap entry that no longer reproduces is stale and fails until removed.
// Entries match a line on component, part and property ('*' covers every
// property of the part); an entry may restrict to named states.

export function explainDisagreements (lines, gaps, component, check) {
  const mine = gaps.filter(function (gap) {
    return gap.check === check && gap.component === component;
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
