# node-tvdb

[![wercker status](https://app.wercker.com/status/19dcad373ede868e37754a0367d68382/s/master "wercker status")](https://app.wercker.com/project/bykey/19dcad373ede868e37754a0367d68382)

Node.js library for accessing [TheTVDB API](http://www.thetvdb.com/wiki/index.php/Programmers_API). Refactored from [joaocampinhos/thetvdb-api](https://github.com/joaocampinhos/thetvdb-api) to give nicer output and lots of additional features.

Pull requests are always very welcome.

## Features

- Handle errors from API as JavaScript errors
- Only returns relevant data (no need to call response.Data.Series etc.)
- Set language at initialisation or afterwards when needed
- Normalised keys and values
- Empty values parsed as null
- Updates endpoint grouped by type
- Supports both node callback functions and promises
- Utility function to parse TheTVDB API's pipe list (e.g. "|Name|Name|Name|Name|")
- Use zip data instead of straight xml where possible
- [Tests with Mocha and Wercker CI](https://app.wercker.com/#applications/53f155d02094f9781d058f98)

## Installation

Install with [npm](http://npmjs.org/):

``` shell
npm install --save node-tvdb
```

And run tests with [Mocha](http://visionmedia.github.io/mocha/):

``` shell
TVDB_KEY=[YOUR API KEY HERE] npm test
```

> _Mocha is installed as a development dependency; you do not need to install it globally to run the tests._

## Example Usage

To start using this library you first need an API key. You can request one [here](http://thetvdb.com/?tab=apiregister). Then just follow this simple example that fetches all the shows containing "The Simpsons" in the name.

``` javascript
var TVDB = require("node-tvdb");
var tvdb = new TVDB("ABC123");

tvdb.getSeriesByName("The Simpsons", function(err, response) {
    // handle error and response
});
```

For use with node engines without `class`/`const`/`let`:

``` javascript
var TVDB = require("node-tvdb/compat");
var tvdb = new TVDB("ABC123");

// continue as normal...
```

## API

### var client = new Client(API_KEY, [language])

Set up tvdb client with API key and optional language (defaults to "en")

``` javascript
var Client = require("node-tvdb");

var tvdb           = new Client("ABC123"); // lang defaults to "en"
var tvdbPortuguese = new Client("ABC123", "pt");
```

### getTime

Get the current server time

``` javascript
tvdb.getTime(function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getTime()
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getLanguages

Get available languages useable by TheTVDB API

``` javascript
tvdb.getLanguages(function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getLanguages()
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getSeriesByName

Get basic series information by name

``` javascript
tvdb.getSeriesByName("Breaking Bad", function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getSeriesByName("Breaking Bad")
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getSeriesById

Get basic series information by id

``` javascript
tvdb.getSeriesById(73255, function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getSeriesById(73255)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getSeriesByRemoteId

Get basic series information by remote id (zap2it or imdb)

``` javascript
tvdb.getSeriesByRemoteId("tt0903747", function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getSeriesByRemoteId("tt0903747")
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

> Note: `node-tvdb` automatically selects between remote providers (IMDb and zap2it)

### getSeriesAllById

Get full/all series information by id

``` javascript
tvdb.getSeriesAllById(73255, function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getSeriesAllById(73255)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getEpisodesById

Get all episodes by series id

``` javascript
tvdb.getEpisodesById(153021, function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getEpisodesById(153021)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getEpisodeById

Get episode by episode id

``` javascript
tvdb.getEpisodeById(4768125, function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getEpisodeById(4768125)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getEpisodeByAirDate

Get series episode by air date

``` javascript
tvdb.getEpisodeByAirDate(153021, "2011-10-03", function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getEpisodeByAirDate(153021, "2011-10-03")
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getActors

Get series actors by series id

``` javascript
tvdb.getActors(73255, function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getActors(73255)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getBanners

Get series banners by series id

``` javascript
tvdb.getBanners(73255, function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getBanners(73255)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getUpdates

Get series and episode updates since a given unix timestamp

``` javascript
tvdb.getUpdates(1400611370, function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getUpdates(1400611370)
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### getUpdateRecords

All updates within the given interval

``` javascript
tvdb.getUpdateRecords("day", function(error, response) {
    // handle error and response
});
```

OR

``` javascript
tvdb.getUpdateRecords("day")
    .then(function(response) { /* handle response */ })
    .catch(function(error) { /* handle error */ });
```

### utils.parsePipeList

Parse pipe list string to javascript array

``` javascript
var list = "|Mos Def|Faune A. Chambers|"; // from a previous api call
var guestStars = Client.utils.parsePipeList(list);
```

## License

The MIT License (MIT)
