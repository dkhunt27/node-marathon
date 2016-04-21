"use strict";

module.exports = function utils() {

  var fs = require('fs');
  var path = require('path');
  var Handlebars = require('handlebars');
  var Promise = require('bluebird');
  var Validator = require('jsonschema').Validator;
  var validator = new Validator();

  var buildMarathonUrl = function(url, path) {
    return new Promise(function(fulfill, reject) {
      // TODO: add handling for unexpected leading/trailing slashes
      return fulfill(url + path);
    });
  };

  var buildUrlPath = function(url, urlParams) {
    return new Promise(function(fulfill, reject) {

      if (!url) {return reject("url must exist");}

      if (!urlParams) {return reject("urlParams must exist");}

      try {

        var path = Handlebars.compile(url, {strict: true})(urlParams);

        return fulfill(path);

      } catch (err) {

        var errToReturn = err;

        // improve error message
        if (err && err.message.indexOf("not defined in [object Object]")) {

          errToReturn = err.message.replace("[object Object]", "urlParams: " + JSON.stringify(urlParams));

        }

        return reject(errToReturn);
      }
    });
  };

  var loadApiMap = function() {
    return new Promise(function(fulfill, reject) {

      var apiMap = require("./apiMap.json");

      return fulfill(apiMap);
    });
  };

  var parseApiMap = function(apiMap, service, action) {
    return new Promise(function(fulfill, reject) {

      // parse the api map
      if (!apiMap[service]) {
        return reject("The apiMap does not contain configuration for service:" + service);
      }
      if (!apiMap[service][action]) {
        return reject("The apiMap." + service + " does not contain configuration for action:" + action);
      }
      if (!apiMap[service][action].path) {
        return reject("The apiMap." + service + "." + action + " does not contain configuration for path");
      }
      if (!apiMap[service][action].method) {
        return reject("The apiMap." + service + "." + action + " does not contain configuration for method");
      }

      return fulfill(apiMap[service][action]);
    });
  };

  var loadSchema = function(service, action) {
    return new Promise(function(fulfill, reject) {

      var schemaDirService = path.join(__dirname, "schema", service);
      var schemaDirAction = path.join(schemaDirService, action);
      var schemaFile = path.join(schemaDirAction, "schema.json");

      // load the schema
      if (!fs.existsSync(schemaDirService)) {
        return reject("The schema folder structure does not exist:" + schemaDirService);
      }

      if (!fs.existsSync(schemaDirAction)) {
        return reject("The schema folder structure does not exist:" + schemaDirAction);
      }

      if (!fs.existsSync(schemaFile)) {
        return reject("The schema file does not exist:" + schemaFile);
      }

      var schema = require(schemaFile);

      return fulfill(schema);
    });
  };

  var schemaValidate = function(inputs, schema) {
    return new Promise(function(fulfill, reject) {
      var results = validator.validate(inputs, schema);

      if (results.valid) {
        return fulfill(results);
      } else {
        return reject(results);
      }
    });
  };

  var loadMock = function(service, action) {
    return new Promise(function(fulfill, reject) {

      var mockDirService = path.join(__dirname, "mock", service);
      var mockDirAction = path.join(mockDirService, action);

      // load the schema
      if (!fs.existsSync(mockDirService)) {
        return reject("The mock folder structure does not exist:" + mockDirService);
      }

      if (!fs.existsSync(mockDirAction)) {
        return reject("The mock folder structure does not exist:" + mockDirAction);
      }

      var files = fs.readdirSync(mockDirAction);

      var mock = {};
      files.forEach(function(file) {

         mock[file.replace(".json","")] = require(path.join(mockDirAction, file));

      });

      return fulfill(mock);
    });
  };

  var validateMockInputs = function(opts, mock4Action) {
    return new Promise(function(fulfill, reject) {

      if (!opts.mockReject && !opts.mockFulfill) {
        return reject("If opts.mock=true, then opts.mockReject or opts.mockFulfill must exist");
      }

      if (opts.mockReject && opts.mockFulfill) {
        return reject("If opts.mock=true, then only one opts.mockReject or opts.mockFulfill can exist");
      }

      if (!mock4Action[opts.mockReject] && !mock4Action[opts.mockFulfill]) {
        return reject("The mock4Action does not contain configuration for mockReject/mockFulfill:" + (opts.mockReject ? opts.mockReject : opts.mockFulfill));
      }

      return fulfill("valid");
    });
  };


  return {
    buildMarathonUrl: buildMarathonUrl,
    buildUrlPath: buildUrlPath,
    loadApiMap: loadApiMap,
    parseApiMap: parseApiMap,
    loadSchema: loadSchema,
    schemaValidate: schemaValidate,
    loadMock: loadMock,
    validateMockInputs: validateMockInputs
  };
}();
