# Theming and the adaptive seam

How a host builds a theme and a system for this library: which inputs the host resolves, which the engine applies, and which the components never see.

A component never reads `form`, `platform`, a window size or a text scale. It reads tokens through `ctx`. Every adaptive input is resolved once at the host's system seam and reaches the components through the built theme and the context.

## Form classes and variants

The library exports `resolveForm(width)` and `FORM_CLASSES = ['compact', 'medium', 'expanded']`. The host computes the form class from the window width in CSS pixels or points:

| Width | Class |
|---|---|
| `< 600` | `compact` |
| `600–839` | `medium` |
| `>= 840` | `expanded` |

The host builds the theme with the variant it resolved:

```js
const form = resolveForm(window.innerWidth);                 // or useWindowDimensions().width
const platform = Platform.OS;                                 // 'web' | 'ios' | 'android' | 'macos' | 'windows'
const built = Themer.buildTheme(template, layers, 'native', {
  variant: { form: form, platform: platform },
  adaptive: 'auto'                                            // 'fixed' ignores variants
});
const Registry = createSystem(sharedLibs, { textScale }, built, breakpoint, factories);
```

When the window crosses a class boundary the host rebuilds the theme (the engine caches, so a rebuild is cheap) and rebuilds or re-renders the system.

A template carries sparse `variants` beside its base tokens: `form.compact`, `form.medium`, `form.expanded` and `platform.<name>`. The engine applies the matching variants after the base and before brand layers; a variant moves touch geometry (row and field heights, the selection glyph, group pitch, `control.target_min`) and platform variants pin system-widget enums. A template that wants one look on every surface ships no variants, and a host that wants the same asks for `adaptive: 'fixed'`.

The `expanded` class is the base: measured geometry against the web references is the base value and never moves with the form class.

## System widgets

`anatomy.toggle_widget`, `anatomy.date_picker_widget` and `anatomy.time_picker_widget` take `drawn` or `system`. A template's platform variant picks `system` where the host should mount the operating system's control.

The host supplies the OS controls as adapters:

```js
const sharedLibs = { ..., adapters: { Switch: ReactNative.Switch, DateTimePicker: CommunityDateTimePicker } };
```

- `shared_libs.adapters` is optional and defaults to `{}`; every present adapter must be a component.
- On native, a `system` enum mounts the adapter (for the Toggle: `value`, `onValueChange`, `disabled`, the theme's track and handle colors, and the same accessibility props). Any other enum value, or an absent adapter, draws the theme's own widget.
- An absent adapter under `system` is reported through `config.onDiagnostic({ code: 'adapter_missing', adapter: 'Switch', component: 'Toggle' })` once per system build; it never throws and never draws nothing.
- On the web the drawn widget always renders - no browser can draw the OS control, including a mobile browser.

## Text scale

`createSystem` reads `config.textScale` (a number, default `1`). `ctx.typeStyle` multiplies `fontSize`, `lineHeight` and `letterSpacing` by the scale clamped to `[1, control.text_scale_max]`; on native the scaled line height is then resolved on the physical pixel grid as before.

The host supplies the scale: `PixelRatio.getFontScale()` on native (re-read on the `Dimensions` change event), `parseFloat(getComputedStyle(document.documentElement).fontSize) / 16` on the web. Because the library applies the scale itself, the context's `ReactNative.Text` and `ReactNative.TextInput` render `allowFontScaling={false}` on native so the OS never scales a second time; a caller's own `allowFontScaling` prop still wins.

## Sample brands

Each template package ships sample brand layers under `brands` (`{ name, light: { tokens }, dark: { tokens } }`, validated against the contract by the template's tests): the default template ships `rounded` and `acme`, the primary template ships `superloom` and `rounded`, the Material template ships `rounded` (a no-op proof there, since its radii are already soft). A host applies the layer matching its scheme's polarity on top of the base and any variants:

```js
Themer.buildTheme(template, [brand[polarity]], 'native', { variant: { form, platform } });
```

## Desktop hosts (untested)

`platform` reserves `macos` and `windows` for Electron and other desktop hosts, resolved from a host-supplied hint. No desktop gate runs: desktop rendering is the web rendering at `expanded`, which is what the web gates prove. Templates ship no desktop variants.
