# census-m3.md - Material/second rows (text copy, from 7f2bd93 tag)

# Census M3 - roster positions 20-51, the remaining atom-tier rows (HIGH, Step 7.0a, 2026-10-13) | L3: Source-read census, as `census-m2.md`: the rows are not built, so the inputs are the upstream sources. The raw facts, each with its upstream `file:line`, are in `census-m3/raw-*.md` (one file per row plus one index per group of shared facts); this file classifies them by FIDELITY RULES 8 and names what each template answers. Primary = `@carbon/react` 1.115.0 markup and `@carbon/styles` (g10 light, g100 dark); second = `@material/web` 2.5.0 (`tokens/versions/v0_192` plus the 2.5.0 wrappers).

# Census M3 - roster positions 20-51, the remaining atom-tier rows (HIGH, Step 7.0a, 2026-10-13) | L5: Mechanism codes (as M2): **E** existing cell or token, **M** member cell, **F** new family cells, **A** anatomy value, **I** icon role, **B** component behavior (neutral), **D** derived from existing tokens (no new token), **H** harness answer. **S** marks a value a template states with no source of its own system for it (no counterpart); the row then carries `superloom_decision` and `notes.md` says what was decided.

### Summary | L15: - **New member cells (button family):** `button_set_*` (separator per state, gap, item width), `button_skeleton_width`, `combo_button_min_width`, `combo_button_max_width`, and one new button kind, `quick_action` (the chat button's quick-action face), which joins `BUTTON_KINDS` so it gets every container, label, border and elevation cell the grid gives a kind, plus `button_quick_action_focus_gap_width`.

### Summary | L17: - **Derived, no token:** the chat button's pill corner (half its height in every size), the chat button's end padding without an icon (its start padding), the combo button's seam (`border.width_01`), the combo primary action's floor per size.

### Summary | L18: - **Behaviors (neutral):** AspectRatio's ratio; ButtonSet's kind order and stacking; the fixed kind of PrimaryButton, SecondaryButton, DangerButton; ComboButton's split action, menu and turning chevron; Button gains a `pill` composition prop (as it gained `fill`).

### Summary | L19: - **Harness:** Divider's only reference is the second (Carbon has no Divider): the primary page mounts nothing for it, which the measurement gate must accept for a row whose `carbon_twin` is `none`; AspectRatio draws no paint of its own, so its samples carry visible content.

### Summary | L20: - **Roster corrections:** tiers (below); `material_twin` -> `none` for SecondaryButton, DangerButton, ButtonSet, ButtonSkeleton, ComboButton, preview__ChatButton, preview__ChatButtonSkeleton (no `@material/web` element draws them, raw files section 3); Divider `carbon_twin` stays `none`.

### AspectRatio (atom; second: none) | L22: ### AspectRatio (atom; second: none)

### AspectRatio (atom; second: none) | L24: | Part / state / property | Primary | Second | Mechanism |

### AspectRatio (atom; second: none) | L26: | ratio | `ratio` one of 16x9, 9x16, 2x1, 1x2, 4x3, 3x4, 3x2, 2x3, 1x1, default 1x1 (`AspectRatio.js`); height = width x h/w by a `::before` padding (`aspect-ratio/_aspect-ratio.scss`) | none | **B** a `ratio` prop; the box takes `aspectRatio` (React Native's and the web's own style property), so no padding trick and no platform branch |

### PrimaryButton, SecondaryButton, DangerButton (Button family; tier atom -> molecule) | L34: | Part / state / property | Primary | Second | Mechanism |

### PrimaryButton, SecondaryButton, DangerButton (Button family; tier atom -> molecule) | L36: | everything drawn | `Button` with `kind` primary / secondary / danger (`PrimaryButton.js`, `SecondaryButton.js`, `DangerButton.js`) | primary: `md-filled-button` (Button's own mapping); secondary and danger: no element | **E** the button's cells for that kind |

### PrimaryButton, SecondaryButton, DangerButton (Button family; tier atom -> molecule) | L37: | kind | Primary and Secondary set the kind before the caller's props (a caller's `kind` wins); Danger sets it after (always danger) | - | **B** the same precedence |

### PrimaryButton, SecondaryButton, DangerButton (Button family; tier atom -> molecule) | L39: Each composes `Button`, so each moves to molecule. Second block: PrimaryButton only (as Button's primary kind); SecondaryButton and DangerButton `material_twin` -> `none`.

### ButtonSet (Button family; tier atom -> molecule; second: none) | L41: ### ButtonSet (Button family; tier atom -> molecule; second: none)

### ButtonSet (Button family; tier atom -> molecule; second: none) | L43: | Part / state / property | Primary | Second | Mechanism |

### ButtonSet (Button family; tier atom -> molecule; second: none) | L45: | layout | row; `stacked` column (`_button.scss:462-468`) | no set element; the closest grouping is the dialog's action row, gap 8 (`control.dialog_actions_gap`, census M2 Modal) | **B** row or column |

### ButtonSet (Button family; tier atom -> molecule; second: none) | L47: | item width | `inline-size: 100%`, `max-inline-size: 196px` (`:470-474`) | content width (md-button `inline-flex`) | **M** `control.button_set_item_max_width`: carbon 196, default 196, material 196 **S**; items share the row equally up to it |

### ButtonSet (Button family; tier atom -> molecule; second: none) | L48: | gap between items | 0 (adjacent) | dialog actions gap 8 | **M** `control.button_set_gap`: carbon 0, default 0, material 8 (its `dialog_actions_gap` source) |

### ButtonSet (Button family; tier atom -> molecule; second: none) | L49: | separator | 1px line at each non-first item's leading edge, `$button-separator` (#e0e0e0 / #161616), drawn as `-1px 0 0 0` box-shadow; top edge when stacked (`:476-494`) | none | **M** `color.button_set_separator`: carbon `button_separator`, default `button_separator`, material `transparent` (its buttons sit apart and draw no seam); width **E** `border.width_01` |

### ButtonSet (Button family; tier atom -> molecule; second: none) | L50: | separator, disabled item | `$icon-on-color-disabled` in a row, `$layer-selected-disabled` stacked (`:496-510`) | none | **M** `color.button_set_separator_disabled` (carbon `icon_on_color_disabled`) and `color.button_set_separator_stacked_disabled` (carbon `layer_selected_disabled`); default the same; material `transparent` |

### ButtonSet (Button family; tier atom -> molecule; second: none) | L52: | `fluid` | a container-width layout: items `flex 0 1 25%`, max 232, min 176, ghost items grow and start-pad `$spacing-07`; stacks below n x 176 (`:49-109`) | none | **M** `control.button_set_fluid_min_width` (carbon 176 = `$button-min-inline-size`, `_vars.scss:89`), `control.button_set_fluid_max_width` (232), `control.button_set_fluid_ghost_padding_start` (carbon `spacing_07`); default the same; material 176 / 232 / its `button_padding_start` **S**. The stack test is **B** (measured width / count < min) |

### ButtonSkeleton (Button family; tier atom -> molecule, it composes the skeleton placeholder of group 3; second: none) | L55: ### ButtonSkeleton (Button family; tier atom -> molecule, it composes the skeleton placeholder of group 3; second: none)

### ButtonSkeleton (Button family; tier atom -> molecule, it composes the skeleton placeholder of group 3; second: none) | L57: | Part / state / property | Primary | Second | Mechanism |

### ButtonSkeleton (Button family; tier atom -> molecule, it composes the skeleton placeholder of group 3; second: none) | L59: | box | `.cds--btn.cds--skeleton`: `$skeleton-background`, no border, no padding (`_button.scss:455-458`, `utilities/_skeleton.scss:18`) | no skeleton in `@material/web` | **E** the skeleton family's container cell (group 3) |

### ButtonSkeleton (Button family; tier atom -> molecule, it composes the skeleton placeholder of group 3; second: none) | L60: | shimmer | `::before` `$skeleton-element`, 3000ms ease-in-out sweep (`utilities/_keyframes.scss:39-96`) | none | **E** the skeleton family's shimmer (group 3) |

### ButtonSkeleton (Button family; tier atom -> molecule, it composes the skeleton placeholder of group 3; second: none) | L61: | width | 150 (`_button.scss:457`) | none | **M** `control.button_skeleton_width`: carbon 150, default 150, material 150 **S** |

### ButtonSkeleton (Button family; tier atom -> molecule, it composes the skeleton placeholder of group 3; second: none) | L63: | corner | 0: the v12 `border-radius: 4px` is behind `enable-v12-release`, off (`_feature-flags.scss:13`) | - | **E** `control.button_radius` (the skeleton takes the shape of the button it stands for; material 9999) |

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L66: ### preview__ChatButton (Button family; tier atom -> molecule; second: none)

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L68: | Part / state / property | Primary | Second | Mechanism |

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L70: | kinds and sizes | `Button` with `kind` primary / secondary / danger / ghost / tertiary, `size` sm / md / lg only (`ChatButton.js:21-50`) | no chat button | **E** the button's cells; **B** sizes outside sm/md/lg fall back to lg |

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L71: | corner | 24 / 20 / 16 for lg / md / sm (`_chat-button.scss:15-29`) = half the height | md-button `corner-full` | **D** half the button's height in every size (a pill), so no token; Button takes a `pill` composition prop |

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L73: | quick action | forces kind ghost and size sm (`ChatButton.js:34-36`); rest: 1px `$chat-button` border, transparent fill, `$chat-button` label (#0f62fe / #78a9ff) (`:32-37`) | closest: `md-outlined-button` (outline + primary label) | **M** a new button kind `quick_action` with every kind cell; carbon `container` transparent, `border` and `label` `chat_button`; material from its outlined button (`outline`, `primary`); default as carbon. The size is **B** (sm) |

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L76: | quick action selected (`isSelected`) | border transparent, fill `$chat-button-selected` (.2 / .24), label `$chat-button-text-selected` (#525252 / #c6c6c6), unchanged on hover, press and disabled (`:67-82`) | no selected state in any md-button | **M** `_container_selected`, `_label_selected`; material from its tonal pair (`secondary-container`, `on-secondary-container`) **S**; the selected label holding through hover and press is **B** |

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L77: | quick action focus | border `$focus` and `inset 0 0 0 1px $focus`: no page-color gap line (`:51-54`); hovered while focused the inner line is `$focus-inset` (`:56-59`) | outlined button focus ring | **M** `control.button_quick_action_focus_gap_width` (carbon 0, default 0, material its `button_focus_gap_width`); the hover-while-focused inner line is a combined state no gate drives: **B** reads `color.button_focus_gap` for it |

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L78: | icon | `renderIcon`, `--with-icon` keeps the icon padding | - | **E** Button's icon slot |

### preview__ChatButton (Button family; tier atom -> molecule; second: none) | L80: New kind cells (per the grid's kind pattern): `color.button_quick_action_container{,_hover,_active,_focus,_disabled,_selected}`, `color.button_quick_action_label{...}`, `color.button_quick_action_border{,_hover,_active,_disabled}`, `shadow.button_quick_action{,_hover,_active,_disabled}` (all `level_00` in every template).

### preview__ChatButtonSkeleton (Button family; tier atom -> molecule; second: none) | L82: ### preview__ChatButtonSkeleton (Button family; tier atom -> molecule; second: none)

### preview__ChatButtonSkeleton (Button family; tier atom -> molecule; second: none) | L84: | Part / state / property | Primary | Second | Mechanism |

### preview__ChatButtonSkeleton (Button family; tier atom -> molecule; second: none) | L87: | width | 150 (the button skeleton's) | - | **E** `control.button_skeleton_width` |

### ComboButton (Button family; tier atom -> composite: Button + IconButton + Menu; second: none) | L91: ### ComboButton (Button family; tier atom -> composite: Button + IconButton + Menu; second: none)

### ComboButton (Button family; tier atom -> composite: Button + IconButton + Menu; second: none) | L93: | Part / state / property | Primary | Second | Mechanism |

### ComboButton (Button family; tier atom -> composite: Button + IconButton + Menu; second: none) | L95: | anatomy | container > primary-action `Button` (kind primary, title = label) + trigger `IconButton` ("Additional actions", `aria-haspopup`, `aria-expanded`, `aria-controls`) with `ChevronDown` + `Menu` (`index.js:75-122`) | no split button in `@material/web` | **B** composition of the built Button, IconButton and Menu; **E** their cells |

### ComboButton (Button family; tier atom -> composite: Button + IconButton + Menu; second: none) | L97: | primary action width | the button `min 111, max 239, width 100%` and its wrapper `min 160 - 1 - trigger` per size (sm 127, md 119, lg 111) (`:24-41`) | none | **M** `control.combo_button_min_width` (carbon 160) and `control.combo_button_max_width` (carbon 240 = 239 + the seam); default the same; material 160 / 240 **S**; the per-size floor is **D** (min - seam - trigger size) |

### ComboButton (Button family; tier atom -> composite: Button + IconButton + Menu; second: none) | L100: | menu | placement `menuAlignment` (bottom default; six values), width = the container's for top and bottom, flips (`index.js:37-61`) | - | **B** the built Menu and its positioning behavior |

### Divider (new `divider` family; atom; primary: none, second `md-divider`) | L103: ### Divider (new `divider` family; atom; primary: none, second `md-divider`)

### Divider (new `divider` family; atom; primary: none, second `md-divider`) | L105: | Part / state / property | Primary | Second | Mechanism |

### Divider (new `divider` family; atom; primary: none, second `md-divider`) | L107: | line | no Divider export in `@carbon/react` (raw-Divider section 1) | `::before` in `currentColor` = `md-sys-color-outline-variant` (#cac4d0 light, #49454f dark), height `thickness` 1px, host full width (`divider/internal/_divider.scss:28-54`, `_md-comp-divider.scss`) | **F** `color.divider` (material `outline_variant`; carbon `border_subtle_01` **S** from Carbon's own scale, D3; default the same as carbon) and `control.divider_width` (material 1; carbon `border.width_01` **S**; default the same) |

### Divider (new `divider` family; atom; primary: none, second `md-divider`) | L108: | insets | none | `inset`, `inset-start`, `inset-end`: 16px padding on that side (`:39-47`) | **F** `control.divider_inset` (material 16; carbon `spacing_05` **S**; default the same); **B** the three props |

### Divider (new `divider` family; atom; primary: none, second `md-divider`) | L110: | measurement | - | - | **H** the second block is the row's only reference: the primary page mounts nothing and the gate must accept that for a row whose `carbon_twin` is `none` |

## Scope after the census: 27 rows (25 after batch 4: the View family moves to Part 8) | L124: **Batch 4 review:** ViewWrapper and LandingView are `@carbon/react-native` rows, which Plan Part 8 builds with the other mobile rows (LandingView's reference composes the mobile Button); their census and v7 cells below stand for Part 8. Milestone 3 is therefore AspectRatio; the eight Button rows; Divider; Link; Loading, InlineLoading, ProgressIndicator, ProgressStep, ProgressIndicatorSkeleton, Saving; IconSkeleton, SkeletonIcon, SkeletonPlaceholder, SkeletonText; DismissibleTag, OperationalTag, SelectableTag, TagSkeleton; LandingView, ViewWrapper.

### Summary | L132: - **New anatomy value:** `anatomy.loading_motion` (`spin` | `arc`): the primary spins a fixed arc, the second grows and shrinks its arc while it turns (FIDELITY RULES 6, both picked).

### Summary | L133: - **New icon:** `save` (Saving's default status glyph; `data/icons.json` lacks it): every template's counterpart at once.

### Summary | L134: - **Library rule amendment:** `docs/authoring.md` says only `Icon` touches `ctx.Svg`; the spinner's stroked arc (`stroke-dasharray` on a circle) has no glyph or View equivalent, so Loading draws its circles through `ctx.Svg` too, and the rule names the two.

### Summary | L135: - **Motion on native:** the spinner and the shimmer animate through the style `animationKeyframes` that react-native-web reads (as ProgressBar's indeterminate bar does); a native platform draws them still.

### Summary | L136: - **Roster corrections:** Loading `material_twin` -> `md-circular-progress`; InlineLoading, Saving, ProgressIndicator, ProgressStep, ProgressIndicatorSkeleton, IconSkeleton `material_twin` -> `none` (no `@material/web` element draws a step, a status line or a placeholder); tiers below; IconSkeleton `family` -> Skeleton (it draws exactly SkeletonIcon's box).

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L138: ### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none)

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L140: | Part / state / property | Primary | Second | Mechanism |

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L142: | label color rest / hover / active / focus | `$link-primary` / `$link-primary-hover` / `$link-primary` / `$link-primary` (#0f62fe, #0043ce; dark #78a9ff, #a6c8ff) (`link/_link.scss:38-65`) | `md-text-button` is a 40px pill button, not a link: no counterpart | **F** `color.link_label`, `_hover`, `_active`; carbon the link roles; default the same; material `primary` for all three **S** |

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L143: | visited (`visited`) | `$link-visited` (#8a3ffc / #be95ff) (`:88-90`) | none | **F** `color.link_label_visited`; material `primary` **S** |

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L144: | disabled | `$text-disabled`, no underline, `aria-disabled`, no `href` (`:77-85`, `Link.js:27-33`) | none | **F** `color.link_label_disabled`; material `on_surface` at 0.38 (its disabled text recipe) |

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L145: | underline | on hover, focus and active; always when `inline` (`:46-65,96-99`) | none | **B** (no second shape exists, so no enum: the primary's is the only answer, rule 6) |

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L146: | focus | 1px outline in `$focus` (`focus-outline`, `:61-65`) | none | **F** `color.link_focus_ring` (carbon `focus`; material its focus ring color **S**), `control.link_focus_width` (carbon 1; material its focus width **S**) |

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L147: | type by size | sm `helper-text-01` 12/16, md `body-compact-01` 14/18, lg `body-compact-02` 16/22 (`:104-112`) | none | **F** `type.link_label`, `type.link_label_small`, `type.link_label_large`; carbon those sets; material `label_large` / `label_medium` / `body_large` **S** |

### Link (new `link` family; tier atom -> molecule, its trailing icon is `Icon`; second: none) | L148: | icon | `__icon` 8 after the label, 16 (lg 20), `1lh` box (`:119-132`) | none | **F** `control.link_icon_gap` (carbon `spacing_03`), `control.link_icon_size` (16), `control.link_icon_size_large` (20); material 8 / 18 / 20 **S** |

### Loading (new `loading` family; atom; second `md-circular-progress`) | L151: ### Loading (new `loading` family; atom; second `md-circular-progress`)

### Loading (new `loading` family; atom; second `md-circular-progress`) | L153: | Part / state / property | Primary | Second | Mechanism |

### Loading (new `loading` family; atom; second `md-circular-progress`) | L155: | box | 88 square; small 16 (`loading/_loading.scss:24-31,57-67`, `_vars.scss`) | 48 square, no small (`progress/internal/_circular-progress.scss`) | **F** `control.loading_size` (88 / 48), `control.loading_size_small` (16 / 24 **S**) |

### Loading (new `loading` family; atom; second `md-circular-progress`) | L156: | indicator stroke | `$interactive`, width 10 of a 100 viewBox (16 small), butt caps (`:38-51,64-66`) | `primary`, 4px | **F** `color.loading_indicator` (carbon `interactive`, material `primary`); `control.loading_stroke_width` (carbon 8.8 = 10% of 88, material 4), `control.loading_stroke_width_small` (carbon 2.56, material 3 **S**) |

### Loading (new `loading` family; atom; second `md-circular-progress`) | L157: | track (small only) | `$layer-accent` circle behind the arc (`:73-85`; `Loading.js:116-121`) | none drawn | **F** `color.loading_track` (carbon `layer_accent_01`, material `transparent`) |

### Loading (new `loading` family; atom; second `md-circular-progress`) | L158: | arc and motion | an 81% arc (48% small) turning at 690ms linear (`_animation.scss`, `cds--rotate`) | an arc growing 10->270 degrees and back over 1333ms while the whole turns (`expand-arc`, `rotate-arc`, `linear-rotate`, `:91-185`) | **A** `anatomy.loading_motion`: `spin` (carbon, default) / `arc` (material); **F** `control.loading_arc` (0.81) and `control.loading_arc_small` (0.48) for `spin`, `motion.loading_rotation` (690 / 1568), `motion.loading_arc_cycle` (material 1333; carbon and default the rotation **S**) |

### Loading (new `loading` family; atom; second `md-circular-progress`) | L160: | overlay (`withOverlay`) | fixed full-viewport `$overlay` (rgba 0,0,0,.6), `z('overlay')`, focus trapped, `role="dialog"` (`:87-99`, `Loading.js:29-89,131-142`) | none | **M** `color.loading_scrim` (carbon `overlay`; material its dialog scrim **S**); **E** `stacking.overlay`; **B** `useViewportLayer`, `useFocusTrap`, `useOverlay` |

### InlineLoading (Progress family; tier atom -> molecule: Loading + Icon; second: none) | L163: ### InlineLoading (Progress family; tier atom -> molecule: Loading + Icon; second: none)

### InlineLoading (Progress family; tier atom -> molecule: Loading + Icon; second: none) | L165: | Part / state / property | Primary | Second | Mechanism |

### InlineLoading (Progress family; tier atom -> molecule: Loading + Icon; second: none) | L168: | text | `label-02` 14/18, `$text-secondary` (`inline-loading/_inline-loading.scss:25-35`) | - | **M** `type.inline_loading_label` (carbon `label02`), `color.inline_loading_label` (carbon `text_secondary`); material `body_medium` / `on_surface_variant` **S** |

### InlineLoading (Progress family; tier atom -> molecule: Loading + Icon; second: none) | L170: | status colors | finished `$support-success`, error `$support-error`, icon 16 (`:45-48,72-76`) | - | **M** `color.inline_loading_success`, `color.inline_loading_error` (carbon the support roles; material `primary` and `error` **S**); size **E** `size.icon_01` |

### InlineLoading (Progress family; tier atom -> molecule: Loading + Icon; second: none) | L171: | the drawn checkmark | `__checkmark` stroke animation (`:60-69`) | - | not drawn: 1.115.0's markup emits no `__checkmark` element (`InlineLoading.js:41-61`), so the rule is unreachable |

### Saving (Progress family, `@carbon/ibm-products`; tier atom -> molecule: Button x2 + InlineLoading + Icon; second: none) | L173: ### Saving (Progress family, `@carbon/ibm-products`; tier atom -> molecule: Button x2 + InlineLoading + Icon; second: none)

### Saving (Progress family, `@carbon/ibm-products`; tier atom -> molecule: Button x2 + InlineLoading + Icon; second: none) | L175: | Part / state / property | Primary | Second | Mechanism |

### Saving (Progress family, `@carbon/ibm-products`; tier atom -> molecule: Button x2 + InlineLoading + Icon; second: none) | L178: | `type="auto"` | status text `body-compact-01`; on fail an `ErrorFilled` 16 in `$button-danger-primary`, 16 before the text (`_saving.scss:18-32`) | none | **M** `type.saving_label` (carbon `body_compact_01`), `color.saving_error_icon` (carbon `button_danger_container`), `control.saving_icon_gap` (carbon `spacing_05`); material `body_medium`, `error`, 16 **S** |

### ProgressIndicator and ProgressStep (new `progress_step` family; ProgressIndicator molecule, ProgressStep molecule with `requires_parent` ProgressIndicator; both compose Icon; second: none) | L180: ### ProgressIndicator and ProgressStep (new `progress_step` family; ProgressIndicator molecule, ProgressStep molecule with `requires_parent` ProgressIndicator; both compose Icon; second: none)

### ProgressIndicator and ProgressStep (new `progress_step` family; ProgressIndicator molecule, ProgressStep molecule with `requires_parent` ProgressIndicator; both compose Icon; second: none) | L182: | Part / state / property | Primary | Second | Mechanism |

### ProgressIndicator and ProgressStep (new `progress_step` family; ProgressIndicator molecule, ProgressStep molecule with `requires_parent` ProgressIndicator; both compose Icon; second: none) | L184: | layout | `ul` row, steps 128 wide (min 112); `spaceEqually` grows them (min 128); `vertical` column, steps min 58 tall (`progress-indicator/_progress-indicator.scss:30-67,308-355`) | no stepper in `@material/web` | **F** `control.progress_step_width` (128), `control.progress_step_min_width` (112), `control.progress_step_vertical_min_height` (58); material 128 / 112 / 58 **S** |

### ProgressIndicator and ProgressStep (new `progress_step` family; ProgressIndicator molecule, ProgressStep molecule with `requires_parent` ProgressIndicator; both compose Icon; second: none) | L187: | glyph color | `$interactive`; incomplete `$icon-primary`; disabled `$icon-disabled`; invalid `$support-error` (`:69-78,202-209,252-290`) | - | **F** `color.progress_step_icon`, `_incomplete`, `_disabled`, `_invalid`; material `primary`, `on_surface_variant`, `on_surface` 0.38, `error` **S** |

### ProgressIndicator and ProgressStep (new `progress_step` family; ProgressIndicator molecule, ProgressStep molecule with `requires_parent` ProgressIndicator; both compose Icon; second: none) | L188: | line | 2 tall, full step width; current and complete `$interactive`, incomplete `$border-subtle` (`:56-67,196-216`) | - | **F** `control.progress_step_line_width` (2), `color.progress_step_line` (carbon `border_subtle_01`), `color.progress_step_line_complete` (carbon `interactive`); material 4 (its progress track height) / `surface_container_highest` / `primary` **S** |

### ProgressIndicator and ProgressStep (new `progress_step` family; ProgressIndicator molecule, ProgressStep molecule with `requires_parent` ProgressIndicator; both compose Icon; second: none) | L189: | label | `body-compact-01`, `$text-primary`, max 88 one line ellipsis (vertical 160, wraps), 8 above; hover (pressable) `$link-primary-hover`; focus `$focus`; disabled `$text-disabled` (`:87-127,252-285`) | - | **F** `type.progress_step_label`, `color.progress_step_label`, `_hover`, `_focus`, `_disabled`, `control.progress_step_label_max_width` (88), `control.progress_step_label_max_width_vertical` (160), `control.progress_step_label_gap` (`spacing_03`); material `label_large`, `on_surface`, `primary`, `primary`, `on_surface` 0.38, 88 / 160 / 8 **S** |

### ProgressIndicator and ProgressStep (new `progress_step` family; ProgressIndicator molecule, ProgressStep molecule with `requires_parent` ProgressIndicator; both compose Icon; second: none) | L190: | secondary label | `label-01`, `$text-secondary` (`:182-187`) | - | **F** `type.progress_step_secondary_label`, `color.progress_step_secondary_label`; material `body_small`, `on_surface_variant` **S** |

### ProgressIndicatorSkeleton (Progress family; molecule: four incomplete steps over the skeleton placeholder; second: none) | L193: ### ProgressIndicatorSkeleton (Progress family; molecule: four incomplete steps over the skeleton placeholder; second: none)

### ProgressIndicatorSkeleton (Progress family; molecule: four incomplete steps over the skeleton placeholder; second: none) | L195: | Part / state / property | Primary | Second | Mechanism |

### ProgressIndicatorSkeleton (Progress family; molecule: four incomplete steps over the skeleton placeholder; second: none) | L198: | label | a 40 x 14 skeleton block, 10 below the top (`:293-306`) | none | **M** `control.progress_step_skeleton_label_width` (40), `control.progress_step_skeleton_label_height` (14); material the same **S**; the block is the skeleton placeholder (group 3) |

### v7 amendment (batch 6): the six cells the ProgressIndicator/ProgressStep and SelectableTag implementations needed | L204: | Cell | carbon | default | material | Carbon source |

### v7 amendment (batch 6): the six cells the ProgressIndicator/ProgressStep and SelectableTag implementations needed | L206: | `control.progress_step_focus_width` | 1 | 1 | `focus-ring` `width` (3) | `progress-indicator/_progress-indicator.scss:127` - `outline: convert.to-rem(1px) solid $focus` on the step button's label at `:focus-visible` |

### v7 amendment (batch 6): the six cells the ProgressIndicator/ProgressStep and SelectableTag implementations needed | L207: | `control.progress_step_vertical_icon_top` | 1 | 1 | 1 **S** | `progress-indicator/_progress-indicator.scss:330` - vertical icon `margin: convert.to-rem(1px) $spacing-03 0` |

### v7 amendment (batch 6): the six cells the ProgressIndicator/ProgressStep and SelectableTag implementations needed | L209: | `control.progress_step_secondary_label_top` | 28 | 28 | 28 **S** | `progress-indicator/_progress-indicator.scss:189` - `margin-block-start: convert.to-rem(28px)` |

### v7 amendment (batch 6): the six cells the ProgressIndicator/ProgressStep and SelectableTag implementations needed | L210: | `control.progress_step_secondary_label_start` | 24 | 24 | 24 **S** | `progress-indicator/_progress-indicator.scss:190` - `margin-inline-start: $spacing-06` (24px) |

### v7 amendment (batch 6): the six cells the ProgressIndicator/ProgressStep and SelectableTag implementations needed | L211: | `color.tag_selectable_layer_active` | `transparent` | `transparent` | `on_surface_variant` at 0.12 (filter chip `pressed-state-layer-*`) | `tag/_tag.scss:115-131` - the selectable tag's rule set draws hover and focus but no `:active` paint; second reference `_md-comp-filter-chip.scss` `pressed-state-layer-color`/`pressed-state-layer-opacity` |

### Summary | L218: - **Template value findings:** material `skeleton_element` equals its `skeleton_background` (#e6e0e9) and default's are equal too (#e0e0e0): their shimmer is invisible. The new `skeleton_shimmer` cell must differ from `skeleton_container` in every template (an engine audit, like the role audit's distinctness).

### Summary | L219: - **New member cells (tag family):** the close button (DismissibleTag), the interactive tag's outline, focus and press layers (OperationalTag, SelectableTag), the selectable tag's selected face, the tag skeleton's width.

### Summary | L221: - **New family:** `view` (ViewWrapper's surfaces) and LandingView's member cells.

### Summary | L222: - **Roster corrections:** DismissibleTag `material_twin` -> `md-input-chip`, OperationalTag -> `md-assist-chip`, SelectableTag -> `md-filter-chip`, TagSkeleton -> `none`; tiers below.

### SkeletonPlaceholder (new `skeleton` family; atom; second: none) | L224: ### SkeletonPlaceholder (new `skeleton` family; atom; second: none)

### SkeletonPlaceholder (new `skeleton` family; atom; second: none) | L226: | Part / state / property | Primary | Second | Mechanism |

### SkeletonPlaceholder (new `skeleton` family; atom; second: none) | L228: | box | `$skeleton-background` (#e8e8e8 / #292929), 100 x 100 unless sized (`skeleton-styles/_skeleton-styles.scss:27-33`, `utilities/_skeleton.scss:18`) | no skeleton in `@material/web` | **F** `color.skeleton_container` (carbon `skeleton_background`; material `surface_container_highest` **S**; default `skeleton_background`), `control.skeleton_placeholder_size` (100; material 100 **S**) |

### SkeletonPlaceholder (new `skeleton` family; atom; second: none) | L229: | shimmer | `::before` `$skeleton-element` (#c6c6c6 / #393939) sweeping by scaleX from the left, then the right, 3000ms ease-in-out, none under reduced motion (`_keyframes.scss:39-96`) | none | **F** `color.skeleton_shimmer` (carbon `skeleton_element`; material `on_surface` at 0.08 **S**; default its gray 30 step **S**), `motion.skeleton_cycle` (3000ms; material and default the same **S**); **B** the sweep keyframes and `useReducedMotion` |

### SkeletonPlaceholder (new `skeleton` family; atom; second: none) | L230: | corner | 0 (v12 4px behind `enable-v12-release`, off) | none | **F** `control.skeleton_radius` (carbon 0, default 0, material 4 = `corner-extra-small` **S**) |

### SkeletonIcon and IconSkeleton (Skeleton family; molecule: the placeholder at 16; second: none) | L233: ### SkeletonIcon and IconSkeleton (Skeleton family; molecule: the placeholder at 16; second: none)

### SkeletonIcon and IconSkeleton (Skeleton family; molecule: the placeholder at 16; second: none) | L235: | Part / state / property | Primary | Second | Mechanism |

### SkeletonText (Skeleton family; molecule; second: none) | L239: ### SkeletonText (Skeleton family; molecule; second: none)

### SkeletonText (Skeleton family; molecule; second: none) | L241: | Part / state / property | Primary | Second | Mechanism |

### SkeletonText (Skeleton family; molecule; second: none) | L243: | line | 16 tall, full width, 8 below (`_skeleton-styles.scss:36-44`) | none | **F** `control.skeleton_text_height` (16), `control.skeleton_text_gap` (carbon `spacing_03`); material 16 / 8 **S** |

### SkeletonText (Skeleton family; molecule; second: none) | L244: | heading | 24 tall (`:46-48`) | none | **F** `control.skeleton_heading_height` (24; material 24 **S**) |

### SkeletonText (Skeleton family; molecule; second: none) | L245: | paragraph | `lineCount` lines (default 3) when `paragraph`; each line's width is `width` less a fixed offset sequence (0.973, 0.153, 0.567 of 75px, cycled) (`SkeletonText.js:21-68`) | - | **B** the same deterministic widths |

### TagSkeleton (Tag family; molecule: the placeholder in the tag's shape; second: none) | L247: ### TagSkeleton (Tag family; molecule: the placeholder in the tag's shape; second: none)

### TagSkeleton (Tag family; molecule: the placeholder in the tag's shape; second: none) | L249: | Part / state / property | Primary | Second | Mechanism |

### TagSkeleton (Tag family; molecule: the placeholder in the tag's shape; second: none) | L251: | box | tag height (sm only, or md), tag corner, 60 wide, skeleton colors (`tag/_tag.scss:411-428`) | none | **E** `control.tag_height`, the small height, `control.tag_radius`, the skeleton cells; **M** `control.tag_skeleton_width` (60; material 60 **S**) |

### DismissibleTag (Tag family; molecule: Tag + Tooltip + Icon; second `md-input-chip`) | L253: ### DismissibleTag (Tag family; molecule: Tag + Tooltip + Icon; second `md-input-chip`)

### DismissibleTag (Tag family; molecule: Tag + Tooltip + Icon; second `md-input-chip`) | L255: | Part / state / property | Primary | Second | Mechanism |

### DismissibleTag (Tag family; molecule: Tag + Tooltip + Icon; second `md-input-chip`) | L258: | close control | a circle of the tag's height at the end, 2 after the label (5 at sm), glyph 16 in `currentColor`; hover fill the hue's `$tag-hover-*`; focus `inset 0 0 0 1px $focus` (`:327-352,374-378,395-397`, `_mixins.scss:43-47`) | a trailing 18px remove icon inset by the trailing space 8, a state layer on press | **A** `anatomy.tag_close`: `circle` (carbon, default) / `inset` (material); **M** `control.tag_close_gap` (carbon `spacing_01`; the small size's 5 is **D**: + half the height difference), `control.tag_close_icon_size` (16 / 18), `control.tag_close_inset` (carbon 0, material 8), `color.tag_close_container_hover` (carbon `tag_hover_gray` for the neutral tag, the hue's `tag_hover_<hue>` **E** for a typed one; material `on_surface_variant` at 0.08), `color.tag_close_focus_ring` (carbon `focus`; material its focus ring) |

### DismissibleTag (Tag family; molecule: Tag + Tooltip + Icon; second `md-input-chip`) | L260: | tooltip | the close control's tooltip says `title` ("Dismiss"), or "Dismiss tag" while the label is truncated (`DismissibleTag.js:56,78-92`) | - | **B**; **E** the compact Tooltip |

### OperationalTag (Tag family; molecule: a pressable Tag; second `md-assist-chip`) | L262: ### OperationalTag (Tag family; molecule: a pressable Tag; second `md-assist-chip`)

### OperationalTag (Tag family; molecule: a pressable Tag; second `md-assist-chip`) | L264: | Part / state / property | Primary | Second | Mechanism |

### OperationalTag (Tag family; molecule: a pressable Tag; second `md-assist-chip`) | L267: | rest | 1px `$tag-border-<type>`, the hue's background and color (`_tag.scss:145-149`) | flat: 1px `outline`, transparent, `on-surface` label | **E** `tag_border_<hue>`, `tag_background_<hue>`, `tag_color_<hue>`; **M** `control.tag_interactive_outline_width` (carbon 1, material 1) |

### OperationalTag (Tag family; molecule: a pressable Tag; second `md-assist-chip`) | L269: | pressed | none | state layer 0.12 | **M** `color.tag_interactive_layer_active` (carbon `transparent`, material `on_surface` at 0.12) |

### OperationalTag (Tag family; molecule: a pressable Tag; second `md-assist-chip`) | L270: | focus | 2px `$focus` outline, offset 1 (`:158-161`) | its focus ring | **M** `color.tag_focus_ring`, `control.tag_focus_width` (2), `control.tag_focus_offset` (1); material its focus cells |

### SelectableTag (Tag family; molecule; second `md-filter-chip`) | L274: ### SelectableTag (Tag family; molecule; second `md-filter-chip`)

### SelectableTag (Tag family; molecule; second `md-filter-chip`) | L276: | Part / state / property | Primary | Second | Mechanism |

### SelectableTag (Tag family; molecule; second `md-filter-chip`) | L281: | selected | `$layer-selected-inverse` fill, `$text-inverse` label, unchanged on hover (`:134-142`) | `secondary-container` fill, outline 0, `on-secondary-container` label, and a leading checkmark (`_md-comp-filter-chip.scss`, `chips/internal/_filter-chip.scss`) | **M** `color.tag_selectable_container_selected`, `_container_selected_hover`, `color.tag_selectable_label_selected`, `control.tag_selectable_outline_width_selected` (carbon 1, material 0); **A** `anatomy.tag_selected_mark`: `hidden` (carbon, default) / `shown` (material); **I** `selected_indicator` (v6) |

### ViewWrapper (new `view` family; atom; `parse-rn`; second: none) | L284: ### ViewWrapper (new `view` family; atom; `parse-rn`; second: none)

### ViewWrapper (new `view` family; atom; `parse-rn`; second: none) | L286: | Part / state / property | Primary | Second | Mechanism |

### ViewWrapper (new `view` family; atom; `parse-rn`; second: none) | L288: | surfaces | top: `topBackgroundColor`, else `layer01` with top navigation, else `background`; same for the bottom; children on `background` (`ViewWrapper/index.js:19-61`) | none | **F** `color.view_background` (carbon `background`), `color.view_navigation_background` (carbon `layer_01`); material `surface` / `surface_container` **S**; default the semantic roles |

### ViewWrapper (new `view` family; atom; `parse-rn`; second: none) | L290: | status bar | `StatusBar` in the top color, light or dark content by scheme (`:75-78`) | - | **B** `ReactNative.StatusBar`; content style from `statusBarStyle`, else from the top surface's luminance (the library has no scheme flag) |

### LandingView (View family; tier atom -> composite: ViewWrapper + Text + Link + Button; `parse-rn`; second: none) | L292: ### LandingView (View family; tier atom -> composite: ViewWrapper + Text + Link + Button; `parse-rn`; second: none)

### LandingView (View family; tier atom -> composite: ViewWrapper + Text + Link + Button; `parse-rn`; second: none) | L294: | Part / state / property | Primary | Second | Mechanism |

### LandingView (View family; tier atom -> composite: ViewWrapper + Text + Link + Button; `parse-rn`; second: none) | L296: | banner | shown when the window is at least 500 tall; 192 tall, `#000000`, status bar light (`LandingView/index.js:33-36,68-71,125-140`) | none | **M** `color.landing_banner` (carbon `#000000`, a literal upstream; material `inverse_surface` **S**; default `#000000`), `control.landing_banner_height` (192), `control.landing_banner_min_window_height` (500); material the same **S** |

### LandingView (View family; tier atom -> composite: ViewWrapper + Text + Link + Button; `parse-rn`; second: none) | L298: | title | `heading-04` 28/36 in SemiBold, 16 below (`:54-57`, `typography.js:62-67,248-255`) | - | **M** `type.landing_title` (carbon 28/36/600; material `headline_medium` **S**) |

