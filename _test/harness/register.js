// Info: Pre-import hook for the test runner. Bootstraps the jsdom DOM
// environment react-native-web needs at import time. There is no module
// resolution hook: the library never imports react-native, so the tests
// hand the web build in through shared_libs like any host would.
//
// Usage: node --import ./harness/register.js --test

import './dom.js';
