# ROBOTS.md - behaviors

Headless interaction hooks and accessibility translators. No appearance: no color, size, radius, border, font, token read or vendor name; no `react`/`react-native` import; no platform read. A component composes behaviors by name and consumes `state`; it never recomputes it.

## Composer

`createBehaviors({ React, ReactNative, Utils, platform })` -> frozen map of every name below. `platform` comes from `component/platform.js` (`{ os, isNative, split }`). Missing dependency throws `TypeError`.

## Convention

- A stateful hook returns `{ ...propGetters, state }` and publishes `Hook.stateKeys`; the rendered `state` has exactly those keys (tested).
- Everything beside `state` is a prop getter (`rootProps`, `inputProps`, `getItemProps(i)`), a handler, or a props object.
- Optional callbacks and injected sources are duck-typed (`typeof x.fn === 'function'`); type guards use `Utils.isString`/`isNumber`/`isNullOrUndefined`.
- Press timing is behavior: `delayPressIn: 0` is set once in `controls.js`.

## Controls (`controls.js`)

- `useTextField({ value, onChangeText, label, invalid, disabled, onFocus, onBlur })` -> `{ rootProps, inputProps, labelProps, state }` | state: `focused, hovered, disabled, invalid, populated`
- `useButton({ children, disabled, selected, onPress, accessibilityLabel })` -> `{ rootProps, state }` | state: `focused, hovered, pressed, disabled, selected`
- `useCheckbox({ checked, indeterminate, disabled, label, onChange })` -> `{ rootProps, inputProps, labelProps, state }` | state: `checked, indeterminate, focused, hovered, pressed, disabled` (`rootProps.onKeyDown` toggles on Space, which the web press responder does not)
- `useSelect({ items, value, disabled, label, onChange })` -> `{ rootProps, triggerProps, listProps, labelProps, getOptionProps(i), state }` | state: `open, focused, disabled, selectedIndex, highlightedIndex`

## Local state (`local.js`, `state.js`)

- `useDisclosure({ open, defaultOpen, disabled, onOpenChange })` -> `{ open(), close(), toggle(), state }` | state: `open, disabled`
- `useFocusState({ disabled, onFocus, onBlur })` -> `{ focusProps, state }` | state: `focused, disabled`
- `useInteractionState({ disabled, onPress, onPressIn, onPressOut, onHoverIn, onHoverOut, onFocus, onBlur })` -> `{ rootProps, state }` | state: `focused, hovered, pressed, disabled`
- `useTimedFlag({ duration })` -> `{ activate(), clear(), state }` | state: `active`
- `useReducedMotion(source?)` -> `{ state }` | state: `reducedMotion` (query hook, no getters)
- `useLiveRegionHost(source?)` -> `{ announce(message, politeness), state }` | state: `isWeb, politeMessage, assertiveMessage, politeRevision, assertiveRevision`
- `useFormSubmit({ onSubmit })` -> `{ formProps, state }` | state: none
- `useResponsiveStack({ enabled, itemCount, minItemWidth, forced })` -> `{ onLayout, state }` | state: `stacked`
- `useControllableState({ value, defaultValue, onChange })` -> `[value, setValue]` (stateless by contract: a primitive, not a behavior surface)
- `useAccordionItemState({ open, defaultOpen, disabled, onHeadingClick })` -> `{ toggle(event), state }` | state: `open, disabled`
- `useTabsState({ defaultSelectedIndex, selectedIndex, onChange })` -> `{ setActiveIndex, setSelectedIndex, state }` | state: `activeIndex, selectedIndex`

## Keyboard, press, focus (`keyboard.js`, `press.js`, `roving.js`, `focus.js`)

- `useEscapeKey(onEscape, active = true, source?)` -> `undefined` (effect only)
- `usePressKeys({ role, onActivate, disabled })` -> `{ onKeyDown }` (Enter, and Space gated by role, activate on web)
- `useRovingTabIndex({ count, orientation, loop, onActiveIndexChange })` -> `{ getItemProps(i), containerProps }`
- `useFocusTrap({ isOpen, active, trap, onClose, initialFocusRef, finalFocusRef })` -> `{ containerRef, onOutsidePress, accessibilityProps }`

## Overlay and positioning (`overlay.js`, `positioning.js`, `menu.js`)

- `OverlayContext`; `useOverlayHost()` -> `{ contextValue, layers }`; `useOverlay({ isOpen, onRequestClose })` -> `{ hosted, layerId, isTopmost }`
- `getAnchoredPosition(rect, placement, offset, viewport)` -> `{ top, left, placement }`; `useAnchoredPosition({ anchor, placement, offset, alignmentAxisOffset, source })` -> `{ position, actualPlacement, measure }`; `usePopoverDismiss({ onDismiss })` -> `{ rootProps }`
- `getMenuPosition({ x, y, width, height, viewport })` -> `{ top, left }`; `useMenuPosition({ ... })` -> `{ position, measure }`; `useMenuCollection({ ... })` -> `{ registerItem, enableIcons, enableSelectableItems, focusItem, containerProps, state }` | state: `hasIcons, hasSelectableItems, items`

## Pickers (`pickers.js`)

- `useDatePickerCalendar({ value, open, getNow, onSelect })` -> `{ previousMonth(), nextMonth(), selectDay(day), state }` | state: `viewYear, viewMonth, daysInMonth, firstDayOfWeek, selectedDay`
- `useTimePickerDraft({ value, open, onConfirm })` -> `{ selectHour(h), selectMinute(m), confirm(), state }` | state: `hour, minute`

## Accessibility (`a11y.js`, `heading.js`, `compound.js`)

- `getA11yState({ checked, disabled, expanded, selected, invalid, required, readonly, busy, pressed, current, hidden, modal })`, `getA11yValue({ min, max, now, text })`, `getA11yRelation({ controls, describedby, labelledby, owns, activedescendant })`, `getA11yPosition({ colspan, posinset, setsize, level })`, `getA11yLive({ live, atomic })` -> `aria-*` props; only `null`/`undefined` are omitted
- `useA11yId(prefix = 'sl')` -> `String` (React `useId`, hydration-safe)
- `HeadingLevelContext`, `HeadingLevelProvider({ level, children })`, `useHeadingLevel()` -> `Number`, `useSectionLevel(override?)` -> `Number`
- `createCompoundContext(displayName)` -> `{ Provider, useCompound }`

## Utilities (`utilities.js`)

- `isLabelMatch(query, label)` -> `Boolean`; `isRtl(config?)` -> `Boolean`; `getProgressValue(value, min, max)` -> `Number | undefined` (throws `TypeError` on a bad range); `getSafeAreaInsets(source?)` -> `{ top, bottom, left, right }` (zero insets where the host reports none)
