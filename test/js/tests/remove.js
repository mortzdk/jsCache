(function (window, document, undefined) {
	"use strict";

	var _,
	    prefix;

	QUnit.module("JSCache.remove()", {
		setup : function () {
			_ = new window.JSCache();
			prefix = "JSCache_";
		},
		teardown : function () {
			_ = undefined;
			prefix = undefined;
		}
	});
	QUnit.test("No argument", function (assert) {
		assert.throws(
			function () {
				_.remove();
			},
			new TypeError("JSCache.remove: Method must have one argument"),
			"Testing that if remove is served no argument, it returns a " + 
			"TypeError explaining that."
		);
	});
	QUnit.test("Wrong argument", function (assert) {
		assert.throws(
			function () {
				_.remove(true);
			},
			new TypeError("JSCache.remove: Argument must be of type: String"),
			"Testing that if remove is served with argument, it must be of " + 
			"type string"
		);
	});
	QUnit.test("localStorage support", 0, function (assert) {
		if (!window.localStorage) {
			QUnit.expect(1);
			assert.throws(
				function () {
					_.remove("Dummy");
				},
				new Error("JSCache.remove: localStorage was not defined"),
				"Testing that if remove is called without support for " + 
				"localStorage then an error is throwed"
			);
		}
	});
	QUnit.test("Successfully removing object", 0, function (assert) {
		var key = "Test", 
		    object = {url:"Test", expires : new Date().getTime()*2};
		if (window.localStorage && window.JSON && window.JSON.stringify) {
			QUnit.expect(1);
			window.localStorage.setItem(prefix + key, JSON.stringify(object));
			assert.strictEqual(
				_.remove(key),
				_
			);
		}
	});
}(window, window.document, void(0)));
