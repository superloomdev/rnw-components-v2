// Info: TextInputSkeleton molecule. The text field's loading shape: a label
// placeholder over a field-sized skeleton box, as the primary reference's
// skeleton draws it.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholders hide themselves (`aria-hidden`); the root
// carries nothing else.

import SPEC from './spec.text-input-skeleton.js';
import createFieldSkeletonParts from './field-skeleton-parts.js';


/********************************************************************
TextInputSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The TextInputSkeleton component
*********************************************************************/
export default function TextInputSkeleton (ctx) {

  const { renderFieldSkeleton } = createFieldSkeletonParts(ctx);

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  TextInputSkeleton component.

  @param {Object} props - See `api.text-input-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function TextInputSkeletonComponent (props) {

    return renderFieldSkeleton('TextInputSkeleton', {
      heightKey: SIZES[props.size] || 'height',
      hideLabel: props.hideLabel,
      prefix: 'text-input-skeleton',
      testID: props.testID
    });

  }

  TextInputSkeletonComponent.displayName = 'TextInputSkeleton';

  return TextInputSkeletonComponent;

}

TextInputSkeleton.spec = SPEC;
