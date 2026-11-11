# DatePicker, DatePickerInput, DatePickerSkeleton

- **DatePickerSkeleton.** A static placeholder (`aria-hidden`): one label bar
  over one input bar per picker; `range` draws the two pickers the upstream
  range skeleton holds, at the range input width with the 1px end margin the
  upstream container carries. The single bar takes the short input cell; the
  upstream skeleton resolves the `--simple --short` class.
- **DatePickerInput.** Carries `requires_parent` (a field draws inside a
  DatePicker, which assigns its width from the picker type and its seat
  index) and `no_reference` (upstream draws the input only inside its
  picker, so it is measured through DatePicker's samples).
