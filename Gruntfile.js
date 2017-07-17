module.exports = function (grunt) {
  grunt.initConfig({
    name: 'json.edit',
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n;\n',
        sourceMap: true
      },
      js: {
        options: {
          banner: '\n(function(){\n"use strict";\n',
          footer: '\n})();'
        },
        src: [
          'src/module.js',
          'src/**/*module.js',
          'src/**/*.js',
          'template/**/*.js'
        ],
        dest: 'dist/<%= name %>.js'
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      js: {
        src: ['dist/<%= name %>.js'],
        dest: 'dist/<%= name %>.js'
      }
    },
    html2js: {
      dist: {
        options: {
          module: null, // no bundle module for all the html2js templates
          base: '.',
          rename: function(moduleName) {
            return `mx/${moduleName}`;
          }
        },
        files: [{
          expand: true,
          src: ['template/**/*.html'],
          ext: '.html.js'
        }]
      }
    },
    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      js: {
        src: ['dist/<%= name %>.js'],
        dest: 'dist/<%= name %>.min.js'
      }
    },
    less: {
      dev: {
        options: {
          sourceMap: true,
          rootpath: '..',
          sourceMapRootpath: '..'
        },
        src: ['assets/index.less'],
        dest: 'dist/<%= name %>.css'
      },
      dist: {
        options: {
          compress: true
        },
        expand: true,
        src: ['dist/<%= name %>.css'],
        ext: '.min.css'
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: {
        tasks: ['watch:less', 'watch:js', 'watch:template']
      }
    },
    watch: {
      options: {
        spawn: false
      },
      less: {
        files: ['assets/**/*.less'],
        tasks: ['less:dev']
      },
      js: {
        files: [
          'src/**/*.js',
          'template/**/*.js'
        ],
        tasks: ['concat:js']
      },
      template: {
        files: ['template/**/*.html'],
        tasks: ['html2js']
      }
    },
    prettier: {
      base: {
        options: {
          singleQuote: true
        },
        src: [
          'src/**/*.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-prettier');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('dist', [
    'less:dev',
    'less:dist',
    'prettier:base',
    'html2js',
    'concat:js',
    'ngAnnotate:js',
    'uglify:js'
  ]);

  grunt.registerTask('dev', [
    'less:dev',
    'concat:js',
    'concurrent:dev'
  ]);
};