// Info: Tile molecule. A static container on the layer that groups related
// content: the layer's box cells and the tile's own type set. A plain tile
// is not a control - no role, no press, no focus ring.
//
// Behavior: none. Ownership: this file is structure and presentation only.
//
// Accessibility: the content speaks for itself; the tile carries no role.
import SPEC from './spec.js';


/********************************************************************
Tile factory.

@param {Object} ctx - Component context

@return {Function} - The Tile component
*********************************************************************/
export default function Tile (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  Tile component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function TileComponent (props) {

    // Render the box; text children take the tile's type set and label cell
    return React.createElement(View, {
      style: [{
        backgroundColor: ctx.color('tile_container'),
        minHeight: ctx.metric('Tile', 'minHeight'),
        minWidth: ctx.metric('Tile', 'minWidth'),
        padding: ctx.metric('Tile', 'padding')
      }],
      testID: props.testID
    },
    Utils.isString(props.children)
      ? React.createElement(Text, {
        style: [{ color: ctx.color('tile_label') }, ctx.typeStyle('tile')]
      }, props.children)
      : props.children);

  }

  TileComponent.displayName = 'Tile';
  return TileComponent;

}
Tile.spec = SPEC;
