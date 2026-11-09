// Info: Accordion's showcase samples. `items` is the only prop that changes
// the tree, so each state carries its own items.

export default Object.freeze([
  { label: 'default', props: { items: [
    { title: 'Section 1', children: 'Section one body text.' },
    { title: 'Section 2', children: 'Section two body text.' },
    { title: 'Section 3', children: 'Section three body text.' }
  ] } },
  { label: 'open', props: { items: [
    { title: 'Section 1', children: 'Section one body text.' },
    { title: 'Section 2', open: true, children: 'Section two body text.' },
    { title: 'Section 3', children: 'Section three body text.' }
  ] } },
  { label: 'start', props: { align: 'start', items: [
    { title: 'Section 1', children: 'Section one body text.' },
    { title: 'Section 2', open: true, children: 'Section two body text.' },
    { title: 'Section 3', children: 'Section three body text.' }
  ] } },
  { label: 'flush', props: { isFlush: true, items: [
    { title: 'Section 1', children: 'Section one body text.' },
    { title: 'Section 2', open: true, children: 'Section two body text.' },
    { title: 'Section 3', children: 'Section three body text.' }
  ] } },
  { label: 'small', props: { size: 'sm', items: [
    { title: 'Section 1', children: 'Section one body text.' },
    { title: 'Section 2', open: true, children: 'Section two body text.' },
    { title: 'Section 3', children: 'Section three body text.' }
  ] } },
  { label: 'large', props: { size: 'lg', items: [
    { title: 'Section 1', children: 'Section one body text.' },
    { title: 'Section 2', open: true, children: 'Section two body text.' },
    { title: 'Section 3', children: 'Section three body text.' }
  ] } },
  { label: 'disabled', props: { items: [
    { title: 'Section 1', disabled: true, children: 'Section one body text.' },
    { title: 'Section 2', children: 'Section two body text.' },
    { title: 'Section 3', children: 'Section three body text.' }
  ] } },
  { label: 'ordered', props: { ordered: true, items: [
    { title: 'Step 1', children: 'Step one body text.' },
    { title: 'Step 2', open: true, children: 'Step two body text.' },
    { title: 'Step 3', children: 'Step three body text.' }
  ] } }
]);

export const FRAME = Object.freeze({ width: 320 });
