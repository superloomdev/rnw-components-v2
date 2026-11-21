// Info: ExpandableTile sample states for the showcase, the browser gates
// and the docs. Each entry is one rendered instance: a label and the
// props it takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ below: 'Below the fold content', children: 'Above the fold content' }) }),
  Object.freeze({ label: 'expanded', props: Object.freeze({ below: 'Below the fold content', children: 'Above the fold content', expanded: true }) }),
  Object.freeze({ label: 'interactive', props: Object.freeze({ belowLink: true, interactive: true, below: 'Below the fold link', children: 'Above the fold content' }) })
]);
