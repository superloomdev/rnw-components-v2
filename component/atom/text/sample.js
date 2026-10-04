// Info: Text sample states for the showcase, the browser gates and the docs.
// Each entry is one rendered instance: a label and the props it takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ text: 'Body compact text' }) }),
  Object.freeze({ label: 'heading', props: Object.freeze({ text: 'Heading', type: 'heading03', accessibilityRole: 'header' }) }),
  Object.freeze({ label: 'label', props: Object.freeze({ text: 'Label', type: 'label01' }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ text: 'Helper text', type: 'helper_text_01', color: 'text_helper' }) }),
  Object.freeze({ label: 'code', props: Object.freeze({ text: 'const width = 16;', type: 'code01' }) }),
  Object.freeze({ label: 'secondary', props: Object.freeze({ text: 'Secondary text', color: 'text_secondary' }) }),
  Object.freeze({ label: 'error', props: Object.freeze({ text: 'Error text', color: 'text_error' }) }),
  Object.freeze({ label: 'children', props: Object.freeze({ children: 'Text passed as children' }) }),
  Object.freeze({ label: 'truncated', props: Object.freeze({ text: 'A long line of text that is cut with an ellipsis at its end when it does not fit', breakMode: 'tail', style: Object.freeze({ width: 160 }) }) })
]);
