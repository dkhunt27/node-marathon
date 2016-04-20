describe('api.integration.tests.js', function(){
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

  var functionToTest, serviceToCall, methodToCall, urlParams, qsParams;

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

  beforeEach(function () {
    var url = require("./realUrl.json").url;
    var options = {};

    toBeTested = require(path.join(rootPath, 'api.js'))(url, options);

    functionToTest=null;
    caught=null;
    rejected=null;
    fulfilled=null;
    urlParams=null;
  });

  afterEach(function() {
  });


  describe('apps', function() {
    beforeEach(function(){
      serviceToCall = "apps";
    });
    describe ('list', function(){
      beforeEach(function(){
        methodToCall = "list";

        functionToTest = buildFunctionToTest(serviceToCall, methodToCall);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest()
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });

        it('then should return fulfilled promise with a list of apps', function () {
          expect(caught, 'caught').to.equal(null);
          expect(rejected, 'rejected').to.equal(null);
          expect(fulfilled, 'fulfilled').to.exist();
          expect(fulfilled.apps, 'fulfilled.apps').to.exist();
          expect(fulfilled.apps.length, 'fulfilled.apps.length').to.exist();
          expect(fulfilled.apps.length, 'fulfilled.apps.length').to.be.greaterThan(1);
          expect(fulfilled.apps[0].id, 'fulfilled.apps[0].id').to.exist();
        });
      });
    });
    describe ('list?id', function(){
      beforeEach(function(){
        methodToCall = "list";
        qsParams = { "id": "/test/hello-world/1.0.0" };
        functionToTest = buildFunctionToTest(serviceToCall, methodToCall);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({qsParams:qsParams})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });

        it('then should return fulfilled promise with a list of apps', function () {
          expect(caught, 'caught').to.equal(null);
          expect(rejected, 'rejected').to.equal(null);
          expect(fulfilled, 'fulfilled').to.exist();
          expect(fulfilled.apps, 'fulfilled.apps').to.exist();
          expect(fulfilled.apps.length, 'fulfilled.apps.length').to.exist();
          expect(fulfilled.apps.length, 'fulfilled.apps.length').to.equal(1);
          expect(fulfilled.apps[0].id, 'fulfilled.apps[0].id').to.equal("/test/hello-world/1.0.0");
        });
      });
    });
  });

  describe('apps', function() {
    beforeEach(function(){
      serviceToCall = "apps";
    });
    describe ('getById', function(){
      beforeEach(function(){
        methodToCall = "getById";

        urlParams = { "appId": "/test/hello-world/1.0.0" };
        functionToTest = buildFunctionToTest(serviceToCall, methodToCall);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest({urlParams:urlParams})
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });

        it('then should return fulfilled promise with a list of apps', function () {
          expect(caught, 'caught').to.equal(null);
          expect(rejected, 'rejected').to.equal(null);
          expect(fulfilled, 'fulfilled').to.exist();
          expect(fulfilled.app, 'fulfilled.app').to.exist();
          expect(fulfilled.app.id, 'fulfilled.apps[0].id').to.equal("/test/hello-world/1.0.0");
        });
      });
    });
  });
});

