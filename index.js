/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <https://api.thetvdb.com/swagger>
 *
 * Copyright (c) 2014-2017 Edward Wellbrook <edwellbrook@gmail.com>
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

    constructor(apiKey, language) {
        if (!apiKey) {
            throw new Error('API key is required');
        }

        this.apiKey = apiKey;
        this.language = language || 'en';

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
     * ``` javascript
     * tvdb.getLanguages()
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Object}  [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Languages/get_languages
     * @public
     */

    getLanguages(opts) {
        return this.sendRequest('languages', opts);
    }

    /**
     * Get episode by episode id
     *
     * ``` javascript
     * tvdb.getEpisodeById(4768125)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} episodeId
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Episodes/get_episodes_id
     * @public
     */

    getEpisodeById(episodeId, opts) {
        return this.sendRequest(`episodes/${episodeId}`, opts);
    }

    /**
     * Get all episodes by series id
     *
     * ``` javascript
     * tvdb.getEpisodesBySeriesId(153021)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes
     * @public
     */

    getEpisodesBySeriesId(seriesId, opts) {
        return this.sendRequest(`series/${seriesId}/episodes`, opts);
    }

    /**
     * Get basic series information by id
     *
     * ``` javascript
     * tvdb.getSeriesById(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id
     * @public
     */

    getSeriesById(seriesId, opts) {
        return this.sendRequest(`series/${seriesId}`, opts);
    }

    /**
     * Get series episode by air date
     *
     * ``` javascript
     * tvdb.getEpisodeByAirDate(153021, '2011-10-03')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {String}        airDate
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
     * @public
     */

    getEpisodesByAirDate(seriesId, airDate, opts) {
        return this.sendRequest(`series/${seriesId}/episodes/query?firstAired=${airDate}`, opts);
    }

    /**
     * Get basic series information by name
     *
     * ``` javascript
     * tvdb.getSeriesByName('Breaking Bad')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {String}  name
     * @param   {Object}  [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Search/get_search_series
     * @public
     */

    getSeriesByName(name, opts) {
        return this.sendRequest(`search/series?name=${name}`, opts);
    }

    /**
     * Get series actors by series id
     *
     * ``` javascript
     * tvdb.getActors(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_actors
     * @public
     */

    getActors(seriesId, opts) {
        return this.sendRequest(`series/${seriesId}/actors`, opts);
    }

    /**
     * Get basic series information by imdb id
     *
     * ``` javascript
     * tvdb.getSeriesByImdbId('tt0903747')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {String}  imdbId
     * @param   {Object}  [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Search/get_search_series
     * @public
     */

    getSeriesByImdbId(imdbId, opts) {
        return this.sendRequest(`search/series?imdbId=${imdbId}`, opts);
    }

    /**
     * Get basic series information by zap2it id
     *
     * ``` javascript
     * tvdb.getSeriesByZap2ItId('EP00018693')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {String}  zap2ItId
     * @param   {Object}  [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Search/get_search_series
     * @public
     */

    getSeriesByZap2ItId(zap2ItId, opts) {
        return this.sendRequest(`search/series?zap2itId=${zap2ItId}`, opts);
    }

    /**
     * Get series banner by series id
     *
     * ``` javascript
     * tvdb.getSeriesBanner(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_filter
     * @public
     */

    getSeriesBanner(seriesId, opts) {
        return this.sendRequest(`series/${seriesId}/filter?keys=banner`, opts)
            .then(response => response.banner);
    }
    
     /**
     * Get series posters by series id
     *
     * ``` javascript
     * tvdb.getSeriesPosters(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images
     * @public
     */

     getSeriesPosters(seriesId) {
        return this.sendRequest(`series/${seriesId}/images/query?keyType=poster`)
            .then(response => response);
    }

    /**
     * Get a list of series updated since a given unix timestamp (and, if given,
     * between a second timestamp).
     *
     * ``` javascript
     * tvdb.getUpdates(1400611370, 1400621370)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number}  fromTime - timestamp to get series updates from
     * @param   {Number}  [toTime] - timestamp to get series updates to
     * @param   {Object}  [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Updates/get_updated_query
     * @public
     */

    getUpdates(fromTime, toTime, opts) {
        let uri = `updated/query?fromTime=${fromTime}`;
        if (toTime) {
            uri += `&toTime=${toTime}`;
        }
        return this.sendRequest(uri, opts);
    }

    /**
     * Get series and episode information by series id. Helper for calling
     * `getSeriesById` and `getEpisodesBySeriesId` at the same time.
     *
     * ``` javascript
     * tvdb.getSeriesAllById(73255)
     *     .then(response => {
     *         response; // contains series data (i.e. `id`, `seriesName`)
     *         response.episodes; // contains an array of episodes
     *     })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @public
     */

    getSeriesAllById(seriesId, opts) {
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
    * Runs a get request with the given options, useful for running custom
    * requests
    *
    * ``` javascript
    * tvdb.sendRequest('custom/endpoint', { custom: 'options' })
    *     .then(response => { handle response })
    *     .catch(error => { handle error });
    * ```
    *
    * @param   {String}  path   - path for http resource
    * @param   {Object}  [opts] - additional options for request
    * @returns {Promise}
    *
    * @public
    */

    sendRequest(path, opts) {
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
 * @param   {String}  path     path from previous request
 * @param   {Object}  opts     additional options from previous request
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
 * Returns true if the response has additional pages, otherwise returns false
 *
 * @param   {Object}  response
 * @returns {Boolean}
 * @private
 */

function hasNextPage(response) {
    return response && response.links && response.links.next;
}

//
// Exports
//

module.exports = Client;
