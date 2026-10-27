// Info: component/composite/modal/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    mount: function (React, upstream, props) {
      const actions = Array.isArray(props.actions) ? props.actions : [];
      // The second page loads no global reset, so the upstream dialog's
      // `::slotted` spacing stands: the slots carry no inline layout
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
      React.createElement('div', { slot: 'headline' }, props.title),
      React.createElement('div', { slot: 'content', style: { letterSpacing: 0.25 } }, props.children),
      actions.length < 1 ? null : React.createElement('div', { slot: 'actions', style: { letterSpacing: 0.1 } },
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
      scrim: Object.freeze({ upstream: 'md-dialog >>> .scrim', ours: '[data-testid="modal-scrim"]', measure: 'box', compare: ['backgroundColor'], except: ['paint'] }),
      container: Object.freeze({ upstream: 'md-dialog >>> dialog', ours: '[role="dialog"], [role="alertdialog"]', measure: 'box', compare: ['width', 'minWidth', 'maxWidth'] }),
      surface: Object.freeze({ upstream: 'md-dialog >>> .container', pseudo: '::before', ours: '[role="dialog"], [role="alertdialog"]', measure: 'box', compare: ['backgroundColor', 'borderRadius', 'boxShadow'] }),
      heading: Object.freeze({ upstream: '[slot="headline"]', ours: '[role="dialog"] > div:first-child > [dir="auto"]:last-child', measure: 'text' }),
      body: Object.freeze({ upstream: 'md-dialog >>> .content', ours: '[role="dialog"] > div:nth-of-type(2)', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      action: Object.freeze({ upstream: 'md-text-button', ours: '[data-testid="modal-actions"] [role="button"]', measure: 'box', compare: ['height'] })
    }),
    omit: Object.freeze({
      label: Object.freeze({ reason: 'the second reference draws no eyebrow label', upstream: 'md-dialog >>> .label', mask: true }),
      close: Object.freeze({ reason: 'the second reference draws no close button', upstream: 'md-dialog >>> .close-button' })
    })
  });
