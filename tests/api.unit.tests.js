describe('api.unit.tests.js', function(){
  "use strict";

  var path = require("path");
  var chai = require("chai");
  var expect = chai.expect;
  chai.use(require("dirty-chai"));
  var sinon = require("sinon");
  var _ = require("underscore");

  var testFolder = '/tests';
  var rootFolder = '/node-marathon';
  var rootPath = __dirname.replace(testFolder, '');
  var toBeTested;
  var caught, rejected, fulfilled;

  expect(rootPath.slice(rootFolder.length * -1), 'rootPath').to.equal(rootFolder);    //make sure the rootPath is correct

  var fakeUrl, fakeOptions, functionToTest, service, action, urlParams, qsParams, body, settingToNothingSoItWillDefault, sinoned, expected;

  var Promise = require("bluebird");
  var utils = require(path.join(rootPath, 'utils.js'));

  require('sinon-as-promised')(Promise);

  var Mock = require(path.join(rootPath, testFolder, "mock.js"));
  var mocked = new Mock();

  var setFulfilled = function(results) {
    fulfilled = results;
    return fulfilled;
  };

  var setRejected = function(results) {
    rejected = results;
    return rejected;
  };

  var setCaught = function(results) {
    caught = results;
    return caught;
  };

  var buildFunctionToTest = function (serviceToCall, methodToCall) {
    return function() {
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return toBeTested[serviceToCall][methodToCall].apply(null, args);
    };
  };

  var fulfillWithExpectedResults = function(expected, expOnly) {

    var exp = expected;

    if (!expOnly) {
      exp = {
        inputs: {
          urlParams: urlParams ? urlParams : {},
          qsParams: qsParams ? qsParams : {},
          body: body ? body : {}
        },
        output: expected
      };
    }

    expect(caught, 'caught').to.equal(null);
    expect(rejected, 'rejected').to.equal(null);
    expect(fulfilled, 'fulfilled').to.deep.equal(exp);
  };

  var rejectWithExpectedResults = function(expected, expOnly) {

    var exp = expected;

    if (!expOnly) {
      exp = {
        inputs: {
          urlParams: urlParams ? urlParams : {},
          qsParams: qsParams ? qsParams : {},
          body: body ? body : {}
        },
        output: expected
      };
    }

    expect(caught, 'caught').to.equal(null);
    expect(rejected, 'rejected').to.deep.equal(exp);
    expect(fulfilled, 'fulfilled').to.equal(null);
  };

  beforeEach(function () {
    fakeUrl = "http://someUrl";
    fakeOptions={};
    service=null;
    action=null;
    functionToTest=null;
    caught=null;
    rejected=null;
    fulfilled=null;
    urlParams = {};
    qsParams = {};
    body = {};
    expected=null;
  });

  afterEach(function() {
  });


  describe('mocked', function() {
    beforeEach(function() {
      fakeOptions.mock = true;
    });
    describe('apps', function () {
      beforeEach(function () {
        service = "apps";
      });
      describe('list', function () {
        beforeEach(function () {
          action = "list";
        });
        describe('given valid inputs', function () {
          beforeEach(function () {
            urlParams = settingToNothingSoItWillDefault;

            qsParams = settingToNothingSoItWillDefault;

            body = settingToNothingSoItWillDefault;
          });
          describe('when called (mocked OK200)', function () {
            beforeEach(function (done) {

              fakeOptions.mockFulfill = "OK200";

              toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

              functionToTest = buildFunctionToTest(service, action);

              functionToTest({
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              })
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should fulfill with expected results', function () {
              fulfillWithExpectedResults(mocked[service][action][fakeOptions.mockFulfill]);
            });
          });
          describe('when called (mocked NotFound404)', function () {
            beforeEach(function (done) {

              fakeOptions.mockReject = "NotFound404";

              toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

              functionToTest = buildFunctionToTest(service, action);

              functionToTest({
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              })
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should reject with expected results', function () {
              rejectWithExpectedResults(mocked[service][action][fakeOptions.mockReject]);
            });
          });
        });
        describe('given invalid inputs', function () {
          beforeEach(function () {
            urlParams = {"bad": "prop"};

            qsParams = {"embed": ["incorrect"]};

            body = settingToNothingSoItWillDefault;
          });
          describe('when called (mocked OK200)', function () {
            beforeEach(function (done) {

              fakeOptions.mockFulfill = "OK200";

              toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

              functionToTest = buildFunctionToTest(service, action);

              functionToTest({
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              })
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should reject with expected results', function () {
              rejectWithExpectedResults('Inputs failed schema validation. Validation Error(s): instance.urlParams additionalProperty "bad" exists in instance when not allowed, instance.qsParams.embed[0] is not one of enum values: apps.tasks,apps.counts,apps.deployments,apps.lastTaskFailure,apps.failures,apps.taskStats', true);
            });
          });
        });
      });
      describe('get', function () {
        beforeEach(function () {
          action = "get";
        });
        describe('that will fulfill with 200', function () {
          beforeEach(function () {

            urlParams = {"appId": "someId"};
            fakeOptions.mockFulfill = "OK200";

            toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

            functionToTest = buildFunctionToTest(service, action);
          });
          describe('when called', function () {
            beforeEach(function (done) {
              functionToTest({
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              })
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should fulfill with expected results', function () {
              fulfillWithExpectedResults(mocked[service][action][fakeOptions.mockFulfill]);
            });
          });
        });
        describe('that will reject with 404', function () {
          beforeEach(function () {

            urlParams = {"appId": "someId"};

            fakeOptions.mockReject = "NotFound404";

            toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

            functionToTest = buildFunctionToTest(service, action);
          });
          describe('when called', function () {
            beforeEach(function (done) {
              functionToTest({
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              })
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should reject with expected results', function () {
              rejectWithExpectedResults(mocked[service][action][fakeOptions.mockReject]);
            });
          });
        });
      });
      describe('restart', function () {
        beforeEach(function () {
          action = "restart";
        });
        describe('that will fulfill with 200', function () {
          beforeEach(function () {

            urlParams = {"appId": "someId"};

            fakeOptions.mockFulfill = "OK200";

            toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

            functionToTest = buildFunctionToTest(service, action);
          });
          describe('when called', function () {
            beforeEach(function (done) {
              functionToTest({
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              })
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should fulfill with expected results', function () {
              fulfillWithExpectedResults(mocked[service][action][fakeOptions.mockFulfill]);
            });
          });
        });
        describe('that will reject with 404', function () {
          beforeEach(function () {

            urlParams = {"appId": "someId"};

            fakeOptions.mockReject = "NotFound404";

            toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

            functionToTest = buildFunctionToTest(service, action);
          });
          describe('when called', function () {
            beforeEach(function (done) {
              functionToTest({
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              })
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should reject with expected results', function () {
              rejectWithExpectedResults(mocked[service][action][fakeOptions.mockReject]);
            });
          });
        });
        describe('that will reject with 409', function () {
          beforeEach(function () {

            urlParams = {"appId": "someId"};

            fakeOptions.mockReject = "Conflict409";

            toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

            functionToTest = buildFunctionToTest(service, action);
          });
          describe('when called', function () {
            beforeEach(function (done) {
              functionToTest({
                urlParams: urlParams,
                qsParams: qsParams,
                body: body
              })
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should reject with expected results', function () {
              rejectWithExpectedResults(mocked[service][action][fakeOptions.mockReject]);
            });
          });
        });
      });
    });
  });

  describe('sinoned', function() {
    beforeEach(function() {
      service = "apps";
      action = "list";

      sinoned = {};
    });
    afterEach(function() {
      _.invoke(sinoned, "restore");
    });
    describe ('happy path, not mocked', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(true);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(true);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(true);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(true);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(true);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('loadApiMap rejects', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").rejects("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(false);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(false);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(false);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(false);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(false);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(false);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('parseApiMap rejects', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").rejects("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(false);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(false);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(false);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(false);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(false);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('loadSchema rejects', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").rejects("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(true);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(false);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(false);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(false);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(false);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('schemaValidate rejects', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").rejects("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(true);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(true);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(false);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(false);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(false);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('buildUrlPath rejects', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").rejects("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(true);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(true);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(true);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(false);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(false);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('buildMarathonUrl rejects', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").rejects("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(true);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(true);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(true);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(true);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(false);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('makeRequest rejects', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").rejects("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(true);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(true);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(true);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(true);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(true);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('loadMock rejects', function() {
      beforeEach(function () {

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").rejects("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(true);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(true);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(true);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(true);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(true);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(false);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(false);
        });
      });
    });
    describe ('happy path, mocked', function() {
      beforeEach(function () {

        fakeOptions.mock = true;

        sinoned.loadApiMap = sinon.stub(utils, "loadApiMap").resolves("loadApiMap");
        sinoned.parseApiMap = sinon.stub(utils, "parseApiMap").resolves("parseApiMap");
        sinoned.loadMock = sinon.stub(utils, "loadMock").resolves("loadMock");
        sinoned.loadSchema = sinon.stub(utils, "loadSchema").resolves("loadSchema");
        sinoned.schemaValidate = sinon.stub(utils, "schemaValidate").resolves("schemaValidate");
        sinoned.buildUrlPath = sinon.stub(utils, "buildUrlPath").resolves("buildUrlPath");
        sinoned.buildMarathonUrl = sinon.stub(utils, "buildMarathonUrl").resolves("buildMarathonUrl");
        sinoned.makeRequest = sinon.stub(utils, "makeRequest").resolves("makeRequest");
        sinoned.validateMockInputs = sinon.stub(utils, "validateMockInputs").resolves("validateMockInputs");

        toBeTested = require(path.join(rootPath, 'api.js'))(fakeUrl, fakeOptions);

        functionToTest = buildFunctionToTest(service, action);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams: urlParams, qsParams: qsParams, body: body})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should call with expected path', function () {
          expect(sinoned.loadApiMap.calledOnce, "sinoned.loadApiMap.calledOnce").to.equal(true);
          expect(sinoned.parseApiMap.calledOnce, "sinoned.parseApiMap.calledOnce").to.equal(true);
          expect(sinoned.loadSchema.calledOnce, "sinoned.loadSchema.calledOnce").to.equal(true);
          expect(sinoned.schemaValidate.calledOnce, "sinoned.schemaValidate.calledOnce").to.equal(true);
          expect(sinoned.buildUrlPath.calledOnce, "sinoned.buildUrlPath.calledOnce").to.equal(false);
          expect(sinoned.buildMarathonUrl.calledOnce, "sinoned.buildMarathonUrl.calledOnce").to.equal(false);
          expect(sinoned.makeRequest.calledOnce, "sinoned.makeRequest.calledOnce").to.equal(false);
          expect(sinoned.loadMock.calledOnce, "sinoned.loadMock.calledOnce").to.equal(true);
          expect(sinoned.validateMockInputs.calledOnce, "sinoned.validateMockInputs.calledOnce").to.equal(true);
        });
      });
    });
  });
});

