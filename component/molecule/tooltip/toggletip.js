// Info: Toggletip molecule. A field label with an information button that
// toggles an inverse bubble of text and up to two actions: a Popover on the
// `tooltip` cells with the caret, no shadow and the `toggletip` offset.
// Escape closes and returns focus to the button; an outside press and a blur
// leaving the toggletip close it. `defaultOpen` opens it initially; the open
// state is otherwise its own.

import SPEC from './spec.toggletip.js';


/********************************************************************
Toggletip factory.

@param {Object} ctx - Component context

@return {Function} - The Toggletip component
*********************************************************************/
export default function Toggletip (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useEscapeKey, useA11yId } = ctx.behaviors;


  /********************************************************************
  Toggletip component.

  @param {Object} props - See `api.toggletip.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggletipComponent (props) {

    const [open, setOpen] = React.useState(props.defaultOpen === true);
    const bubbleId = useA11yId('sl-toggletip');
    const rootRef = React.useRef(null);

    // The trigger holds DOM focus the way upstream's HTMLButtonElement
    // does: a press opens and focuses it, Escape refocuses it
    const focusButton = function () {
      if (rootRef.current !== null && typeof rootRef.current.querySelector === 'function') {
        const button = rootRef.current.querySelector('button');
        if (button !== null) {
          button.focus();
        }
      }
    };
    // Escape returns focus to the button; blur leaving the toggletip closes
    const close = function (refocus) {
      setOpen(false);
      if (refocus === true) {
        focusButton();
      }
    };
    useEscapeKey(function () {
      close(true);
    }, open === true);

    // The label and the button sit on one row; the button is the popover's
    // anchor and reports `aria-expanded` at the bubble it controls
    const trigger = React.createElement(ctx.Registry.ToggletipButton, {
      controls: bubbleId,
      expanded: open === true,
      label: Utils.isString(props.buttonLabel) ? props.buttonLabel : 'Show information',
      onPress: function () {
        setOpen(open !== true);
        if (open !== true) {
          focusButton();
        }
      }
    });

    const actions = Array.isArray(props.actions) ? props.actions.slice(0, 2) : [];
    const content = React.createElement(ctx.Registry.ToggletipContent, { id: bubbleId },
      props.content,
      Utils.isEmptyArray(actions) ? null : React.createElement(ctx.Registry.ToggletipActions, { actions: actions }));

    return React.createElement(View, {
      onBlur: function (event) {
        // A blur whose related target stays inside does not close it
        const next = event && event.relatedTarget;
        const root = rootRef.current;
        if (root !== null && typeof root.contains === 'function' && next !== null && root.contains(next)) {
          return;
        }
        close(false);
      },
      ref: rootRef,
      style: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
      testID: props.testID
    },
    Utils.isString(props.label) ? React.createElement(ctx.Registry.ToggletipLabel, null, props.label) : null,
    React.createElement(ctx.Registry.Popover, {
      align: Utils.isString(props.align) ? props.align : 'bottom',
      autoAlign: props.autoAlign === true,
      caret: true,
      content: content,
      dropShadow: false,
      highContrast: true,
      offset: ctx.metric('Toggletip', 'offset'),
      onRequestClose: function () {
        close(false);
      },
      open: open === true
    },
    trigger));

  }

  ToggletipComponent.displayName = 'Toggletip';

  return ToggletipComponent;

}

Toggletip.spec = SPEC;
