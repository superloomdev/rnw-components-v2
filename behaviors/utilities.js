// Info: Pure behavior utilities - filter matching and direction.
//
// No state, no appearance: these translate caller input into a yes/no
// answer. Matching is a case-insensitive substring check where an absent
// query matches everything and numeric input is a real query (0 filters
// to labels containing "0"), not an empty value.


/********************************************************************
Build the utilities behaviors for one component system.

@param {Object} deps - { Utils, ReactNative, platform }

@return {Object} - { isLabelMatch, isRtl, getProgressValue, getSafeAreaInsets }
*********************************************************************/
export default function createUtilitiesBehaviors (deps) {

  const Utils = deps.Utils;
  const { I18nManager } = deps.ReactNative;
  const platform = deps.platform;


  /********************************************************************
  Case-insensitive substring match of a query against a label.

  @param {*} inputValue - The query; null/undefined/'' matches everything
  @param {*} label - The candidate label

  @return {Boolean} - Whether the label contains the query
  *********************************************************************/
  function isLabelMatch (inputValue, label) {

    // An absent query matches everything; 0 is a real query, not absent
    if (Utils.isNullOrUndefined(inputValue) || (Utils.isString(inputValue) && Utils.isEmptyString(inputValue))) {
      return true;
    }

    return String(label).toLowerCase().includes(String(inputValue).toLowerCase());

  }


  /********************************************************************
  Resolve right-to-left direction for the current platform.

  Web reads the host config's locale flag; native reads the global
  I18nManager.

  @param {Object} [config] - Host config carrying locale.IS_RTL (web)

  @return {Boolean} - Whether the layout is right-to-left
  *********************************************************************/
  function isRtl (config) {

    if (platform.os === 'web') {
      return Boolean(config && config.locale && config.locale.IS_RTL);
    }

    return I18nManager.isRTL === true;

  }


  function getProgressValue (value, min, max) {

    if (!Utils.isNumber(value) || !Number.isFinite(value)) {
      return undefined;
    }
    if (!Utils.isNumber(min) || !Number.isFinite(min) ||
        !Utils.isNumber(max) || !Number.isFinite(max) || min > max) {
      throw new TypeError('getProgressValue: min and max must be finite numbers with min less than or equal to max');
    }

    return Math.min(max, Math.max(min, value));

  }


  function normalizeInset (value) {

    return Number.isFinite(value) ? Math.max(0, value) : 0;

  }

  function getSafeAreaInsets (source) {

    if (Utils.isNullOrUndefined(source) ||
        typeof source.getSafeAreaInsets !== 'function') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const result = source.getSafeAreaInsets();
    if (Utils.isNullOrUndefined(result) || result.success !== true) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    return {
      top: normalizeInset(result.top),
      bottom: normalizeInset(result.bottom),
      left: normalizeInset(result.left),
      right: normalizeInset(result.right)
    };

  }


  return {
    isLabelMatch: isLabelMatch,
    isRtl: isRtl,
    getProgressValue: getProgressValue,
    getSafeAreaInsets: getSafeAreaInsets
  };

}
