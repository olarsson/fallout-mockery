export const hasTouch = function() {
  'use strict';
  return (('ontouchstart' in window) ||       // html5 browsers
  (navigator.maxTouchPoints > 0) ||   // future IE
  (navigator.msMaxTouchPoints > 0));  // current IE10
};
