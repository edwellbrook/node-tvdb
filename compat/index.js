/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

"use strict";

var request = require("request");

//
// updating for the new tvdb api
// - more info: https://forums.thetvdb.com/viewtopic.php?f=17&t=23259
// - api reference: https://api-dev.thetvdb.com/swagger
//
// lots of refactoring of this code will take place once the api methods from the
// reference web page is added below. for now, please just add the remaining methods
// and then we can move the request and error handling to its own dedicated function
//

//
// API Client
//

var Client = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};

    function Client(opts) {
        var TVDB_API_VERSION = "1.2.0";

        opts = opts || {};

        this.language = opts.language || "en";
        this.token = opts.token;

        this.request = request.defaults({
            baseUrl: "https://api-dev.thetvdb.com/",
            headers: {
                "User-Agent": "edwellbrook/node-tvdb",
                "Accept": ("application/vnd.thetvdb.v" + TVDB_API_VERSION)
            },
            json: true
        });
    }DP$0(Client,"prototype",{"configurable":false,"enumerable":false,"writable":false});


    // https://api-dev.thetvdb.com/swagger#!/Authentication/post_login

    proto$0.auth = function(apiKey) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.post({
                uri: "/login",
                body: {
                    "apikey": apiKey
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                self.token = data.token;
                resolve();
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Authentication/get_refresh_token

    proto$0.refreshToken = function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/refresh",
                headers: {
                    Authorization: ("Bearer " + (self.token))
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                self.token = data.token;
                resolve();
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Languages/get_languages

    proto$0.getLanguages = function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/languages",
                headers: {
                    Authorization: ("Bearer " + (self.token))
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Languages/get_languages_id

    proto$0.getLanguage = function(id) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: ("/languages/" + id),
                headers: {
                    "Authorization": ("Bearer " + (self.token))
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data);
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Search/get_search_series

    proto$0.searchSeries = function(key, value) {
        var self = this;

        // default to "name" key if only one param passed
        if (value == null) {
            value = key;
            key = "name";
        }

        return new Promise(function(resolve, reject) {
            var query = {};
            query[key] = value;

            self.request.get({
                uri: "/search/series",
                headers: {
                    "Authorization": ("Bearer " + (self.token)),
                    "Accept-Language": self.language
                },
                qs: query
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Search/get_search_series_params

    proto$0.searchSeriesParams = function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/search/series/params",
                headers: {
                    "Authorization": ("Bearer " + (self.token)),
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err) return reject(err);
                console.log(data.data);
                resolve(data.data.params);
            });
        });
    };


    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id

    proto$0.getSeries = function(id) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: ("/series/" + id),
                headers: {
                    "Authorization": ("Bearer " + (self.token)),
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    };

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_episodes

    proto$0.getSeriesEpisodes = function(id) {
        var self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: (("/series/" + id) + "/episodes"),
                headers: {
                    "Authorization": ("Bearer " + (self.token)),
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err) return reject(err);
                resolve(data.data);
            });
        });
    };

MIXIN$0(Client.prototype,proto$0);proto$0=void 0;return Client;})();

//
// Utilities
//



//
// Exports
//

module.exports = Client;
