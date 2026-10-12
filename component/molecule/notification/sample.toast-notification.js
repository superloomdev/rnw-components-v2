// Info: ToastNotification sample states for the showcase, the browser
// gates and the docs. Each entry is one rendered instance: a label and the
// props it takes.

export default Object.freeze([
  Object.freeze({
    label: 'default',
    props: Object.freeze({
      caption: '16:42:03',
      kind: 'error',
      subtitle: 'The save failed; retry in a moment.',
      title: 'Save failed'
    })
  }),
  Object.freeze({
    label: 'low-contrast',
    props: Object.freeze({
      kind: 'success',
      lowContrast: true,
      subtitle: 'All four checks passed.',
      title: 'Deploy finished'
    })
  }),
  // Upstream toasts forbid interactive children (its action variant is a
  // different component), so the action sample has no reference counterpart;
  // `cell: false` keeps it out of the grids while the unit gates still mount it
  Object.freeze({
    label: 'action',
    props: Object.freeze({
      action: Object.freeze({ label: 'Undo' }),
      kind: 'warning',
      subtitle: 'The file was moved to the archive.',
      title: 'File archived'
    }),
    cell: false
  })
]);
