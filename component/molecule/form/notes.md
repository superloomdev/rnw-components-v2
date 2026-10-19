## Decisions

- **Form's role.** The `form` role exists only with an accessible name, so the role is set exactly when `accessibilityLabel` is; `role`, not `accessibilityRole`, carries the ARIA name on every platform.
- **FormItem's type.** The upstream item sets the compact body type on the container itself, so bare string children mount through the registry Text in `type.body_compact_01`.
- **FormGroup's legend.** The legend is a registry Text in `type.field_label` in the label color (the disabled label color while disabled), `spacing.spacing_03` below - the upstream label's bottom margin. `role: 'group'` names itself by the legend's generated id; `invalid` sets `aria-invalid` on the group and nothing else - the upstream's unstyled requirement block answers a `message` with a plain Text, not a new style.
- **Disabled is inherited.** A disabled group publishes the shared DisabledContext; the registry forces `disabled` on every component inside it, so a nested group passing `disabled: false` stays disabled, matching the upstream fieldset's disabling of descendant controls.
- **FormLabel has no margin.** The upstream label class drops the label margin for this member; the gap above a field belongs to the field, so the Text paints bare.
- **Members of a form only.** The roster keeps `requires_parent` on FormGroup and FormLabel: upstream mounts both only inside a Form, so they are not standalone components.

## Platform

A group, a form and a label are roles and ids on every platform; the disabling is a context value, not a DOM attribute, so it behaves identically on native.
