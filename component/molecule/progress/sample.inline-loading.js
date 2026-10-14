// Info: InlineLoading sample states for the showcase, the browser gates
// and the docs: one state per status, each with its status text so the
// `text` part is drawn.

export default Object.freeze([
  Object.freeze({
    label: 'active',
    props: Object.freeze({
      description: 'Loading data',
      status: 'active'
    })
  }),
  Object.freeze({
    label: 'finished',
    props: Object.freeze({
      description: 'Data saved',
      status: 'finished'
    })
  }),
  Object.freeze({
    label: 'error',
    props: Object.freeze({
      description: 'Failed to load',
      status: 'error'
    })
  }),
  Object.freeze({
    label: 'inactive',
    props: Object.freeze({
      description: 'Not started',
      status: 'inactive'
    })
  })
]);
