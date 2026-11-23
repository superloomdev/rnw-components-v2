// Info: HeaderContainer public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderContainer',
  props: Object.freeze({
    header: { type: 'object', required: false, description: 'The Header props the container draws; its `menuButton` shows and toggles the side navigation\'s expansion.' },
    render: { type: 'function', required: false, description: 'A component the container renders in place of `header`, given `isSideNavExpanded` and `onClickSideNavExpand`.' },
    isSideNavExpanded: { type: 'boolean', required: false, description: 'The expansion the container starts from. Default false; Escape collapses it.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
