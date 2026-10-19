// Info: SelectSkeleton composite. The select field's loading shape: a label
// placeholder over a field-height skeleton box, as the primary reference's
// skeleton draws it.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholders hide themselves (`aria-hidden`); the root
// carries nothing else.

import SPEC from './spec.select-skeleton.js';
import createFieldSkeletonParts from '../../molecule/text-input/field-skeleton-parts.js';


/********************************************************************
SelectSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The SelectSkeleton component
*********************************************************************/
export default function SelectSkeleton (ctx) {

  const { renderFieldSkeleton } = createFieldSkeletonParts(ctx);


  /********************************************************************
  SelectSkeleton component.

  @param {Object} props - See `api.select-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function SelectSkeletonComponent (props) {

    return renderFieldSkeleton('SelectSkeleton', {
      heightKey: 'height',
      hideLabel: props.hideLabel,
      prefix: 'select-skeleton',
      testID: props.testID
    });

  }

  SelectSkeletonComponent.displayName = 'SelectSkeleton';

  return SelectSkeletonComponent;

}

SelectSkeleton.spec = SPEC;
