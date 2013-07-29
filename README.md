[![Build Status](https://travis-ci.org/joaocampinhos/thetvdb-api.png)](https://travis-ci.org/joaocampinhos/thetvdb-api)

# Thetvdb-api

Node.js library for accessing [TheTVDB Api](http://www.thetvdb.com/wiki/index.php/Programmers_API).



## Index

* [Installation](#installation)
* [Usage](#usage)
* [Api](#api)
* [License](#license)



## Installation

Install with the Node.JS package manager [npm](http://npmjs.org/):

```bash
npm install thetvdb-api
```

or

Install via git clone:

```bash
git clone https://github.com/joaocampinhos/thetvdb-api.git
cd thetvdb-api
npm install
```



## Usage

To start using this library you first need an API key. You can request one [here](http://thetvdb.com/?tab=apiregister).
Then just follow this simple example that fetches all the shows containing "the Simpsons" in the name.

```js
var tvDB    = require("thetvdb-api"),
    key     = "abc123";

tvDB(key).getSeries("the Simpsons", function(err, res) {
  if (!err) console.log(res);
});
```



## API

Since this api is a little bit different that the usual REST api's I tried to change things a bit and simplified some of the names.
Not all API endpoints are available but you can see them all here:
<http://www.thetvdb.com/wiki/index.php/Programmers_API#File_Structure>

Here are the ones provided in the library so far:

```js
// Get all the available languages
tvDB(key).getLanguages(function(err,res){ });

// Get the current language
tvDB(key).getLanguage();

// Set a different language
tvDB(key).setLanguages(lang);

// Get the current server time
tvDB(key).getTime(function(err,res){ });

// Get the series that matches the name
tvDB(key).getSeries(name, function(err,res){ });

// Get the series basic information that matches the id
tvDB(key).getSeriesById(id, function(err,res){ });

// Get the series full information that matches the id
tvDB(key).getSeriesAllById(id, function(err,res){ });

// Get all the actors of a given series
tvDB(key).getActors(id, function(err,res){ });

// Get all the banners of a given series
tvDB(key).getBanners(id, function(err,res){ });

// Get updated shows since the last time
tvDB(key).getUpdates(time, function(err,res){ });
```



## License

The MIT License (MIT)

Copyright (c) 2013 João Campinhos <joao@campinhos.pt>

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
