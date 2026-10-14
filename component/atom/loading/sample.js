// Info: Loading sample states for the showcase, the browser gates and the
// docs. The spinner needs no frame: the cells size to the square it draws.
// `inactive` and `overlay` keep out of the grids: the stopped form runs its
// arc shut and renders nothing, and the overlay form fixes a scrim to the
// viewport - neither can stand in a cell. The unit tests mount both.

export default Object.freeze([
  Object.freeze({
    label: 'default',
    props: Object.freeze({
      withOverlay: false
    })
  }),
  Object.freeze({
    label: 'small',
    props: Object.freeze({
      small: true,
      withOverlay: false
    })
  }),
  Object.freeze({
    label: 'inactive',
    props: Object.freeze({
      active: false,
      withOverlay: false
    }),
    cell: false
  }),
  Object.freeze({
    label: 'overlay',
    props: Object.freeze({}),
    cell: false
  })
]);
