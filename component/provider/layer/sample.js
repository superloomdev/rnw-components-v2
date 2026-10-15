// Info: Layer sample states for the showcase, the browser gates and the
// docs: each painted level with its background, the inherited level and a
// level without a background.

export default Object.freeze([
  Object.freeze({ label: 'level 1', props: Object.freeze({ level: 0, withBackground: true, children: 'Level one' }) }),
  Object.freeze({ label: 'level 2', props: Object.freeze({ level: 1, withBackground: true, children: 'Level two' }) }),
  Object.freeze({ label: 'level 3', props: Object.freeze({ level: 2, withBackground: true, children: 'Level three' }) }),
  Object.freeze({ label: 'inherited', props: Object.freeze({ withBackground: true, children: 'Inherited level' }) }),
  Object.freeze({ label: 'plain', props: Object.freeze({ level: 0, children: 'No background' }) })
]);
