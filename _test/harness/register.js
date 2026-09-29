// Info: Pre-import hook for the test runner. Bootstraps the jsdom DOM
// environment react-native-web needs at import time.
//
// There is no module-resolution hook. The library never imports a framework
// (the purity test proves it); the Node tests inject react-native-web as
// `ReactNative` and `harness/svg-stub.js` as `Svg`, because react-native-svg's
// web build is bundler-only (extensionless imports, CommonJS parser output).
// The real react-native-svg is exercised by the browser tier, where esbuild
// applies the same aliases a host bundler does, and by the native gate.
//
// Usage: node --import ./harness/register.js --test

import './dom.js';
