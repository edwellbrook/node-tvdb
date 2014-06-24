/**
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

var request		= require("superagent").get,
    parseString	= require("xml2js").parseString;
	
var externalProvidersIdRegEx = {
	imdbid: /^tt/i,
	zap2it: /^ep/i
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
	var provider = "",
		regexps = externalProvidersIdRegEx,
		keys = Object.keys(regexps),
		i = 0, len = keys.length;
	
	for (; i < len; i++) {
		if (regexps[keys[i]].exec(remoteId)) {
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
		if (response && response.statusCode === 200) {
			
			parseString(response.text, {
				trim: true,
				normalize: true,
				ignoreAttrs: true,
				explicitArray: false,
				emptyTag: null
			}, function(error, results) {
				
				if (results.Error) {
					error = results.Error;
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
