/**
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

var request = require("superagent").get;
var parser  = require("xml2js").parseString;

var remoteProviders = {
    imdbid: /^tt/i,
    zap2it: /^ep/i
};

var parserOptions = {
    trim: true,
    normalize: true,
    ignoreAttrs: true,
    explicitArray: false,
    emptyTag: null
};

var Client = function(accessToken, language) {
    if (!accessToken) {
        throw new Error("Access token must be set.");
    }
    
    this._token = accessToken;
    this._language = language || "en";
    this._baseURL = "http://www.thetvdb.com/api/";
};

/**
 * Languages
 */

Client.prototype.getLanguages = function(callback) {
    var path = this._token + "/languages.xml";
    this.sendRequest(path, function(error, response) {
        callback(error, response ? response.Languages.Language : null);
    });
};

Client.prototype.getLanguage = function() {
    return this._language;
};

Client.prototype.setLanguage = function(language) {
    this._language = language;
};

/**
 * Time
 */

Client.prototype.getTime = function(callback) {
    var path = "Updates.php?type=none";
    this.sendRequest(path, function(error, response) {
        callback(error, response ? response.Items.Time : null);
    });
};

/**
 * Series
 */

Client.prototype.getSeries = function(name, callback) {
    var path = "GetSeries.php?seriesname=" + name + "&language=" + this._language;
    this.sendRequest(path, function(error, response) {
        callback(error, (response && response.Data) ? response.Data.Series : null);
    });
};

Client.prototype.getSeriesById = function(id, callback) {
    var path = this._token + "/series/" + id + "/" + this._language + ".xml";
    this.sendRequest(path, function(error, response) {
        callback(error, response ? response.Data.Series : null);
    });
};

Client.prototype.getSeriesByRemoteId = function(remoteId, callback) {
    var provider = "";
    var keys     = Object.keys(remoteProviders);
    var len      = keys.length;
    
    for (var i = 0; i < len; i++) {
        if (remoteProviders[keys[i]].exec(remoteId)) {
            provider = keys[i];
            break;
        }
    }
    
    var path = "GetSeriesByRemoteID.php?" + provider + "=" + remoteId + "&language=" + this._language;
    this.sendRequest(path, function(error, response) {
        callback(error, (response && response.Data) ? response.Data.Series : null);
    });
};

Client.prototype.getSeriesAllById = function(id, callback) {
    var path = this._token + "/series/" + id + "/all/" + this._language + ".xml";
    this.sendRequest(path, function(error, response) {
        if (response) {
            response.Data.Series.Episodes = response.Data.Episode;
        }
        callback(error, response ? response.Data.Series : null);
    });
};

Client.prototype.getActors = function(id, callback) {
    var path = this._token + "/series/" + id + "/actors.xml";
    this.sendRequest(path, function(error, response) {
        callback(error, response ? response.Actors.Actor : null);
    });
};

Client.prototype.getBanners = function(id, callback) {
    var path = this._token + "/series/" + id + "/banners.xml";
    this.sendRequest(path, function(error, response) {
        callback(error, response ? response.Banners.Banner : null);
    });
};

/**
 * Episodes
 */

Client.prototype.getEpisodeById = function(id, callback) {
    var path = this._token + "/episodes/" + id;
    this.sendRequest(path, function(error, response) {
        callback(error, response ? response.Data.Episode : null);
    });
};

/**
 * Updates
 */

Client.prototype.getUpdates = function(time, callback) {
    var path = "Updates.php?type=all&time=" + time;
    this.sendRequest(path, function(error, response) {
        callback(error, response ? response.Items : null);
    });
};

/**
 * Utilities
 */

Client.prototype.sendRequest = function(path, done) {
    var url = this._baseURL + path;
    request(url, function (error, response) {
        if ((response && response.statusCode === 200) && (response.type != "text/plain" && !~response.text.indexOf("404 Not Found"))) {
            
            parser(response.text, parserOptions, function(error, results) {
                if (results && results.Error) {
                    error   = new Error(results.Error);
                    results = null;
                }

                done(error, results);
            });
            
        } else {
            done(error ? error : new Error("Could not complete the request"), null);
        }
    });
};

module.exports = Client;
