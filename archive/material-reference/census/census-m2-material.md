# census-m2.md - Material/second rows (text copy, from 7f2bd93 tag)

# Census M2 - the 12 remaining anchors (HIGH, Step 6.0a, 2026-10-08) | L3: Source-read census (the rows are not built, so there is no script census to classify): for each row, every part x state x property each reference states, with the upstream file and line, classified by FIDELITY RULES 8. Primary = `@carbon/styles` 1.x `scss/components/<row>` (pinned in the library's `_test`) and the `@carbon/react` 1.115.0 markup; second = `@material/web` 2.x, token files `tokens/versions/v0_192/_md-comp-*.scss` and the element's `internal/*.scss`. Paths below are relative to those package roots.

## Summary (the inputs to the v6 request block) | L10: - **New member cells:** `text_area` (value type, hover fill, disabled outline); `radio` (size, border, dot, selected ring with its states, focus offset); `icon_button` (size, icon size, the standard and outlined kinds' icon colors); `menu` (padding, item height, divider, danger item, icon size); `tooltip_compact` (the icon button's tooltip); `dialog_close_icon_size`.

## Summary (the inputs to the v6 request block) | L12: - **New icon roles (2):** `selected_indicator` (a selected list or menu item's mark), `switch_checked_indicator` (the checked handle's mark; the primary's own drawing).

## Summary (the inputs to the v6 request block) | L13: - **Component behaviors (neutral):** the select indicator turns while open (Select fixed with Dropdown); a `rows` prop and a counter on TextArea; the Select's open list moves onto the `list` cells.

## Summary (the inputs to the v6 request block) | L14: - **Harness:** an `open` interaction (press the trigger, measure the list against both references); Tooltip and ToastNotification have no rendered second element (`@material/web` 2.x ships token files only), so their roster `material_twin` becomes `none` and they are measured against the primary alone, while the material template still answers their cells from those token files.

## Summary (the inputs to the v6 request block) | L15: - **Already in the contract and reused:** the field, button and selection cells; the primary's ten tag hues (`color.tag_*_<hue>`); the notification status fills (`color.notification_background_<status>`); `anatomy.switch_handle`, `anatomy.status_marker`, `anatomy.dialog_actions`; `stacking.*`; the plain glyphs the status icons use.

## TextArea (TextInput family; second `md-outlined-text-field type="textarea"`) | L19: ## TextArea (TextInput family; second `md-outlined-text-field type="textarea"`)

## TextArea (TextInput family; second `md-outlined-text-field type="textarea"`) | L21: | Part / state / property | Primary | Second | Mechanism |

## TextArea (TextInput family; second `md-outlined-text-field type="textarea"`) | L23: | value + placeholder type | `body-01` 14/20/0.16 (`text-area/_text-area.scss:30,56`); the text input draws `body-compact-01` 14/18 | `input-text-type` = body-large 16/24, the same as its text field (`_md-comp-outlined-text-field.scss:95-106`) | **M** `type.text_area_value` (primary `body_01`; second and default alias `type.field_value`) |

## TextArea (TextInput family; second `md-outlined-text-field type="textarea"`) | L24: | block padding | 11px (`:33`) = (40 - 18) / 2: the single-line field's height less the single-line value line | `top-space` / `bottom-space` 16px (`_md-comp-outlined-text-field.scss:141-142`) = (56 - 24) / 2 | **D** `(control.field_height - type.field_value.lineHeight) / 2`: exact under both; the first line sits where a single-line field puts its value |

## TextArea (TextInput family; second `md-outlined-text-field type="textarea"`) | L28: | hover fill | none (no `:hover` rule) | outline hover cells | **M** `color.text_area_container_hover` (primary `field_01`, as the text input's member cell; second and default alias `field_container_hover`) |

## TextArea (TextInput family; second `md-outlined-text-field type="textarea"`) | L30: | disabled | fill `$field`, bottom border transparent, value `$text-disabled` (`:113-124`) | disabled cells | **M** `color.text_area_outline_disabled` (primary `transparent`; second and default alias `field_outline_disabled`); value and placeholder **E** |

## TextArea (TextInput family; second `md-outlined-text-field type="textarea"`) | L32: | counter (`maxCount`, `enableCounter`) | in the label row, end-aligned, label type and color (`:240-245`; `@carbon/react` `TextArea` renders `.cds--label` counter) | in the supporting-text row, end-aligned, supporting-text type and color (`field/internal/_supporting-text.scss`, `.counter`) | **A** `anatomy.field_counter: label | message` (primary `label`, second `message`, default `label`); colors and type **E** (label or helper cells for the row it sits in) |

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L37: ## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`)

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L39: Closed, the dropdown is the select's field: every closed-state property matches what the built Select already reads.

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L41: | Part / state / property | Primary | Second | Mechanism |

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L45: | indicator | chevron 16 in a 24 box, end `$spacing-04` 12 (so the glyph ends 16 from the edge), rotated 180 while open (`:460-484`) | the select's 10 x 5 drawing, drawn upward while open | **E** `icon.dropdown_indicator`, `control.field_icon_inset`; **B** the indicator turns while open (both references; the built Select does not, fixed with it) |

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L46: | invalid icon | end `$spacing-08` 40, centred (`:180-185`) | none (error color only) | **E** as the Select (`field_invalid_icon`, mask under the second) |

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L47: | open: frame | bottom border `$border-subtle-01`, no hover fill (`:152-166`) | focused outline (the trigger holds focus) | **E** the focus cells (the open field is focused; the primary's subtle bottom border sits under its 2px inset ring) |

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L49: | list item geometry | height = field height per size, inline padding 16 / end 24, divider 1px top (`:618-646, 713-729`) | one-line height 56, leading and trailing space 16 (`_md-comp-list.scss:152-157, 225`; `menuitem/_menu-item.scss:110-113`) | **F** `control.list_item_height`, `control.list_item_padding_inline`; divider **F** `control.list_item_divider_width` (primary 1, second 0) |

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L52: | selected mark | checkmark 16 at the item's end on the selected item (`list-box__menu-item__selected-icon`) | none in a single select | **I** `icon.selected_indicator` role (primary `checkmark`, second none: a template answers a blank glyph) - or an anatomy value; decided in 6.0b with the menu rows (both systems' menus also mark a checked item) |

## Dropdown (Select family; second `md-outlined-select`, whose menu is `md-menu` + `md-select-option`) | L53: | open-state measurement | the menu renders in the page below the field | `md-menu` renders in the host's shadow root | **H** an `open` interaction in the fidelity harness: press the trigger, wait for the list, measure list parts against both references |

## RadioButton (selection family; second `md-radio`) | L58: ## RadioButton (selection family; second `md-radio`)

## RadioButton (selection family; second `md-radio`) | L60: | Part / state / property | Primary | Second | Mechanism |

## RadioButton (selection family; second `md-radio`) | L65: | checked ring color | `$icon-primary` (`:110`) | `selected-icon-color` primary | **M** `color.radio_outline_selected` (primary aliases `selection_outline`; second primary; default aliases `selection_outline`) |

## RadioButton (selection family; second `md-radio`) | L69: | focus ring | `outline: 2px $focus`, offset 1.5px, round (`:229-233`) | focus ring around the 40 state layer | **E** `control.selection_focus_width`, `color.selection_focus_ring`, `control.selection_focus_radius`; offset **M** `control.radio_focus_offset` (primary 1.5 where the checkbox's is 1) |

## RadioButton (selection family; second `md-radio`) | L70: | label | `body-compact-01`, gap: ring margin-inline 2 / 10 (`:81, 96`) | the page's label (the element draws no text) | **E** the checkbox's label type and color cells; gap **D** from the same spacing steps as the checkbox |

## Toggle (new `switch` family; second `md-switch`) | L76: ## Toggle (new `switch` family; second `md-switch`)

## Toggle (new `switch` family; second `md-switch`) | L78: | Part / state / property | Primary | Second | Mechanism |

## Toggle (new `switch` family; second `md-switch`) | L82: | track colors | off `$toggle-off`, on `$support-success`, disabled `$button-disabled` (`:62, 100, 162`) | unselected surface-container-highest, selected primary, each with hover / focus / pressed, disabled on-surface 12% | **F** `color.switch_track`, `_hover`, `_focus`, `_active`, `_disabled`, and `color.switch_track_selected` with the same states (the primary's `toggle_off` stays its value; aliases where a reference states no change) |

## Toggle (new `switch` family; second `md-switch`) | L85: | handle mark | small size only: a 6 x 5 check drawn in `$support-success` inside the checked handle (`:134-146`) | optional selected icon 16 in on-primary-container (`selected-icon-size`, `selected-icon-color`), off unless the page asks | **I** `icon.switch_checked_indicator` (primary its own drawing, rule 4; second Material Symbols check); **F** `color.switch_mark`, `_disabled`; **B** the small size draws the mark (the primary's only use; the second has no small size) |

## Toggle (new `switch` family; second `md-switch`) | L88: | label | above, `label-01`, `$text-secondary`, gap `$spacing-05` (`:30-39`) | none drawn (the page's label) | **E** label type and color tokens the primary names; under the second template its mapping answers them |

## Toggle (new `switch` family; second `md-switch`) | L89: | state text | "Off" / "On" beside the track, `body-01`, `$text-primary` (`:114-116`; `@carbon/react` `Toggle` `labelA`, `labelB`) | none | **A** `anatomy.switch_state_text: shown | hidden` (primary `shown`, second `hidden`, default `shown`) |

## Toggle (new `switch` family; second `md-switch`) | L90: | read-only | outlined track, inverted handle (`:176-197`) | none | out of the anchor's samples; a later fix run |

## Tag (new `tag` family; second `md-assist-chip`) | L94: ## Tag (new `tag` family; second `md-assist-chip`)

## Tag (new `tag` family; second `md-assist-chip`) | L96: The primary's ten hues already exist as contract tokens (`color.tag_background_<hue>`, `_color_`, `_border_`, `_hover_`), filled by every template; the family cells below are what the default (gray, read-only) tag draws and what the second reference's chip states.

## Tag (new `tag` family; second `md-assist-chip`) | L98: | Part / state / property | Primary | Second | Mechanism |

## Tag (new `tag` family; second `md-assist-chip`) | L104: | container and label colors | gray hue: `$tag-background-gray`, `$tag-color-gray` (`:146-148`); disabled `$layer` / `$text-disabled` (`:284-293`) | transparent; label on-surface; disabled 38% | **F** `color.tag_container`, `_disabled`, `color.tag_label`, `_disabled` (the primary aliases its gray hue; a `type` prop picks a hue's existing tokens) |

## Tag (new `tag` family; second `md-assist-chip`) | L106: | icon | 16, the label's color | `with-icon-icon-size` 18, primary color | **F** `control.tag_icon_size`, `color.tag_icon`, `_disabled` |

## Tag (new `tag` family; second `md-assist-chip`) | L107: | interactive states | none (a read-only tag is a `span`; the interactive tags are their own rows) | hover / focus / pressed state layers | out of the read-only anchor; the `Tag` family's interactive rows (Part 7) add their cells |

## ProgressBar (new `progress` family; second `md-linear-progress`) | L111: ## ProgressBar (new `progress` family; second `md-linear-progress`)

## ProgressBar (new `progress` family; second `md-linear-progress`) | L113: | Part / state / property | Primary | Second | Mechanism |

## ProgressBar (new `progress` family; second `md-linear-progress`) | L116: | indicator | `$interactive` (`:61-64`) | `active-indicator-color` primary, the track's height and shape | **F** `color.progress_indicator` |

## ProgressBar (new `progress` family; second `md-linear-progress`) | L117: | finished / error | indicator `$support-success` / `$support-error`, status icon beside the label (`:111-127`) | none | **F** `color.progress_indicator_success`, `color.progress_indicator_error` (the second answers with its primary and error roles); icons **E** plain glyphs `checkmark_filled`, `error_filled` (the glyph is the meaning, rule 7) |

## ProgressBar (new `progress` family; second `md-linear-progress`) | L120: | indeterminate | a gradient sweep across the track, 1400 ms, linear (`:74-96`) | two bars travelling across the track (`progress/internal/_linear-progress.scss`) | **A** `anatomy.progress_indeterminate: sweep | travel` (primary `sweep`, second `travel`, default `sweep`); timing **E** motion tokens |

## Tooltip (new `tooltip` family; second: `_md-comp-plain-tooltip.scss` tokens, no rendered element) | L124: ## Tooltip (new `tooltip` family; second: `_md-comp-plain-tooltip.scss` tokens, no rendered element)

## Tooltip (new `tooltip` family; second: `_md-comp-plain-tooltip.scss` tokens, no rendered element) | L126: `@material/web` 2.x ships no tooltip element (its `labs/` holds badge, card, item, navigation, segmented button), so the second reference is token data only: the material template fills the cells from the plain-tooltip token file, and the row is measured against the primary alone (**H**: roster `material_twin` -> `none`, the reason in the row's `notes.md`).

## Tooltip (new `tooltip` family; second: `_md-comp-plain-tooltip.scss` tokens, no rendered element) | L128: | Part / state / property | Primary | Second (tokens) | Mechanism |

## Tooltip (new `tooltip` family; second: `_md-comp-plain-tooltip.scss` tokens, no rendered element) | L135: | caret | 12 x 6 (`:79-85`) | none | **F** `control.tooltip_caret_width`, `control.tooltip_caret_height` (second 0: no caret drawn; the part stays mounted) |

## Tooltip (new `tooltip` family; second: `_md-comp-plain-tooltip.scss` tokens, no rendered element) | L139: | compact variant (the icon button's) | padding-block 2, caret 8 x 4, offset 8, `body-compact-01` (`tooltip/_tooltip.scss:71-91`) | the plain tooltip is already compact | **M** `control.tooltip_compact_padding_block`, `control.tooltip_compact_caret_width`, `_caret_height`, `control.tooltip_compact_offset`, `type.tooltip_compact_label` (the second and default alias the family cells) |

## Tooltip (new `tooltip` family; second: `_md-comp-plain-tooltip.scss` tokens, no rendered element) | L140: | behavior | opens on hover and focus after 100 ms, closes after 100 ms, Escape closes (`@carbon/react` `Tooltip` `enterDelayMs`, `leaveDelayMs`) | (no element) | **B** existing `overlay`, `anchored-position` behaviors; delays **E** motion tokens or a component constant flagged `superloom_decision` (decided in the row's run) |

## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`) | L144: ## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`)

## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`) | L146: The upstream icon button is the button (`ButtonBase` with `hasIconOnly`, default kind `primary`, size `lg`) inside a compact tooltip, so it reads the button family's cells per kind; it needs member cells only where an icon button differs from a labelled button of the same kind.

## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`) | L148: | Part / state / property | Primary | Second | Mechanism |

## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`) | L150: | size | square at the button's height per size (sm 32, md 40, lg 48) (`button/_button.scss` `--icon-only`) | `container-width` / `-height` 40, state layer 40 (`_md-comp-*-icon-button.scss`) | **F** `control.icon_button_size` (primary 48 = `control.button_height`; other sizes **D** from the size scale) |

## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`) | L152: | shape | the button's radius (0) | `container-shape` / `state-layer-shape` full | **E** `control.button_radius` (a full radius on a square is a circle) |

## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`) | L153: | fill, border, elevation per kind and state | the button's kind cells | filled = primary, tonal = secondary-container, outlined = outline 1px, standard = none | **E** `color.button_<kind>_container*`, `_border*` (filled -> primary, tonal -> tonal, outlined -> tertiary, standard -> ghost) |

## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`) | L154: | icon color | the kind's label color | standard and outlined: on-surface-variant (unselected), primary (selected); filled and tonal: their label roles (`unselected-icon-color`, `selected-icon-color`) | **M** `color.icon_button_ghost_icon`, `color.icon_button_tertiary_icon` with `_hover`, `_active`, `_focus`, `_disabled`, `_selected` (the primary aliases each kind's label cell; filled and tonal need none) |

## IconButton (Button family member; second `md-icon-button`, `md-filled-icon-button`, `md-filled-tonal-icon-button`, `md-outlined-icon-button`) | L156: | tooltip | compact tooltip, `align` top, label = the accessible name | none (the page adds one) | **E** the Tooltip row's compact member cells; **B** composes `Tooltip` |

## Tabs (new `tab` family; second `md-tabs` with `md-primary-tab`; `md-secondary-tab` for the full-width indicator) | L160: ## Tabs (new `tab` family; second `md-tabs` with `md-primary-tab`; `md-secondary-tab` for the full-width indicator)

## Tabs (new `tab` family; second `md-tabs` with `md-primary-tab`; `md-secondary-tab` for the full-width indicator) | L162: | Part / state / property | Primary | Second | Mechanism |

## Tabs (new `tab` family; second `md-tabs` with `md-primary-tab`; `md-secondary-tab` for the full-width indicator) | L166: | unselected underline | 2px `$border-subtle`; hover `$border-strong` (`:486, 569`) | none | **F** `color.tab_track`, `_hover`, `_disabled`, `control.tab_track_width` (second 0) |

## Tabs (new `tab` family; second `md-tabs` with `md-primary-tab`; `md-secondary-tab` for the full-width indicator) | L167: | selected indicator | 2px `$border-interactive`, full tab width (`:597`) | primary tab: `active-indicator-color` primary, height 3, top corners 3, the label's width; secondary tab: 2, full width | **F** `color.tab_indicator`, `control.tab_indicator_width`, `control.tab_indicator_radius`; **A** `anatomy.tab_indicator: full | content` (primary `full`, second `content`, default `full`) |

## Tabs (new `tab` family; second `md-tabs` with `md-primary-tab`; `md-secondary-tab` for the full-width indicator) | L172: | contained kind | `$layer-accent` fill, `$layer-accent-hover`, selected `$layer` with a 2px `$border-interactive` top, `$border-strong` separators (`:332-354, 579-611`) | none | **F** `color.tab_contained_container`, `_hover`, `_selected`, `color.tab_contained_separator`; the second answers from its own surface roles |

## Menu (the `list` family of the Dropdown, with menu members; second `md-menu` + `md-menu-item`) | L177: ## Menu (the `list` family of the Dropdown, with menu members; second `md-menu` + `md-menu-item`)

## Menu (the `list` family of the Dropdown, with menu members; second `md-menu` + `md-menu-item`) | L179: | Part / state / property | Primary | Second | Mechanism |

## Menu (the `list` family of the Dropdown, with menu members; second `md-menu` + `md-menu-item`) | L184: | item label | `body-short-01`, `$text-secondary`, hover `$text-primary` on `$layer-hover`, disabled `$text-disabled` (`:81-105, 204-212`) | body-large on-surface, hover 8% layer, disabled 38% | **E** `list` item cells and `type.list_item` (the primary's menu and list box label share type and colors) |

## Menu (the `list` family of the Dropdown, with menu members; second `md-menu` + `md-menu-item`) | L186: | danger item | hover and focus `$button-danger-primary`, `$text-on-color` (`:215-222`) | none | **M** `color.menu_item_danger_container_hover`, `color.menu_item_danger_label`, `_hover` (the second answers from its error roles) |

## Modal (new `dialog` family; second `md-dialog`) | L193: ## Modal (new `dialog` family; second `md-dialog`)

## Modal (new `dialog` family; second `md-dialog`) | L195: | Part / state / property | Primary | Second | Mechanism |

## Modal (new `dialog` family; second `md-dialog`) | L198: | container | `$layer`, 1px `$border-subtle-01`, no corners, no shadow; width by size 24-84% (`:80-107, 190-240`) | `container-color` surface-container-high, `container-elevation` level 3, `container-shape` 28; 280-560 wide, at least 140 high (`_md-comp-dialog.scss`; `_dialog.scss:40-42`) | **F** `color.dialog_container`, `color.dialog_border`, `control.dialog_border_width`, `control.dialog_radius`, `shadow.dialog`, `control.dialog_min_width`, `control.dialog_max_width` (the primary's percentage widths stay a component rule per size) |

## Modal (new `dialog` family; second `md-dialog`) | L199: | header padding | top 16, inline 16 / end 48 (`:160-167`) | 24 all round, gap 8 (`_dialog.scss:110-111`) | **F** `control.dialog_padding_inline`, `control.dialog_padding_top`, `control.dialog_header_gap`; the primary's end 48 **D** room for the close button |

## Modal (new `dialog` family; second `md-dialog`) | L200: | label (eyebrow) | `label-01`, `$text-secondary` (`:170-174`) | none | **E** the named tokens (no second counterpart) |

## Modal (new `dialog` family; second `md-dialog`) | L203: | actions | footer 64 high, buttons fill it edge to edge, 64 high (`:305-326`) | text buttons trailing, gap 8, padding 16 24 24 (`_dialog.scss:216-222`) | **E** `anatomy.dialog_actions` (`stretched` / `trailing`); **F** `control.dialog_actions_height` (second 0: content height), `control.dialog_actions_gap`, `control.dialog_actions_padding` |

## Modal (new `dialog` family; second `md-dialog`) | L204: | close button | 48 square, transparent, hover `$layer-hover`, icon 20, top end (`:335-367`) | none | **A** `anatomy.dialog_close: shown | hidden` (primary `shown`, second `hidden`, default `shown`); composes IconButton (ghost); **M** `control.dialog_close_icon_size` (20 where the icon button's is 16) |

## ToastNotification (new `notification` family; second: `_md-comp-snackbar.scss` tokens, no rendered element) | L209: ## ToastNotification (new `notification` family; second: `_md-comp-snackbar.scss` tokens, no rendered element)

## ToastNotification (new `notification` family; second: `_md-comp-snackbar.scss` tokens, no rendered element) | L211: `@material/web` 2.x ships no snackbar element: the material template fills the cells from the snackbar token file and the row is measured against the primary alone (**H**: roster `material_twin` -> `none`). The low-contrast kind's status fills already exist as contract tokens (`color.notification_background_<status>`).

## ToastNotification (new `notification` family; second: `_md-comp-snackbar.scss` tokens, no rendered element) | L213: | Part / state / property | Primary | Second (tokens) | Mechanism |

## ToastNotification (new `notification` family; second: `_md-comp-snackbar.scss` tokens, no rendered element) | L223: | height | content (title + subtitle + paddings) | single line 48, two lines 68 | **D** content height; the second's heights are content-derived too |

## Decisions at the 6.0b HIGH review (2026-10-09) | L229: The v6 step ran under LOW at the owner's direction; the HIGH review applied FIDELITY RULES 4 and 8 to the rows it had left open or answered without a source:

## Decisions at the 6.0b HIGH review (2026-10-09) | L231: - **Selected mark (Dropdown row, Menu row):** Carbon draws `checkmark` on the selected item (`list-box/_list-box.scss:877`); Material's select option draws no mark (`select/internal/selectoption/select-option.js` renders none). Hiding a part is structure (rule 4), so the contract gains `anatomy.list_selected_mark: shown | hidden` (default and Carbon `shown`, Material `hidden`); `icon.selected_indicator` stays the glyph (Carbon `checkmark`, Material Symbols `check` for a layer that shows it).

## Decisions at the 6.0b HIGH review (2026-10-09) | L232: - **Switch handle mark (Toggle row):** each reference draws its own check (rule 4): `@carbon/react` 1.115.0 `Toggle/Toggle.js` `toggle__check` (viewBox 0 0 6 5) for Carbon and the default, `@material/web` 2.5.0 `switch/internal/switch.js` `renderOnIcon` (weight 500, viewBox 0 0 24 24) for Material. Recorded in each template's `provenance.icons.drawings`.

## Decisions at the 6.0b HIGH review (2026-10-09) | L233: - **Modal row, Material body and actions:** `_dialog.scss:190-193` pads the content 24 on every side; with actions the content bottom drops to 8 and the actions row pads 16 24 24 (`:216-222`), 24 between text and buttons either way. Material answers body 24 / 24 and actions padding 24; **the component applies `control.dialog_actions_padding` to the row's inline sides and bottom only** (neutral: Carbon's is 0), which reproduces both reference layouts.

## Decisions at the 6.0b HIGH review (2026-10-09) | L234: - **Tooltip and ToastNotification rows, Material geometry with no token:** stated from Google's own M3 implementation, Compose Material 3 at androidx `00709418ece1`: `Tooltip.kt` (padding 4 / 8, anchor spacing 4, plain max width 200, no caret) and `Snackbar.kt` (fills the width up to 600). `control.notification_width` is a width the toast takes up to the viewport (Carbon fixed 288; Material 600 at most) - the ToastNotification run implements it as `min(cell, available)`.

## Decisions at the 6.0b HIGH review (2026-10-09) | L235: - **Tag row, Material paddings:** read from the chip tokens (`leading-space` 16, `with-leading-icon-leading-space` 8) rather than stated.

