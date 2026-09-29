// Info: Every component factory, by roster name. A host passes this map (or a
// subset) to `createSystem`. One line per roster row whose `status` is not
// `not_applicable`, in roster build order; the docs gate checks the two agree.

export { default as Icon } from './component/atom/icon/icon.js';
