// Info: Text measurement reference. The upstream is a React Native text
// component whose type sets are named with dashes (`body-compact-02`,
// `heading-03`); a type leaf maps to its name by replacing underscores with
// dashes and separating a trailing number (`heading03` -> `heading-03`).
// The upstream draws the same text, type set and break mode; a color leaf
// maps to the upstream's camel-cased color name (`text_secondary` ->
// `textSecondary`) and is passed as its style. Its style objects are what
// the reference page draws, and they are compared with ours.

/********************************************************************
Map a type leaf to the upstream's type name.

@param {String} leaf - A `type.` leaf, e.g. 'body_compact_02'

@return {String|undefined} - The upstream name, e.g. 'body-compact-02'
*********************************************************************/
function toUpstreamType (leaf) {

  if (typeof leaf !== 'string') {
    return undefined;
  }

  return leaf.replace(/_/g, '-').replace(/([a-z])([0-9])/g, '$1-$2');

}


export default Object.freeze({
  kind: 'parse-rn',
  mount: function (React, upstream, props) {
    const color = typeof props.color === 'string' ? upstream.getColor(props.color.replace(/_([a-z0-9])/g, function (match, next) {
      return next.toUpperCase();
    })) : undefined;
    return React.createElement(upstream.Text, {
      text: typeof props.text === 'string' ? props.text : props.children,
      type: toUpstreamType(props.type),
      breakMode: props.breakMode,
      style: Object.assign({}, props.style, color === undefined ? {} : { color: color })
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > *', ours: ':scope > *', measure: 'type' })
  })
});
