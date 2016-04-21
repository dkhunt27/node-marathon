module.exports = function() {
  "use strict";

  var through2 = require('through2');                   // node stream wrapper used to support gulp async waiting

  var gulpNext = function (then) {
    // http://unobfuscated.blogspot.com/2014/01/executing-asynchronous-gulp-tasks-in.html
    return through2.obj(function (data, enc, cb) {
        cb();
      },
      function () {
        then();
      });
  };

  return {
    gulpNext: gulpNext
  };

}();
