module.exports = function gulpFile() {
  "use strict";

  var fs = require('fs');
  var path = require('path');

  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var runSequence = require('run-sequence');

  var codeDir = path.join(__dirname);
  var testDir = path.join(codeDir, 'tests');
  var unitTestFiles = path.join(testDir, '/**/*.unit.tests.js');  // used for tests, coverage
  var codeFiles = [
    path.join(codeDir, 'api.js'),
    path.join(codeDir, 'utils.js')
  ];                                                              // used for jshint, coverage

  // PROJECT STRUCTURE
  var projStruct = {
    codeDir: codeDir,
    codeFiles: codeFiles,
    unitTestFiles: unitTestFiles
  };

  // add individual gulp tasks
  var addGulpTaskInputs = {
    gulp: gulp,
    gutil: gutil,
    projStruct: projStruct
  };

  //loop through all gulpTasks
  var gulpTasksDir = "./gulpTasks/";
  var files = fs.readdirSync(gulpTasksDir);
  files.forEach(function (file) {
    var gulpFilePath = gulpTasksDir + file;
    if (fs.statSync(gulpFilePath).isFile()) {
      require(gulpFilePath).addGulpTask(addGulpTaskInputs);
    }
  });

  require('gulp-task-list')(gulp);

  // List of tasks
  gulp.task('default', ['task-list']);

  // Run tests
  gulp.task('test', ['unit-tests']);

  // Sequenced composite task: jshint, unit-tests, coverage
  gulp.task('code-quality', function (done) {
    runSequence('jshint', 'unit-tests', 'coverage', done);
  });

  return {};
}();
