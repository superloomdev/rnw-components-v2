// Info: EmptyState molecule. A title, optional subtitle, an `sm`
// `tertiary` action button and a learn-more link under an optional
// illustration. Composition: Heading, Button, Link, the host image.
//
// Layout (`_empty-state.scss`): the root is a flex row whose direction the
// illustration position sets (top column, right row-reverse, bottom
// column-reverse, left row); the illustration keeps its bottom margin in
// every position, the action button its bottom margin before the link.
import SPEC from './spec.empty-state.js';

export default function EmptyState (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Image, Text, View } = ctx.ReactNative;
  const DIRECTIONS = Object.freeze({ top: 'column', right: 'row-reverse', bottom: 'column-reverse', left: 'row' });

  function EmptyStateComponent (props) {
    const small = props.size === 'sm';
    const gap = function (name) {
      return ctx.metric('EmptyState', name);
    };
    const illustration = props.illustration
      ? React.createElement(View, { dataSet: { part: 'illustration' }, style: { height: gap(small ? 'illustrationSizeSmall' : 'illustrationSize'), marginBottom: gap('illustrationGap'), width: gap(small ? 'illustrationSizeSmall' : 'illustrationSize') } },
        Utils.isString(props.illustration) ? React.createElement(Image, { accessibilityLabel: props.illustrationAlt || '', source: { uri: props.illustration }, style: { height: '100%', width: '100%' } }) : props.illustration)
      : null;
    // The action button is a block with its bottom margin; the link sits
    // under it at its own width (`__action-button`, `__link` inline-block)
    const content = React.createElement(View, { dataSet: { part: 'content' }, style: { flexShrink: 1 } },
      Utils.isString(props.title) ? React.createElement(Text, { dataSet: { part: 'header' }, style: [{ color: ctx.color('empty_state_title'), paddingBottom: gap('titleGap'), textAlign: 'left' }, ctx.typeStyle(small ? 'empty_state_title_small' : 'empty_state_title')] }, props.title) : null,
      Utils.isString(props.subtitle) ? React.createElement(Text, { dataSet: { part: 'subtitle' }, style: [{ color: ctx.color('empty_state_subtitle'), paddingBottom: gap('subtitleGap'), textAlign: 'left' }, ctx.typeStyle(small ? 'empty_state_subtitle_small' : 'empty_state_subtitle')] }, props.subtitle) : null,
      props.action && Utils.isString(props.action.text) ? React.createElement(View, { dataSet: { part: 'action' }, style: { alignSelf: 'flex-start', flexDirection: 'row', marginBottom: gap('actionGap') } },
        React.createElement(ctx.Registry.Button, { children: props.action.text, kind: props.action.kind || 'tertiary', onPress: props.action.onClick, pressFloor: true, size: 'sm' })) : null,
      props.link && Utils.isString(props.link.text) ? React.createElement(View, { dataSet: { part: 'link' }, style: { alignSelf: 'flex-start' } }, React.createElement(ctx.Registry.Link, { children: props.link.text, href: props.link.href })) : null);
    return React.createElement(View, {
      dataSet: { part: 'root' },
      style: { flexDirection: props.illustration ? (DIRECTIONS[props.illustrationPosition] || 'column') : 'row' },
      testID: props.testID
    }, illustration, content);
  }

  EmptyStateComponent.displayName = 'EmptyState';
  return EmptyStateComponent;
}
EmptyState.spec = SPEC;
