(function (window, document, undefined) {
	"use strict";

	var _;

	QUnit.module("JSCache.version()", {
  		setup : function () {
  			_ = new window.JSCache();
  		},
  		teardown : function () {
  			_ = null;
  		}
  	});
  	QUnit.test("Version check", function (assert) {
  		assert.equal(
  			_.version(),
  			"2.0",
  			"Check that version is in fact 2.0"
  		);
  	});
}(window, window.document, void(0)));
