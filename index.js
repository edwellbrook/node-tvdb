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
const request = require('node-fetch');
const flatten = require('lodash/flatten');

const BASE_URL = 'https://api.thetvdb.com';
const LIB_VERSION = require('./package.json').version;
const API_VERSION = 'v2.1.1';
const AV_HEADER = `application/vnd.thetvdb.${API_VERSION}`;

const DEFAULT_OPTS = {
    getAllPages: true,
    headers: {
        'User-Agent': `node-tvdb/${LIB_VERSION} (+https://github.com/edwellbrook/node-tvdb)`
    }
};


//
// API Client
//

class Client {

    /**
     * @param {String} apiKey
     * @param {String} [language]
     */

    constructor(apiKey, language = 'en') {
        if (!apiKey) {
            throw new Error('API key is required');
        }

        this.apiKey = apiKey;
        this.language = language;

        // store and manage auth token
        let tokenPromise = undefined;

        this.getToken = function() {
            if (tokenPromise === undefined) {
                tokenPromise = logIn(this.apiKey);
            }

            return tokenPromise;
        };
    }

    /**
     * Get available languages useable by TheTVDB API
     *
     * https://api.thetvdb.com/swagger#!/Languages/get_languages
     *
     * ``` javascript
     * tvdb.getLanguages()
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getLanguages
     * @returns {Promise}
     * @public
     */

    getLanguages() {
        return this.sendRequest('languages');
    }

    /**
     * Get episode by episode id
     *
     * https://api.thetvdb.com/swagger#!/Episodes/get_episodes_id
     *
     * ``` javascript
     * tvdb.getEpisodeById(4768125)
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getEpisodeById
     * @param   {Number|String} episodeId
     * @param   {String}        [language]
     * @returns {Promise}
     * @public
     */

    getEpisodeById(episodeId, opts = {}) {
        return this.sendRequest(`episodes/${episodeId}`, opts);
    }

    /**
     * Get all episodes by series id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes
     *
     * ``` javascript
     * tvdb.getEpisodesBySeriesId(153021)
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getEpisodesBySeriesId
     * @param   {Number|String} seriesId
     * @param   {String} [language]
     * @returns {Promise}
     * @public
     */

    getEpisodesBySeriesId(seriesId, opts = {}) {
        return this.sendRequest(`series/${seriesId}/episodes`, opts);
    }

    /**
     * Get basic series information by id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id
     *
     * ``` javascript
     * tvdb.getSeriesById(73255)
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getSeriesById
     * @param   {Number|String} seriesId
     * @param   {String} [`language`]
     * @returns {Promise}
     * @public
     */

    getSeriesById(seriesId, opts = {}) {
        return this.sendRequest(`series/${seriesId}`, opts);
    }

    /**
     * Get series episode by air date
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
     *
     * ``` javascript
     * tvdb.getEpisodeByAirDate(153021, '2011-10-03')
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getEpisodesByAirDate
     * @param   {Number|String} seriesId
     * @param   {String} airDate
     * @param   {String} [language]
     * @returns {Promise}
     * @public
     */

    getEpisodesByAirDate(seriesId, airDate, opts = {}) {
        return this.sendRequest(`series/${seriesId}/episodes/query?firstAired=${airDate}`, opts);
    }

    /**
     * Get basic series information by name
     *
     * https://api.thetvdb.com/swagger#!/Search/get_search_series
     *
     * ``` javascript
     * tvdb.getSeriesByName('Breaking Bad')
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getSeriesByName
     * @param   {String} name
     * @param   {String} [language]
     * @returns {Promise}
     * @public
     */

    getSeriesByName(name, opts = {}) {
        return this.sendRequest(`search/series?name=${name}`, opts);
    }

    /**
     * Get series actors by series id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_actors
     *
     * ``` javascript
     * tvdb.getActors(73255)
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getActors
     * @param   {Number|String} seriesId
     * @param   {String} [language]
     * @returns {Promise}
     * @public
     */

    getActors(seriesId, opts = {}) {
        return this.sendRequest(`series/${seriesId}/actors`, opts);
    }

    /**
     * Get basic series information by imdb id
     *
     * https://api.thetvdb.com/swagger#!/Search/get_search_series
     *
     * ``` javascript
     * tvdb.getSeriesByImdbId('tt0903747')
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getSeriesByImdbId
     * @param   {String}          imdbId
     * @param   {String}          [language]
     * @returns {Promise}
     * @public
     */

    getSeriesByImdbId(imdbId, opts = {}) {
        return this.sendRequest(`search/series?imdbId=${imdbId}`, opts);
    }

    /**
     * Get basic series information by zap2it id
     *
     * https://api.thetvdb.com/swagger#!/Search/get_search_series
     *
     * ``` javascript
     * tvdb.getSeriesByZap2ItId('EP00018693')
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getSeriesByZap2ItId
     * @param   {String}            zap2ItId
     * @param   {String}            [language]
     * @returns {Promise}
     * @public
     */

    getSeriesByZap2ItId(zap2ItId, opts = {}) {
        return this.sendRequest(`search/series?zap2itId=${zap2ItId}`, opts);
    }

    /**
     * Get series banner by series id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_filter
     *
     * ``` javascript
     * tvdb.getSeriesBanner(73255)
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getSeriesBanner
     * @param   {Number|String} seriesId
     * @returns {Promise}
     * @public
     */

    getSeriesBanner(seriesId) {
        return this.sendRequest(`series/${seriesId}/filter?keys=banner`)
            .then(response => response.banner);
    }

    /**
     * Get a list of series updated since one or between two given unix timestamps
     *
     * https://api.thetvdb.com/swagger#!/Updates/get_updated_query
     *
     * ``` javascript
     * tvdb.getUpdates(1400611370, 1400621370)
     *     .then(response => { /* handle response *\/ })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getUpdates
     * @param   {Number}   fromTime
     * @param   {Number}   toTime
     * @returns {Promise}
     * @public
     */

    getUpdates(fromTime, toTime) {
        let uri = `updated/query?fromTime=${fromTime}`;
        if (toTime) {
            uri = `${uri}&toTime=${toTime}`;
        }
        return this.sendRequest(uri);
    }

    /**
     * Get series and episode information by series id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes
     *
     * ``` javascript
     * tvdb.getSeriesAllById(73255)
     *     .then(response => {
     *         /* handle response *\/
     *         console.log(response); // response contains series data (e.g. `response.id`, `response.seriesName`)
     *         console.log(response.episodes); // response contains an array of episodes
     *     })
     *     .catch(error => { /* handle error *\/ });
     * ```
     *
     * @name    getSeriesAllById
     * @param   {Number|String}  seriesId
     * @param   {String}         [language]
     * @returns {Promise}
     * @public
     */

    getSeriesAllById(seriesId, opts = {}) {
        return Promise.all([
            this.getSeriesById(seriesId, opts),
            this.getEpisodesBySeriesId(seriesId, opts)
        ])
        .then(results => {
            let series = results[0];
            series.episodes = results[1];
            return series;
        });
    }

    /**
    * Runs a get request with the given options, useful for running custom requests
    *
    * ``` javascript
    * tvdb.sendRequest('unimplmented/endpoint', { custom: 'options' })
    *     .then(response => {
    *         /* handle response *\/
    *     })
    *     .catch(error => { /* handle error *\/ });
    * ```
    *
    * @name    sendRequest
    * @param   {String}  path
    * @param   {Object}  opts additional options for request
    * @returns {Promise}
    * @public
    */

    sendRequest(path, opts = {}) {
        const options = Object.assign({}, DEFAULT_OPTS, opts);
        const headers = Object.assign({
            'Accept':          AV_HEADER,
            'Accept-language': options.lang || this.language
        }, options.headers);

        return this.getToken()
            .then(token => {
                headers['Authorization'] = `Bearer ${token}`;

                return request(`${BASE_URL}/${path}`, { headers: headers });
            })
            .then(res => res.json())
            .then(res => checkError(res))
            .then(res => getNextPages(this, res, path, options))
            .then(res => res.data);
    }

}

/**
 * Returns the next page of a paged response.
 *
 * @param   {TVDB}    client   TVDB client to run next request with
 * @param   {Object}  res      response from previous request
 * @param   {String}  token    auth token for request
 * @param   {String}  path     path for previous request
 * @param   {String}  language
 * @returns {Promise}
 * @private
 */

function getNextPages(client, res, path, opts) {
    if (!hasNextPage(res) || !opts.getAllPages) {
        return Promise.resolve(res);
    }

    let urlObj = url.parse(path, true);
    urlObj.query.page = res.links.next;

    // remove urlObj.search to force url.format() to use urlObj.query
    urlObj.search = undefined;

    let newPath = url.format(urlObj);

    return client.sendRequest(newPath, opts)
        .then(nextRes => [res.data, nextRes])
        .then(dataArr => {
            return { data: flatten(dataArr) };
        });
}

/**
 * Check response for error. Return a rejected promise if there's an error
 * otherwise resolve the response
 *
 * @param   {Object}  json JSON response
 * @returns {Promise}
 * @private
 */

function checkError(json) {
    if (json.Error) {
        return Promise.reject(new Error(json.Error));
    }

    return Promise.resolve(json);
}

/**
 * Perform login flow with given API Key
 *
 * @param   {String}  apiKey
 * @returns {Promise}
 * @private
 */

function logIn(apiKey) {
    const opts = {
        method: 'POST',
        body: JSON.stringify({ apikey: apiKey }),
        headers: {
            'Accept':       AV_HEADER,
            'Content-Type': 'application/json'
        }
    };

    return request(`${BASE_URL}/login`, opts)
        .then(res => res.json())
        .then(res => checkError(res))
        .then(json => json.token);
}

/**
 * Returns true if the response has additional pages, otherwise returns
 * false
 *
 * @param   {Object}  response
 * @returns {Boolean}
 */

function hasNextPage(response) {
    return response && response.links && response.links.next;
}

//
// Exports
//

module.exports = Client;
