// Info: Shared field-skeleton anatomy for the field family. `renderFieldSkeleton`
// draws the loading shape every field skeleton shares - an optional label bar
// over a field-height bar - for the owner that calls it. The wrapper paints
// nothing: the primary reference marks the dropdown skeleton's form wrapper
// with its skeleton class, but no compiled rule answers the bare class, so
// the rendered upstream wrapper stays transparent. Private to the field
// skeletons; nothing here is a registry row or a public export.


/********************************************************************
Build the field-skeleton parts for one component system. Called once
inside each owning factory, never during render.

@param {Object} ctx - Component context

@return {Object} - { renderFieldSkeleton }
*********************************************************************/
export default function createFieldSkeletonParts (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;

  const PCT = '%';


  /********************************************************************
  Render one field skeleton: a root of `alignSelf: stretch` holding the
  label placeholder (unless `hideLabel`) over the field placeholder.

  @param {String} owner              - Spec name holding the metrics
  @param {Object} options
  @param {String} options.prefix     - testID prefix for the bars (required)
  @param {String} options.heightKey  - Spec metric for the field bar's
                                       height (required)
  @param {Boolean}[options.hideLabel]- Skips the label placeholder
  @param {String} [options.testID]   - Test id for the root

  @return {Object} - React element
  *********************************************************************/
  function renderFieldSkeleton (owner, options) {

    return React.createElement(View, {
      style: { alignSelf: 'stretch' },
      testID: options.testID
    },
    options.hideLabel === true ? null : React.createElement(View, {
      style: { marginBottom: ctx.metric(owner, 'labelGap') }
    },
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric(owner, 'labelHeight'),
      testID: options.prefix + '-label',
      width: ctx.metric(owner, 'labelWidth')
    })),
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric(owner, options.heightKey),
      testID: options.prefix + '-field',
      width: 100 + PCT
    }));

  }


  return {
    renderFieldSkeleton: renderFieldSkeleton
  };

}
