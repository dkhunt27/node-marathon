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

  var toBeTested, functionToTest, results, caught;


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
    results = null;
    caught = null;
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
          beforeEach(function () {
            try {
              results = functionToTest(url, pathParam);
            } catch (err) {
              caught = err;
            }
          });
          it('then should fulfill with expected results', function () {
            expect(caught, "caught").to.not.exist();
            expect(results, "results").to.equal("http://someUrl/somePath/");
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
          beforeEach(function () {
            try {
              results = functionToTest(url, urlParams);
            } catch (err) {
              caught = err;
            }
          });
          it('then should fulfill with expected results', function () {
            expect(caught, "caught").to.not.exist();
            expect(results, "results").to.equal("http://someUrl/");
          });
        });
      });
      describe ('given urlParams', function() {
        beforeEach(function () {
          urlParams = {"someId": "abc"};
        });
        describe('when called', function () {
          beforeEach(function () {
            try {
              results = functionToTest(url, urlParams);
            } catch (err) {
              caught = err;
            }
          });
          it('then should fulfill with expected results', function () {
            expect(caught, "caught").to.not.exist();
            expect(results, "results").to.equal("http://someUrl/");
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
          beforeEach(function () {
            try {
              results = functionToTest(url, urlParams);
            } catch (err) {
              caught = err;
            }
          });
          it('then should fulfill with expected results', function () {
            expect(caught, "caught").to.exist();
            expect(caught.message, "caught.message").to.equal("\"someId\" not defined in urlParams: {}");
            expect(results, "results").to.not.exist();
          });
        });
      });
      describe ('given urlParams', function() {
        beforeEach(function () {
          urlParams = {"someId": "abc"};
        });
        describe('when called', function () {
          beforeEach(function () {
            try {
              results = functionToTest(url, urlParams);
            } catch (err) {
              caught = err;
            }
          });
          it('then should fulfill with expected results', function () {
            expect(caught, "caught").to.not.exist();
            expect(results, "results").to.equal("http://someUrl/abc");
          });
        });
      });
    });
  });
});

