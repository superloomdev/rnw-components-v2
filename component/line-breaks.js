// Info: Where a line may break after a dash, as the browser the references
// are drawn in breaks it (Chromium, measured over one-pixel-wide boxes):
// after a hyphen (U+002D, U+2010) before a letter, whatever stands before
// it ("customer-facing", "24-hour", "a -b"); after a hyphen that follows a
// letter or a digit before a digit, an opening bracket or another hyphen
// ("COVID-19", "2020-2024", "x-(y)", "x--y"), never before a digit at a
// word's start ("a -5"); after an en dash (U+2013) between letters or
// digits and after a word-initial en dash before a digit. A hyphen before
// a full stop, the non-breaking hyphen (U+2011) and a word-initial en dash
// before a letter take no break. Each match ends on the dash, so a break
// mark goes straight after it (`'$&' + mark`). `breakRuns` gives the
// unbreakable runs a min-content width is the widest of.

export const BREAK_AFTER_DASH = /[-\u2010](?=\p{L})|[\p{L}\p{N}](?:[-\u2010](?=[\p{N}\p{Ps}\-\u2010])|\u2013(?=[\p{L}\p{N}]))|\s\u2013(?=\p{N})/gu;


/********************************************************************
The words a text can break into: split at white space and after each
dash the browser breaks after, the dash kept on the part before it.

@param {Object} Utils - The shared utilities
@param {String} text  - The text

@return {Array} - The unbreakable runs
*********************************************************************/
export function breakRuns (Utils, text) {

  // Mark each dash break with a line feed, then split at white space
  const runs = String(text).replace(BREAK_AFTER_DASH, '$&\n').split(/\s+/);

  // The runs, empty ones dropped
  return runs.filter(function (run) {
    return !Utils.isEmptyString(run);
  });

}
