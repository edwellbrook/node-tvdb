const TVDB = require("./");
const tvdb = new TVDB({language: "fr"});

tvdb.auth(process.env.TVDB_KEY)
    .then(function() {
        // get a list of the languages tvdb supports
        return tvdb.getLanguages();
    })
    .then(function(langs) {
        // set the language of the client to "en"
        tvdb.language = "en";

        // get a list of the search types tvdb supports
        return tvdb.searchSeriesParams();
    })
    .then(function(params) {
        // search for "house" using the first item in the search types/params
        // list
        return tvdb.searchSeries(params[0], "House");
    })
    .then(function(results) {
        // get the series info from the second item in the search results list
        return tvdb.getSeries(results[1].id);
    })
    .then(function(series) {
        // print the series info to the console
        console.log(series);
    })
    .catch(function(err) {
        // if at any point above we hit an error, print it to the console
        console.log(err);
    });
