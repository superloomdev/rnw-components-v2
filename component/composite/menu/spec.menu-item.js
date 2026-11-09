// Info: MenuItem spec sheet. Every metric names a token; the theme
// supplies the number. `submenuDelay` is the hover-open wait, a spec
// constant (`MenuItem.js:54-58`: no motion token is 100 ms); the submenu
// offsets are the member cells.

export default Object.freeze({
  iconSize: 'control.menu_icon_size',
  itemGap: 'control.menu_item_gap',
  markSize: 'size.icon_01',
  dangerInsetWidth: 'control.menu_item_danger_focus_inset_width',
  optionPaddingInline: 'control.list_item_padding_inline',
  submenuDelay: { constant: 100 },
  viewportMargin: 'control.menu_viewport_margin',
  submenuOffsetEnd: 'control.menu_submenu_offset_end',
  submenuOffsetStart: 'control.menu_submenu_offset_start',
  submenuOffsetBlock: 'control.menu_submenu_offset_block'
});
