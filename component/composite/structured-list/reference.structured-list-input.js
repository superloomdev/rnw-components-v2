// Info: StructuredListInput measurement reference. Upstream draws the rows' hidden radios inside a whole
// list (`referenceProps.list`, mounted by the wrapper's reference): the
// table's columns come from every row, so the member is compared in its
// list. Parts and targets are the wrapper's, those its states draw.

import { TARGETS, mountList, partsOf } from './reference.structured-list-wrapper.js';

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  additionalTargets: Object.freeze([TARGETS[0], TARGETS[2]]),
  // Taller than the measurement grid's 160 pitch: the body declares its
  // height so the cell spans its rows
  body: Object.freeze({ width: 800, height: 120, stage: true }),
  mount: function (React, upstream, props) {
    return mountList(React, upstream, props.list);
  },
  parts: partsOf(['root', 'rows', 'cells', 'labels', 'radios', 'checks'])
});
