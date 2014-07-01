module.exports = function(grunt) {

// Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-htmlrefs');
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/**/'],
            css: ['public_html/css/<%= pkg.name %>.lib.css'],
            js: ['public_html/js/<%= pkg.name %>.lib.js',
                'public_html/js/<%= pkg.name %>.ugly.js']
        },
        concat: {
            options: {
                separator: "\n", //add a new line after each file
                banner: "", //added before everything
                footer: "" //added after everything
            },
            libCss: {
                src: [
                    'public_html/lib/custom-scroll/jquery.mCustomScrollbar.css',
                    'public_html/lib/jqm/jquery.mobile.flatui.min.css'
                ],
                dest: 'public_html/css/<%= pkg.name %>.lib.css'
            },
            libJs: {
                src: [
                    'public_html/lib/context_blender.js',
                    'public_html/lib/jquery/jquery.min.js',
                    'public_html/lib/custom-scroll/jquery.mCustomScrollbar.concat.min.js',
                    'public_html/lib/jqm/jquery.mobile-1.4.0-rc.1.js'
                ],
                dest: 'public_html/js/<%= pkg.name %>.lib.js'
            },
            finalCss: {
                src: [
                    'public_html/css/<%= pkg.name %>.lib.css',
                    'public_html/css/style.css'
                ],
                dest: 'public_html/css/<%= pkg.name %>.min.css'
            },
            finalJs: {
                src: [
                    'public_html/js/<%= pkg.name %>.lib.js',
                    'public_html/js/<%= pkg.name %>.ugly.js'
                ],
                dest: 'public_html/js/<%= pkg.name %>.min.js'
            }

        },
        removelogging: {
            dist: {
                files: {
                    'public_html/js/<%= pkg.name %>.ugly.js': 
                    ['public_html/js/app.js', 'public_html/js/foo.js']
                }
            }
        },
        uglify: {
            options: {
                banner: ""
            },
            build: {
                files: {
                    'public_html/js/<%= pkg.name %>.ugly.js': 
                    ['public_html/js/<%= pkg.name %>.ugly.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {cwd: 'public_html/templates', src: '**/*', dest: 'build/templates', expand: true},
                    {cwd: 'public_html/lib/jqm/fonts', src: '**/*', dest: 'build/css/fonts', expand: true},
                    {cwd: 'public_html/lib/jqm/images', src: '**/*', dest: 'build/css/images', expand: true},
                    {src: 'public_html/js/<%= pkg.name %>.min.js', dest: 'build/js/<%= pkg.name %>.min.js',
                        filter: 'isFile'},
                    {src: 'public_html/css/<%= pkg.name %>.min.css', dest: 'build/css/<%= pkg.name %>.min.css',
                        filter: 'isFile'},
                ]
            }
        },
        htmlrefs: {
            dist: {
              /** @required  - string including grunt glob variables */
              src: './public_html/index.html',
              /** @optional  - string directory name*/
              dest: './build/index.html',
              options: {
                /** @optional  - references external files to be included */
                includes: {
                  analytics: './ga.inc' // in this case it's google analytics (see sample below)
                },
                /** any other parameter included on the options will be passed for template evaluation */
                appName: '<%= pkg.name %>'
              }
            }
      }
    });
    // Define the default task
    grunt.registerTask('default', ['removelogging', 'uglify', 'concat', 'clean',
        'copy','htmlrefs']);
};
