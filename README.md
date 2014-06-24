# node-tvdb

Node.js library for accessing [TheTVDB API](http://www.thetvdb.com/wiki/index.php/Programmers_API). Heavily based on [joaocampinhos/thetvdb-api](https://github.com/joaocampinhos/thetvdb-api), but does some additional work to give nicer data output.

## Features

- Handle errors from API as JavaScript errors
- Only returns relevant data (no need to call response.Data.Series etc.)
- Set language at initialisation or afterwards when needed
- Normalised keys and values
- Empty values parsed as null

## Installation

Install with [npm](http://npmjs.org/):

```
npm install --save node-tvdb
```

And run tests with [Mocha](http://visionmedia.github.io/mocha/):

```
TVDB_KEY=[YOUR API KEY HERE] mocha
```
> _Install mocha with: `npm install -g mocha` (sudo may be required for your setup)_

## Example Usage

To start using this library you first need an API key. You can request one [here](http://thetvdb.com/?tab=apiregister).
Then just follow this simple example that fetches all the shows containing "The Simpsons" in the name.

```
var TVDBClient	= require("node-tvdb"),
	client		= new TVDBClient("ABC123");

client.getSeries("The Simpsons", function(err, response) {
	// handle error and response
});
```

## API

### var client = new TVDBClient(API_KEY, language)
```
var TVDBClient			= require("node-tvdb");

var client				= new TVDBClient("ABC123"), // language defaults to "en"
	clientePortuguese	= new TVDBClient("ABC123", "pt");
```

### client.getLanguages(callback)
```
client.getLanguages(function(error, response) {
	// handle error and response
});
```

### client.getLanguage()
```
client.getLanguage(); // => "en"
```

### client.setLanguage(language)
```
client.setLanguage("pt");
```

### client.getTime(callback)
```
client.getTime(function(error, response) {
	// handle error and response
});
```

### client.getSeries(seriesName, callback)
```
client.getSeries("Breaking Bad", function(error, response) {
	// handle error and response
});
```

### client.getSeriesById(seriesId, callback)
```
client.getSeriesById(73255, function(error, response) {
	// handle error and response
});
```

### client.getSeriesByRemoteId(remoteId, callback)
```
client.getSeriesByRemoteId("tt0903747", function(error, response) {
	// handle error and response
});
```
> Note: `node-tvdb` automatically selects between remote providers (IMDb and zap2it)

### client.getSeriesAllById(seriesId, callback)
```
client.getSeriesAllById(73255, function(error, response) {
	// handle error and response
});
```

### client.getActors(seriesId, callback)
```
client.getActors(73255, function(error, response) {
	// handle error and response
});
```

### client.getBanners(seriesId, callback)
```
client.getBanners(73255, function(error, response) {
	// handle error and response
});
```

### client.getUpdates(time, callback)
```
client.getUpdates(1400611370, function(error, response) {
	// handle error and response
});
```

## License

The MIT License (MIT)

Copyright (c) 2014 Edward Wellbrook <edwellbrook@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
