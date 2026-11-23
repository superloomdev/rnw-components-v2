// Info: HeaderGlobalBar sample states for the showcase, the browser gates
// and the docs. `requires_parent`: each state mounts inside a Header.

import { ACTIONS } from './sample.header.js';

export const FRAME = Object.freeze({ width: 800, height: 120, stage: true });

const IN_HEADER = Object.freeze([Object.freeze({ component: 'Header', props: Object.freeze({}) })]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ actions: ACTIONS }), wrappers: IN_HEADER })
]);
