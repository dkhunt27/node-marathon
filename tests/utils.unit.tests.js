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
      describe ('given no urlParams', function() {
        beforeEach(function () {
          urlParams = null;
        });
        describe('when called', function () {
          beforeEach(function (done) {
            functionToTest(url, urlParams)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should reject with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal("urlParams must exist");
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
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
    describe ('given no url', function(){
      beforeEach(function(){
        url = null;
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
            expect(rejected, 'rejected').to.equal("url must exist");
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
    });
  });
  describe('parseApiMap', function() {
    var fnName, apiMap, service, action;
    beforeEach(function () {
      fnName = "parseApiMap";
      apiMap = null;
      service = null;
      action = null;
    });
    describe('given valid apiMap', function () {
      beforeEach(function () {
        apiMap = {
          "someService": {
            "someAction": {
              "path": "somePath",
              "method": "someMethod"
            }
          }
        };
      });
      describe('given valid service', function () {
        beforeEach(function () {
          service = "someService";
        });
        describe('given valid action', function () {
          beforeEach(function () {
            action = "someAction";
          });
          describe('when called', function () {
            beforeEach(function (done) {

              functionToTest = buildFunctionToTest(fnName);

              functionToTest(apiMap, service, action)
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should fulfill with expected results', function () {
              expect(caught, 'caught').to.equal(null);
              expect(rejected, 'rejected').to.equal(null);
              expect(fulfilled, 'fulfilled').to.deep.equal({
                "path": "somePath",
                "method": "someMethod"
              });
            });
          });
        });
        describe('given invalid action', function () {
          beforeEach(function () {
            action = "notValidAction";
          });
          describe('when called', function () {
            beforeEach(function (done) {

              functionToTest = buildFunctionToTest(fnName);

              functionToTest(apiMap, service, action)
                .then(setFulfilled, setRejected)
                .catch(setCaught)
                .finally(done);
            });
            it('then should reject with expected results', function () {
              expect(caught, 'caught').to.equal(null);
              expect(rejected, 'rejected').to.equal("The apiMap.someService does not contain configuration for action:notValidAction");
              expect(fulfilled, 'fulfilled').to.equal(null);
            });
          });
        });
      });
      describe('given invalid service', function () {
        beforeEach(function () {
          service = "notValidService";
          action = "someAction";
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(apiMap, service, action)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should reject with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal("The apiMap does not contain configuration for service:notValidService");
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
    });
    describe('given no apiMap', function () {
      beforeEach(function () {
        apiMap = null;
        service = "someService";
        action = "someAction";
      });
      describe('when called', function () {
        beforeEach(function (done) {

          functionToTest = buildFunctionToTest(fnName);

          functionToTest(apiMap, service, action)
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should reject with expected results', function () {
          expect(caught, 'caught').to.equal(null);
          expect(rejected, 'rejected').to.equal("apiMap must exist");
          expect(fulfilled, 'fulfilled').to.equal(null);
        });
      });
    });
  });
  describe('validateMockInputs', function() {
    var fnName, opts, mock4Action;
    beforeEach(function () {
      fnName = "validateMockInputs";
      opts = null;
      mock4Action = null;
    });
    describe('given valid opts', function () {
      beforeEach(function () {
        opts = {
          "mockReject": "foo"
        };
      });
      describe('given valid mock4Action', function () {
        beforeEach(function () {
          mock4Action = {
            "foo": "bar"
          };
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(opts, mock4Action)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should fulfill with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal(null);
            expect(fulfilled, 'fulfilled').to.equal("valid");
          });
        });
      });
      describe('given invalid mock4Action', function () {
        beforeEach(function () {
          mock4Action = {
            "notFoo": "bar"
          };
        });
        describe('when called', function () {
          beforeEach(function (done) {

            functionToTest = buildFunctionToTest(fnName);

            functionToTest(opts, mock4Action)
              .then(setFulfilled, setRejected)
              .catch(setCaught)
              .finally(done);
          });
          it('then should reject with expected results', function () {
            expect(caught, 'caught').to.equal(null);
            expect(rejected, 'rejected').to.equal("The mock4Action does not contain configuration for mockReject/mockFulfill:foo");
            expect(fulfilled, 'fulfilled').to.equal(null);
          });
        });
      });
    });
    describe('given invalid opts (no mockReject/mockFulfill)', function () {
      beforeEach(function () {
        opts = {
          "not": "correct"
        };
        mock4Action = {
          "foo": "bar"
        };
      });
      describe('when called', function () {
        beforeEach(function (done) {

          functionToTest = buildFunctionToTest(fnName);

          functionToTest(opts, mock4Action)
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should reject with expected results', function () {
          expect(caught, 'caught').to.equal(null);
          expect(rejected, 'rejected').to.equal("If opts.mock=true, then opts.mockReject or opts.mockFulfill must exist");
          expect(fulfilled, 'fulfilled').to.equal(null);
        });
      });
    });
    describe('given invalid opts (both mockReject/mockFulfill)', function () {
      beforeEach(function () {
        opts = {
          "mockReject": "foo",
          "mockFulfill": "foo"
        };
        mock4Action = {
          "foo": "bar"
        };
      });
      describe('when called', function () {
        beforeEach(function (done) {

          functionToTest = buildFunctionToTest(fnName);

          functionToTest(opts, mock4Action)
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should reject with expected results', function () {
          expect(caught, 'caught').to.equal(null);
          expect(rejected, 'rejected').to.equal("If opts.mock=true, then only one opts.mockReject or opts.mockFulfill can exist");
          expect(fulfilled, 'fulfilled').to.equal(null);
        });
      });
    });
    describe('given no opts', function () {
      beforeEach(function () {
        opts = null;
        mock4Action = {
          "foo": "bar"
        };
      });
      describe('when called', function () {
        beforeEach(function (done) {

          functionToTest = buildFunctionToTest(fnName);

          functionToTest(opts, mock4Action)
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });
        it('then should reject with expected results', function () {
          expect(caught, 'caught').to.equal(null);
          expect(rejected, 'rejected').to.equal("opts must exist");
          expect(fulfilled, 'fulfilled').to.equal(null);
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

