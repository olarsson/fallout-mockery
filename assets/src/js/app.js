'use strict';

//Polyfills
import './polyfills/index.js';

//CSS imports
import '../css/styles.scss';

//Vendor imports
import './vendor/o2/src/o.js'; //DOM selector, debounce, throttle, element in viewport etc..

//Pages
//import {startPage} from './pages/start.js';

//Globally used objects
/**/

//Components
import {area} from './components/area.js';
//import {accordion} from './components/accordion.js';
//import {menu} from './components/menu.js';
//import {gdprBanner} from './components/gdprBanner.js';

global.project = {

  area,

  init: {

    //Instanties code that doesn't depend upon DOM state
    instantly() {
/*
      enquire.register("screen and (max-width:1199px)", {
        match() {
          console.log('screen and (max-width:1199px)');
        },
        deferSetup : true
      });*/

    },

    //DOM markup is parsed
    whenMarkupParsed() {

      let self = global.project;

      self.globalevents();
      self.area.init();
      //self.gdprBanner.init();
      //self.menu.init();
      //self.accordion.init();
    }

  },

  globalevents() {

    //Global events
    o._debug();

  }

};

((self) => {

  self.init.instantly();

  if (document.readyState !== 'loading') {
    self.init.whenMarkupParsed();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      self.init.whenMarkupParsed();
    });
  }

})(global.project);
