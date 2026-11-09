// Info: ClickableTile spec sheet. The tile keeps the family's box cells and
// reads the link's ring cells (upstream's `a.cds--link` wins that
// specificity race) plus the corner-icon cells.

export default Object.freeze({
  padding: 'control.tile_padding',
  minHeight: 'control.tile_min_height',
  minWidth: 'control.tile_min_width',
  focusWidth: 'control.link_focus_width',
  iconSize: 'control.tile_icon_size',
  iconInset: 'control.tile_icon_inset'
});
