(function (window, document, undefined) {
	"use strict";

	var _,
	    prefix;

	QUnit.module("JSCache.get()", {
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
				_.get();
			},
			new TypeError("JSCache.get: Method must have one argument"),
			"Testing that if get is served no argument, it returns a " + 
			"TypeError explaining that."
		);
	});
	QUnit.test("Wrong argument", function (assert) {
		assert.throws(
			function () {
				_.get(true);
			},
			new TypeError("JSCache.get: Argument must be of type: String"),
			"Testing that if get is served with argument, it must be of type" + 
			"string"
		);
	});
	QUnit.test("localStorage support", 0, function (assert) {
		if (!window.localStorage) {
			QUnit.expect(1);
			assert.throws(
				function () {
					_.get("Dummy");
				},
				new Error("JSCache.get: localStorage was not defined"),
				"Testing that if get is called without support for " + 
				"localStorage then an error is throwed"
			);
		}
	});
	QUnit.test("JSON support", 0, function (assert) {
		if (!window.JSON) {
			QUnit.expect(1);
			assert.throws(
				function () {
					_.get("Dummy");
				},
				new Error("JSCache.get: JSON was not defined"),
				"Testing that if get is called without support for " + 
				"JSON then an error is throwed"
			);
		}
	});
	QUnit.test("Wrong type, Non-existing or expired key", 0, function (assert) {
		var key = "Test";
		if (window.localStorage && window.JSON && window.JSON.stringify) {
			QUnit.expect(5);
			assert.strictEqual(
				_.get("Dummy"),
				null
			);
			window.localStorage.setItem(
				prefix + key, 
				JSON.stringify(
					{url:false}
				)
			);
			assert.strictEqual(
				_.get(key),
				null
			);
			assert.strictEqual(
				window.localStorage.getItem(prefix + key),
				null
			);
			window.localStorage.setItem(
				prefix + key, 
				JSON.stringify(
					{url:"Test", expires:0}
				)
			);
			assert.strictEqual(
				_.get(key),
				null
			);
			assert.strictEqual(
				window.localStorage.getItem(prefix + key),
				null
			);
		}
	});
	QUnit.test("Successfully getting object", 0, function (assert) {
		var key = "Test", 
		    object = {url:"Test", expires : new Date().getTime()*2};
		if (window.localStorage && window.JSON && window.JSON.stringify) {
			QUnit.expect(1);
			window.localStorage.setItem(prefix + key, JSON.stringify(object));
			assert.deepEqual(
				_.get(key),
				object
			);
			window.localStorage.removeItem(prefix + key);
		}
	});
}(window, window.document, void(0)));
