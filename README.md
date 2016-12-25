# node-tvdb

[![wercker status](https://app.wercker.com/status/19dcad373ede868e37754a0367d68382/s/master "wercker status")](https://app.wercker.com/project/bykey/19dcad373ede868e37754a0367d68382)

Node.js library for accessing [TheTVDB API](https://api.thetvdb.com/swagger/). Refactored from [joaocampinhos/thetvdb-api](https://github.com/joaocampinhos/thetvdb-api) to give nicer output and lots of additional features.

Pull requests are always very welcome.

## Features

- Handle errors from API as JavaScript errors
- Only returns relevant data (no need to call response.Data.Series etc.)
- Set language at initialisation or on each function call
- Return values through promises (dropped callback support)
- Use new JSON API from TheTVDB
- [Tests with Mocha and Wercker CI](https://app.wercker.com/#applications/53f155d02094f9781d058f98)

## Installation

Install with [npm](https://npmjs.org/):

``` shell
npm install --save node-tvdb
```

And run tests with [Mocha](https://mochajs.org):

``` shell
TVDB_KEY=[YOUR API KEY HERE] npm test
```

> _Mocha is installed as a development dependency; you do not need to install it globally to run the tests._

## Example Usage

To start using this library you first need an API key. You can request one [here](http://thetvdb.com/?tab=apiregister). Then just follow this simple example that fetches all the shows containing "The Simpsons" in the name.

``` javascript
const TVDB = require("node-tvdb");
const tvdb = new TVDB("ABC123");

tvdb.getSeriesByName("The Simpsons")
    .then(response => { /* process data */ })
    .catch(error => { /* handle error */ });
```

## API

See [tests](test) and [TheTVDB API documentation](https://api.thetvdb.com/swagger/) for details about response data format.

### new Client(API_KEY, [language])

Set up a client with your API key and optionally a default language

``` javascript
const Client = require("node-tvdb");

const tvdb           = new Client("ABC123"); // lang defaults to "en"
const tvdbPortuguese = new Client("ABC123", "pt");
```

<!--- Function documentation -->
### getLanguages

Get available languages useable by TheTVDB API
([TheTVDB API](https://api.thetvdb.com/swagger#!/Languages/get_languages))

``` javascript
tvdb.getLanguages()
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getEpisodeById

Get episode by episode id
([TheTVDB API](https://api.thetvdb.com/swagger#!/Episodes/get_episodes_id))

``` javascript
tvdb.getEpisodeById(4768125)
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getEpisodesBySeriesId

Get all episodes by series id
([TheTVDB API](https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes))

``` javascript
tvdb.getEpisodesBySeriesId(153021)
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getSeriesById

Get basic series information by id
([TheTVDB API](https://api.thetvdb.com/swagger#!/Series/get_series_id))

``` javascript
tvdb.getSeriesById(73255)
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getEpisodesByAirDate

Get series episode by air date
([TheTVDB API](https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query))

``` javascript
tvdb.getEpisodeByAirDate(153021, '2011-10-03')
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getSeriesByName

Get basic series information by name
([TheTVDB API](https://api.thetvdb.com/swagger#!/Search/get_search_series))

``` javascript
tvdb.getSeriesByName('Breaking Bad')
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getActors

Get series actors by series id
([TheTVDB API](https://api.thetvdb.com/swagger#!/Series/get_series_id_actors))

``` javascript
tvdb.getActors(73255)
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getSeriesByImdbId

Get basic series information by imdb id
([TheTVDB API](https://api.thetvdb.com/swagger#!/Search/get_search_series))

``` javascript
tvdb.getSeriesByImdbId('tt0903747')
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getSeriesByZap2ItId

Get basic series information by zap2it id
([TheTVDB API](https://api.thetvdb.com/swagger#!/Search/get_search_series))

``` javascript
tvdb.getSeriesByZap2ItId('EP00018693')
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getSeriesBanner

Get series banner by series id
([TheTVDB API](https://api.thetvdb.com/swagger#!/Series/get_series_id_filter))

``` javascript
tvdb.getSeriesBanner(73255)
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getUpdates

Get a list of series updated since one or between two given unix timestamps
([TheTVDB API](https://api.thetvdb.com/swagger#!/Updates/get_updated_query))

``` javascript
tvdb.getUpdates(1400611370, 1400621370)
    .then(response => { /* handle response */ })
    .catch(error => { /* handle error */ });
```


### getSeriesAllById

Get series and episode information by series id
([TheTVDB API](https://api.thetvdb.com/swagger#!/Series/get_series_id))
([TheTVDB API](https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes))

``` javascript
tvdb.getSeriesAllById(73255)
    .then(response => {
        /* handle response */
        console.log(response); // response contains series data (e.g. `response.id`, `response.seriesName`)
        console.log(response.episodes); // response contains an array of episodes
    })
    .catch(error => { /* handle error */ });
```


### sendRequest

Runs a get request with the given options, useful for running custom requests

``` javascript
tvdb.sendRequest('unimplmented/endpoint', { custom: 'options' })
    .then(response => {
        /* handle response */
    })
    .catch(error => { /* handle error */ });
```
<!--- Function documentation -->

## License

The MIT License (MIT)
