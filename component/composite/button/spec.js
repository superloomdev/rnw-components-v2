// Info: ComboButton spec sheet. Every metric names a token; the theme
// supplies the number. `seam` is the border-width gap between the two
// seats; the action's window is the combo's floor less the seam and the
// trigger's side and its ceiling less the seam. The trigger sides are the
// icon button's per size.

export default Object.freeze({
  minWidth: 'control.combo_button_min_width',
  maxWidth: 'control.combo_button_max_width',
  seam: 'border.width_01',
  triggerSmall: 'size.size_small',
  triggerMedium: 'size.size_medium',
  triggerLarge: 'control.icon_button_size'
});
