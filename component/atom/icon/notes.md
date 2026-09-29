# Icon

The one icon-aware component. A caller names a glyph semantically (`name: 'close'`); the theme carries the path data as the token `icon.close`, so the same `Icon` renders one set under one template and another set under the next, and a brand layer can override any single glyph.

## Decisions (roster flags `no_reference`, `superloom_decision`)

- **No upstream reference.** Icon sets are data, not components, in both reference systems; there is nothing to measure against. The gates for this row are structural, accessibility and cross-template consistency.
- **Size picks the glyph.** When the set draws its own glyph at the requested size (`sizes['16']`), that glyph is used with its own viewBox; otherwise the base glyph scales through its viewBox. Nothing is ever substituted from another set.
- **Decorative by default.** Without `accessibilityLabel` the icon is hidden from assistive technology; with one it is an image with that name. A component that pairs an icon with visible text passes no label.
- **Renderer.** `react-native-svg` on every platform, injected as `shared_libs.Svg`. On web the host bundler resolves its `.web.js` build; nothing is aliased by the library.

## Platform

Both. No fallback needed: `react-native-svg` draws on iOS, Android and web.
