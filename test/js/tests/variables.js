(function (window, document, undefined) {
	"use strict";

	var _;

	QUnit.module("Variables", {
		setup : function () {
			_ = new window.JSCache();
		},
		teardown : function () {
			_ = null;
		}
	});
	QUnit.test("Options: timeout", function () {
		QUnit.equal(
			_.timeout,
			5000,
			"Check that the timeout variable is set to 5000 due to the" + 
			"default value of the JSCache object"
		);
		_.timeout = 1000;
		QUnit.equal(
			_.timeout,
			1000,
			"Check that the timeout variable is set to 1000 due to the" + 
			"reassignment on the JSCache object"
		);
	});
	QUnit.test("Options: expires", function () {
		QUnit.equal(
			_.expires,
			432000000,
			"Check that the variable is set to 432000000 due to the" + 
			"default value of the JSCache object"
		);
		_.expires = 86400000;
		QUnit.equal(
			_.expires,
			86400000,
			"Check that the variable is set to 86400000 due to the" + 
			"reassignment on the JSCache object"
		);
	});
}(window, window.document, void(0)));
