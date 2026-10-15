// Info: Heading sample states for the showcase, the browser gates and the
// docs: the bare heading and the levels a run of Sections produces.
// `wrappers` lists the Sections each state mounts inside, first entry
// outermost - catalog composition metadata, never a Heading prop (the
// upstream reference gets the same nesting in its own Section).

const SECTION = Object.freeze({ component: 'Section', props: Object.freeze({}) });

function sections (count) {

  const wrappers = [];
  for (let i = 0; i < count; i = i + 1) {
    wrappers.push(SECTION);
  }
  return Object.freeze(wrappers);

}

export default Object.freeze([
  Object.freeze({ label: 'level 1', props: Object.freeze({ children: 'Level one' }) }),
  Object.freeze({ label: 'level 2', wrappers: sections(1), props: Object.freeze({ children: 'Level two' }) }),
  Object.freeze({ label: 'level 3', wrappers: sections(2), props: Object.freeze({ children: 'Level three' }) }),
  Object.freeze({ label: 'level 6', wrappers: sections(5), props: Object.freeze({ children: 'Level six' }) }),
  Object.freeze({ label: 'level 7', wrappers: sections(7), props: Object.freeze({ children: 'Level seven' }) })
]);
