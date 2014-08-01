(function (window, document, undefined) {
	"use strict";

	/**
	 * Object with commonly used methods
	 */
	function Helper() {
		var self = this;

		/**
		 * Function to iterate through array
		 */
		self.each = function (_array, _callback) {
			var length = _array.length;
			while (length) {
				length -= 1;
				_callback.call(self, _array[length], length);
			}
		};

		/**
		 * Test whether some conditional comment hold in the browser.
		 *
		 * To see which conditional comments that can be used check: 
		 * http://dev.bowdenweb.com/html/ie-conditional-comments.html 
		 */
		self.conditionalComment = function (_condition) {
			var div = document.createElement("div"), 
			    italics = div.getElementsByTagName("i");

			div.innerHTML = "<!--[" + _condition + "]><!-- -->" + 
			                "<i></i>" + 
			                "<![endif]-->";			

			return !!italics[0];
		};

		/**
		 * Function that calculates whether a timestamp has expired. 
		 */
		self.expired = function (_timestamp) {
			return _timestamp < new Date().getTime();
		};

		/**
		 * Function to check whether the argument is undefined.
		 */
		self.isUndefined = function (_arg) {
			return _arg === undefined;
		};

		/**
		 * Function to check whether the argument match a javascript 
		 * file-extension or http header.
		 */	
		self.isJavascript = function (_arg) {
			return /^(application|text|\.)?(\/x-|\/)?(java)?(script|js)$/i.test(
				_arg
			);
		};

		/**
		 * Function to check whether the argument match a css file-extension or 
		 * http header.
		 */
		self.isCss = function (_arg) {
			return /^(text\/|\.)?(css|style)(sheet)?$/i.test(
				_arg
			);
		};

		/**
		 * Function to check whether the argument match a image file-extension 
		 * or http header.
		 */
		self.isImage = function (_arg) {
			return /^(image\/|\.)?(gif|jpg|jpeg|tif|tiff(-fx)?|png|bmp|pdf|svg(\+xml)?)$/i.test(
				_arg	
			);
		};

		/**
		 * Functions to check the type of a given argument.
		 */
		self.each.call(self,
			[
				"String",
				"Function",
				"Object",
				"Number",
				"Boolean",
				"Array"
			],
			function (_type) {
				self["is" + _type] = function (_arg) {
					return typeof _arg === _type.toLowerCase() || 
					       Object.prototype.toString.call(_arg) === "[object " + _type + "]";
				};
			}
		);

		/**
		 * Function to bind events to elements.
		 */
		self.bind = function (_element, _action, _callback) {
			var capture = (_action === "focus" || _action === "blur");

			if (_element.addEventListener) {
				_element.addEventListener(_action, _callback, capture);
			} else {
				if (_action === "focus") {
					_action = "focusin";
				} else if (_action === "blur") {
					_action = "focusout";
				}

				_action = "on" + _action;

				if (_element.attachEvent) {
					_element.attachEvent(_action, _callback);
				} else {
					if (self.isFunction(_element[_action])) {
						_callback = (function (_f1, _f2) {
							_f1.apply(self, arguments);
							_f2.apply(self, arguments);
						})(
							_callback, 
							_element[_action]
						);
					}
					_element[_action] = _callback;
				}
			}

			return self;
		};

		/**
		 * Function to unbind events from elements.
		 */
		self.unbind = function (_element, _action, _callback) {
			var capture = (_action === "focus" || _action === "blur");

			if (_element.removeEventListener) {
				_element.removeEventListener(_action, _callback, capture);
			} else {
				if (_action === "focus") {
					_action = "focusin";
				} else if (_action === "blur") {
					_action = "focusout";
				}

				_action = "on" + _action;

				if (_element.detachEvent) {
					_element.detachEvent(_action, _callback);
				} else {
					_element[_action] = null;
				}
			}
			
			return self;
		};
	}
	Helper.prototype.constructor = Helper;
	var _ = new Helper();

	function JSCache() {
		var self = this,

		/**
		 * The current version of JSCache.
		 */
		version = 2.0,

		/**
		 * The prefix appended to the key when adding, getting or removing an 
		 * object.
		 */
		prefix = "JSCache_";

		/**
		 * Determines when the cached files is to expire i.e. when to look for 
		 * a new version of the files.
		 *
		 * Default: 432000000 = 5*24*60*60*1000 (5 Days in milliseconds)
		 */
		self.expires = 432000000;

		/**
		 * Determines when the loading of files is to timeout and fallback to 
		 * ordinary loading of files.
		 *
		 * Default: 5000 = 5*1000 (5 seconds)
		 */
		self.timeout = 5000;

		/**
		 * Function that returns the version of the JSCache object.
		 * 
		 * @return [String] (The version of the current JSCache object)
		 */
		self.version = function () {
			return version;
		};

		/**
		 * Function that takes a key and request the data associated with the 
		 * key from localStorage.
		 *
		 * @param _key [String] (The key associated with the expected object) 
		 * @return [Object] (The object that holds all information and data 
		 *                   associated with the specified key)
		 */
		self.get = function (_key) {
			var object = null;

			if ( arguments.length < 1 ) { 
				throw new TypeError(
					"JSCache.get: Method must have one argument"
				);
			}

			if ( !_.isString(_key) ) {
				throw new TypeError(
					"JSCache.get: Argument must be of type: String"
				);
			}

			if ( !window.localStorage ) {
				throw new Error(
					"JSCache.get: localStorage was not defined"
				);
			}

			if ( !window.JSON || !window.JSON.parse ) {
				throw new Error(
					"JSCache.get: JSON was not defined"
				);
			}

			try {
				object = JSON.parse(
					window.localStorage.getItem(
						prefix + _key
					)
				);

				if ( !_.isObject(object) || 
					 object.url !== _key || 
					 _.expired(object.expires) ) {
					self.remove(_key); 
					object = null;
				}
			} catch (ignore) {}

			return object;
		};

		/**
		 * Function that takes a key and remove the data associated with the 
		 * key from localStorage.
		 *
		 * @param _key [String] (The key associated with the expected object) 
		 * @return [JSCache] (The reference to the JSCache object)
		 */
		self.remove = function (_key) {
			if ( arguments.length < 1 ) { 
				throw new TypeError(
					"JSCache.remove: Method must have one argument"
				);
			}

			if ( !_.isString(_key) ) {
				throw new TypeError(
					"JSCache.remove: Argument must be of type: String"
				);
			}

			if ( !window.localStorage ) {
				throw new Error(
					"JSCache.remove: localStorage was not defined"
				);
			}

			window.localStorage.removeItem(
				prefix + _key
			);

			return self;
		};

		/**
		 * Function that clears the localStorage for all JSCache objects
		 *
		 * @return [JSCache] (The reference to the JSCache object)
		 */
		self.clear = function () {
			var i,
				prefixedKey,
				key,
				regexp = /^JSCache_(.*)$/;

			if ( !window.localStorage ) {
				throw new Error(
					"JSCache.clear: localStorage was not defined"
				);
			}

			for (i = window.localStorage.length-1; i > -1; i -= 1) {
				prefixedKey = window.localStorage.key(i);

				if ( _.isString(prefixedKey) && prefixedKey.match(regexp) ) {
					key = prefixedKey.split(prefix)[1];	
				}

				if ( _.isString(key) ) {
					self.remove(key);
				}

				prefixedKey = key = null;
			}

			return self;
		};
    }

	/**
	 * Function that takes a condition, a callback function and an unlimited
	 * amount of arguments. The function tests the condition and fires the 
	 * callback function if the condition is true. Both the condition and 
	 * callback can be of type Function, and if so they are served with the
	 * trailing arguments of the function.
	 *
	 * @param _condition [Boolean, Function, String] (The condition which 
	 *                                                should be meet) 
	 * @param _callback [Function] (The callback function)
	 * @param arguments[2, 3, ...] (The arguments served to both condition and 
	 *                              callback if they are of type Function)
	 * @return (The return value of the callback function)
	 */
	JSCache.prototype.detect = function (_condition, _callback) {
		var self = this,
		    args = [],
		    result = false;

		if ( arguments.length < 2 ) { 
			throw new TypeError(
				"JSCache.detect: Method must have at least two arguments"
			);
		}

		if ( !_.isFunction(_callback) ) {
			throw new TypeError(
				"JSCache.detect: Second argument must be of type: Function"
			);
		}

		// Push all trailing arguments to new array to be served as arguments 
		// for the condition and callback function.
		if ( arguments.length > 2 ) {
			_.each(arguments, function (_value, _key) {
				if (_key > 1) {
					args.push(_value);
				}
			});
			args.reverse();
		}

		if ( _.isString(_condition) ) {
			result = _.conditionalComment(_condition) ? 
					 _callback.apply(this, args) : undefined;
		} else if ( _.isFunction(_condition) ) {
			result = _condition.apply(this, args) ? 
			         _callback.apply(this, args) : undefined;
		} else if ( _.isBoolean(_condition) ) {
			result = _condition ? 
			         _callback.apply(this, args) : undefined;
		} else {
			throw new TypeError(
				"JSCache.detect: First argument must be of type: " + 
				"String, Boolean, or Function"
			);
		}

		// Return reference to JSCache object if there was not returned 
		// anything from the callback function.
		return _.isUndefined(result) ? self : result;
	};

	/**
	 * Function that takes arguments of type Function and waits until the DOM 
	 * is ready before executing them.
	 *
	 * @return [JSCache] (The reference to the JSCache object)
	 */
	JSCache.prototype.ready = function () {
		var self = this,
		    args = [],
			done = false,
		    timer = null,
			clear = function () {
				clearInterval(timer);
				timer = null;
			},
			ready = function () {
				done = true;

				// Stop the interval.
				clear.call(this);

				// Clear all events to avoid memory-leaks.
				_.unbind(document, "DOMContentLoaded", change)
				 .unbind(document, "readystatechange", change)
				 .unbind(document, "load", change)
				 .unbind(window, "load", change);

				// Call the callback functions.
				_.each(args, function (_arg) {
					_arg.call(self);
				});
			},
			change = function (event) {
				// If the document is ready we return.
				if (done) {
					return clear.call(self);
				}

				if ( event && /^(DOMContentLoaded|load)$/.test(event.type) ) {
					ready.call(self);
				} else if ( document.readyState ) {
					if ( /^(loaded|complete|interactive)$/.test(document.readyState) ) {
						ready.call(self);
					} else if ( !!document.documentElement.doScroll ) {
						try {
							document.documentElement.doScroll("left");
							ready.call(self);
						} catch (ignore) {}
					}
				} 
			}; 

		_.each(arguments, function (_arg) {
			if ( !_.isFunction(_arg) ) {
				throw new TypeError(
					"JSCache.ready: Arguments must be of type: Function"
				);
			}
			args.push(_arg);
		});

		// Bind DOMContentLoaded, readystatechange and load to have 
		// cross-browser support in main document and iframe.
		_.bind(document, "DOMContentLoaded", change)
		 .bind(document, "readystatechange", change)
		 .bind(document, "load", change)
		 .bind(window, "load", change);

		// Checkup on the readystate to have support for old IE versions.
		timer = setInterval(change, 1);

		return self;
	};
	JSCache.prototype.constructor = JSCache;
	
	window.JSCache = JSCache;
}(window, window.document, void(0)));
