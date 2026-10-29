// Info: Callout molecule. A persistent inline message: the actionable
// inline layout - marker, kind glyph, title and subtitle, the ghost
// action - with no close button, no role and no focus trap. The given
// `kind` is drawn as given, including `error` (the upstream deprecation
// only warns). `titleId` names the action through `aria-describedby`.

import SPEC from './spec.callout.js';
import createNotificationParts from './notification-parts.js';


/********************************************************************
Callout factory.

@param {Object} ctx - Component context

@return {Function} - The Callout component
*********************************************************************/
export default function Callout (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const parts = createNotificationParts(ctx);
  const { useA11yId } = ctx.behaviors;


  /********************************************************************
  Callout component.

  @param {Object} props - See `api.callout.js`

  @return {Object} - React element
  *********************************************************************/
  function CalloutComponent (props) {

    // Init the kind and the title id that names the action
    const kind = Utils.inArray(['info', 'success', 'warning', 'error', 'info-square', 'warning-alt'], props.kind) ? props.kind : 'info';
    const generated = useA11yId('callout-title');
    const titleId = Utils.isString(props.titleId) ? props.titleId : generated;
    const lowContrast = props.lowContrast === true;
    const owner = 'Callout';

    // Render the actionable inline band: details, then the ghost action;
    // never a close
    return parts.frame({ kind: kind, lowContrast: lowContrast, owner: owner, testID: props.testID, width: ctx.metric(owner, 'width') }, [
      parts.details({ kind: kind, lowContrast: lowContrast, owner: owner }, [
        parts.icon({ kind: kind, lowContrast: lowContrast, owner: owner }),
        parts.textBlock({ owner: owner }, [
          React.createElement(ctx.ReactNative.View, { key: 'title', nativeID: titleId },
            parts.text({ lowContrast: lowContrast, owner: owner, subtitle: props.subtitle, title: props.title }))
        ])
      ]),
      Utils.isString(props.actionButtonLabel) ? React.createElement(ctx.Registry.NotificationActionButton, {
        'aria-describedby': titleId,
        label: props.actionButtonLabel,
        lowContrast: lowContrast,
        onPress: props.onActionButtonClick,
        variant: 'inline'
      }) : null
    ]);

  }

  CalloutComponent.displayName = 'Callout';

  return CalloutComponent;

}

Callout.spec = SPEC;
