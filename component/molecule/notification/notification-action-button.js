// Info: NotificationActionButton member. The notification's action: a
// `ctx.Registry.Button` of size `sm` at `control.notification_action_height`,
// re-coloured by the notification cells - inline the ghost action (ink
// `notification_action`, hover `notification_action_container_hover`,
// `notification_action_hover` under lowContrast, focus ring
// `focus_ring_inverse` / `focus`); toast the tertiary-inverse mapping
// (rest transparent with label and 1 px border
// `notification_action_tertiary_inverse`, hover/active fills `_hover` /
// `_active` with label `_text`). It must be composed inside a
// notification.

import SPEC from './spec.notification-action-button.js';


/********************************************************************
NotificationActionButton factory.

@param {Object} ctx - Component context

@return {Function} - The NotificationActionButton component
*********************************************************************/
export default function NotificationActionButton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  NotificationActionButton component.

  @param {Object} props - See `api.notification-action-button.js`

  @return {Object} - React element
  *********************************************************************/
  function NotificationActionButtonComponent (props) {

    // Init the metrics and the two colour maps
    const metrics = {
      height: ctx.metric('NotificationActionButton', 'height')
    };
    const toast = props.variant === 'toast';
    const lowContrast = props.lowContrast === true;
    const recolour = toast ? (lowContrast ? {} : {
      borderLeaf: 'notification_action_tertiary_inverse',
      fillActiveLeaf: 'notification_action_tertiary_inverse_active',
      fillFocusLeaf: 'notification_action_tertiary_inverse',
      fillHoverLeaf: 'notification_action_tertiary_inverse_hover',
      fillLeaf: null,
      labelHoverLeaf: 'notification_action_tertiary_inverse_text',
      labelLeaf: 'notification_action_tertiary_inverse'
    }) : {
      fillHoverLeaf: lowContrast ? 'notification_action_hover' : 'notification_action_container_hover',
      focusRingGap: false,
      labelHoverLeaf: lowContrast ? 'link_primary_hover' : 'notification_action',
      labelLeaf: 'notification_action'
    };

    // Render the seat: the action's margins, the height and the mapped
    // button. Upstream's toast action keeps a block-end margin only
    // (`_actionable-notification.scss:441-442` `margin-block-end: $spacing-05`),
    // the inline ghost keeps `margin: $spacing-03 0` (`:384-390`)
    return React.createElement(View, {
      style: {
        alignSelf: 'flex-start',
        marginBlockEnd: ctx.token(toast ? 'spacing.spacing_05' : 'spacing.spacing_03'),
        marginBlockStart: toast ? 0 : ctx.token('spacing.spacing_03'),
        marginEnd: Utils.isNumber(props.marginEnd) ? props.marginEnd : undefined,
        marginStart: toast ? ctx.token('control.notification_toast_action_inset') : ctx.token('control.notification_action_inset')
      }
    },
    React.createElement(View, {
      'aria-describedby': props['aria-describedby'],
      style: { minHeight: metrics.height }
    },
    React.createElement(ctx.Registry.Button, Object.assign({
      'aria-describedby': props['aria-describedby'],
      borderLeaf: recolour.borderLeaf,
      fill: true,
      focusRingLeaf: toast || !lowContrast ? 'focus_ring_inverse' : 'focus',
      kind: toast ? 'tertiary' : 'ghost',
      onPress: typeof props.onPress === 'function' ? props.onPress : undefined,
      paddingEnd: toast ? ctx.token('spacing.spacing_05') : undefined,
      paddingStart: toast ? ctx.token('spacing.spacing_05') : undefined,
      size: 'sm'
    }, recolour), props.label)));

  }

  NotificationActionButtonComponent.displayName = 'NotificationActionButton';

  return NotificationActionButtonComponent;

}

NotificationActionButton.spec = SPEC;
