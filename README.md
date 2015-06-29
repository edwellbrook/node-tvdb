# node-tvdb

[![wercker status](https://app.wercker.com/status/19dcad373ede868e37754a0367d68382/s/master "wercker status")](https://app.wercker.com/project/bykey/19dcad373ede868e37754a0367d68382)

Node.js library for accessing [TheTVDB API](http://www.thetvdb.com/wiki/index.php/Programmers_API). Refactored from [joaocampinhos/thetvdb-api](https://github.com/joaocampinhos/thetvdb-api) to give nicer output and lots of additional features.

Pull requests are always very welcome.

## Features

- Handle errors from API as JavaScript errors
- Only returns relevant data (no need to call response.Data.Series etc.)
- Set language at initialisation or afterwards when needed
- Return values through promises (dropped callback support)
- Use new JSON api from TheTVDB
- [Tests with Mocha and Wercker CI](https://app.wercker.com/#applications/53f155d02094f9781d058f98)

## Installation

Install with [npm](http://npmjs.org/):

```shell
npm install --save node-tvdb
```

And run tests with [Mocha](http://visionmedia.github.io/mocha/):

```shell
TVDB_KEY=[YOUR API KEY HERE] npm test
```
> _Mocha is installed as a development dependency; you do not need to install it globally to run the tests._

## Example Usage

To start using this library you first need an API key. You can request one [here](http://thetvdb.com/?tab=apiregister).
Then just follow this simple example that fetches all the shows containing "The Simpsons" in the name.

```javascript
var TVDB = require("node-tvdb");
var tvdb = new TVDB("ABC123");

tvdb.getSeries("The Simpsons", function(err, response) {
    // handle error and response
});
```

For use with node engines without `class`/`const`/`let`:

```javascript
var TVDB = require("node-tvdb/compat");
var tvdb = new TVDB("ABC123");

// continue as normal...
```

## API

### var client = new Client(API_KEY, [language])
```javascript
var Client = require("node-tvdb");

var tvdb           = new Client("ABC123"); // lang defaults to "en"
var tvdbPortuguese = new Client("ABC123", "pt");
```

### getTime
```javascript
tvdb.getTime(function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getTime()
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getSeriesByName
```javascript
tvdb.getSeriesByName("Breaking Bad", function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getSeriesByName("Breaking Bad")
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getSeriesById
```javascript
tvdb.getSeriesById(73255, function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getSeriesById(73255)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getSeriesByRemoteId
```javascript
tvdb.getSeriesByRemoteId("tt0903747", function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getSeriesByRemoteId("tt0903747")
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```
> Note: `node-tvdb` automatically selects between remote providers (IMDb and zap2it)

### getSeriesAllById
```javascript
tvdb.getSeriesAllById(73255, function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getSeriesAllById(73255)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getEpisodeById
```javascript
tvdb.getEpisodeById(4768125, function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getEpisodeById(4768125)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getActors
```javascript
tvdb.getActors(73255, function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getActors(73255)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getBanners
```javascript
tvdb.getBanners(73255, function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getBanners(73255)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getUpdates
```javascript
tvdb.getUpdates(1400611370, function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getUpdates(1400611370)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getUpdateRecords
```javascript
tvdb.getUpdateRecords("day", function(error, response) {
    // handle error and response
});
```
OR
```javascript
tvdb.getUpdateRecords("day")
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### utils.parsePipeList
```javascript
var list = "|Mos Def|Faune A. Chambers|"; // from a previous api call
var guestStars = Client.utils.parsePipeList(list);
```

## License

The MIT License (MIT)
