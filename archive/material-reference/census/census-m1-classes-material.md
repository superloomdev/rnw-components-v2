# census-m1-classes.md - Material/second rows (text copy, from 7f2bd93 tag)

# Census classes - milestone 1 (HIGH, 2026-10-06) | L3: The reasoning tier's classification of `census-m1.md` (script-written: 18 runs, 1159 disagreement lines, library `0f877b1`, published templates). Each class names the upstream fact, what we draw, and the FIDELITY RULES 8 mechanism that resolves it. Light and dark produce the same classes (the dark rows mirror the light ones), so every class is a template-data or component answer, not a scheme accident. Carbon rest states in both schemes are clean; every Carbon line is an interaction state.

## C1 - Focus indicator (Button, Checkbox, TextInput, Select; both references) | L8: - **Second:** a ring 3px wide, 2px outside the container, in `secondary`, following the container's corners (`_md-comp-focus-ring.scss:46-52`), on keyboard focus only (`:focus-visible`). A field draws no ring: its outline turns `primary` and 2px wide (`text-field-focus-outline-color`, `-width: 2px`).

## C1 - Focus indicator (Button, Checkbox, TextInput, Select; both references) | L10: - **Mechanism:** grid cells per family: `control.<family>_focus_width`, `control.<family>_focus_offset` (negative draws inside), `color.<family>_focus_ring`, `control.<family>_focus_gap` with `color.<family>_focus_gap` (the primary button's 1px page-color line), and the per-kind focus fill and ink (`color.button_<kind>_focus`, `color.button_<kind>_label_focus`; equal to rest except the primary's tertiary). A field's ring width is 0 under the second template, where its focus is the outline cells of C2. behavior enum `feedback.focus_trigger: any | keyboard` (primary `any`, second `keyboard`, default `any`): both values picked, so FIDELITY RULES 6 holds. A field shows its focus state on any focus under both references, so the field family ignores the trigger.

## C2 - Field state colors and widths (TextInput, Select; second reference) | L12: ## C2 - Field state colors and widths (TextInput, Select; second reference)

## C2 - Field state colors and widths (TextInput, Select; second reference) | L14: - **Second:** rest outline `outline` 1px; hover outline and label `on-surface`; focus outline `primary` 2px and label `primary`; disabled outline `on-surface` at 12%, label, value and icon at 38%; supporting text `on-surface-variant`; error, error-hover and error-focus outline, label and supporting text `error` (hover `on-error-container`) (`_md-comp-outlined-text-field.scss`, `_md-comp-outlined-select.scss`; listed in the sheet).

## C2 - Field state colors and widths (TextInput, Select; second reference) | L17: - **Mechanism:** grid cells: `color.field_outline` with `_hover`, `_focus`, `_disabled`, `_invalid`, `_invalid_hover`, `_invalid_focus`; `control.field_outline_width` and `_focus`; `color.field_label` with `_hover`, `_focus`, `_disabled`, `_invalid`; `color.field_value` and `_disabled`; `color.field_helper` and `_disabled`; `color.field_message_invalid`; `color.field_icon` with `_disabled`, `_invalid`; `control.field_invalid_ring_width` (primary 2, second 0). Opacity values as `rgba` (FIDELITY RULES 3). The `feedback.field` color branches in `context.fieldPresentation` move into these cells; `feedback.field` keeps only the frame shape (underline or outline).

## C3 - Field type (TextInput, Select; second reference) | L19: ## C3 - Field type (TextInput, Select; second reference)

## C3 - Field type (TextInput, Select; second reference) | L21: - **Second:** value and resting label in body-large (16/24); the primary draws compact body (14/18). Already queued (`type.field_text`, 17 expected gaps).

## C4 - Field hover fill (TextInput, Select; primary reference) | L28: - **Mechanism:** component change (the select tracks hover as the text input does) and a member cell where the primary distinguishes the members: family `color.field_container_hover` (primary `field_hover_01`), member `color.text_input_container_hover` (primary `field_01`); every member cell aliases its family cell unless a reference distinguishes it (rule 2 refinement below). Second: the container stays transparent; hover is C2's outline.

## C5 - Select indicator (second reference) | L30: ## C5 - Select indicator (second reference)

## C5 - Select indicator (second reference) | L32: - **Second:** the select's own 10 x 5 drop-down drawing in every state, 12px from the trailing edge (`with-trailing-icon-trailing-space: 12px`); the primary insets its arrow 16px (`$spacing-05`).

## C5 - Select indicator (second reference) | L33: - **Ours:** no indicator under the second template (`anatomy.caret: hidden`).

## C5 - Select indicator (second reference) | L34: - **Mechanism:** icon role `icon.dropdown_indicator` (decided at 5.5g) and grid cell `control.field_icon_inset` (primary 16, second 12).

## C6 - Select placeholder under a floating label (second reference) | L36: ## C6 - Select placeholder under a floating label (second reference)

## C6 - Select placeholder under a floating label (second reference) | L38: - **Second:** a select has no placeholder: focused and empty, its label rises and the trigger stays empty.

## C6 - Select placeholder under a floating label (second reference) | L40: - **Mechanism:** component change: under `anatomy.label: floating` the select never draws its placeholder (it stays in the element tree, so the accessibility tree is unchanged). A text input keeps drawing its placeholder on focus, as the second reference's text field does.

## C7 - Button state fills, elevation and disabled (second reference) | L42: ## C7 - Button state fills, elevation and disabled (second reference)

## C7 - Button state fills, elevation and disabled (second reference) | L44: - **Second:** hover lays the label color over the container at 8%, pressed at 12%, focus lays nothing; a filled and a tonal button rise to elevation level 1 on hover; the elevated button sits at level 1 and rises to 2 on hover; disabled container `on-surface` at 12%, label at 38%; a text button pads 12 and is at least 64 wide (`_md-comp-*-button.scss`).

## C7 - Button state fills, elevation and disabled (second reference) | L46: - **Mechanism:** grid cells per kind: `color.button_<kind>` with `_hover`, `_active`, `_focus`, `_disabled`; `color.button_<kind>_label` with the same states; `color.button_<kind>_border` where the kind draws one; `shadow` cells `button_<kind>_elevation` with `_hover`, `_active`; `control.button_ghost_padding`, `control.button_min_width`. The second template flattens hover and pressed over the container (exact) and states disabled as `rgba`. Component change: focus reads the focus cells (no pressed fill).

## C8 - Button state colors (primary reference) | L51: - **Mechanism:** the same per-kind cells as C7, filled from the primary's button styles.

## C9 - Checkbox (second reference; focus in C1) | L53: ## C9 - Checkbox (second reference; focus in C1)

## C9 - Checkbox (second reference; focus in C1) | L55: - **Second:** unselected outline `on-surface-variant` (queued `control_unchecked`); disabled selected container `on-surface` at 38%; hover and pressed state layers per selected or unselected state (`_md-comp-checkbox.scss`).

## Measurement artefacts (harness, resolved in 5.5j; not template or component defects) | L64: - **Elevation read as a string:** the second reference draws elevation on a separate element, so `boxShadow` on its container reads `none`. Elevation is compared by the ring profile sampled outside the edge (it already catches C7's hover elevation), not by the shadow string.

## Measurement artefacts (harness, resolved in 5.5j; not template or component defects) | L65: - **Second checkbox perceptual:** the second reference's checkbox is the box alone, so a whole-cell perceptual ratio counts our label. A block with an `origin` part compares pixels within that part's box.

## Measurement artefacts (harness, resolved in 5.5j; not template or component defects) | L66: - **Unmeasured states:** the second reference has no secondary or danger buttons, sizes other than one, unlabelled empty selects or an invalid checkbox; those states are measured against the primary only (D4).

