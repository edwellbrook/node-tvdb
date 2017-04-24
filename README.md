# node-tvdb

[![Build Status](https://travis-ci.org/edwellbrook/node-tvdb.svg?branch=master)](https://travis-ci.org/edwellbrook/node-tvdb)
[![npm Downloads](https://img.shields.io/npm/dm/node-tvdb.svg?style=flat)](https://www.npmjs.com/package/node-tvdb)

Node.js library for accessing [TheTVDB JSON API](https://api.thetvdb.com/swagger). Originally based on [joaocampinhos/thetvdb-api](https://github.com/joaocampinhos/thetvdb-api) to give nicer output and additional features.

Pull requests are always very welcome.

## Features

- Handle errors from API as JavaScript errors
- Only returns relevant data (no need to call response.Data.Series etc.)
- Set language at initialisation or on each function call
- Return values through promises (dropped callback support)
- Uses the new JSON API from TheTVDB
- [Tests with Mocha and Travis CI](https://travis-ci.org/edwellbrook/node-tvdb)

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
const TVDB = require('node-tvdb');
const tvdb = new TVDB('ABC123');

tvdb.getSeriesByName('The Simpsons')
    .then(response => { /* process data */ })
    .catch(error => { /* handle error */ });
```

## Full API Docs

Generated API docs with code examples can be found at: [edwellbrook.github.io/node-tvdb](https://edwellbrook.github.io/node-tvdb/).

For details on response data, please see [TheTVDB API docs](https://api.thetvdb.com/swagger).

## License

The MIT License (MIT)
