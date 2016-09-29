/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <https://api.thetvdb.com/swagger>
 *
 * Copyright (c) 2014-2016 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

'use strict';

const url = require('url');
const request = require('request-promise');
const flatten = require('lodash/flatten');

const BASE_URL = 'https://api.thetvdb.com/';
const LIB_VERSION = require('./package.json').version;
const USER_AGENT = `node-tvdb/${LIB_VERSION}`;

//
// API Client
//

class Client {

    /**
     * @param {String} apiKey
     * @param {String} [language]
     */

    constructor(apiKey, language = 'en') {
        this.token = undefined;
        this.apiKey = apiKey;
        this.language = language;
    }

    /**
     * @returns {Promise}
     */

    getLanguages() {
        return this.sendRequest('languages');
    }

    /**
     * @param {Number|String} episodeId
     * @param {String} [language]
     * @returns {Promise}
     */

    getEpisodeById(episodeId, language) {
        return this.sendRequest(`episodes/${episodeId}`, language);
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
        return this.sendRequest(`series/${seriesId}/episodes`, language);
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     */

    getSeriesById(seriesId, language) {
        return this.sendRequest(`series/${seriesId}`, language);
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} airDate
     * @param {String} [language]
     * @returns {Promise}
     */

    getEpisodesByAirDate(seriesId, airDate, language) {
        return this.sendRequest(`series/${seriesId}/episodes/query?firstAired=${airDate}`, language);
    }

    /**
     * @param {String} name
     * @param {String} [language]
     * @returns {Promise}
     */

    getSeriesByName(name, language) {
        return this.sendRequest(`search/series?name=${name}`, language);
    }

    /**
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     */

    getActors(seriesId, language) {
        return this.sendRequest(`series/${seriesId}/actors`, language);
    }

    /**
     * @param {String} imdbId
     * @param {String} [language]
     * @returns {Promise}
     */

    getSeriesByImdbId(imdbId, language) {
        return this.sendRequest(`search/series?imdbId=${imdbId}`, language);
    }

    /**
     * @param {String} zap2ItId
     * @param {String} [language]
     * @returns {Promise}
     */

    getSeriesByZap2ItId(zap2ItId, language) {
        return this.sendRequest(`search/series?zap2itId=${zap2ItId}`, language);
    }

    /**
     * @param {Number|String} seriesId
     * @returns {Promise}
     */

    getSeriesBanner(seriesId) {
        return this.sendRequest(`series/${seriesId}/filter?keys=banner`)
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
        return this.sendRequest(uri);
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
     * Runs a get request with the given options, follows pages and returns the
     * combined returned data of the request.
     *
     * @param {String} path
     * @param {String} [language]
     * @returns {Promise}
     * @private
     */

    sendRequest(path, language = this.language) {
        // TODO: use saved token instead of requesting a new one
        return request.post({
            baseUrl: BASE_URL,
            json: true,
            uri: 'login',
            body: {
                apikey: this.apiKey
            }
        })
        .then(data => data.token)
        .then(token => {
            // save token for future requests
            this.token = token;

            return request.get({
                baseUrl: BASE_URL,
                uri: path,
                json: true,
                headers: {
                    'User-Agent': USER_AGENT,
                    'Authorization': `Bearer ${token}`,
                    'Accept-language': language
                }
            });
        })
        .then(response => {
            if (hasNextPage(response)) {
                return this.getNextPage(response, path, language)
                    .then(nextPageResponse => [response.data, nextPageResponse])
                    .then(dataArray => flatten(dataArray));
            }
            return response.data;
        });
    }

    /**
     * Returns the next page of a paged response.
     *
     * @param {Object} response
     * @param {String} path - path for previous request
     * @param {String} language
     * @returns {Promise}
     * @private
     */

    getNextPage(response, path, language) {
        let urlObj = url.parse(path, true);
        urlObj.query.page = response.links.next;

        const newPath = url.format(urlObj);
        return this.sendRequest(newPath, language);
    }
}

/**
 * Returns true if the response is paged and there is a next page, false
 * otherwise.
 *
 * @param {Object} response
 * @returns {Boolean}
 */

function hasNextPage(response) {
    return response && response.links && response.links.next;
}

//
// Exports
//

module.exports = Client;
