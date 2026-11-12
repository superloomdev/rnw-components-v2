# DatePicker, DatePickerInput, DatePickerSkeleton

- **DatePicker.** Owns the value (`m/d/Y` text, a `[start, end]` pair for
  `range`), the open state and the shown month, and draws its own calendar:
  the month header with its arrows, the weekday row and a six-week grid of
  42 days. The calendar sits flush under the first field (the reference
  positions it 2 below and pulls it back 2) at the calendar cells (288 x
  336, padding 4 / 4 / 8 / 4) and centers its rows in that box, so the 326
  of rows overflow it by 1 at each end as the reference's centered column
  does; the six week rows share the 246 grid height (a 41 pitch), as the
  reference's wrapping lines stretch. The weekday labels and month names are
  English with Sunday first unless the `locale` prop says otherwise. The
  calendar always draws in place, hung from the first field's start edge
  (logical, so a range's calendar stays over its fields in rtl) at the
  dropdown stacking level; it does not render through an overlay host, whose
  anchored position is physical. Escape and a day press close it; an outside
  press does not yet.
- **Icon.** As the reference's field icon: the calendar, drawn in the
  disabled icon color on a disabled or read-only field; the error glyph in
  its place on an invalid field; none on a valid `simple` field.
- **Platform.** The row is `split`: the web half always draws. The native
  half reads `anatomy.date_picker_widget`: `system` keeps the drawn labels,
  fields and messages and seats the host's `adapters.DatePicker` (props
  `value` as a `Date`, `mode: 'date'`, `onChange(event, date)`, `disabled`)
  in each field where the text input draws, with no calendar; without the
  adapter it draws the calendar and reports `adapter_missing`.
- **Not drawn.** The year is text, not the reference's number input with
  its hover arrows; a typed year is entered through the field. `warn` is
  accepted but drawn as the helper message only: the field family draws no
  warning frame yet, so no sample shows it.
- **DatePickerSkeleton.** A static placeholder (`aria-hidden`): one label bar
  over one input bar per picker; `range` draws the two pickers the upstream
  range skeleton holds, at the range input width with the 1px end margin the
  upstream container carries. The single bar takes the short input cell; the
  upstream skeleton resolves the `--simple --short` class.
- **DatePickerInput.** Carries `requires_parent` (a field draws inside a
  DatePicker, which assigns its width from the picker type and its seat
  index, hands it its text and opens the calendar from its focus) and
  `no_reference` (upstream draws the input only inside its picker, so it is
  measured through DatePicker's samples).
