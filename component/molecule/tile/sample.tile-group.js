// Info: TileGroup sample states for the showcase, the browser gates and
// the docs. Each entry is one rendered instance: a label and the props it
// takes.

export default Object.freeze([
  Object.freeze({
    label: 'default',
    props: Object.freeze({
      defaultSelected: 'one',
      items: Object.freeze([
        Object.freeze({ children: 'Option one', value: 'one' }),
        Object.freeze({ children: 'Option two', value: 'two' }),
        Object.freeze({ children: 'Option three', disabled: true, value: 'three' })
      ]),
      legend: 'Tile group',
      name: 'sample-tile-group'
    })
  })
]);
