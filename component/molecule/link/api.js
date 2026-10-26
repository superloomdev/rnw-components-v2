// Info: Link public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Link',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The link text; the accessible name.' },
    href: { type: 'string', required: false, description: 'The destination the anchor carries; omitted while disabled.' },
    onPress: { type: 'function', required: false, description: 'Called on activation; on a native platform this is how the link navigates.' },
    inline: { type: 'boolean', required: false, description: 'Draw the link inline - underlined at rest, not only while hovered, focused or pressed.' },
    visited: { type: 'boolean', required: false, description: 'Draw the visited color; a page cannot drive the `:visited` pseudo-class itself.' },
    disabled: { type: 'boolean', required: false, description: 'Draw the disabled color; no href and no activation.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md` (the default) or `lg` - the label\'s type set.' },
    icon: { type: 'string', required: false, description: 'A semantic icon name drawn after the label, decorative.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' },
    accessibilityLabel: { type: 'string', required: false, description: 'The accessible name when it should differ from the children.' }
  }),
  composition: Object.freeze({
    inverse: { type: 'boolean', required: false, description: 'Composition prop: draws the inverse cells - `link_label_inverse` and its hover - with the inverse focus ring; a dark surface asks for it.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'color.link_label', 'color.link_label_hover', 'color.link_label_active',
    'color.link_label_visited', 'color.link_label_disabled', 'color.link_focus_ring',
    'type.link_label', 'type.link_label_small', 'type.link_label_large',
    'color.link_label_inverse', 'color.link_label_inverse_hover', 'color.focus_ring_inverse',
    'control.link_focus_width', 'control.link_icon_gap',
    'control.link_icon_size', 'control.link_icon_size_large'
  ]),
  colors: Object.freeze([])
});
