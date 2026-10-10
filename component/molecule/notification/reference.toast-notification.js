// Info: ToastNotification measurement reference. The upstream toast is a
// `.cds--toast-notification` band (kind and optional `--low-contrast`
// modifiers) whose start border is the status marker; inside, the status
// icon, the `__details` (title, subtitle, caption) and the 48-square close
// button. The parts compared are the band, the icon, the title, the
// subtitle and the close icon. There is no second rendered reference:
// the second template fills the `notification` cells from the snackbar
// token file and the roster records no second twin, so the row is
// measured against the primary alone.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ToastNotification, {
      caption: props.caption,
      kind: props.kind,
      lowContrast: props.lowContrast === true,
      onClose: function () {
        return undefined;
      },
      role: props.role,
      subtitle: props.subtitle,
      title: props.title
    });
  },
  // The element a person would press first: the close button
  target: Object.freeze({ upstream: '.cds--toast-notification__close-button', ours: '[role="status"] [role="button"], [role="alert"] [role="button"]' }),
  parts: Object.freeze({
    band: Object.freeze({ upstream: '.cds--toast-notification', ours: '[role="status"], [role="alert"]', measure: 'box', compare: ['width', 'backgroundColor', 'borderRadius'] }),
    icon: Object.freeze({ upstream: '.cds--toast-notification__icon', ours: '[role="status"] > div:first-child svg, [role="alert"] > div:first-child svg', measure: 'box', compare: ['width', 'height', 'fill'], optional: true }),
    title: Object.freeze({ upstream: '.cds--toast-notification__title', ours: '[role="status"] [dir="auto"], [role="alert"] [dir="auto"]', measure: 'text' }),
    subtitle: Object.freeze({ upstream: '.cds--toast-notification__subtitle', ours: '[role="status"] [dir="auto"]:nth-of-type(2), [role="alert"] [dir="auto"]:nth-of-type(2)', measure: 'text', optional: true }),
    marker: Object.freeze({ upstream: '.cds--toast-notification', ours: '[role="status"], [role="alert"]', measure: 'box', compare: ['borderLeftWidth', 'borderLeftColor'], optional: true }),
    close: Object.freeze({ upstream: '.cds--toast-notification__close-button svg', ours: '[role="status"] [data-testid="icon-button-face"] svg, [role="alert"] [data-testid="icon-button-face"] svg', measure: 'box', compare: ['fill'], optional: true })
  })
});
