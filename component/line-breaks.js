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
// mark goes straight after it (`'$&' + mark`).

export const BREAK_AFTER_DASH = /[-\u2010](?=\p{L})|[\p{L}\p{N}](?:[-\u2010](?=[\p{N}\p{Ps}\-\u2010])|\u2013(?=[\p{L}\p{N}]))|\s\u2013(?=\p{N})/gu;
