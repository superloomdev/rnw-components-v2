// Info: Icon atom. The only icon-aware component in the library: it reads
// the glyph for a semantic name and size from the theme (`ctx.icon`) and
// draws it through the injected react-native-svg on every platform. It never
// names a vendor, never holds path data, and never substitutes one glyph
// for another; a name the theme lacks throws at render.

import SPEC from './spec.js';


/********************************************************************
Icon factory.

@param {Object} ctx - Component context

@return {Function} - The Icon component
*********************************************************************/
export default function Icon (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const Svg = ctx.Svg.Svg;
  const Path = ctx.Svg.Path;


  /********************************************************************
  Icon component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function IconComponent (props) {

    // Init the size: caller's, else the theme's default metric
    const size = Utils.isNumber(props.size) ? props.size : ctx.metric('Icon', 'size');

    // Read the glyph and the fill from the theme
    const glyph = ctx.icon(props.name, size);
    const fill = ctx.color(Utils.isString(props.color) ? props.color : 'icon_primary');

    // A labelled icon is an image; an unlabelled one is decorative and hidden
    const labelled = Utils.isString(props.accessibilityLabel) && !Utils.isEmptyString(props.accessibilityLabel);

    // Render the paths in order
    const paths = glyph.paths.map(function (path, index) {
      return React.createElement(Path, {
        key: index,
        d: path.d,
        fillRule: path.fillRule
      });
    });

    // Render the root
    return React.createElement(Svg, {
      width: size,
      height: size,
      viewBox: glyph.viewBox,
      fill: fill,
      accessibilityRole: 'image',
      accessibilityLabel: labelled ? props.accessibilityLabel : undefined,
      'aria-hidden': labelled ? undefined : true,
      testID: props.testID,
      style: props.style
    }, paths);

  }

  IconComponent.displayName = 'Icon';

  return IconComponent;

}

Icon.spec = SPEC;
