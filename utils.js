"use strict";

module.exports = function utils() {

  var Handlebars = require('handlebars');

  var buildMarathonUrl = function(url, path) {
    // TODO: add handling for unexpected leading/trailing slashes
    return url + path;
  };

  var buildUrlPath = function(url, urlParams) {
    if (!url) {
      throw new Error("url must exist");
    }
    if (!urlParams) {
      throw new Error("urlParams must exist");
    }

    try {
      var path = Handlebars.compile(url, {strict: true})(urlParams);
      return path;
    } catch (err) {
      // improve error message
      if (err && err.message.indexOf("not defined in [object Object]")) {
        err.message = err.message.replace("[object Object]", "urlParams: " + JSON.stringify(urlParams));
      }
      throw err;
    }
  };

  return {
    buildMarathonUrl: buildMarathonUrl,
    buildUrlPath: buildUrlPath
  };
}();
