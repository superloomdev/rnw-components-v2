// Info: ComposedModal measurement reference. The upstream composed modal
// is a fixed `.cds--modal` layer whose `.cds--modal-container` holds the
// header (eyebrow label, heading, the close IconButton), the
// `.cds--modal-content` body and a `.cds--modal-footer` of stretched
// buttons; `passive` drops the footer. The parts compared are the scrim,
// the container, the header block, the heading, the body, the close
// button, the footer and its buttons.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus']),
  mount: function (React, upstream, props) {
    const footer = props.footer === undefined ? null : React.createElement(upstream.ModalFooter, {
      danger: props.danger === true,
      primaryButtonText: props.footer.primaryButtonText,
      secondaryButtonText: props.footer.secondaryButtonText,
      secondaryButtons: props.footer.secondaryButtons
    });
    // A transformed wrapper makes `.cds--modal`'s fixed layer the cell's own
    // containing block; the injected rule demotes it to absolute and pins
    // its size to the cell - upstream sizes it `100vw` x `100vh`, which
    // would keep covering every other cell and intercepting their close
    return React.createElement('div', { style: { height: '100%', transform: 'scale(1)', width: '100%' } },
      React.createElement('style', null, '.cds--modal { position: absolute !important; inset: 0 !important; inline-size: 100% !important; block-size: 100% !important; width: 100% !important; height: 100% !important; }'),
      React.createElement(upstream.ComposedModal, {
        danger: props.danger === true,
        onClose: function () {
          return false;
        },
        open: true,
        preventCloseOnClickOutside: true,
        size: props.size
      },
      React.createElement(upstream.ModalHeader, { label: 'Account', title: 'Confirm the change' }),
      React.createElement(upstream.ModalBody, { hasScrollingContent: props.body !== undefined && props.body.hasScrollingContent === true },
        React.createElement('p', null, props.children)),
      footer));
  },
  // The element a person interacts with: the close button
  target: Object.freeze({ upstream: '.cds--modal-close', ours: '[data-testid="composed-modal-scrim"] [role="button"]' }),
  // The fixed scrim mounts inside its cell: the body stages it, matching
  // the sample's frame
  body: Object.freeze({ width: 640, height: 400, stage: true }),
  parts: Object.freeze({
    scrim: Object.freeze({ upstream: '.cds--modal', ours: '[data-testid="composed-modal-scrim"]', measure: 'box', compare: ['backgroundColor'] }),
    container: Object.freeze({ upstream: '.cds--modal-container', ours: '[role="dialog"]', measure: 'box', compare: ['width', 'backgroundColor', 'borderTopWidth', 'borderTopColor', 'borderRadius', 'boxShadow'] }),
    header: Object.freeze({ upstream: '.cds--modal-header', ours: '[role="dialog"] > div:first-child', measure: 'box', compare: ['paddingTop', 'paddingLeft'] }),
    label: Object.freeze({ upstream: '.cds--modal-header__label', ours: '[role="dialog"] > div:first-child [dir="auto"]:first-child', measure: 'text', optional: true }),
    heading: Object.freeze({ upstream: '.cds--modal-header__heading', ours: '[role="dialog"] > div:first-child [dir="auto"]:last-child', measure: 'text' }),
    close: Object.freeze({ upstream: '.cds--modal-close svg', ours: '[role="dialog"] svg', measure: 'box', optional: true, compare: ['width', 'height'] }),
    content: Object.freeze({ upstream: '.cds--modal-content', ours: '[data-part="modalBody"]', measure: 'box', compare: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] }),
    footer: Object.freeze({ upstream: '.cds--modal-footer', ours: '[data-part="modalFooter"]', measure: 'box', optional: true, compare: ['height'] }),
    action: Object.freeze({ upstream: '.cds--modal-footer .cds--btn', ours: '[data-part="modalFooter"] [role="button"]', measure: 'box', optional: true, compare: ['width', 'height', 'backgroundColor', 'paddingTop', 'paddingBottom'] })
  })
});
