/**
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

"use strict";

const request = require("superagent").get;
const parser  = require("xml2js").parseString;
const promise = require("when").promise;
const util    = require("util");

const REMOTE_PROVIDERS = {
    imdbid: /^tt/i,
    zap2it: /^ep/i
};

const PARSER_OPTS = {
    trim: true,
    normalize: true,
    ignoreAttrs: true,
    explicitArray: false,
    emptyTag: null
};

class Client {

    constructor(token, language) {
        if (!token) throw new Error("Access token must be set.");

        this.token = token;
        this.language = language || "en";
        this.baseURL = "http://www.thetvdb.com/api";
    }

    getLanguages(callback) {
        let path = `${this.baseURL}/${this.token}/languages.xml`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = (response && response.Languages) ? response.Languages.Language : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getTime(callback) {
        let path = `${this.baseURL}/Updates.php?type=none`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = (response && response.Items) ? response.Items.Time : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getSeries(name, callback) {
        let path = `${this.baseURL}/GetSeries.php?seriesname=${name}&language=${this.language}`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = (response && response.Data) ? response.Data.Series : null;
                response = !response || Array.isArray(response) ? response : [response];
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getSeriesById(id, callback) {
        let path = `${this.baseURL}/${this.token}/series/${id}/${this.language}.xml`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = (response && response.Data) ? response.Data.Series : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getSeriesByRemoteId(remoteId, callback) {
        let provider = "";
        let keys     = Object.keys(REMOTE_PROVIDERS);
        let len      = keys.length;

        for (let i = 0; i < len; i++) {
                if (REMOTE_PROVIDERS[keys[i]].exec(remoteId)) {
                    provider = keys[i];
                    break;
                }
        }

        let path = `${this.baseURL}/GetSeriesByRemoteID.php?${provider}=${remoteId}&language=${this.language}`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = (response && response.Data) ? response.Data.Series : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getSeriesAllById(id, callback) {
        let path = `${this.baseURL}/${this.token}/series/${id}/all/${this.language}.xml`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                if (response && response.Data && response.Data.Series) {
                    response.Data.Series.Episodes = response.Data.Episode;
                }

                response = response ? response.Data.Series : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getActors(id, callback) {
        var path = `${this.baseURL}/${this.token}/series/${id}/actors.xml`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = (response && response.Actors) ? response.Actors.Actor : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getBanners(id, callback) {
        let path = `${this.baseURL}/${this.token}/series/${id}/banners.xml`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = (response && response.Banners) ? response.Banners.Banner : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getEpisodeById(id, callback) {
        let path = `${this.baseURL}/${this.token}/episodes/${id}`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = (response && response.Data) ? response.Data.Episode : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

    getUpdates(time, callback) {
        let path = `${this.baseURL}/Updates.php?type=all&time=${time}`;

        return promise(function(resolve, reject) {
            sendRequest(path, function(error, response) {
                response = response ? response.Items : null;
                callback ? callback(error, response) : error ? reject(error) : resolve(response);
            });
        });
    }

}

/**
 * Utilities
 */

function sendRequest(url, done) {

    request(url, function (error, data) {

        if (data &&
            data.statusCode === 200 &&
            data.text != "" &&
            data.type != "text/plain" &&
            !~data.text.indexOf("404 Not Found")) {

            parser(data.text, PARSER_OPTS, function(error, results) {
                if (results && results.Error) {
                    error   = new Error(results.Error);
                    results = null;
                }

                done(error, results);
            });

        } else {
            error = error ? error : new Error("Could not complete the request");
            error.statusCode = data ? data.statusCode : undefined;

            done(error, null);
        }
    });
}

module.exports = Client;
