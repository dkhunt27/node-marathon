describe('utils.unit.tests.js', function(){
  "use strict";

  var path = require("path");
  var chai = require("chai");
  var expect = chai.expect;
  chai.use(require("dirty-chai"));

  var testFolder = '/tests';
  var rootFolder = '/node-marathon';
  var rootPath = __dirname.replace(testFolder, '');

  expect(rootPath.slice(rootFolder.length * -1), 'rootPath').to.equal(rootFolder);    //make sure the rootPath is correct

  var toBeTested, caught, rejected, fulfilled, functionToTest;

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

  var buildFunctionToTest = function (fnName) {
    return function() {
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return toBeTested[fnName].apply(null, args);
    };
  };

  beforeEach(function () {
    toBeTested = require(path.join(rootPath, 'utils.js'));

    functionToTest=null;
    caught=null;
    rejected=null;
    fulfilled=null;
  });

  afterEach(function() {
  });


  describe('buildMarathonUrl', function() {
    var url, pathParam;
    beforeEach(function(){
      url = null;
      pathParam = null;

      functionToTest = buildFunctionToTest("buildMarathonUrl");
    });
    describe ('given url with trailing slash', function(){
      beforeEach(function(){
        url = "http://someUrl/";
      });
      describe ('given path with trailing slash', function() {
        beforeEach(function () {
          pathParam = "somePath/";
        });
        describe('when called', function () {
          beforeEach(function (done) {
            functionToTest(url, pathParam)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal(null);
            expect(fulfilled, 'fulfilled').to.deep.equal("http://someUrl/somePath/");
          });
        });
      });
    });
  });
  describe('buildUrlPath', function() {
    var url, urlParams;
    beforeEach(function(){
      url = null;
      urlParams = null;

      functionToTest = buildFunctionToTest("buildUrlPath");
    });
    describe ('given url with no urlParams', function(){
      beforeEach(function(){
        url = "http://someUrl/";
      });
      describe ('given empty urlParams', function() {
        beforeEach(function () {
          urlParams = {};
        });
        describe('when called', function () {
          beforeEach(function (done) {
            functionToTest(url, urlParams)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal(null);
            expect(fulfilled, 'fulfilled').to.deep.equal("http://someUrl/");
          });
        });
      });
      describe ('given urlParams', function() {
        beforeEach(function () {
          urlParams = {"someId": "abc"};
        });
        describe('when called', function () {
          beforeEach(function (done) {
            functionToTest(url, urlParams)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal(null);
            expect(fulfilled, 'fulfilled').to.deep.equal("http://someUrl/");
          });
        });
      });
    });
    describe ('given url that expects urlParams', function(){
      beforeEach(function(){
        url = "http://someUrl/{{someId}}";
      });
      describe ('given empty urlParams', function() {
        beforeEach(function () {
          urlParams = {};
        });
        describe('when called', function () {
          beforeEach(function (done) {
            functionToTest(url, urlParams)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal("\"someId\" not defined in urlParams: {}");
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
      describe ('given urlParams', function() {
        beforeEach(function () {
          urlParams = {"someId": "abc"};
        });
        describe('when called', function () {
          beforeEach(function (done) {
            functionToTest(url, urlParams)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal(null);
            expect(fulfilled, 'fulfilled').to.equal("http://someUrl/abc");
          });
        });
      });
    });
  });
  describe('schemaValidate', function() {
    var inputs, schema, fnName;
    beforeEach(function(){
      fnName = "schemaValidate";
      inputs = null;
      schema = null;
    });
    describe ('given basic schema', function(){
      beforeEach(function(){
        schema = require(path.join(rootPath, testFolder, "schema", "basic.json"));
      });
      describe ('given valid root', function() {
        beforeEach(function () {
          inputs = {"prop1": {}};
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(inputs, schema)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal(null);
            expect(fulfilled, 'fulfilled').to.exist();
            expect(fulfilled.errors, 'fulfilled.errors').to.exist();
            expect(fulfilled.errors.length, 'fulfilled.errors.length').to.equal(0);
          });
        });
      });
      describe ('given valid root and child', function() {
        beforeEach(function () {
          inputs = {"prop1": {"prop2": "123"}};
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(inputs, schema)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal(null);
            expect(fulfilled, 'fulfilled').to.exist();
            expect(fulfilled.errors, 'fulfilled.errors').to.exist();
            expect(fulfilled.errors.length, 'fulfilled.errors.length').to.equal(0);
          });
        });
      });
      describe ('given valid root and child and array enum child', function() {
        beforeEach(function () {
          inputs = {"prop1": {"prop2": "123", "prop3": ["xyz"]}};
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(inputs, schema)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal(null);
            expect(fulfilled, 'fulfilled').to.exist();
            expect(fulfilled.errors, 'fulfilled.errors').to.exist();
            expect(fulfilled.errors.length, 'fulfilled.errors.length').to.equal(0);
          });
        });
      });
      describe ('given invalid root', function() {
        beforeEach(function () {
          inputs = {"propa": {}};
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(inputs, schema)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should reject with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.exist();
            expect(rejected.errors.length, 'rejected.errors.length').to.equal(2);
            expect(rejected.errors[0].stack, 'rejected.errors[0].stack').to.equal('instance additionalProperty "propa" exists in instance when not allowed');
            expect(rejected.errors[1].stack, 'rejected.errors[1].stack').to.equal('instance requires property "prop1"');
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
      describe ('given addtl invalid root', function() {
        beforeEach(function () {
          inputs = { "prop1": {}, "propa": {}};
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(inputs, schema)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should reject with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.exist();
            expect(rejected.errors.length, 'rejected.errors.length').to.equal(1);
            expect(rejected.errors[0].stack, 'rejected.errors[0].stack').to.equal('instance additionalProperty "propa" exists in instance when not allowed');
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
      describe ('given valid root and invalid child', function() {
        beforeEach(function () {
          inputs = {"prop1": {"propa": "abc"}};
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(inputs, schema)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should reject with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.exist();
            expect(rejected.errors.length, 'rejected.errors.length').to.equal(1);
            expect(rejected.errors[0].stack, 'rejected.errors[0].stack').to.equal('instance.prop1 additionalProperty "propa" exists in instance when not allowed');
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
      describe ('given valid root and invalid addtl child', function() {
        beforeEach(function () {
          inputs = {"prop1": {"prop2": "abc", "propa": "abc"}};
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(inputs, schema)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should reject with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.exist();
            expect(rejected.errors.length, 'rejected.errors.length').to.equal(1);
            expect(rejected.errors[0].stack, 'rejected.errors[0].stack').to.equal('instance.prop1 additionalProperty "propa" exists in instance when not allowed');
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
      describe ('given valid root and invalid enum child', function() {
        beforeEach(function () {
          inputs = {"prop1": {"prop2": "abc", "prop3": ["123"]}};
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(inputs, schema)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should reject with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.exist();
            expect(rejected.errors.length, 'rejected.errors.length').to.equal(1);
            expect(rejected.errors[0].stack, 'rejected.errors[0].stack').to.equal('instance.prop1.prop3[0] is not one of enum values: rst,uvw,xyz');
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
    });
  });
});

