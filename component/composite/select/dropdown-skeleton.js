// Info: DropdownSkeleton composite. The dropdown's loading shape: a label
// placeholder over a field-height skeleton box, as the primary reference's
// skeleton draws it. The source marks the wrapper with its skeleton class,
// but no compiled rule answers the bare class, so the wrapper stays
// transparent like the rendered upstream.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholders hide themselves (`aria-hidden`); the root
// carries nothing else.

import SPEC from './spec.dropdown-skeleton.js';
import createFieldSkeletonParts from '../../molecule/text-input/field-skeleton-parts.js';


/********************************************************************
DropdownSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The DropdownSkeleton component
*********************************************************************/
export default function DropdownSkeleton (ctx) {

  const { renderFieldSkeleton } = createFieldSkeletonParts(ctx);


  /********************************************************************
  DropdownSkeleton component.

  @param {Object} props - See `api.dropdown-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function DropdownSkeletonComponent (props) {

    return renderFieldSkeleton('DropdownSkeleton', {
      heightKey: 'height',
      hideLabel: props.hideLabel,
      prefix: 'dropdown-skeleton',
      testID: props.testID
    });

  }

  DropdownSkeletonComponent.displayName = 'DropdownSkeleton';

  return DropdownSkeletonComponent;

}

DropdownSkeleton.spec = SPEC;
