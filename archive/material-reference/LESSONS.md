# What Material taught

Each lesson below became a behavior-named contract value. Each value stays in the contract because it is implemented
and covered by the enum-render gate and a unit test (FIDELITY RULES 6, amended by D41). A template or a brand layer may
pin it even though neither shipped template does.

## Fields (TextInput, TextArea, PasswordInput, NumberInput, Select, ComboBox, Dropdown, DatePicker)
Material's filled and outlined fields float the label into the border when the field holds a value or focus. Carbon
keeps the label above. This became `anatomy.label: floating | above`, with the outline notch drawn from the label's
measured width.

## Buttons and pressables (Button, IconButton, every pressable control)
Material answers a press with a ripple from the touch point over a state layer. Carbon swaps the fill. This became
`feedback.press: ripple | highlight`. Material's hover, focus and pressed fills are translucent layers over the
container, so those cells carry `rgba()` values that composite exactly over any backdrop (FIDELITY RULES 3).

## Switch
Material's handle grows from 16 to 24 when selected and to 28 when pressed. Carbon's handle keeps its size. This became
`anatomy.switch_handle: grows | fixed`.

## Slider
Material draws the handle as a vertical bar with a gap in the track on each side. Carbon draws a round thumb. This became
`anatomy.slider_handle: bar | round`.

## Dialog (Modal, ComposedModal)
Material places the actions as trailing text buttons and fades the content's edges when it scrolls. Carbon uses
full-width footer buttons and no fade. These became `anatomy.dialog_actions: trailing | footer` and
`anatomy.dialog_scroll_fade`.

## Lists and selection (ListItem, ContainedListItem, Select options, Menu selectable items)
Material marks a selected list item with a leading or trailing mark. Carbon marks it with a fill. This became
`anatomy.list_selected_mark`.

## ContentSwitcher (segmented buttons)
Material shows a check before the label of a selected segment that has no icon. Carbon shows a filled segment. This
became `anatomy.content_switcher_selected_mark: shown | hidden`.

## OverflowMenu
Carbon joins the open panel to its trigger with a connector. Material's menu floats free. This became
`anatomy.overflow_menu_connector`.

## Target size (every control)
Material keeps a 48 dp touch target around controls that draw smaller. This became the target-size cells read by every
pressable (D26).

## What it cost
The second reference took about a third of the gate matrix, and it produced the hardest reference-side hours of batches
12-15: shadow-DOM mounts, `md-menu` anchoring and the segmented-button set. The proof of genericity it bought is kept in
the values above and in the enum-render gate, which renders every value of every enum on every run.
