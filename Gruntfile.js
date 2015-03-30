module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			require: {
				files: {
					'build/require.min.js': ['require.js']
				}
			}
		},
		jshint: {
			options: {
				sub: true
			},
			all: {
				src: ['require.js']
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint:all', 'uglify']);
};