// Info: TagSet sample states. Each label renders the Showcase cell.

export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  { label: 'fits', props: { tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }] } },
  { label: 'overflow', props: { maxVisible: 2, tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }, { label: 'Four' }, { label: 'Five' }, { label: 'Six' }, { label: 'Seven' }, { label: 'Eight' }] } },
  { label: 'max-visible', props: { maxVisible: 2, tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }] } },
  { label: 'multiline', props: { multiline: true, tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }, { label: 'Four' }, { label: 'Five' }, { label: 'Six' }] } },
  { label: 'many', props: { maxVisible: 2, tags: Array.from({ length: 14 }, function (_, i) {
    return { label: 'Tag ' + (i + 1) };
  }) } },
  { label: 'dismissible', props: { maxVisible: 2, tags: [{ label: 'One', onClose: function () {} }, { label: 'Two' }] } }
]);
