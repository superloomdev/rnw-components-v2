// Info: Accordion composite. A list of headed sections that open and close
// independently, each an AccordionItem with its chevron and a divider rule.
// The parent tracks which heading is hovered so a hovered heading's own top
// rule and the next item's rule both read `accordion_divider_hover`.

import SPEC from './spec.accordion.js';


/********************************************************************
Accordion factory.

@param {Object} ctx - Component context

@return {Function} - The Accordion component
*********************************************************************/
export default function Accordion (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  Accordion component.

  @param {Object} props - See `api.accordion.js`

  @return {Object} - React element
  *********************************************************************/
  function AccordionComponent (props) {

    const items = props.items || [];
    const hoveredRef = React.useRef(-1);
    const [, bump] = React.useState(0);
    const setHovered = function (index) {
      if (hoveredRef.current !== index) {
        hoveredRef.current = index;
        bump(function (n) {
          return n + 1;
        });
      }
    };

    const ListTag = props.ordered === true ? 'ol' : 'ul';

    return React.createElement(View, { accessibilityRole: 'list', role: ListTag === 'ol' ? 'list' : 'list' },
      items.map(function (item, index) {
        const contentId = item.id || 'accordion-content-' + index;
        return React.createElement(ctx.Registry.AccordionItem, {
          key: item.id || index,
          align: props.align,
          children: item.children,
          contentId: contentId,
          defaultOpen: item.defaultOpen === true || item.open === true,
          disabled: props.disabled === true || item.disabled === true,
          dividerHover: hoveredRef.current === index,
          flush: props.isFlush === true,
          last: index === items.length - 1,
          size: props.size || 'md',
          onOpenChange: function (open) {
            if (typeof item.onOpenChange === 'function') {
              item.onOpenChange(open);
            }
            if (typeof props.onChange === 'function') {
              props.onChange({ index: index, open: open });
            }
          },
          onHoverChange: function (hovered) {
            setHovered(hovered === true ? index : -1);
          },
          ordered: props.ordered === true,
          previousHover: hoveredRef.current !== -1 && hoveredRef.current === index - 1,
          title: item.title
        });
      }));
  }

  AccordionComponent.displayName = 'Accordion';

  return AccordionComponent;

}

Accordion.spec = SPEC;
