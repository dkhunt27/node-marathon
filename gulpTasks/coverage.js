module.exports = function () {
  "use strict";

  var addGulpTask = function (fnInputs) {
    var gulp = fnInputs.gulp;
    var projStruct = fnInputs.projStruct;

    var istanbul = require('gulp-istanbul');
    var mocha = require('gulp-mocha');


    gulp.task('pre-coverage', function () {
      return gulp.src(projStruct.codeFiles)
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
    });

    gulp.task('coverage', ['pre-coverage'], function () {
      return gulp.src(projStruct.unitTestFiles)
        .pipe(mocha({reporter: 'dot'}))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 85 } }));
    });
  };

  return {
    addGulpTask: addGulpTask
  };

}();
