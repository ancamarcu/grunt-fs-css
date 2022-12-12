/*
 * Copyright (c) 2022 Anonymous
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var CssProcessor = require('../lib/cssprocessor.js');

  grunt.registerMultiTask('fscss', 'Replaces images references with FirstSpirit CMS_REF references', function() {
    // merge options with defaults
    var options = this.options({
      seperator: '\n\n',
      addFileNameComment: false,
      fileMapping: {}
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.error('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(options.seperator);

      if(src.toString().length < 1) {
        return grunt.log.warn("No (or only empty) css files found to process!");
      }

      // replace media references in given file
      var cssp = new CssProcessor(grunt.util.normalizelf(src.toString()), grunt.util.linefeed, options);
      var srcp = cssp.processFile();

      // Write the destination file.
      grunt.file.write(f.dest, srcp);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};
