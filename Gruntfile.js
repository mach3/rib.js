
module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-concat");

	var banner = grunt.template.process(
		grunt.file.read("src/banner.js"),
		{data: grunt.file.readJSON("package.json")}
	);

	grunt.initConfig({
		uglify: {
			dist: {
				options: { banner: banner },
				files: {
					"dist/rib.min.js": ["src/rib.js"]
				}
			}
		},
		concat: {
			dist: {
				options: { banner: banner },
				files: {
					"dist/rib.js": ["src/rib.js"]
				}
			}
		}
	});

	grunt.registerTask("default", ["uglify:dist", "concat:dist"]);

};