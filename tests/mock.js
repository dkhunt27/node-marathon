"use strict";

module.exports = function Mock() {

  var path = require("path");
  var walk = require("walk-sync");

  var mockedResults = {};

  // walk the mock directory
  var mockDir = path.join(__dirname, "..", "mock");
  var files = walk(mockDir, {globs: ['**/*.json'] });

  files.forEach(function(file) {
    var parts = file.split('/');

    if (parts.length !== 3) {
      throw new Error("mock file not in expected directory structure of [service]/[action]/[status].json");
    }

    var service = parts[0];
    var action = parts[1];
    var statusFile = parts[2];
    var status = statusFile.replace(".json", "");

    if (!mockedResults[service]) {
      mockedResults[service] = {};
    }

    if (!mockedResults[service][action]) {
      mockedResults[service][action] = {};
    }

    mockedResults[service][action][status] = require(path.join(mockDir, service, action, statusFile));

  });

  return mockedResults;
};
