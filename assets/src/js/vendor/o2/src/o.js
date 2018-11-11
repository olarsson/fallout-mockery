"use strict";

import {debounce} from './helpers/debounce.js';
import {hasTouch} from './helpers/hasTouch.js';
import {isElementInViewport} from './helpers/isElementInViewport.js';
import {isElementXPercentInViewport} from './helpers/isElementXPercentInViewport.js';
import {throttle} from './helpers/throttle.js';
import {debug} from './helpers/debug.js';

//Create the base "o" object that primarily functions as an element selector
window.o = (selector, onlyOne = false) => {
  if (selector.substr(0,1) === '#') {
    return document.getElementById(selector.substr(1, selector.length));
  } else {
    return document['querySelector' + (onlyOne ? '' : 'All')](selector);
  }
};

//Extend the "o" object with custom helpers
window.o._debounce = debounce;
window.o._isElementInViewport = isElementInViewport;
window.o._isElementXPercentInViewport = isElementXPercentInViewport;
window.o._throttle = throttle;
window.o._debug = debug;

//Getter constructions of the helper functions
Object.defineProperty(o, '_hasTouch', { get: hasTouch });  //elem._hasTouch; [BOOLEAN]
