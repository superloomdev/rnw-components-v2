# Slider

A bounded numeric value with three controls over one state: a draggable
thumb on the track, the keyboard on that same thumb, and an optional
number field that keeps a raw text draft. The behavior owns the value on
its min-anchored step grid - endpoints are always reachable even when the
span is not divisible by `step`, and the field's draft stays verbatim
while it is malformed or out of range until a commit clamps it.

## Semantics

The thumb is the `slider` role with the min/max/now value triplet and
increment/decrement accessibility actions; the member input is a
`spinbutton` carrying the same triplet. The field's Enter commits the
draft and its arrow keys step through the thumb's own keyboard handler -
there is no second numeric state. `hideTextInput` swaps the field for a
compact Tooltip seated on the thumb, labeled with the formatted value.
`invalidText` renders once below the row and describes both controls.

## Paint

All painted nodes are `aria-hidden` and pointer-transparent; the semantic
thumb is a sibling press target expanded to the platform minimum around
the base face. The face grows by `handleSizeActive`/`handleSize` under
hover, focus or press - never while disabled. The `anatomy.slider_focus`
enum picks the focus answer: `inset` draws concentric ring/gap/core discs
on the face, `outline` a separate focus circle through the slider's own
focus cells. The `anatomy.slider_disabled_paint` enum picks the disabled
composition policy: `grouped` fades the track, fill and nub as one
composed group, matching the retired second reference's single host opacity with
each layer compensated inside it - so their overlap never paints a
darker stripe. `independent` keeps every layer's own alpha exactly as
the measured reference paints it, where each disabled part carries its
own translucent border/track color and overlaps stay un-compensated.

## The second reference's value badge

The second reference selected here is deliberately its default
unlabeled slider. Its optional `labeled` mode - the ice-cream-cone
value badge - is a distinct upstream feature, not an anatomy this curated
slice claims; the hidden-field member composes the library's own Tooltip
under every template, pinning the bubble's inline padding to the source's
spacing cell through the Tooltip composition seam rather than the shared
role default.

## Uncarried variants

`readOnly`, `warn`/`warnText`, `required`, `light` (deprecated upstream),
`hideTextInput`'s labelText secondary binding (the tooltip carries the
formatted value instead), `is skeletal`/`formatLabel` partial overrides,
`onBlur`/`onFocus`/`onClick` field callbacks (the draft's commit seam is
internal), `ariaLabelInput` is `inputLabel`, `labelText` is `label`,
`name`/`id` (no form submission contract), `withLabel` on the second
reference (see above), and the range/multi-thumb API (a single handle is
the settled scope).

## SliderSkeleton

A non-interactive placeholder: the label bar over the row's bound bars
and track host, painted with the live track paint at a full fill and a
centered handle. The endpoint bars and the track share the row's flex
shrink, so they land on the same fractional widths the source's own flex
arithmetic produces. The skeleton has no second reference - the second
system ships no slider skeleton, so its cells reuse the shared paint
answer.
