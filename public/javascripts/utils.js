(function() {

    // prefixed declarations
    var prefixes = {
        transform: ["transform", "webkitTransform", "mozTransform", "oTransform", "msTransform"],
        transition: ["transition", "webkitTransition", "mozTransition", "oTransition", "msTransition"],
        transitionEnd: ["transitionEnd", "webkitTransitionEnd", "mozTransitionEnd", "oTransitionEnd", "msTransitionEnd"],
        transitionProperty: ["transitionProperty", "webkitTransitionProperty", "mozTransitionProperty", "oTransitionProperty", "msTransitionProperty"],
        transitionDuration: ["transitionDuration", "webkitTransitionDuration", "mozTransitionDuration", "oTransitionDuration", "msTransitionDuration"],
        transitionDelay: ["transitionDelay", "webkitTransitionDelay", "mozTransitionDelay", "oTransitionDelay", "msTransitionDelay"],
        transitionTimingFunction: ["transitionTimingFunction", "webkitTransitionTimingFunction", "mozTransitionTimingFunction", "oTransitionTimingFunction", "msTransitionTimingFunction"]
    };

    // prefixes handler helper
    var getVendorPrefix = function(prefixes) {
        var tmp = document.createElement('div'),
            i = 0;
        for (; i < prefixes.length; i += 1) {
            if (typeof tmp.style[prefixes[i]] !== 'undefined')
                return prefixes[i];
        }
        return null;
    };

    // object that holds current valid prefixes
    window.expCSSprefix = [];
    for (var prop in prefixes) {
        if (prefixes.hasOwnProperty(prop)) {
            expCSSprefix[prop] = getVendorPrefix( prefixes[prop] );
        }
    }

    /* ------ POLYFILLS ------ */

    // forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, scope) {
            'use strict';
            var i, len;
            for (i = 0, len = this.length; i < len; ++i) {
                if (i in this) {
                    fn.call(scope, this[i], i, this);
                }
            }
        };
    }

    // some
    if (!Array.prototype.some) {
        Array.prototype.some = function(fun /*, thisp */) {
            'use strict';

            if (this == null) {
                throw new TypeError();
            }

            var thisp, i,
                t = Object(this),
                len = t.length >>> 0;
            if (typeof fun !== 'function') {
                throw new TypeError();
            }

            thisp = arguments[1];
            for (i = 0; i < len; i++) {
                if (i in t && fun.call(thisp, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                      'toString',
                      'toLocaleString',
                      'valueOf',
                      'hasOwnProperty',
                      'isPrototypeOf',
                      'propertyIsEnumerable',
                      'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

    // trim
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/gm, '');
        };
    }
})();
