// Info: ListItem renders only inside a list - one standalone state for
// the showcase; the gates measure it through the lists' samples.

// Upstream's markers hang outside the list (_list.scss:64-96); a host reserves the 32 px nested-list indent (:50-52)
export const FRAME = Object.freeze({ width: 400, hang: Object.freeze({ start: 32 }) });
export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'List item', kind: 'unordered' }) })
]);
