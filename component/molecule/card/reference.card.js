// Info: Card measurement reference - the product-patterns ProductiveCard:
// the card's box, header fields, body and footer's action seats.
export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Card, {
      actionIcons: (props.actionIcons || []).map(function (s) {
        return { id: s.label, icon: s.icon === 'edit' ? upstream.Edit : upstream.TrashCan, iconDescription: s.label, onClick: s.onPress };
      }),
      actionsPlacement: props.actionsPlacement,
      children: props.children,
      clickZone: props.clickZone,
      description: props.description,
      label: props.label,
      onClick: props.onClick,
      overflowActions: props.overflowActions,
      primaryButtonText: props.primaryButtonText,
      productive: true,
      secondaryButtonText: props.secondaryButtonText,
      title: props.title,
      titleSize: props.titleSize === 'large' ? 'large' : 'default'
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.c4p--card', ours: ':scope > div, :scope > a, :scope > button', measure: 'box' }),
    header: Object.freeze({ upstream: '.c4p--card__header', ours: '[data-part="header"]', measure: 'box' }),
    label: Object.freeze({ upstream: '.c4p--card__label', ours: '[data-part="label"]', measure: 'text' }),
    title: Object.freeze({ upstream: '.c4p--card__title', ours: '[data-part="title"]', measure: 'text' }),
    description: Object.freeze({ upstream: '.c4p--card__description', ours: '[data-part="description"]', measure: 'text' }),
    body: Object.freeze({ upstream: '.c4p--card__body', ours: '[data-part="body"]', measure: 'box' }),
    footer: Object.freeze({ upstream: '.c4p--card__footer', ours: '[data-part="footer"]', measure: 'box', optional: true }),
    actions: Object.freeze({ upstream: '.c4p--card__actions', ours: '[data-part="actions"]', measure: 'box', all: true, optional: true }),
    buttons: Object.freeze({ upstream: '.cds--btn', ours: '[data-part="footer"] button', measure: 'box', all: true, optional: true }),
    overflowTrigger: Object.freeze({ upstream: '.cds--overflow-menu', ours: '[data-part="actions"] [role="button"]', measure: 'box', optional: true })
  })
});
