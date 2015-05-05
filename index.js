/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

"use strict";

const request = require("superagent").get;
const parser  = require("xml2js").parseString;

// available providers for remote ids
const REMOTE_PROVIDERS = {
    imdbid: /^tt/i,
    zap2it: /^ep/i
};

// options for xml2js parser
const PARSER_OPTS = {
    trim: true,
    normalize: true,
    ignoreAttrs: true,
    explicitArray: false,
    emptyTag: null
};

class Client {

    /**
     * Set up tvdb client with API key and optional language (defaults to "en")
     *
     * @param {String} token
     * @param {String} [language]
     * @api public
     */

    constructor(token, language) {
        if (!token) throw new Error("Access token must be set.");

        this.token = token;
        this.language = language || "en";
        this.baseURL = "http://www.thetvdb.com/api";
    }

    /**
     * Get available languages useable by TheTVDB API
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:languages.xml
     *
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    getLanguages(callback) {
        let path = `${this.baseURL}/${this.token}/languages.xml`;

        return sendRequest(path, callback, function(response, done) {
            done((response && response.Languages) ? response.Languages.Language : null);
        });
    }

    /**
     * Get the current server time
     *
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */
    getTime(callback) {
        let path = `${this.baseURL}/Updates.php?type=none`;

        return sendRequest(path, callback, function(response, done) {
            done((response && response.Items) ? response.Items.Time : null);
        });
    }

    /**
     * Get basic series information by name
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:GetSeries
     *
     * @param {String} name
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */
    getSeriesByName(name, callback) {
        let path = `${this.baseURL}/GetSeries.php?seriesname=${name}&language=${this.language}`;

        return sendRequest(path, callback, function(response, done) {
            response = (response && response.Data) ? response.Data.Series : null;
            done(!response || Array.isArray(response) ? response : [response]);
        });
    }

    /**
     * Get basic series information by id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:Base_Series_Record
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */
    getSeriesById(id, callback) {
        let path = `${this.baseURL}/${this.token}/series/${id}/${this.language}.xml`;

        return sendRequest(path, callback, function(response, done) {
            done((response && response.Data) ? response.Data.Series : null);
        });
    }

    /**
     * Get basic series information by remote id (zap2it or imdb)
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:GetSeriesByRemoteID
     *
     * @param {String} remoteId
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

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

        return sendRequest(path, callback, function(response, done) {
            done((response && response.Data) ? response.Data.Series : null);
        });
    }

    /**
     * Get full/all series information by id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:Full_Series_Record
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    getSeriesAllById(id, callback) {
        let path = `${this.baseURL}/${this.token}/series/${id}/all/${this.language}.xml`;

        return sendRequest(path, callback, function(response, done) {
            if (response && response.Data && response.Data.Series) {
                response.Data.Series.Episodes = response.Data.Episode;
            }

            done(response ? response.Data.Series : null);
        });
    }

    /**
     * Get series actors by series id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:actors.xml
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    getActors(id, callback) {
        var path = `${this.baseURL}/${this.token}/series/${id}/actors.xml`;

        return sendRequest(path, callback, function(response, done) {
            done((response && response.Actors) ? response.Actors.Actor : null);
        });
    }

    /**
     * Get series banners by series id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:banners.xml
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    getBanners(id, callback) {
        let path = `${this.baseURL}/${this.token}/series/${id}/banners.xml`;

        return sendRequest(path, callback, function(response, done) {
            done((response && response.Banners) ? response.Banners.Banner : null);
        });
    }

    /**
     * Get episode by episode id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:Base_Episode_Record
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    getEpisodeById(id, callback) {
        let path = `${this.baseURL}/${this.token}/episodes/${id}`;

        return sendRequest(path, callback, function(response, done) {
            done((response && response.Data) ? response.Data.Episode : null);
        });
    }

    /**
     * Get series and episode updates since a given unix timestamp
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:Update_Records
     *
     * @param {Number} time
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    getUpdates(time, callback) {
        let path = `${this.baseURL}/Updates.php?type=all&time=${time}`;
        return sendRequest(path, callback, function(response, done) {

            done(response ? response.Items : null);
        });
    }

}

/**
 * Utilities
 */

function sendRequest(url, callback, normaliser) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, data) {

            if (data &&
                data.statusCode === 200 &&
                data.text != "" &&
                data.text.indexOf("404 Not Found") === -1) {

                parser(data.text, PARSER_OPTS, function(error, results) {
                    if (results && results.Error) {
                        error   = new Error(results.Error);
                        results = null;
                    }

                    normaliser(results, function(response) {
                        callback ? callback(error, response) : error ? reject(error) : resolve(response);
                    });
                });

            } else {
                error = error ? error : new Error("Could not complete the request");
                error.statusCode = data ? data.statusCode : undefined;

                (callback ? callback : reject)(error);
            }
        });
    });
}

function pipeListToArray(value) {
    return value.replace(/(^\|)|(\|$)/g, "").split("|");
}

function parsePipeList(response) {
    if (response.Actors) response.Actors = pipeListToArray(response.Actors);
    if (response.Genre) response.Genre = pipeListToArray(response.Genre);
    if (response.Writer) response.Writer = pipeListToArray(response.Writer);
    if (response.Colors) response.Colors = pipeListToArray(response.Colors);
    if (response.GuestStars) response.GuestStars = pipeListToArray(response.GuestStars);

    return response;
}

/**
 * Exports
 */

Client.utils = {
    parsePipeList: parsePipeList
};

module.exports = Client;
