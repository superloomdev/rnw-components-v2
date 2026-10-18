# NumberInput

The number field composes the shared field anatomy and two trailing
steppers, one decrement and one increment, each an action seat under the
theme's `anatomy.field_action` choice with an invisible press target that
expands outward, never inward onto its neighbor. Two rule dividers stand
with the steppers: the start line draws only while the field is invalid,
the center line stays unless a stepper is hovered or focused.

## Semantics

The input carries the `spinbutton` role with the finite number, the `min`
and the `max` as its aria value triplet; editing text stays verbatim
(`onChangeText` reports every keystroke, `onChange` reports only a finite
parse or the permitted empty string), so a partial entry like `1.` or `-`
is never rewritten mid-edit. The steppers carry `tabIndex -1`, as the
primary keeps them out of the ordinary tab order while leaving
programmatic focus possible.

## Step consistency

The primary reference's manual zero shortcut steps by one even when a
different `step` is declared, while its numeric keyboard honors `step`;
this library follows the declared `step` for both methods - one rule, no
special case (source `NumberInput.handleStep`'s raw `+/-1` branch).

## Decisions

- **No custom steppers.** The second reference has no custom steppers, so their geometry is a Superloom decision - the roster's `superloom_decision` flag.

## Uncarried variants

`readOnly`, `warn`/`warnText`, `light` (deprecated upstream, `surface` is
this library's answer), `inline`, `fluid`, `iconDescription` (the action
labels are `decrementLabel`/`incrementLabel`), `type='text'` text mode,
`locale`/`formatOptions`/`stepStartValue`/`pattern`/`validate`
(localized formatting is out of scope; the field keeps raw text),
`disableWheel`, `onClick`/`onStepperBlur` (callback surface kept to the
declared set), `decorator`/`slug` (product chrome), `hideLabel` (the label
is omitted by passing `accessibilityLabel` instead, as every field row).

## NumberInputSkeleton

Composes the field skeleton at the number field's minimum width; the
second system has no skeleton, so its values are a Superloom decision -
the roster's `superloom_decision` flag.
