"use strict";

module.exports = function Marathon(url, opts) {

  var Promise = require('bluebird');
  var utils = require("./utils.js");

  var callMarathon = function(fnInputs) {
    return new Promise(function (fulfill, reject) {
      var service = fnInputs.service;
      var action = fnInputs.action;
      var inputs = fnInputs.inputs ? fnInputs.inputs : {};
      var urlParams = inputs.urlParams ? inputs.urlParams : {};
      var qsParams = inputs.qsParams ? inputs.qsParams : {};
      var body = inputs.body ? inputs.body : {};

      var apiMap4Action, mock4Action, schema4Action, requestOptions;

      // LOAD THE API MAP
      return utils.loadApiMap().then(function(apiMap) {

        // THEN PARSE THE SERVICE/ACTION FROM API MAP
        return utils.parseApiMap(apiMap, service, action);

      }).then(function(apiMap4ActionTemp) {

        apiMap4Action = apiMap4ActionTemp;

        // THEN LOAD MOCK FOR SERVICE/ACTION
        return utils.loadMock(service, action);

      }).then(function(mock4ActionTemp) {

        mock4Action = mock4ActionTemp;

        // THEN LOAD SCHEMA FOR SERVICE/ACTION
        return utils.loadSchema(service, action);

      }).then(function(schema4ActionTemp) {

        schema4Action = schema4ActionTemp;

        // THEN VALIDATE INPUTS AGAINST SCHEMA
        return utils.schemaValidate({urlParams: urlParams, qsParams: qsParams, body: body}, schema4Action);

      }).then(function() {

        if (!opts.mock) {
          // THIS IS NOT A MOCK CALL

          // THEN BUILD THE URL PATH
          return utils.buildUrlPath(apiMap4Action.path, urlParams).then(function(urlPath) {

            // THEN BUILD THE FULL/FINAL URL
            return utils.buildMarathonUrl(url, urlPath);

          }).then(function(finalMarathonUrl) {

            requestOptions = {
              method: apiMap4Action.method,
              uri: finalMarathonUrl,
              qs: qsParams,
              useQuerystring: true,
              body: body,
              simple: true,
              json: true,
              headers: opts.headers
            };

            // THEN CALL MARATHON
            return utils.makeRequest(requestOptions).then(function(results) {

              return fulfill(results);

            });
          });

        } else {
          // THIS IS A MOCK CALL

          // VALIDATE MOCK INPUTS
          return utils.validateMockInputs(opts, mock4Action).then(function() {

            var results = {
              inputs: {
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              },
              output: {}
            };

            if (opts.mockReject) {

              results.output = mock4Action[opts.mockReject];

              return reject(results);

            } else {

              results.output = mock4Action[opts.mockFulfill];

              return fulfill(results);

            }

          });
        }
      }).catch(function (caught) {

        if (caught.schema && caught.errors && caught.errors.length > 0) {
          // assuming schema validation result error

          var errMsg = "Inputs failed schema validation. Validation Error(s): ";

          caught.errors.forEach(function(error, index) {
            errMsg = errMsg + error;
            if (index < caught.errors.length - 1) {
              errMsg = errMsg + ", ";
            }
          });

          caught = errMsg;
        }
        else if (requestOptions) {

          caught.requestOptions = requestOptions;

        }

        return reject(caught);

      });
    });
  };

  return {
    apps: {
      list: function (fnInputs) {
        return callMarathon({
          service: "apps",
          action: "list",
          inputs: fnInputs
        });
      },
      getById: function (fnInputs) {
        return callMarathon({
          service: "apps",
          action: "getById",
          inputs: fnInputs
        });
      },
      restart: function (fnInputs) {
        return callMarathon({
          service: "apps",
          action: "restart",
          inputs: fnInputs
        });
      }
    }
  };
};
