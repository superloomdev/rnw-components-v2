// Info: Modal measurement reference. The upstream modal is a fixed
// `.cds--modal` layer whose `.cds--modal-container` holds the header
// (eyebrow label, heading, the close IconButton), the `.cds--modal-content`
// body and a `.cds--modal-footer` of stretched buttons. `passiveModal`
// drops the footer. The parts compared are the scrim, the container, the
// heading, the body, the close button and an action. The second reference
// was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  mount: function (React, upstream, props) {
    const actions = Array.isArray(props.actions) ? props.actions : [];
    const last = actions.length - 1;
    // A transformed wrapper makes `.cds--modal`'s fixed layer the cell's own
    // containing block; the injected rule demotes it to absolute and pins
    // its size to the cell - upstream sizes it `100vw` x `100vh`, which
    // would keep covering every other cell and intercepting their close
    // Our own cell renders the modal hosted so `useLayerSpace` reads the
    // same cell box this pins the upstream layer to (`oursHosted` below);
    // the measure page opens unhosted, so without it ours would keep a
    // viewport-relative layer and measure double
    return React.createElement('div', { style: { height: '100%', transform: 'scale(1)', width: '100%' } },
      React.createElement('style', null, '.cds--modal { position: absolute !important; inset: 0 !important; inline-size: 100% !important; block-size: 100% !important; width: 100% !important; height: 100% !important; }'),
      React.createElement(upstream.Modal, {
        modalHeading: props.title,
        modalLabel: props.label,
        onRequestClose: function () {
          return undefined;
        },
        open: props.open,
        passiveModal: props.passive === true,
        primaryButtonText: last >= 0 ? actions[last].label : undefined,
        secondaryButtonText: actions.length > 1 ? actions[0].label : undefined,
        size: props.size
      }, props.children));
  },
  // The element a person focuses first: the dialog container itself
  target: Object.freeze({ upstream: '.cds--modal-container', ours: '[role="dialog"], [role="alertdialog"]' }),
  // The fixed scrim mounts inside its cell: the body stages it, matching
  // the sample's frame
  body: Object.freeze({ width: 640, height: 400, stage: true }),
  oursHosted: true,
  parts: Object.freeze({
    scrim: Object.freeze({ upstream: '.cds--modal', ours: '[data-testid="modal-scrim"]', measure: 'box', compare: ['backgroundColor'] }),
    container: Object.freeze({ upstream: '.cds--modal-container', ours: '[role="dialog"], [role="alertdialog"]', measure: 'box', compare: ['width', 'backgroundColor', 'borderWidth', 'borderColor', 'borderRadius', 'boxShadow'] }),
    heading: Object.freeze({ upstream: '.cds--modal-header__heading', ours: '[role="dialog"] > div:first-child > [dir="auto"]:last-child', measure: 'text' }),
    label: Object.freeze({ upstream: '.cds--modal-header__label', ours: '[role="dialog"] > div:first-child > [dir="auto"]:first-child', measure: 'text', optional: true }),
    body: Object.freeze({ upstream: '.cds--modal-content', ours: '[data-part="modalBody"]', measure: 'box', compare: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] }),
    close: Object.freeze({ upstream: '.cds--modal-close svg', ours: '[role="dialog"] svg', measure: 'box', optional: true, compare: ['width', 'height'] }),
    action: Object.freeze({ upstream: '.cds--modal-footer .cds--btn', ours: '[data-part="modalFooter"] [role="button"]', measure: 'box', compare: ['height', 'backgroundColor'] })
  })
});
