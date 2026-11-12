# Card family

A productive card with a header, a body and actions in its header or
footer. The product-patterns `ProductiveCard` is the upstream.

## Decisions

Action icons are ghost `IconButton`s (sm at the top, md at the bottom),
not raw `__icon` seats; the overflow is an `OverflowMenu`. The footer
renders only when there are bottom actions or a button. `clickZone:
'one'` puts the role, the tab stop and key handling on the root.

U2 repair (upstream quoted): the footer holds the ghost md buttons,
secondary then primary, then the actions, spread apart when a button is
present and at the end otherwise (`CardFooter.js:28-42`,
`_productive-card.scss` `__footer`). The header pads every side but the end
and its row pads the end by `control.card_actions_space` (8) when it holds
actions (`_card.scss:64-66,137-139`); the header actions lift by
`control.card_actions_offset` (4) unless a label or a large title sits
beside them (`__actions-header`). Productive icons are icon-only ghost
buttons, so the actions row adds no padding (probe: `icons[0].paddingLeft`
ABSENT). The reference passes `actionsPlacement: 'bottom'` by default as the
probe mount does (`ProductiveCard.js:15` defaults to `top`). The clickable
background turns to the hover cell on hover only (probe: clickable/hover
reads `color.card_container_hover`). The footer Buttons take their label as `children` (it was
passed as `label` and drew an empty face).

Deviation, platform-forced: upstream puts `role="button"` on a `div` that can
hold the action buttons (`Card.js:29-34,166`). react-native-web draws every
button role as a `<button>` and a `<button>` may not hold another, so a
clickable card that holds controls takes the `group` role with the same
press, keys and ring; one without controls is a `button`. The body part is
`data-part="content"`: the harness owns `body`.

## Platform

`platform.support` is `both`.
