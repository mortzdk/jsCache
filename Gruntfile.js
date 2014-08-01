module.exports = function (grunt) {
	"use strict";
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				separator : ";"
			},
			dist: {
				src: ["src/*.js"],
				dest: "dist/<%= pkg.name %>.js"
			}
		},
		uglify: {
			options: {
				banner : "/* <%= pkg.name %> - Version <%= pkg.version %> - <%= grunt.template.today('dd-mm-yyyy') %> */\n"
			},
			dist: {
				files: {
					"dist/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]
				}
			}
		},
		jshint: {
			files: ["Gruntfile.js", "src/*.js", "test/js/tests/**/*.js"],
			options: {
				camelcase: true,
				curly: true,
				eqeqeq: true,
				es3: true,
				forin: true,
				freeze: true,
				immed: true,
				indent: 4,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonbsp: true,
				nonew: true,
				plusplus: true,
				quotmark: "double",
				undef: true,
				unused: true,
				strict: true,
				trailing: true,
				browser: true,
				devel: true,
				globals: {
					JSCache: true,
					jQuery: true,
					module: true,
					QUnit: true,
					ActiveXObject: true,
					XDomainRequest: true
				}
			}
		},
		watch: {
			files: [
				"<%= jshint.files %>", 
				"test/index.html"
			],
			tasks: [
				"jshint", 
				"copy", 
				"blanket_qunit"
			]
		},
		clean: {
			test: {
				src: [
					"test/js/*.js"
				]
			},
			dist: {
				src: ["dist"]
			}
		},
		copy : {
			test : {
				files: [{
					expand: true,
					cwd: "src",
					src: ["*.js"],
					dest: "test/js/"
				}]
			}
		}
		/* jshint ignore:start */
		,blanket_qunit : {
			all : {
				options : {
					urls : ["test/index.html?coverage=true&gruntReport"],
					threshold : 75 
				}
			}
		}
		/* jshint ignore:end */
	});
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-blanket-qunit");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-concat");

	grunt.registerTask("clear", ["clean"]);
	grunt.registerTask(
		"test", 
		[
			"jshint", 
			"copy", 
			"blanket_qunit"
		]
	);
	grunt.registerTask(
		"dist", 
		[
			"jshint", 
			"copy", 
			"blanket_qunit", 
			"clean", 
			"concat", 
			"uglify"
		]
	);
	grunt.registerTask(
		"default",
		[
			"watch"
		]
	);
};
