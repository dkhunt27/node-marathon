"use strict";

module.exports = function Marathon(url, opts) {

  var rp = require('request-promise');
  var Promise = require('bluebird');
  var Mock = require("./mock/mock.js");
  var utils = require("./utils.js");

  var mock = {};

  if (opts.mock) {
    mock = new Mock();
  }

  var marathonApi = {
    "apps": {
      "list": {
        "method": "GET",
        "path": "/v2/apps"
      },
      "getById": {
        "method": "GET",
        "path": "/v2/apps/{{appId}}"
      },
      "restart": {
        "method": "POST",
        "path": "/v2/apps/{{appId}}/restart"
      },
      "create": {
        "method": "POST",
        "path": "/v2/apps"
      }
    }
  };

  var callMarathon = function(fnInputs) {
    return new Promise(function (fulfill, reject) {
      var service = fnInputs.service;
      var action = fnInputs.action;
      var inputs = fnInputs.inputs;
      var urlParams = inputs.urlParams;
      var qsParams = inputs.qsParams;
      var body = inputs.body;

      // calling of the marathon api is a generic wrapper with most of the configuration
      // coming from the marathonApi object.  For better error handling, make sure
      // called service/action exist in marathonApi
      if (!marathonApi[service]) {
        return reject("The marathonApi does not contain configuration for service:" + service);
      }
      if (!marathonApi[service][action]) {
        return reject("The marathonApi." + service + " does not contain configuration for action:" + action);
      }
      if (!marathonApi[service][action].path) {
        return reject("The marathonApi." + service + "." + action + " does not contain configuration for path");
      }
      if (!marathonApi[service][action].method) {
        return reject("The marathonApi." + service + "." + action + " does not contain configuration for method");
      }

      try {
        var path = utils.buildUrlPath(marathonApi[service][action].path, urlParams);

        var finalUrl = utils.buildMarathonUrl(url, path);
      } catch (err) {
        return reject(err);
      }

      if (opts.mock) {

        // For better error handling, make sure called service/action exist in mocked
        if (!opts.mockReject && !opts.mockFulfill) {
          return reject("If opts.mock=true, then opts.mockReject or opts.mockFulfill must exist");
        }
        if (opts.mockReject && opts.mockFulfill) {
          return reject("If opts.mock=true, then only one opts.mockReject or opts.mockFulfill can exist");
        }

        var mocked = new Mock();

        // For better error handling, make sure called service/action exist in mocked
        if (!mocked[service]) {
          return reject("The mocked does not contain configuration for service:" + service);
        }
        if (!mocked[service][action]) {
          return reject("The mocked." + service + " does not contain configuration for action:" + action);
        }
        if (!mocked[service][action][opts.mockReject] && !mocked[service][action][opts.mockFulfill]) {
          return reject("The mocked." + service + "." + action + " does not contain configuration for mockReject/mockFulfill:" + (opts.mockReject ? opts.mockReject : opts.mockFulfill));
        }

        if (opts.mockReject) {
          return reject(mocked[service][action][opts.mockReject]);
        } else {
          return fulfill(mocked[service][action][opts.mockFulfill]);
        }
      } else {

        var rpOptions = {
          method: marathonApi[service][action].method,
          uri: finalUrl,
          qs: qsParams,
          body: body,
          simple: true,
          json: true // Automatically parses the JSON string in the response
        };

        return rp(rpOptions).then(function (resolved) {
          return fulfill(resolved);
        }).catch(function (caught) {
          caught.rpOptions = rpOptions;
          return reject(caught);
        });
      }
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
