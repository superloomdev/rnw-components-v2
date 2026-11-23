// Info: Content composite. The page's `main` landmark beside the UI shell:
// `control.content_padding` on every side, a string child drawn in
// `type.body01` and `color.content_label`. Upstream offsets it under its
// fixed header and beside its side navigation; ours lays the shell out in
// flow, so the region needs no offset.

import SPEC from './spec.content.js';


/********************************************************************
Content factory.

@param {Object} ctx - Component context

@return {Function} - The Content component
*********************************************************************/
export default function Content (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  Content component.

  @param {Object} props - See `api.content.js`

  @return {Object} - React element
  *********************************************************************/
  function ContentComponent (props) {

    return React.createElement(View, {
      'aria-label': props.accessibilityLabel,
      role: 'main',
      testID: props.testID,
      style: { padding: ctx.metric('Content', 'padding') }
    }, Utils.isString(props.children)
      ? React.createElement(Text, { dir: 'auto', style: [ctx.typeStyle('body01'), { color: ctx.color('content_label') }] }, props.children)
      : props.children);

  }

  ContentComponent.displayName = 'Content';

  return ContentComponent;

}

Content.spec = SPEC;
