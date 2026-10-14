// Info: ProgressIndicator sample states for the showcase, the browser
// gates and the docs: the row at rest with the second step current, the
// space-equal spread, the column form, a step drawn invalid beside a
// disabled one, and the steps pressable through `onChange`. Each `items`
// entry is a ProgressStep prop object, as the component requires; the
// samples draw the indicator's clones, so the states exercise the index
// math.

export default Object.freeze([
  Object.freeze({
    label: 'default',
    props: Object.freeze({
      currentIndex: 1,
      items: Object.freeze([
        Object.freeze({ label: 'First step' }),
        Object.freeze({ label: 'Second step' }),
        Object.freeze({ label: 'Third step' })
      ])
    })
  }),
  Object.freeze({
    label: 'space equal',
    props: Object.freeze({
      currentIndex: 1,
      items: Object.freeze([
        Object.freeze({ label: 'First step' }),
        Object.freeze({ label: 'Second step' }),
        Object.freeze({ label: 'Third step' })
      ]),
      spaceEqually: true
    })
  }),
  Object.freeze({
    label: 'vertical',
    props: Object.freeze({
      currentIndex: 1,
      items: Object.freeze([
        Object.freeze({ label: 'First step' }),
        Object.freeze({ label: 'Second step' }),
        Object.freeze({ label: 'Third step' })
      ]),
      vertical: true
    })
  }),
  Object.freeze({
    label: 'invalid',
    props: Object.freeze({
      currentIndex: 1,
      items: Object.freeze([
        Object.freeze({ label: 'First step' }),
        Object.freeze({ invalid: true, label: 'Invalid step' }),
        Object.freeze({ disabled: true, label: 'Disabled step' })
      ])
    })
  }),
  Object.freeze({
    label: 'interactive',
    props: Object.freeze({
      currentIndex: 1,
      items: Object.freeze([
        Object.freeze({ label: 'First step' }),
        Object.freeze({ label: 'Second step' }),
        Object.freeze({ label: 'Third step' })
      ]),
      onChange: function () {}
    })
  })
]);
