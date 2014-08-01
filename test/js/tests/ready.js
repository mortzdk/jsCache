(function (window, document, undefined) {
	"use strict";

	var _;
  
  	QUnit.module("JSCache.ready()", {
  		setup : function () {
  			_ = new window.JSCache();
  		},
  		teardown : function () {
  			_ = undefined;
  		}
  	});
	QUnit.test("Not right type of arguments", function (assert) {
		assert.throws(
  			function () {
  				_.ready(
  					123456789,
  					true	
  				);
  			},
  			new TypeError(
  				"JSCache.ready: Arguments must be of type: Function"
  			),
  			"Testing if we throw an error if arguments is not of type Function"
  		);
	});
	QUnit.asyncTest("Testing that ready works", 2, function (assert) {
		_.ready(
			function () {
				assert.ok(
					true, 
					"Testing that first argument functions is fired"
				);
			},
			function () {
				assert.ok(
					true, 
					"Testing that second argument functions is fired"
				);
			},
			function () {
				QUnit.start();
			}
		);
	});
}(window, window.document, void(0)));
