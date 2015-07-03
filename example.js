const TVDB = require("./");
const tvdb = new TVDB({language: "fr"});
const serieId = 73255;
const episodeId = 110992;

tvdb.auth(process.env.TVDB_KEY)
    .then(function () {
        console.log("Running: API " + process.env.TVDB_KEY);
        // get a list of the languages tvdb supports
        return tvdb.getLanguages();
    })
    .then(function (langs) {
        // set the language of the client to "en"
        tvdb.language = "en";

        // get a list of the search types tvdb supports
        return tvdb.searchSeriesParams();
    })
    .then(function (params) {
        // search for "house" using the first item in the search types/params
        // list
        return tvdb.searchSeries(params[0], "House");
    })
    .then(function (results) {
        // get the series info from the second item in the search results list
        return tvdb.getSeries(results[1].id);
    })
    .then(function (series) {
        // print the series info to the console
        console.log("getSerieInfo Results: " + JSON.stringify(series));
        return tvdb.getSeriesEpisodes(series.id);
    })
    .then(function (results) {
        console.log("GetSeriesEpisodes Results: " + JSON.stringify(results));
        return (tvdb.getEpisodeQuery(serieId, {'absoluteNumber': '1'}));
    })
    .then(function (results) {
        console.log("GetEpisodeQuery Results: " + JSON.stringify(results));
        return (tvdb.getEpisodeSummary(serieId));
    })
    .then(function (results) {
        console.log("GetEpisodeSummary Results: " + JSON.stringify(results));
        return (tvdb.getSeriesFilter(serieId, "poster"));
    })
    .then(function (results) {
        console.log("GetSeriesFilter Results: " + JSON.stringify(results));
        return (tvdb.getSeriesFilterParam(serieId));
    })
    .then(function (results) {
        console.log("GetSeriesFilterParam Results: " + JSON.stringify(results));
        return (tvdb.getSeriesImages(serieId));
    })
    .then(function (results) {
        console.log("GetSeriesImages Results: " + JSON.stringify(results));
        return tvdb.getSeriesImagesQuery(serieId, { keyType: "poster" });
    })
    .then(function (results) {
        console.log("GetSeriesImagesQuery Results: " + JSON.stringify(results));
        return tvdb.getSeriesImagesParams(serieId);
    })
    .then(function (results) {
        console.log("GetSeriesImagesParams Results: " + JSON.stringify(results));
        return tvdb.getEpisode(episodeId);
    })
    .then(function (results) {
        console.log("GetEpisode Results: " + JSON.stringify(results));
        return tvdb.getUpdates(1435784810);
    })
    .then(function (results) {
        console.log("GetUpdates Results: " + JSON.stringify(results));
        return tvdb.getUpdatesParams();
    })
    .then(function (results) {
        console.log("GetUpdatesParams Results: " + JSON.stringify(results));
        return tvdb.getSeriesEpisodesParams(serieId);
    })
    .then(function (results) {
        console.log("GetSeriesEpisodesParams Results: " + JSON.stringify(results));
    })
    .catch(function (err) {
        // if at any point above we hit an error, print it to the console
        console.log("Error: " + err);
    });
