/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

"use strict";

const request = require("request");

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

class Client {

    constructor(opts) {
        const TVDB_API_VERSION = "1.2.0";

        opts = opts || {};

        this.language = opts.language || "en";
        this.token = opts.token;

        this.request = request.defaults({
            baseUrl: "https://api-dev.thetvdb.com/",
            headers: {
                "User-Agent": "edwellbrook/node-tvdb",
                "Accept": `application/vnd.thetvdb.v${TVDB_API_VERSION}`
            },
            json: true
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Authentication/post_login

    auth(apiKey) {
        let self = this;

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
    }


    // https://api-dev.thetvdb.com/swagger#!/Authentication/get_refresh_token

    refreshToken() {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/refresh",
                headers: {
                    Authorization: `Bearer ${self.token}`
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                self.token = data.token;
                resolve();
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Languages/get_languages

    getLanguages() {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/languages",
                headers: {
                    Authorization: `Bearer ${self.token}`
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Languages/get_languages_id

    getLanguage(id) {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: `/languages/${id}`,
                headers: {
                    "Authorization": `Bearer ${self.token}`
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data);
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Search/get_search_series

    searchSeries(key, value) {
        let self = this;

        // default to "name" key if only one param passed
        if (value == null) {
            value = key;
            key = "name";
        }

        return new Promise(function(resolve, reject) {
            let query = {};
            query[key] = value;

            self.request.get({
                uri: "/search/series",
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                },
                qs: query
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Search/get_search_series_params

    searchSeriesParams() {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: "/search/series/params",
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data.data.params);
            });
        });
    }


    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id

    getSeries(id) {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: `/series/${id}`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err) return reject(err);

                resolve(data.data);
            });
        });
    }

    // https://api-dev.thetvdb.com/swagger#!/Series/get_series_id_episodes

    getSeriesEpisodes(id) {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.request.get({
                uri: `/series/${id}/episodes`,
                headers: {
                    "Authorization": `Bearer ${self.token}`,
                    "Accept-Language": self.language
                }
            }, function(err, res, data) {
                if (err) return reject(err);
                resolve(data.data);
            });
        });
    }

}

//
// Utilities
//



//
// Exports
//

module.exports = Client;
