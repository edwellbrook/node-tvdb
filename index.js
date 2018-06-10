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
        let tokenPromise = null;

        this.getToken = function() {
            if (tokenPromise === null) {
                tokenPromise = logIn(this.apiKey);
            }

            return tokenPromise;
        };
    }

    /**
     * Get available languages useable by TheTVDB API.
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
     * Get episode by episode id.
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
     * Get all episodes by series id.
     *
     * The opts may include the object `query` with any of the parameters from the query endpoint
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
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
     * @public
     */

    getEpisodesBySeriesId(seriesId, opts) {
        if (opts && opts.query) {
            return this.sendRequest(`series/${seriesId}/episodes/query`, opts);
        }
        return this.sendRequest(`series/${seriesId}/episodes`, opts);
    }

    /**
     * Get episodes summary by series id.
     *
     * ``` javascript
     * tvdb.getEpisodesSummaryBySeriesId(153021)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_summary
     * @public
     */

    getEpisodesSummaryBySeriesId(seriesId) {
        return this.sendRequest(`series/${seriesId}/episodes/summary`);
    }

    /**
     * Get basic series information by id.
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
     * Get series episode by air date.
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
        const query = { firstAired: airDate };
        const reqOpts = Object.assign({}, opts, { query: query });

        return this.getEpisodesBySeriesId(seriesId, reqOpts);
    }

    /**
     * Get basic series information by name.
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
        const query = { name: name };
        const reqOpts = Object.assign({}, opts, { query: query });
        return this.sendRequest(`search/series`, reqOpts);
    }

    /**
     * Get series actors by series id.
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
     * Get basic series information by imdb id.
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
        const query = { imdbId: imdbId };
        const reqOpts = Object.assign({}, opts, { query: query });
        return this.sendRequest(`search/series`, reqOpts);
    }

    /**
     * Get basic series information by zap2it id.
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
        const query = { zap2itId: zap2ItId };
        const reqOpts = Object.assign({}, opts, { query: query });
        return this.sendRequest(`search/series`, reqOpts);
    }

    /**
     * Get series banner by series id.
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
        const query = { keys: 'banner' };
        const reqOpts = Object.assign({}, opts, { query: query });

        return this.sendRequest(`series/${seriesId}/filter`, reqOpts).then(response => {
            return response.banner;
        });
    }

    /**
     * Get series images for a given key type.
     *
     * ``` javascript
     * // request only return fan art images:
     * tvdb.getSeriesImages(73255, 'fanart', { query: queryOptions })
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {String}        keyType - the key type to query by
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     * @public
     */

    getSeriesImages(seriesId, keyType, opts) {
        let query = {};
        if (keyType !== null) {
            query = { query: {
                keyType: keyType }
            };
        }
        const reqOpts = Object.assign({}, opts, query);

        return this.sendRequest(`series/${seriesId}/images/query`, reqOpts);
    }

    /**
     * Convenience wrapper around `getSeriesImages` to only return poster images for a series.
     *
     * ``` javascript
     * tvdb.getSeriesPosters(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     * @public
     */
    getSeriesPosters(seriesId, opts) {
        return this.getSeriesImages(seriesId, 'poster', opts);
    }

    /**
     * Convenience wrapper around `getSeriesImages` to only return season poster images for a series.
     *
     * ``` javascript
     * tvdb.getSeasonPosters(73255, 1)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     *
     * @param   {Number|String} seriesId
     * @param   {Number|String} season
     * @param   {Object}        [opts] - additional options for request
     * @returns {Promise}
     *
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     * @public
     */
    getSeasonPosters(seriesId, season, opts) {
        const query = { keyType: 'season', subKey: season };
        const reqOpts = Object.assign({}, opts, { query: query });

        return this.getSeriesImages(seriesId, null, reqOpts);
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
        const query = { fromTime: fromTime };
        if (toTime) {
            query.toTime = toTime;
        } else {
            opts = toTime;
        }

        const reqOpts = Object.assign({}, opts, { query: query });
        return this.sendRequest('updated/query', reqOpts);
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
    * requests.
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
        const query = Object.assign({}, options.query);
        const headers = Object.assign({
            'Accept':          AV_HEADER,
            'Accept-language': options.lang || this.language
        }, options.headers);

        const requestURL = BASE_URL + '/' + url.format({
            pathname: path,
            query: query
        });

        return this.getToken()
            .then(token => {
                headers['Authorization'] = `Bearer ${token}`;
                return request(requestURL, { headers: headers });
            })
            .then(res => checkHttpError(res))
            .then(res => checkJsonError(res))
            .then(json => getNextPages(this, json, path, options))
            .then(json => json.data);
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

    const query = Object.assign({}, opts.query, { page: res.links.next });
    const reqOpts = Object.assign({}, opts, { query: query });

    return client.sendRequest(path, reqOpts)
        .then(nextRes => [res.data, nextRes])
        .then(dataArr => {
            return { data: flatten(dataArr) };
        });
}

/**
 * Check response for HTTP error. Return a rejected promise if there's an error
 * otherwise resolve the full response object.
 *
 * @param   {Object}  res node-fetch response object
 * @returns {Promise}
 * @private
 */

function checkHttpError(res) {
    const contentType = res.headers.get('content-type') || '';

    if (res.status && res.status >= 400 && !contentType.includes('application/json')) {
        let err = new Error(res.statusText);
        err.response = {
            url: res.url,
            status: res.status,
            statusText: res.statusText
        };
        return Promise.reject(err);
    }
    return Promise.resolve(res);
}

/**
 * Check response for JSON error. Return a rejected promise if there's an error
 * otherwise resolve the response body as a JSON object.
 *
 * @param   {Object}  res node-fetch response object
 * @returns {Promise}
 * @private
 */

function checkJsonError(res) {
    return res.json().then((json) => {
        if (json.Error) {
            let err = new Error(json.Error);
            err.response = {
                url: res.url,
                status: res.status,
                statusText: res.statusText
            };
            return Promise.reject(err);
        }
        return Promise.resolve(json);
    });
}

/**
 * Perform login flow with given API Key.
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
        .then(res => checkHttpError(res))
        .then(res => checkJsonError(res))
        .then(json => json.token);
}

/**
 * Returns true if the response has additional pages, otherwise returns false.
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
