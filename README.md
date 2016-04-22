# Node Marathon
Node Marathon is a Mesos Marathon v2 API client for Node.js powered by Bluebird promises.  Based on great work by 
[elasticio marathon-node](https://github.com/elasticio/marathon-node)

The main difference between this one and elasticio is that all the methods or actions have a consistent signature.  Using schema validation to identify
valid/invalid inputs to each method/action.  There is built in mocking ability.

## Marathon REST API
[Marathon REST API](https://mesosphere.github.io/marathon/docs/rest-api.html)

The intention is to support every endpoint here in this client.  Each endpoint will be mapped to a service.action similarly how it is shown on the API documentation.
Each service.action function can use any one of the 3 inputs: urlParams, qsParams, and body.  Depending on the endpoint, these will be parsed.  Normally, urlParams and 
body are required or empty and qsParams are optional.  The urlParams map to any parameter in the url in the Marathon API doc.  The qsParams map to any  "Parameters" 
or query string parameters listed in that API.  And lastly, the body is the body of any action.

### Example
[POST /v2/apps/{appId}/restart](https://mesosphere.github.io/marathon/docs/rest-api.html#post-v2-apps-appid-restart) 

In the URL "{appId}" in maps to 
```
urlParams = { "appId": "[YOUR APP ID]" }
```

The Parameters table identifies an optional force parameter which maps to 
```
qsParams = { "force": false }
```

There is no body requirement, so it can be null or set to an empty object {}
```
body = {}
```

# Setup
```
npm install node-marathon

var client = require("node-marathon")(marathonUrl, options);

client.apps.restart({
        urlParams: {
            appId: "[YOUR APP ID]"
        },
        qsParams: {
            force: true
        },
        body: {}
    })
    .then(function(fulfilled) {
        // do something with results
    }).catch(function(caught) {
        // do something with error
    });
```

# Methods

## apps (service)

### list (action)
Get a list of apps

### getById (action)
Get an app by its id

### restart (action)
Restart an app


## Still a work in progress...more methods/actions to come


# Mocking
You can tell the code to not actually perform the call to marathon and just return a mocked result.  Not only does it return the mocked
result, it also returns the inputs.  This is so you can test that you passed in the inputs correctly.  When you enable mocking, you will
need to identify if the mock should fulfill or reject the call. And with what mocked result.  The available mocked results are in the mock
folder under the service/action you are performing.

```
var option = {
    mock: true,
    mockFulfill: "OK200"  // OR mockReject = "NotFound404"
}

var client = require("node-marathon")(marathonUrl, options);

client.apps.restart({
        urlParams: {
            appId: "[YOUR APP ID]"
        },
        qsParams: {
            force: true
        },
        body: {}
    })
    .then(function(fulfilled) {
        // do something with results
    }).catch(function(caught) {
        // do something with error
    });

```
