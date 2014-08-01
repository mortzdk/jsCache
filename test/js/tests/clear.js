(function (window, document, undefined) {
	"use strict";

	var _,
	    prefix;
  
  	QUnit.module("JSCache.clear()", {
  		setup : function () {
  			_ = new window.JSCache();
			prefix = "JSCache_";
  		},
  		teardown : function () {
  			_ = undefined;
			prefix = undefined;
  		}
  	});
	QUnit.test("localStorage support", 0, function (assert) {
		if (!window.localStorage) {
			QUnit.expect(1);
			assert.throws(
				function () {
					_.clear();
				},
				new Error("JSCache.clear: localStorage was not defined"),
				"Testing that if clear is called without support for " + 
				"localStorage then an error is throwed"
			);
		}
	});
	QUnit.test("Successfully clearing JSCache", 0, function (assert) {
		var key1 = "Test1", 
		    key2 = "Test2",
			key3 = "Test3",
		    object1 = {url:key1, expires : new Date().getTime()*2},
			object2 = {url:key2, expires : new Date().getTime()*2},
			object3 = {url:key3, expires : new Date().getTime()*2};


		if (window.localStorage && window.JSON && window.JSON.stringify) {
			QUnit.expect(1);

			window.localStorage.clear();

			window.localStorage.setItem(
				prefix + key1, 
				JSON.stringify(object1)
			);
			window.localStorage.setItem(
				prefix + key2, 
				JSON.stringify(object2)
			);
			window.localStorage.setItem(
				key3 + prefix,
				JSON.stringify(object3)
			);

			_.clear();

			assert.equal(
				window.localStorage.length,
				1,
				"Testing that clear does only remove JSCache stored objects " +
				"no other objects stored in localStorage"
			);

			window.localStorage.removeItem(key3 + prefix);
		}
	});

}(window, window.document, void(0)));
