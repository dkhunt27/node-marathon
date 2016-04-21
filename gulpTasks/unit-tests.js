module.exports = function() {
  "use strict";

  var addGulpTask = function (fnInputs) {
    var gulp = fnInputs.gulp;
    var projStruct = fnInputs.projStruct;

    // gulp plugins
    var mocha = require('gulp-mocha');                         // run mocha tests with gulp

    gulp.task('unit-tests', function () {
      return gulp.src(projStruct.unitTestFiles, {read: false})
        .pipe(mocha({reporter: 'dot'}));
    });
  };

  return {
    addGulpTask: addGulpTask
  };

}();
