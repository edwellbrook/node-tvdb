# thetvdb-api

Node.js library for accessing [TheTVDB API](http://www.thetvdb.com/wiki/index.php/Programmers_API).

## Installation

Install with [NPM](http://npmjs.org/):

```
npm install --save thetvdb-api
```

## Example Usage

To start using this library you first need an API key. You can request one [here](http://thetvdb.com/?tab=apiregister).
Then just follow this simple example that fetches all the shows containing "The Simpsons" in the name.

```
var TVDBClient	= require("thetvdb-api"),
	client		= new TVDBClient("abc123");

client.getSeries("The Simpsons", function(err, res) {
	// handle errors and response
});
```

## API

Since this API is a little bit different that the usual REST API's I tried to change things a bit and simplified some of the names.
Not all API endpoints are available but you can see them all here:
<http://www.thetvdb.com/wiki/index.php/Programmers_API#File_Structure>

Here are the ones provided in the library so far:

```
// Get all the available languages
client.getLanguages(function(err, res) {});

// Get the current language
client.getLanguage();

// Set a different language
client.setLanguage("en");

// Get the current server time
client.getTime(function(err, res) {});

// Get the series that matches the name
client.getSeries("The Simpsons", function(err, res) {});

// Get the series basic information that matches the id
client.getSeriesById(71663, function(err, res) {});

// Get the series full information that matches the id
client.getSeriesAllById(71663, function(err, res) {});

// Get all the actors of a given series
client.getActors(71663, function(err, res) {});

// Get all the banners of a given series
client.getBanners(71663, function(err, res) {});

// Get updated shows since the last time
client.getUpdates(1374620168, function(err, res) {});
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
