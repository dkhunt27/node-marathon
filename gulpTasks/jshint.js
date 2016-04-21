module.exports = function() {
  "use strict";

  var addGulpTask = function (fnInputs) {
    var gulp = fnInputs.gulp;
    var gutil = fnInputs.gutil;
    var projStruct = fnInputs.projStruct;
    var gHelperFns = require('./helperFunctions/gulpHelperFunctions.js');

    // gulp plugins
    var jshint = require('gulp-jshint');                  // run jshint with gulp
    var stylish = require('jshint-stylish');

    var files = projStruct.codeFiles;
    files.push('gulpfile.js');
    files.push('gulpTasks/**/*.js');

    // JSHint code files
    gulp.task('jshint', function (done) {
      gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .pipe(gutil.noop())    // need the noop for the finish event to be called correctly when done
        .pipe(gHelperFns.gulpNext(function () {
          gutil.log("gulp jshint finished");
          done();
        }));
    });
  };

  return {
    addGulpTask: addGulpTask
  };

}();
