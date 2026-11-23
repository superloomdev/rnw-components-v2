// Info: HeaderContainer composite. The side navigation's open state for a
// header: it starts from `isSideNavExpanded`, a press of the header's menu
// button toggles it and Escape anywhere collapses it. It draws `header` as
// a Header whose menu button shows the state (`isActive`), or renders
// `render` with `isSideNavExpanded` and `onClickSideNavExpand`. It draws
// nothing of its own.

import SPEC from './spec.header-container.js';


/********************************************************************
HeaderContainer factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderContainer component
*********************************************************************/
export default function HeaderContainer (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { useEscapeKey } = ctx.behaviors;


  /********************************************************************
  HeaderContainer component.

  @param {Object} props - See `api.header-container.js`

  @return {Object|null} - React element
  *********************************************************************/
  function HeaderContainerComponent (props) {

    const [expanded, setExpanded] = React.useState(props.isSideNavExpanded === true);
    const toggle = React.useCallback(function () {
      setExpanded(function (previous) {
        return !previous;
      });
    }, []);
    // Escape collapses the side navigation (`HeaderContainer.tsx` window keydown)
    useEscapeKey(function () {
      setExpanded(false);
    }, expanded);

    if (Utils.isFunction(props.render)) {
      return React.createElement(props.render, { isSideNavExpanded: expanded, onClickSideNavExpand: toggle });
    }
    if (!Utils.isObject(props.header)) {
      return null;
    }
    const menuButton = Utils.isObject(props.header.menuButton)
      ? Object.assign({}, props.header.menuButton, { isActive: expanded, onPress: toggle })
      : undefined;
    return React.createElement(ctx.Registry.Header, Object.assign({}, props.header, { menuButton: menuButton }));

  }

  HeaderContainerComponent.displayName = 'HeaderContainer';

  return HeaderContainerComponent;

}

HeaderContainer.spec = SPEC;
