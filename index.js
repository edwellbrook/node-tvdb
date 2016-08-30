'use strict';
/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

let request  = require('request-promise');
let defaults = require('lodash/defaults');
let flatten  = require('lodash/flatten');

let baseUrl = 'https://api.thetvdb.com/';

class Client {
    constructor(apiKey, language = 'en') {
        this.language = language;
        this.apiKey   = apiKey;

        this.login();
    }

    getLanguages() {
        return this.requestGet({uri: 'languages'});
    }

    getEpisodeById(id, language) {
        return this.requestGet({uri: `episodes/${id}`}, language);
    }

    getEpisodesById(seriesId, language) {
        return this.getEpisodesBySeriesId(seriesId, language);
    }

    getEpisodesBySeriesId(seriesId, language) {
        return this.requestGet({uri: `series/${seriesId}/episodes`}, language);
    }

    getSeriesById(id, language) {
        return this.requestGet({uri: `series/${id}`}, language);
    }

    getEpisodesByAirDate(seriesId, airDate, language) {
        return this.requestGet({uri: `series/${seriesId}/episodes/query?firstAired=${airDate}`}, language);
    }

    getSeriesByName(name, language) {
        return this.requestGet({uri: `search/series?name=${name}`}, language);
    }

    getActors(seriesId, language) {
        return this.requestGet({uri: `series/${seriesId}/actors`}, language);
    }

    getSeriesByImdbId(imdbId, language) {
        return this.requestGet({uri: `search/series?imdbId=${imdbId}`}, language);
    }

    getSeriesByZap2ItId(zap2ItId, language) {
        return this.requestGet({uri: `search/series?zap2itId=${zap2ItId}`}, language);
    }

    getSeriesBanner(seriesId) {
        return this.requestGet({uri: `series/${seriesId}/filter?keys=banner`})
            .then(response => response.banner);
    }

    getUpdates(fromTime, toTime){
        let uri = `updated/query?fromTime=${fromTime}`;
        if (toTime){
            uri = `${uri}&toTime=${toTime}`;
        }
        return this.requestGet({uri});
    }

    getSeriesAllById(seriesId, language) {
        return Promise.all([
            this.getSeriesById(seriesId, language),
            this.getEpisodesBySeriesId(seriesId, language)
        ])
            .then(results => {
                let series      = results[0];
                series.Episodes = results[1];
                return series;
            });
    }

    login() {
        this.loginPromise = request.post({
            baseUrl,

            json: true,
            uri:  'login',
            body: {
                apikey: this.apiKey
            }
        })
            .then(data => data.token)
            .then(token => {
                this.defaultRequest = request.defaults({
                    baseUrl,

                    json:    true,
                    headers: {
                        "User-Agent":      "edwellbrook/node-tvdb",
                        Authorization:     `Bearer ${token}`,
                        'Accept-language': this.language
                    }
                });
            });
    }

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

    getNextPage(response, options) {
        let separator = options.uri.indexOf('?') === -1 ? '?' : '&';
        let uri       = options.uri + separator + 'page=' + response.links.next;
        let o         = defaults({uri}, options);
        return this.requestGet(o);
    }

    static setBaseUrl(url){
        baseUrl = url;
    }
}

function

hasNextPage(response) {
    return response.links && response.links.next;
}

module.exports = Client;