'use strict';
/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

let request = require('request-promise');
let defaults = require('lodash/defaults');
let flatten = require('lodash/flatten');

let baseUrl = 'https://api.thetvdb.com/';

class Client {
    /**
     * @param {string} apiKey
     * @param {string} [language]
     */
    constructor(apiKey, language = 'en') {
        this.language = language;
        this.apiKey = apiKey;

        this.login();
    }

    /**
     * @returns {Promise}
     */
    getLanguages() {
        return this.requestGet({uri: 'languages'});
    }

    /**
     * @param {Number|String} episodeId
     * @param {String} [language]
     * @returns {Promise}
     */
    getEpisodeById(episodeId, language) {
        return this.requestGet({uri: `episodes/${episodeId}`}, language);
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     */
    getEpisodesById(seriesId, language) {
        return this.getEpisodesBySeriesId(seriesId, language);
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     */
    getEpisodesBySeriesId(seriesId, language) {
        return this.requestGet({uri: `series/${seriesId}/episodes`}, language);
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     */
    getSeriesById(seriesId, language) {
        return this.requestGet({uri: `series/${seriesId}`}, language);
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} airDate
     * @param {String} [language]
     * @returns {Promise}
     */
    getEpisodesByAirDate(seriesId, airDate, language) {
        return this.requestGet({uri: `series/${seriesId}/episodes/query?firstAired=${airDate}`}, language);
    }

    /**
     * @param {String} name
     * @param {String} [language]
     * @returns {Promise}
     */
    getSeriesByName(name, language) {
        return this.requestGet({uri: `search/series?name=${name}`}, language);
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     */
    getActors(seriesId, language) {
        return this.requestGet({uri: `series/${seriesId}/actors`}, language);
    }

    /**
     * @param {String} imdbId
     * @param {String} [language]
     * @returns {Promise}
     */
    getSeriesByImdbId(imdbId, language) {
        return this.requestGet({uri: `search/series?imdbId=${imdbId}`}, language);
    }

    /**
     * @param {String} zap2ItId
     * @param {String} [language]
     * @returns {Promise}
     */
    getSeriesByZap2ItId(zap2ItId, language) {
        return this.requestGet({uri: `search/series?zap2itId=${zap2ItId}`}, language);
    }

    /**
     * @param {Number|String} seriesId
     * @returns {Promise}
     */
    getSeriesBanner(seriesId) {
        return this.requestGet({uri: `series/${seriesId}/filter?keys=banner`})
            .then(response => response.banner);
    }

    /**
     * @param {Number} fromTime
     * @param {Number} toTime
     * @returns {Promise}
     */
    getUpdates(fromTime, toTime) {
        let uri = `updated/query?fromTime=${fromTime}`;
        if (toTime) {
            uri = `${uri}&toTime=${toTime}`;
        }
        return this.requestGet({uri});
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     */
    getSeriesAllById(seriesId, language) {
        return Promise.all([
            this.getSeriesById(seriesId, language),
            this.getEpisodesBySeriesId(seriesId, language)
        ])
            .then(results => {
                let series = results[0];
                series.Episodes = results[1];
                return series;
            });
    }

    /**
     * Performs the login into the thetvdb api and creates the loginPromise all later requests will use.
     *
     * @private
     */
    login() {
        this.loginPromise = request.post({
            baseUrl,

            json: true,
            uri: 'login',
            body: {
                apikey: this.apiKey
            }
        })
            .then(data => data.token)
            .then(token => {
                this.defaultRequest = request.defaults({
                    baseUrl,

                    json: true,
                    headers: {
                        "User-Agent": `node-tvdb/${require('./package.json').version}`,
                        Authorization: `Bearer ${token}`,
                        'Accept-language': this.language
                    }
                });
            });
    }

    /**
     * Runs a get request with the given options, follows pages and returns the combined returned data of the request.
     *
     * @param {object} options
     * @param {string} [language]
     * @returns {Promise}
     * @private
     */
    requestGet(options, language) {
        options = defaults({}, options, {headers: {'Accept-language': language}});
        return this.loginPromise
            .then(() => this.defaultRequest.get(options))
            .then(response => {
                if (hasNextPage(response)) {
                    return this.getNextPage(response, options)
                        .then(nextPageResponse => [response.data, nextPageResponse])
                        .then(dataArray => flatten(dataArray));
                }
                return response.data;
            });
    }

    /**
     * Returns the next page of a paged response.
     *
     * @param {object} response
     * @param {object} options
     * @returns {Promise}
     * @private
     */
    getNextPage(response, options) {
        let separator = options.uri.indexOf('?') === -1 ? '?' : '&';
        let uri = options.uri + separator + 'page=' + response.links.next;
        let o = defaults({uri}, options);
        return this.requestGet(o);
    }
}

/**
 * Returns true if the response is paged and there is a next page, false otherwise.
 *
 * @param {object} response
 * @returns {boolean}
 */
function hasNextPage(response) {
    return response.links && response.links.next;
}

module.exports = Client;
