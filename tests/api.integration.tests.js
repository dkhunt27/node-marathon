describe('api.integration.tests.js', function(){
  "use strict";

  var path = require("path");
  var expect = require("chai").expect;
  var sinon = require("sinon");

  var testFolder = '/tests';
  var rootFolder = '/node-marathon';
  var rootPath = __dirname.replace(testFolder, '');
  var toBeTested;
  var caught, rejected, fulfilled;

  expect(rootPath.slice(rootFolder.length * -1), 'rootPath').to.equal(rootFolder);    //make sure the rootPath is correct

  var functionToTest, serviceToCall, methodToCall;

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

  beforeEach(function () {
    var url = require("./realUrl.json").url;
    var options = {};

    toBeTested = require(path.join(rootPath, 'api.js'))(url, options);

    functionToTest=null;
    caught=null;
    rejected=null;
    fulfilled=null;
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

        functionToTest = function() {
          var args = [];
          for (var i=0; i< arguments.length; i++) {
            args.push(arguments[i]);
          }
          return toBeTested[serviceToCall][methodToCall](null, args);
        };
      });
      describe('when called', function () {
        beforeEach(function (done) {
          functionToTest()
            .then(setFulfilled, setRejected)
            .catch(setCaught)
            .finally(done);
        });

        it('then should return fulfilled promise with a list of apps', function () {
          expect(fulfilled, 'fulfilled').to.exist;
          expect(fulfilled.apps, 'fulfilled.apps').to.exist;
          expect(fulfilled.apps.length, 'fulfilled.apps.length').to.exist;
          expect(fulfilled.apps.length, 'fulfilled.apps.length').to.be.greaterThan(1);
          expect(fulfilled.apps[0].id, 'fulfilled.apps[0].id').to.exist;
          expect(rejected, 'rejected').to.equal(null);
          expect(caught, 'caught').to.equal(null);
        });
      });
    });
  });
});

