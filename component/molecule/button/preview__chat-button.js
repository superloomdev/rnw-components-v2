// Info: preview__ChatButton molecule. The chat family's pill button: a
// Button drawn with `pill` in the small, medium or large size, or - with
// `isQuickAction` - as a small `quick_action` button that fills while
// `isSelected`. Without an icon its end padding is the button's own start
// padding, as the primary's chat button draws it.
//
// Behavior: none - the Button the wrapper mounts owns the input state.
//
// Accessibility: the mounted Button's; this wrapper passes the label and
// naming props through unchanged.

import SPEC from './spec.preview-chat-button.js';


/********************************************************************
preview__ChatButton factory.

@param {Object} ctx - Component context

@return {Function} - The preview__ChatButton component
*********************************************************************/
export default function ChatButton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;

  // The sizes the chat button keeps; anything else draws the large
  const SIZES = Object.freeze(['sm', 'md', 'lg']);

  // The kinds that take the ghost paddings in the Button, as Button's own
  const INLINE = Object.freeze(['ghost', 'danger_ghost', 'quick_action']);


  /********************************************************************
  preview__ChatButton component.

  @param {Object} props - See `api.preview-chat-button.js`

  @return {Object} - React element
  *********************************************************************/
  function ChatButtonComponent (props) {

    // The quick action forces the quick-action kind and the small size
    const quick = props.isQuickAction === true;
    const kind = quick ? 'quick_action' : props.kind;
    const size = quick ? 'sm' : Utils.inArray(SIZES, props.size) ? props.size : 'lg';

    // An icon-free chat button ends with the start padding, not the slot
    // the trailing icon reserves
    const paddingEnd = Utils.isString(props.icon) ? undefined
      : ctx.metric('preview__ChatButton', Utils.inArray(INLINE, kind) ? 'inlineStartPadding' : 'startPadding');

    return React.createElement(ctx.Registry.Button, Object.assign({}, props, {
      kind: kind,
      paddingEnd: paddingEnd,
      pill: true,
      selected: props.isSelected === true,
      size: size
    }));

  }

  ChatButtonComponent.displayName = 'preview__ChatButton';

  return ChatButtonComponent;

}

ChatButton.spec = SPEC;
