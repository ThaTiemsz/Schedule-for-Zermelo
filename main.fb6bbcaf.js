// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/main.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

jQuery(document).ready(function ($) {
  var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
  var transitionsSupported = $('.csstransitions').length > 0; //if browser does not support transitions - use a different event to trigger them

  if (!transitionsSupported) transitionEnd = 'noTransition'; //should add a loding while the events are organized 

  var SchedulePlan =
  /*#__PURE__*/
  function () {
    function SchedulePlan(element) {
      _classCallCheck(this, SchedulePlan);

      this.element = element;
      this.timeline = this.element.find('.timeline');
      this.timelineItems = this.timeline.find('li');
      this.timelineItemsNumber = this.timelineItems.length;
      this.timelineStart = getScheduleTimestamp(this.timelineItems.eq(0).text()); //need to store delta (in our case half hour) timestamp

      this.timelineUnitDuration = getScheduleTimestamp(this.timelineItems.eq(1).text()) - getScheduleTimestamp(this.timelineItems.eq(0).text());
      this.eventsWrapper = this.element.find('.events');
      this.eventsGroup = this.eventsWrapper.find('.events-group');
      this.singleEvents = this.eventsGroup.find('.single-event');
      this.eventSlotHeight = this.eventsGroup.eq(0).children('.top-info').outerHeight();
      this.modal = this.element.find('.event-modal');
      this.modalHeader = this.modal.find('.header');
      this.modalHeaderBg = this.modal.find('.header-bg');
      this.modalBody = this.modal.find('.body');
      this.modalBodyBg = this.modal.find('.body-bg');
      this.modalMaxWidth = 800;
      this.modalMaxHeight = 480;
      this.animating = false;
      this.initSchedule();
    }

    _createClass(SchedulePlan, [{
      key: "initSchedule",
      value: function initSchedule() {
        this.scheduleReset();
        this.initEvents();
      }
    }, {
      key: "scheduleReset",
      value: function scheduleReset() {
        var mq = this.mq();

        if (mq == 'desktop' && !this.element.hasClass('js-full')) {
          //in this case you are on a desktop version (first load or resize from mobile)
          this.eventSlotHeight = this.eventsGroup.eq(0).children('.top-info').outerHeight();
          this.element.addClass('js-full');
          this.placeEvents();
          this.element.hasClass('modal-is-open') && this.checkEventModal();
        } else if (mq == 'mobile' && this.element.hasClass('js-full')) {
          //in this case you are on a mobile version (first load or resize from desktop)
          this.element.removeClass('js-full loading');
          this.eventsGroup.children('ul').add(this.singleEvents).removeAttr('style');
          this.eventsWrapper.children('.grid-line').remove();
          this.element.hasClass('modal-is-open') && this.checkEventModal();
        } else if (mq == 'desktop' && this.element.hasClass('modal-is-open')) {
          //on a mobile version with modal open - need to resize/move modal window
          this.checkEventModal('desktop');
          this.element.removeClass('loading');
        } else {
          this.element.removeClass('loading');
        }
      }
    }, {
      key: "initEvents",
      value: function initEvents() {
        var self = this;
        this.singleEvents.each(function () {
          //create the .event-date element for each event
          var durationLabel = '<span class="event-date">' + $(this).data('start') + ' - ' + $(this).data('end') + '</span>';
          $(this).children('a').prepend($(durationLabel)); //detect click on the event and open the modal

          $(this).on('click', 'a', function (event) {
            event.preventDefault();
            if (!self.animating) self.openModal($(this));
          });
        }); //close modal window

        this.modal.on('click', '.close', function (event) {
          event.preventDefault();
          if (!self.animating) self.closeModal(self.eventsGroup.find('.selected-event'));
        });
        this.element.on('click', '.cover-layer', function (event) {
          if (!self.animating && self.element.hasClass('modal-is-open')) self.closeModal(self.eventsGroup.find('.selected-event'));
        });
      }
    }, {
      key: "placeEvents",
      value: function placeEvents() {
        var self = this;
        this.singleEvents.each(function () {
          //place each event in the grid -> need to set top position and height
          var start = getScheduleTimestamp($(this).attr('data-start')),
              duration = getScheduleTimestamp($(this).attr('data-end')) - start;
          var eventTop = self.eventSlotHeight * (start - self.timelineStart) / self.timelineUnitDuration,
              eventHeight = self.eventSlotHeight * duration / self.timelineUnitDuration;
          $(this).css({
            top: eventTop - 1 + 'px',
            height: eventHeight + 1 + 'px'
          });
        });
        this.element.removeClass('loading');
      }
    }, {
      key: "openModal",
      value: function openModal(event) {
        var self = this;
        var mq = self.mq();
        this.animating = true; //update event name and time

        this.modalHeader.find('.event-name').text(event.find('.event-name').text());
        this.modalHeader.find('.event-date').text(event.find('.event-date').text());
        this.modal.attr('data-event', event.parent().attr('data-event')); //update event content

        this.modalBody.find('.event-info').load(event.parent().attr('data-content') + '.html .event-info > *', function (data) {
          //once the event content has been loaded
          self.element.addClass('content-loaded');
        });
        this.element.addClass('modal-is-open');
        setTimeout(function () {
          //fixes a flash when an event is selected - desktop version only
          event.parent('li').addClass('selected-event');
        }, 10);

        if (mq == 'mobile') {
          self.modal.one(transitionEnd, function () {
            self.modal.off(transitionEnd);
            self.animating = false;
          });
        } else {
          var eventTop = event.offset().top - $(window).scrollTop(),
              eventLeft = event.offset().left,
              eventHeight = event.innerHeight(),
              eventWidth = event.innerWidth();
          var windowWidth = $(window).width(),
              windowHeight = $(window).height();
          var modalWidth = windowWidth * .8 > self.modalMaxWidth ? self.modalMaxWidth : windowWidth * .8,
              modalHeight = windowHeight * .8 > self.modalMaxHeight ? self.modalMaxHeight : windowHeight * .8;
          var modalTranslateX = parseInt((windowWidth - modalWidth) / 2 - eventLeft),
              modalTranslateY = parseInt((windowHeight - modalHeight) / 2 - eventTop);
          var HeaderBgScaleY = modalHeight / eventHeight,
              BodyBgScaleX = modalWidth - eventWidth; //change modal height/width and translate it

          self.modal.css({
            top: eventTop + 'px',
            left: eventLeft + 'px',
            height: modalHeight + 'px',
            width: modalWidth + 'px'
          });
          transformElement(self.modal, 'translateY(' + modalTranslateY + 'px) translateX(' + modalTranslateX + 'px)'); //set modalHeader width

          self.modalHeader.css({
            width: eventWidth + 'px'
          }); //set modalBody left margin

          self.modalBody.css({
            marginLeft: eventWidth + 'px'
          }); //change modalBodyBg height/width ans scale it

          self.modalBodyBg.css({
            height: eventHeight + 'px',
            width: '1px'
          });
          transformElement(self.modalBodyBg, 'scaleY(' + HeaderBgScaleY + ') scaleX(' + BodyBgScaleX + ')'); //change modal modalHeaderBg height/width and scale it

          self.modalHeaderBg.css({
            height: eventHeight + 'px',
            width: eventWidth + 'px'
          });
          transformElement(self.modalHeaderBg, 'scaleY(' + HeaderBgScaleY + ')');
          self.modalHeaderBg.one(transitionEnd, function () {
            //wait for the  end of the modalHeaderBg transformation and show the modal content
            self.modalHeaderBg.off(transitionEnd);
            self.animating = false;
            self.element.addClass('animation-completed');
          });
        } //if browser do not support transitions -> no need to wait for the end of it


        if (!transitionsSupported) self.modal.add(self.modalHeaderBg).trigger(transitionEnd);
      }
    }, {
      key: "closeModal",
      value: function closeModal(event) {
        var self = this;
        var mq = self.mq();
        this.animating = true;

        if (mq == 'mobile') {
          this.element.removeClass('modal-is-open');
          this.modal.one(transitionEnd, function () {
            self.modal.off(transitionEnd);
            self.animating = false;
            self.element.removeClass('content-loaded');
            event.removeClass('selected-event');
          });
        } else {
          var eventTop = event.offset().top - $(window).scrollTop(),
              eventLeft = event.offset().left,
              eventHeight = event.innerHeight(),
              eventWidth = event.innerWidth();
          var modalTop = Number(self.modal.css('top').replace('px', '')),
              modalLeft = Number(self.modal.css('left').replace('px', ''));
          var modalTranslateX = eventLeft - modalLeft,
              modalTranslateY = eventTop - modalTop;
          self.element.removeClass('animation-completed modal-is-open'); //change modal width/height and translate it

          this.modal.css({
            width: eventWidth + 'px',
            height: eventHeight + 'px'
          });
          transformElement(self.modal, 'translateX(' + modalTranslateX + 'px) translateY(' + modalTranslateY + 'px)'); //scale down modalBodyBg element

          transformElement(self.modalBodyBg, 'scaleX(0) scaleY(1)'); //scale down modalHeaderBg element

          transformElement(self.modalHeaderBg, 'scaleY(1)');
          this.modalHeaderBg.one(transitionEnd, function () {
            //wait for the  end of the modalHeaderBg transformation and reset modal style
            self.modalHeaderBg.off(transitionEnd);
            self.modal.addClass('no-transition');
            setTimeout(function () {
              self.modal.add(self.modalHeader).add(self.modalBody).add(self.modalHeaderBg).add(self.modalBodyBg).attr('style', '');
            }, 10);
            setTimeout(function () {
              self.modal.removeClass('no-transition');
            }, 20);
            self.animating = false;
            self.element.removeClass('content-loaded');
            event.removeClass('selected-event');
          });
        } //browser do not support transitions -> no need to wait for the end of it


        if (!transitionsSupported) self.modal.add(self.modalHeaderBg).trigger(transitionEnd);
      }
    }, {
      key: "mq",
      value: function mq() {
        //get MQ value ('desktop' or 'mobile') 
        var self = this;
        return window.getComputedStyle(this.element.get(0), '::before').getPropertyValue('content').replace(/["']/g, '');
      }
    }, {
      key: "checkEventModal",
      value: function checkEventModal(device) {
        this.animating = true;
        var self = this;
        var mq = this.mq();

        if (mq == 'mobile') {
          //reset modal style on mobile
          self.modal.add(self.modalHeader).add(self.modalHeaderBg).add(self.modalBody).add(self.modalBodyBg).attr('style', '');
          self.modal.removeClass('no-transition');
          self.animating = false;
        } else if (mq == 'desktop' && self.element.hasClass('modal-is-open')) {
          self.modal.addClass('no-transition');
          self.element.addClass('animation-completed');
          var event = self.eventsGroup.find('.selected-event');
          var eventTop = event.offset().top - $(window).scrollTop(),
              eventLeft = event.offset().left,
              eventHeight = event.innerHeight(),
              eventWidth = event.innerWidth();
          var windowWidth = $(window).width(),
              windowHeight = $(window).height();
          var modalWidth = windowWidth * .8 > self.modalMaxWidth ? self.modalMaxWidth : windowWidth * .8,
              modalHeight = windowHeight * .8 > self.modalMaxHeight ? self.modalMaxHeight : windowHeight * .8;
          var HeaderBgScaleY = modalHeight / eventHeight,
              BodyBgScaleX = modalWidth - eventWidth;
          setTimeout(function () {
            self.modal.css({
              width: modalWidth + 'px',
              height: modalHeight + 'px',
              top: windowHeight / 2 - modalHeight / 2 + 'px',
              left: windowWidth / 2 - modalWidth / 2 + 'px'
            });
            transformElement(self.modal, 'translateY(0) translateX(0)'); //change modal modalBodyBg height/width

            self.modalBodyBg.css({
              height: modalHeight + 'px',
              width: '1px'
            });
            transformElement(self.modalBodyBg, 'scaleX(' + BodyBgScaleX + ')'); //set modalHeader width

            self.modalHeader.css({
              width: eventWidth + 'px'
            }); //set modalBody left margin

            self.modalBody.css({
              marginLeft: eventWidth + 'px'
            }); //change modal modalHeaderBg height/width and scale it

            self.modalHeaderBg.css({
              height: eventHeight + 'px',
              width: eventWidth + 'px'
            });
            transformElement(self.modalHeaderBg, 'scaleY(' + HeaderBgScaleY + ')');
          }, 10);
          setTimeout(function () {
            self.modal.removeClass('no-transition');
            self.animating = false;
          }, 20);
        }
      }
    }]);

    return SchedulePlan;
  }();

  var schedules = $('.cd-schedule');
  var objSchedulesPlan = [],
      windowResize = false;

  if (schedules.length > 0) {
    schedules.each(function () {
      //create SchedulePlan objects
      objSchedulesPlan.push(new SchedulePlan($(this)));
    });
  }

  $(window).on('resize', function () {
    if (!windowResize) {
      windowResize = true;
      !window.requestAnimationFrame ? setTimeout(checkResize) : window.requestAnimationFrame(checkResize);
    }
  });
  $(window).keyup(function (event) {
    if (event.keyCode == 27) {
      objSchedulesPlan.forEach(function (element) {
        element.closeModal(element.eventsGroup.find('.selected-event'));
      });
    }
  });

  function checkResize() {
    objSchedulesPlan.forEach(function (element) {
      element.scheduleReset();
    });
    windowResize = false;
  }

  function getScheduleTimestamp(time) {
    //accepts hh:mm format - convert hh:mm to timestamp
    time = time.replace(/ /g, '');
    var timeArray = time.split(':');
    var timeStamp = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    return timeStamp;
  }

  function transformElement(element, value) {
    element.css({
      '-moz-transform': value,
      '-webkit-transform': value,
      '-ms-transform': value,
      '-o-transform': value,
      'transform': value
    });
  }
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54804" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.map