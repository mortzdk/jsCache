(function (window, document, undefined) {
	"use strict";

	var _;

	QUnit.module("JSCache", {
		setup : function () {
			_ = new window.JSCache();
		},
		teardown : function () {
			_ = null;
		}
	});
	QUnit.test("Initialized", function () {
		QUnit.ok(
			_ instanceof JSCache
		);
	});
}(window, window.document, void(0)));
