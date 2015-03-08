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
var promise = require("when").promise;

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
    var path = this._baseURL + this._token + "/languages.xml";

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = (response && response.Languages) ? response.Languages.Language : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
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
    var path = this._baseURL + "Updates.php?type=none";

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = (response && response.Items) ? response.Items.Time : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
    });
};

/**
 * Series
 */

Client.prototype.getSeries = function(name, callback) {
    var path = this._baseURL + "GetSeries.php?seriesname=" + name + "&language=" + this._language;

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = (response && response.Data) ? response.Data.Series : null;
            response = !response || Array.isArray(response) ? response : [response];
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
    });
};

Client.prototype.getSeriesById = function(id, callback) {
    var path = this._baseURL + this._token + "/series/" + id + "/" + this._language + ".xml";

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = (response && response.Data) ? response.Data.Series : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
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

    var path = this._baseURL + "GetSeriesByRemoteID.php?" + provider + "=" + remoteId + "&language=" + this._language;

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = (response && response.Data) ? response.Data.Series : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
    });
};

Client.prototype.getSeriesAllById = function(id, callback) {
    var path = this._baseURL + this._token + "/series/" + id + "/all/" + this._language + ".xml";

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            if (response && response.Data && response.Data.Series) {
                response.Data.Series.Episodes = response.Data.Episode;
            }

            response = response ? response.Data.Series : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
    });
};

Client.prototype.getActors = function(id, callback) {
    var path = this._baseURL + this._token + "/series/" + id + "/actors.xml";

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = (response && response.Actors) ? response.Actors.Actor : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
    });
};

Client.prototype.getBanners = function(id, callback) {
    var path = this._baseURL + this._token + "/series/" + id + "/banners.xml";

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = (response && response.Banners) ? response.Banners.Banner : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
    });
};

/**
 * Episodes
 */

Client.prototype.getEpisodeById = function(id, callback) {
    var path = this._baseURL + this._token + "/episodes/" + id;

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = (response && response.Data) ? response.Data.Episode : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
    });
};

/**
 * Updates
 */

Client.prototype.getUpdates = function(time, callback) {
    var path = this._baseURL + "Updates.php?type=all&time=" + time;

    return promise(function(resolve, reject) {
        sendRequest(path, function(error, response) {
            response = response ? response.Items : null;
            callback ? callback(error, response) : error ? reject(error) : resolve(response);
        });
    });
};

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

            parser(data.text, parserOptions, function(error, results) {
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
