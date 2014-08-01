(function (window, document, undefined) {
	"use strict";

	var _;
  
  	QUnit.module("JSCache.detect()", {
  		setup : function () {
  			_ = new window.JSCache();
  			this.bool = function () {
  				return true;
  			};
  			this.and = function () {
  				return arguments[0] && arguments[1];
  			};
  		},
  		teardown : function () {
  			_ = undefined;
  		}
  	});
  	QUnit.test("Not enough arguments", function (assert) {
  		assert.throws(
  			function () {
  				_.detect(
  					true
  				);
  			},
  			new TypeError(
  				"JSCache.detect: Method must have at least two arguments"
  			),
  			"Testing if we throw an error about argument length"
  		);
  	});
  	QUnit.test("Not right type of first argument", function (assert) {
  		assert.throws(
  			function () {
  				_.detect(
  					123456789,
  					this.bool
  				);
  			},
  			new TypeError(
  				"JSCache.detect: First argument must be of type: " + 
  				"String, Boolean, or Function"
  			),
  			"Testing if we throw an error about argument length"
  		);
  	});
  	QUnit.test("Not right type of second argument", function (assert) {
  		assert.throws(
  			function () {
  				_.detect(
  					123456789,
  					987654321
  				);
  			},
  			new TypeError(
  				"JSCache.detect: Second argument must be of type: Function"
  			),
  			"Testing if we throw an error about argument length"
  		);
  	});
  	QUnit.test("True boolean condition", 1, function (assert) {
  		assert.ok(
  			_.detect(
  				true,	
  				this.bool,
  				true
  			),
  			"Testing if callback is fired"
  		);
  	});
  	QUnit.test("False boolean condition", function (assert) {
  		assert.strictEqual(
  			_.detect(
  				false,	
  				this.bool
  			),
  			_,
  			"Testing if detect succeeds"
  		);
  	});
  	QUnit.test("Testing arguments for boolean condition", 3, function (assert) {
  		assert.strictEqual(
  			_.detect(
  				true,	
  				this.and,
  				false
  			),
  			false,
  			"Testing if 3rd argument is passed to callback function"
  		);
  		assert.strictEqual(
  			_.detect(
  				true,	
  				this.and,
  				true,
  				true
  			),
  			true,
  			"Testing if 3rd and 4th argument is passed to callback function"
  		);
  		assert.strictEqual(
  			_.detect(
  				true,	
  				this.and,
  				false,
  				true
  			),
  			false,
  			"Testing if 3rd and 4th argument is passed to callback function"
  		);
  	});
  	QUnit.test("Testing conditional comment", function (assert) {
  		var tmp = document.documentMode,
  			isIE;
  
  		try {
  			document.documentMode = "";
  		} catch(ignore){
  		} finally {
  			/* jshint ignore:start */
  			isIE = typeof document.documentMode === "number" || 
  			       eval("/*@cc_on!@*/!false")
  			/* jshint ignore:end */
  			document.documentMode = tmp;
  		}
  
  		assert.strictEqual(
  			_.detect(
  				"if !IE",
  				this.and,
  				true,
  				true
  			),
  			isIE,
  			"Testing if callback is fired when browser is not IE" 
  		);
  
  		assert.strictEqual(
  			_.detect(
  				"if IE",
  				this.bool,
  				true
  			),
  			isIE,
  			"Testing if callback is fired" 
  		);
  	});
	QUnit.test("First argument is type Function", function (assert) {
		assert.strictEqual(
			_.detect(
				this.bool,
				this.and
			),
			_
		);
	});
	QUnit.test("Testing arguments for first argument type Function", function (assert) {
		assert.strictEqual(
			_.detect(
				this.bool,
				this.and,
				false
			),
			false
		);
		assert.strictEqual(
			_.detect(
				this.bool,
				this.and,
				true,
				true
			),
			true
		);
	});
}(window, window.document, void(0)));
