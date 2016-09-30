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
     * Get available languages useable by TheTVDB API
     *
     * https://api.thetvdb.com/swagger#!/Languages/get_languages
     *
     * ``` javascript
     * tvdb.getLanguages()
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @returns {Promise}
     * @name getLanguages
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
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @param {Number|String} episodeId
     * @param {String} [language]
     * @returns {Promise}
     * @name getEpisodeById
     * @public
     */

    getEpisodeById(episodeId, language) {
        return this.sendRequest(`episodes/${episodeId}`, language);
    }

    /**
     * Get all episodes by series id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes
     *
     * ``` javascript
     * tvdb.getEpisodesBySeriesId(153021)
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @alias getEpisodesById
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     * @name getEpisodesBySeriesId
     * @public
     */

    getEpisodesBySeriesId(seriesId, language) {
        return this.sendRequest(`series/${seriesId}/episodes`, language);
    }

    /**
     * Alias for getEpisodesBySeriesId
     *
     * @isAlias
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     * @name getEpisodesById
     * @public
     */

    getEpisodesById(seriesId, language) {
        return this.sendRequest(`series/${seriesId}/episodes`, language);
    }

    /**
     * Get basic series information by id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id
     *
     * ``` javascript
     * tvdb.getSeriesById(73255)
     *   .then (response => { /* handle response *\/ })
     *   .catch(error    => { /* handle error *\/    });
     *   ```
     *
     * @param {Number|String} seriesId
     * @param {String} [`language`]
     * @returns {Promise}
     * @name getSeriesById
     * @public
     */

    getSeriesById(seriesId, language) {
        return this.sendRequest(`series/${seriesId}`, language);
    }

    /**
     * Get series episode by air date
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
     *
     * ``` javascript
     * tvdb.getEpisodeByAirDate(153021, "2011-10-03")
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @param {Number|String} seriesId
     * @param {String} airDate
     * @param {String} [language]
     * @returns {Promise}
     * @name getEpisodesByAirDate
     * @public
     */

    getEpisodesByAirDate(seriesId, airDate, language) {
        return this.sendRequest(`series/${seriesId}/episodes/query?firstAired=${airDate}`, language);
    }

    /**
     * Get basic series information by name
     *
     * https://api.thetvdb.com/swagger#!/Search/get_search_series
     *
     * ``` javascript
     * tvdb.getSeriesByName("Breaking Bad")
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @param {String} name
     * @param {String} [language]
     * @returns {Promise}
     * @name getSeriesByName
     * @public
     */

    getSeriesByName(name, language) {
        return this.sendRequest(`search/series?name=${name}`, language);
    }

    /**
     * Get series actors by series id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_actors
     *
     * ``` javascript
     * tvdb.getActors(73255)
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     * @name getActors
     * @public
     */

    getActors(seriesId, language) {
        return this.sendRequest(`series/${seriesId}/actors`, language);
    }

    /**
     * Get basic series information by imdb id
     *
     * https://api.thetvdb.com/swagger#!/Search/get_search_series
     *
     * ``` javascript
     * tvdb.getSeriesByImdbId("tt0903747")
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @param {String} imdbId
     * @param {String} [language]
     * @returns {Promise}
     * @name getSeriesByImdbId
     * @public
     */

    getSeriesByImdbId(imdbId, language) {
        return this.sendRequest(`search/series?imdbId=${imdbId}`, language);
    }

    /**
     * Get basic series information by zap2it id
     *
     * https://api.thetvdb.com/swagger#!/Search/get_search_series
     *
     * ``` javascript
     * tvdb.getSeriesByZap2ItId("EP00018693")
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @param {String} zap2ItId
     * @param {String} [language]
     * @returns {Promise}
     * @name getSeriesByZap2ItId
     * @public
     */

    getSeriesByZap2ItId(zap2ItId, language) {
        return this.sendRequest(`search/series?zap2itId=${zap2ItId}`, language);
    }

    /**
     * Get series banner by series id
     *
     * https://api.thetvdb.com/swagger#!/Series/get_series_id_filter
     *
     * ``` javascript
     * tvdb.getSeriesBanner(73255)
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @param {Number|String} seriesId
     * @returns {Promise}
     * @name getSeriesBanner
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
     *   .then (response => { /* handle response *\/})
     *   .catch(error    => { /* handle error *\/   });
     * ```
     *
     * @param {Number} fromTime
     * @param {Number} toTime
     * @returns {Promise}
     * @name getUpdates
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
     *   .then(response {
     *     /* handle response *\/
     *     console.log(response.seriesName); // response contains series data
     *     console.log(response.Episodes.length); // response contains an array of episodes
     *   })
     *   .catch(error { /* handle error *\/});
     * ```
     *
     * @param {Number|String} seriesId
     * @param {String} [language]
     * @returns {Promise}
     * @name getSeriesAllById
     * @public
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
