// Info: Tearsheet measurement reference. The upstream wide tearsheet is a
// `.c4p--tearsheet` layer whose `.c4p--tearsheet__container` holds the
// header (label, heading, description, optional navigation), the close
// IconButton, the body (influencer, main, content) and the action set.
// `isolate: true`: upstream shares one module-level stack across every
// open tearsheet on the page, so the reference renders one state at a
// time (the gates open it per state through `&state=`).

const PCT = '%';

function Stage (props) {
  const React = props.React;
  const node = React.useState(null);
  const setNode = node[1];
  return React.createElement('div', { ref: setNode, style: { height: 100 + PCT, transform: 'scale(1)', width: 100 + PCT } },
    React.createElement('style', null, '.cds--modal { position: absolute !important; inset: 0 !important; inline-size: 100% !important; block-size: 100% !important; width: 100% !important; height: 100% !important; }'),
    node[0] === null ? null : React.createElement(props.upstream.Tearsheet, Object.assign({}, props.tearsheet, { open: true, portalTarget: node[0] })));
}

function buildTearsheetProps (React, upstream, props) {
  const text = function (value) {
    return React.createElement('div', { style: upstream.fixtureTextStyle('bodyCompact01') }, value);
  };
  return {
    actions: props.actions === undefined ? undefined : props.actions.map(function (action) {
      return { key: action.label, kind: action.kind, label: action.label, onClick: function () {} };
    }),
    children: text(props.children),
    closeIconDescription: 'Close',
    description: props.description,
    influencer: props.influencer === undefined ? undefined : text(props.influencer),
    influencerPosition: props.influencerPosition,
    influencerWidth: props.influencerWidth,
    label: props.label,
    navigation: props.navigation === undefined ? undefined : text(props.navigation),
    onClose: function () {
      return false;
    },
    title: props.title,
    verticalPosition: props.verticalPosition
  };
}

export default Object.freeze({
  kind: 'render-web',
  isolate: true,
  interactions: Object.freeze([]),
  mount: function (React, upstream, props) {
    return React.createElement(Stage, { React: React, upstream: upstream, tearsheet: buildTearsheetProps(React, upstream, props) });
  },
  target: Object.freeze({ upstream: '.c4p--tearsheet .cds--modal-close', ours: '[data-part="close"] [role="button"]' }),
  body: Object.freeze({ width: 1280, height: 720, stage: true }),
  // Below md the wide container spans the layer, the description takes
  // the whole row and the influencer its own width, read from the window
  // (`Tearsheet/_tearsheet.scss:298-302,392-394,469-477`): the narrow set
  // draws a 320 body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  oursHosted: true,
  parts: Object.freeze({
    scrim: Object.freeze({ upstream: '.c4p--tearsheet', pseudo: '::before', ours: '[data-part="scrim"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] }),
    container: Object.freeze({ upstream: '.c4p--tearsheet__container', ours: '[data-part="container"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor', 'borderTopWidth', 'borderTopColor'] }),
    header: Object.freeze({ upstream: '.c4p--tearsheet__header', ours: '[data-part="header"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'minHeight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'backgroundColor', 'borderBottomWidth', 'borderBottomColor'] }),
    label: Object.freeze({ upstream: '.c4p--tearsheet__header .cds--modal-header__label', ours: '[data-part="label"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'marginBottom', 'color', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight'] }),
    heading: Object.freeze({ upstream: '.c4p--tearsheet__heading', ours: '[data-part="heading"] [dir="auto"]', measure: 'text' }),
    description: Object.freeze({ upstream: '.c4p--tearsheet__header-description', ours: '[data-part="description"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'marginTop', 'maxWidth', 'color', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight'] }),
    navigation: Object.freeze({ upstream: '.c4p--tearsheet__header-navigation', ours: '[data-part="navigation"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'marginTop'] }),
    close: Object.freeze({ upstream: '.c4p--tearsheet .cds--modal-close', ours: '[data-part="close"] [role="button"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    closeIcon: Object.freeze({ upstream: '.c4p--tearsheet .cds--modal-close__icon', ours: '[data-part="close"] svg', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    body: Object.freeze({ upstream: '.c4p--tearsheet__body', ours: '[data-part="tearsheetBody"]', measure: 'box' }),
    influencer: Object.freeze({ upstream: '.c4p--tearsheet__influencer', ours: '[data-part="influencer"]', measure: 'box', optional: true, compare: ['width', 'backgroundColor', 'borderRightWidth', 'borderRightColor', 'borderLeftWidth', 'borderLeftColor'] }),
    // Upstream's main is the content's grid row, the button container the
    // next row (`_tearsheet.scss:491-498,552-555`); ours holds both, so its
    // height is the body's, which `body` compares
    main: Object.freeze({ upstream: '.c4p--tearsheet__main', ours: '[data-part="main"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'backgroundColor'], except: ['height'] }),
    content: Object.freeze({ upstream: '.c4p--tearsheet__content', ours: '[data-part="content"]', measure: 'box', optional: true }),
    buttonContainer: Object.freeze({ upstream: '.c4p--tearsheet__button-container', ours: '[data-part="buttonContainer"]', measure: 'box', optional: true }),
    buttonSet: Object.freeze({ upstream: '.c4p--tearsheet__buttons', ours: '[data-part="buttonSet"]', measure: 'box', optional: true, compare: ['backgroundColor', 'borderTopWidth', 'borderTopColor'] }),
    buttons: Object.freeze({ upstream: '.c4p--tearsheet__buttons .cds--btn', all: true, ours: '[data-part="buttonSet"] [role="button"]', measure: 'box', optional: true, compare: ['width', 'height', 'paddingTop', 'paddingBottom'] })
  })
});
