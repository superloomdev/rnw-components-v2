// Info: TreeView measurement reference. The tree's label and each node's
// row: container, label box, text, toggle and icon.
export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    const node = function (n, i) {
      const kids = n.children ? n.children.map(function (c, j) {
        return node(c, i + '-' + j);
      }) : undefined;
      // As the probe mount: each node carries its `id` (selection and the
      // parent's expansion key on it) and the icon through `upstream.icon`
      return React.createElement(upstream.TreeNode, { disabled: n.disabled === true, id: n.id, isExpanded: n.expanded === true, key: i, label: n.label, renderIcon: typeof n.icon === 'string' ? upstream.icon(n.icon) : undefined, value: n.id }, kids);
    };
    return React.createElement(upstream.TreeView, {
      active: props.active,
      hideLabel: props.hideLabel === true,
      label: props.label,
      selected: props.defaultSelected || props.selected,
      size: props.size
    }, props.nodes.map(function (n, i) {
      return node(n, i);
    }));
  },
  parts: Object.freeze({
    tree: Object.freeze({ upstream: '.cds--tree', ours: '[data-part="tree"]', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]', measure: 'text' }),
    nodes: Object.freeze({ upstream: '.cds--tree-node', ours: '[data-part="node"]', measure: 'box', all: true }),
    labels: Object.freeze({ upstream: '.cds--tree-node__label', ours: '[data-part="label"]', measure: 'box', all: true }),
    texts: Object.freeze({ upstream: '.cds--tree-node__label__text', ours: '[data-part="text"]', measure: 'text', all: true }),
    toggles: Object.freeze({ upstream: '.cds--tree-node__toggle', ours: '[data-part="toggle"]', measure: 'box', all: true, optional: true }),
    toggleGlyphs: Object.freeze({ upstream: '.cds--tree-node__toggle svg', ours: '[data-part="toggle"] svg', measure: 'box', all: true, optional: true }),
    icons: Object.freeze({ upstream: '.cds--tree-node__icon', ours: '[data-part="icon"] svg', measure: 'box', all: true, optional: true })
  })
});
