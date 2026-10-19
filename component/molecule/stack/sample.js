// Info: Stack sample states for the showcase, the browser gates and the
// docs: the default gap, the horizontal direction, no gap and the scale's
// largest step - each with three text children so the gaps read.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ gap: 5, children: Object.freeze(['First', 'Second', 'Third']) }) }),
  Object.freeze({ label: 'horizontal', props: Object.freeze({ gap: 3, orientation: 'horizontal', children: Object.freeze(['First', 'Second', 'Third']) }) }),
  Object.freeze({ label: 'none', props: Object.freeze({ children: Object.freeze(['First', 'Second', 'Third']) }) }),
  Object.freeze({ label: 'largest', props: Object.freeze({ gap: 13, children: Object.freeze(['First', 'Second', 'Third']) }) })
]);
