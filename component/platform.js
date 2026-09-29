// Info: The one place the library reads the platform.
//
// Every other file receives the answer: behaviors read `platform.os`, and a
// component with two platform halves calls `platform.split({ web, native })`
// and renders whatever comes back. Concentrating the read here keeps the
// purity gate simple (a `Platform.OS` anywhere else is a defect) and makes
// the platform answer injectable in tests, where `ReactNative` is the web
// build and `os` is whatever the test declares.

const NATIVE = ['ios', 'android'];


/********************************************************************
Build the platform answer for one component system.

@param {Object} ReactNative - The injected React Native module; only
                              `Platform.OS` is read from it
@param {Object} Utils       - Injected helper-utils

@return {Object} - { os, isNative, split }
*********************************************************************/
export default function createPlatform (ReactNative, Utils) {

  // Validate the injected module exposes a platform name
  if (Utils.isNullOrUndefined(ReactNative) || Utils.isNullOrUndefined(ReactNative.Platform) ||
      !Utils.isString(ReactNative.Platform.OS)) {
    throw new TypeError('createPlatform requires ReactNative.Platform.OS to be a string');
  }

  // Init the single platform read
  const os = ReactNative.Platform.OS;
  const isNative = Utils.inArray(NATIVE, os);


  /********************************************************************
  Pick the half that applies to this platform. `web` serves the web;
  `native` serves iOS and Android; a half a caller does not list yields
  null so the dispatcher renders nothing rather than the wrong half.

  @param {Object} halves - { web, native }

  @return {*} - The chosen half, or null when none is listed
  *********************************************************************/
  function split (halves) {

    // Validate the halves object
    if (Utils.isNullOrUndefined(halves)) {
      throw new TypeError('platform.split requires an object with web and/or native halves');
    }

    // Pick the half for this platform
    const half = isNative ? halves.native : halves.web;

    // Return null when no half is listed for this platform
    if (Utils.isNullOrUndefined(half)) {
      return null;
    }

    // Return the chosen half
    return half;

  }


  return Object.freeze({
    os: os,
    isNative: isNative,
    split: split
  });

}
