// Info: Modal measurement reference. The upstream modal is a fixed
// `.cds--modal` layer whose `.cds--modal-container` holds the header
// (eyebrow label, heading, the close IconButton), the `.cds--modal-content`
// body and a `.cds--modal-footer` of stretched buttons. `passiveModal`
// drops the footer. The parts compared are the scrim, the container, the
// heading, the body, the close button and an action. The second reference
// is `md-dialog`: a fixed `dialog` of `.scrim`, `.container` (painted on its
// `::before`), `.headline`, `.content` and `.actions`, with the spacing on
// the slotted children; it has no eyebrow label and no close button, so
// those are omitted there.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  mount: function (React, upstream, props) {
    const actions = Array.isArray(props.actions) ? props.actions : [];
    const last = actions.length - 1;
    return React.createElement(upstream.Modal, {
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
    }, props.children);
  },
  // The element a person focuses first: the dialog container itself
  target: Object.freeze({ upstream: '.cds--modal-container', ours: '[role="dialog"], [role="alertdialog"]' }),
  // The fixed scrim mounts inside its cell: the body stages it, matching
  // the sample's frame
  body: Object.freeze({ width: 640, height: 400, stage: true }),
  parts: Object.freeze({
    scrim: Object.freeze({ upstream: '.cds--modal', ours: '[data-testid="modal-scrim"]', measure: 'box', compare: ['backgroundColor'] }),
    container: Object.freeze({ upstream: '.cds--modal-container', ours: '[role="dialog"], [role="alertdialog"]', measure: 'box', compare: ['width', 'backgroundColor', 'borderWidth', 'borderColor', 'borderRadius', 'boxShadow'] }),
    heading: Object.freeze({ upstream: '.cds--modal-header__heading', ours: '[role="dialog"] > div:first-child > [dir="auto"]:last-child', measure: 'text' }),
    label: Object.freeze({ upstream: '.cds--modal-header__label', ours: '[role="dialog"] > div:first-child > [dir="auto"]:first-child', measure: 'text', optional: true }),
    body: Object.freeze({ upstream: '.cds--modal-content', ours: '[role="dialog"] > div:nth-of-type(2)', measure: 'box', compare: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] }),
    close: Object.freeze({ upstream: '.cds--modal-close svg', ours: '[role="dialog"] svg', measure: 'box', optional: true, compare: ['width', 'height'] }),
    action: Object.freeze({ upstream: '.cds--modal-footer .cds--btn', ours: '[data-testid="modal-actions"] [role="button"]', measure: 'box', compare: ['height', 'backgroundColor'] })
  }),
  second: Object.freeze({
    mount: function (React, upstream, props) {
      const actions = Array.isArray(props.actions) ? props.actions : [];
      const last = actions.length - 1;
      // The page's own stylesheet suppresses the `::slotted` spacing the
      // upstream dialog's slots ask for; the mount restores it inline so the
      // reference draws the layout the upstream intends
      return React.createElement('md-dialog', {
        open: props.open === true ? true : undefined,
        // The upstream dialog mounts to the top layer, centered on the
        // viewport, so every state's dialog would stack on the same spot;
        // the exhibit recenters each one on its own cell's body
        ref: function (element) {
          if (element !== null) {
            window.requestAnimationFrame(function () {
              const dialog = element.shadowRoot && element.shadowRoot.querySelector('dialog');
              const body = element.closest('.cell-body');
              if (dialog !== null && body !== null) {
                const bodyBox = body.getBoundingClientRect();
                const dialogBox = dialog.getBoundingClientRect();
                dialog.style.translate = String(bodyBox.x + bodyBox.width / 2 - (dialogBox.x + dialogBox.width / 2)) + 'px ' +
                  String(bodyBox.y + bodyBox.height / 2 - (dialogBox.y + dialogBox.height / 2)) + 'px';
              }
            });
          }
        }
      },
      React.createElement('div', { slot: 'headline', style: { paddingInline: 24, paddingTop: 24 } }, props.title),
      React.createElement('div', { slot: 'content', style: Object.assign({ letterSpacing: 0.25, padding: 24 }, last >= 0 ? { paddingBottom: 8 } : {}) }, props.children),
      actions.length < 1 ? null : React.createElement('div', { slot: 'actions', style: { display: 'flex', gap: 8, justifyContent: 'flex-end', letterSpacing: 0.1, paddingTop: 16, paddingInline: 24, paddingBottom: 24 } },
        actions.map(function (action, index) {
          return React.createElement('md-text-button', { key: index }, action.label);
        })));
    },
    // The fixed dialog mounts inside its cell: the body stages it, matching
    // the sample's frame
    body: Object.freeze({ width: 640, height: 400, stage: true }),
    // The upstream dialog mounts to the top layer, where it sits centered on
    // the viewport rather than inside the stage; the surface is the origin so
    // positions and pixels compare inside the dialog itself
    origin: 'surface',
    // The scrim covers a different region on each side (a top-layered
    // element's containing block against the stage), so the pixels compare
    // on the origin part's own shot rather than the cell's
    originPixels: true,
    parts: Object.freeze({
      // The upstream dialog mounts to the top layer, so its scrim's sampled
      // pixel reads a different backdrop than the stage-contained one here;
      // the scrim's own color is still compared
      scrim: Object.freeze({ upstream: 'md-dialog >>> .scrim', ours: '[data-testid="modal-scrim"]', measure: 'box', compare: ['backgroundColor'], except: ['x', 'y', 'paint'] }),
      container: Object.freeze({ upstream: 'md-dialog >>> dialog', ours: '[role="dialog"], [role="alertdialog"]', measure: 'box', compare: ['width', 'minWidth', 'maxWidth'] }),
      surface: Object.freeze({ upstream: 'md-dialog >>> .container', pseudo: '::before', ours: '[role="dialog"], [role="alertdialog"]', measure: 'box', compare: ['backgroundColor', 'borderRadius', 'boxShadow'] }),
      heading: Object.freeze({ upstream: '[slot="headline"]', ours: '[role="dialog"] > div:first-child > [dir="auto"]:last-child', measure: 'text' }),
      body: Object.freeze({ upstream: 'md-dialog >>> .content', ours: '[role="dialog"] > div:nth-of-type(2)', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      action: Object.freeze({ upstream: 'md-text-button >>> .button', ours: '[data-testid="modal-actions"] [role="button"]', measure: 'box', compare: ['height'] })
    }),
    omit: Object.freeze({
      label: Object.freeze({ reason: 'the second reference draws no eyebrow label', upstream: 'md-dialog >>> .label', mask: true }),
      close: Object.freeze({ reason: 'the second reference draws no close button', upstream: 'md-dialog >>> .close-button' })
    })
  })
});
