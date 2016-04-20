describe('api.unit.tests.js', function(){
  "use strict";

  var path = require("path");
  var chai = require("chai");
  var expect = chai.expect;
  chai.use(require("dirty-chai"));

  var testFolder = '/tests';
  var rootFolder = '/node-marathon';
  var rootPath = __dirname.replace(testFolder, '');
  var toBeTested;
  var caught, rejected, fulfilled;

  expect(rootPath.slice(rootFolder.length * -1), 'rootPath').to.equal(rootFolder);    //make sure the rootPath is correct

  var fakeUrl, fakeOptions, functionToTest, service, action, urlParams, qsParams, body;


  var Mock = require(path.join(rootPath, "mock/mock.js"));
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

  var fulfillWithExpectedResults = function(expected) {
    expect(caught, 'caught').to.equal(null);
    expect(rejected, 'rejected').to.equal(null);
    expect(fulfilled, 'fulfilled').to.deep.equal(expected);
  };

  var rejectWithExpectedResults = function(expected) {
    expect(caught, 'caught').to.equal(null);
    expect(rejected, 'rejected').to.deep.equal(expected);
    expect(fulfilled, 'fulfilled').to.equal(null);
  };

  beforeEach(function () {
    fakeUrl = "http://someUrl";
    fakeOptions = { "mock": true };
    service=null;
    action=null;
    functionToTest=null;
    caught=null;
    rejected=null;
    fulfilled=null;
    urlParams = {};
    qsParams = {};
    body = {};
  });

  afterEach(function() {
  });


  describe('apps', function() {
    beforeEach(function(){
      service = "apps";
    });
    describe ('list', function(){
      beforeEach(function(){
        action = "list";
      });
      describe ('that will fulfill with 200', function() {
        beforeEach(function () {

          fakeOptions.mockFulfill = "OK200";

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
          it('then should fulfill with expected results', function () {
            fulfillWithExpectedResults(mocked[service][action][fakeOptions.mockFulfill]);
          });
        });
      });
      describe ('that will reject with 404', function() {
        beforeEach(function () {

          fakeOptions.mockReject = "NotFound404";

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
          it('then should reject with expected results', function () {
            rejectWithExpectedResults(mocked[service][action][fakeOptions.mockReject]);
          });
        });
      });
    });
    describe ('getById', function(){
      beforeEach(function(){
        action = "getById";
      });
      describe ('that will fulfill with 200', function() {
        beforeEach(function () {

          urlParams = { "appId": "someId" };
          fakeOptions.mockFulfill = "OK200";

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
          it('then should fulfill with expected results', function () {
            fulfillWithExpectedResults(mocked[service][action][fakeOptions.mockFulfill]);
          });
        });
      });
      describe ('that will reject with 404', function() {
        beforeEach(function () {

          urlParams = { "appId": "someId" };

          fakeOptions.mockReject = "NotFound404";

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
          it('then should reject with expected results', function () {
            rejectWithExpectedResults(mocked[service][action][fakeOptions.mockReject]);
          });
        });
      });
    });
    describe ('restart', function(){
      beforeEach(function(){
        action = "restart";
      });
      describe ('that will fulfill with 200', function() {
        beforeEach(function () {

          urlParams = { "appId": "someId" };

          fakeOptions.mockFulfill = "OK200";

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
          it('then should fulfill with expected results', function () {
            fulfillWithExpectedResults(mocked[service][action][fakeOptions.mockFulfill]);
          });
        });
      });
      describe ('that will reject with 404', function() {
        beforeEach(function () {

          urlParams = { "appId": "someId" };

          fakeOptions.mockReject = "NotFound404";

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
          it('then should reject with expected results', function () {
            rejectWithExpectedResults(mocked[service][action][fakeOptions.mockReject]);
          });
        });
      });
      describe ('that will reject with 409', function() {
        beforeEach(function () {

          urlParams = { "appId": "someId" };

          fakeOptions.mockReject = "Conflict409";

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
          it('then should reject with expected results', function () {
            rejectWithExpectedResults(mocked[service][action][fakeOptions.mockReject]);
          });
        });
      });
    });
  });
});

