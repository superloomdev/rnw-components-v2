// Info: EmptyState molecule. A title, optional subtitle, an `sm`
// `tertiary` action button and a learn-more link under an optional
// illustration. Composition: Heading, Button, Link, the host image.
import SPEC from './spec.empty-state.js';

export default function EmptyState (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Image, Text, View } = ctx.ReactNative;

  function EmptyStateComponent (props) {
    const small = props.size === 'sm';
    const gap = function (name) {
      return ctx.metric('EmptyState', name);
    };
    const illustration = props.illustration
      ? React.createElement(View, { dataSet: { part: 'illustration' }, style: { height: gap(small ? 'illustrationSizeSmall' : 'illustrationSize'), width: gap(small ? 'illustrationSizeSmall' : 'illustrationSize') } },
        Utils.isString(props.illustration) ? React.createElement(Image, { accessibilityLabel: props.illustrationAlt || '', source: { uri: props.illustration }, style: { height: '100%', width: '100%' } }) : props.illustration)
      : null;
    const content = React.createElement(View, { dataSet: { part: 'content' }, style: { alignSelf: 'flex-start' } },
      Utils.isString(props.title) ? React.createElement(Text, { dataSet: { part: 'header' }, style: [{ color: ctx.color('empty_state_title'), marginBottom: gap('titleGap'), textAlign: 'left' }, ctx.typeStyle(small ? 'empty_state_title_small' : 'empty_state_title')] }, props.title) : null,
      Utils.isString(props.subtitle) ? React.createElement(Text, { dataSet: { part: 'subtitle' }, style: [{ color: ctx.color('empty_state_subtitle'), marginBottom: gap('subtitleGap'), textAlign: 'left' }, ctx.typeStyle(small ? 'empty_state_subtitle_small' : 'empty_state_subtitle')] }, props.subtitle) : null,
      props.action && Utils.isString(props.action.text) ? React.createElement(View, { dataSet: { part: 'action' }, style: { marginTop: gap('actionGap') } },
        React.createElement(ctx.Registry.Button, { kind: props.action.kind || 'tertiary', label: props.action.text, onPress: props.action.onClick, size: 'sm' })) : null,
      props.link && Utils.isString(props.link.text) ? React.createElement(View, { dataSet: { part: 'link' } }, React.createElement(ctx.Registry.Link, { children: props.link.text, href: props.link.href })) : null);
    return React.createElement(View, {
      dataSet: { part: 'root' },
      style: { flexDirection: props.illustration ? (props.illustrationPosition === 'left' ? 'row' : props.illustrationPosition === 'right' ? 'row-reverse' : props.illustrationPosition === 'bottom' ? 'column-reverse' : 'column') : 'row', gap: gap('illustrationGap') },
      testID: props.testID
    }, illustration, content);
  }

  EmptyStateComponent.displayName = 'EmptyState';
  return EmptyStateComponent;
}
EmptyState.spec = SPEC;
