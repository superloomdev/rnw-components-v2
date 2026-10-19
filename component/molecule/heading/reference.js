// Info: Heading measurement reference. The upstream heading is the heading
// element of the context level with the design system's default heading
// styles; ours is the same element in the theme's `type.heading-<7-N>`
// set. States past level 1 carry `inside`, which wraps both mounts in the
// same run of Section context. The single part compares the heading text:
// its set, its color and where it sits. No second reference: the second
// system's composition guidance carries no measurement twin.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Heading, null, props.children);
  },
  parts: Object.freeze({
    text: Object.freeze({ upstream: 'h1,h2,h3,h4,h5,h6', ours: 'h1,h2,h3,h4,h5,h6', measure: 'text' })
  })
});
