// Info: FileUploaderSkeleton composite: the loading placeholder of a
// FileUploader (`aria-hidden`): a heading bar at the title width, a text
// bar at the description width, and a button placeholder, each spaced by
// its own skeleton gap.

import SPEC from './spec.file-uploader-skeleton.js';


/********************************************************************
FileUploaderSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The FileUploaderSkeleton component
*********************************************************************/
export default function FileUploaderSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  FileUploaderSkeleton component.

  @param {Object} props - See `api.file-uploader-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function FileUploaderSkeletonComponent (props) {

    return React.createElement(View, {
      accessibilityElementsHidden: true,
      'aria-hidden': true,
      dataSet: { part: 'root' },
      style: { alignItems: 'flex-start' },
      testID: props.testID
    },
    React.createElement(View, { dataSet: { part: 'title' } },
      React.createElement(ctx.Registry.SkeletonText, { heading: true, width: ctx.metric('FileUploaderSkeleton', 'titleWidth') })),
    React.createElement(View, { dataSet: { part: 'description' } },
      React.createElement(ctx.Registry.SkeletonText, { width: ctx.metric('FileUploaderSkeleton', 'descriptionWidth') })),
    React.createElement(ctx.Registry.ButtonSkeleton, {}));

  }

  FileUploaderSkeletonComponent.displayName = 'FileUploaderSkeleton';

  return FileUploaderSkeletonComponent;

}

FileUploaderSkeleton.spec = SPEC;
