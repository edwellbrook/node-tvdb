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
	
var Client = function(accessToken, language, mirror) {
	if (!accessToken) {
		throw new Error("Access token must be set.");
	}
	
	this._token = accessToken;
	this._language = language || "en";
	this._baseURL = "http://" + (mirror || "thetvdb.com/api/");
}


/**
 * Languages
 */

Client.prototype.getLanguages = function(callback) {
	var url = this._token + "/languages.xml";
	this.sendRequest(url, function(error, response) {
		callback(error, response ? response.Languages.Language : null);
	});
}

Client.prototype.getLanguage = function() {
	return this._language;
}

Client.prototype.setLanguage = function(language) {
	this._language = language;
}

/**
 * Time
 */

Client.prototype.getTime = function(callback) {
	var url = "Updates.php?type=none";
	this.sendRequest(url, function(error, response) {
		callback(error, response ? response.Items.Time : null);
	});
}

/**
 * Series
 */

Client.prototype.getSeries = function(name, callback) {
	var url = "GetSeries.php?seriesname=" + name + "&language=" + this._language;
	this.sendRequest(url, function(error, response) {
		callback(error, response ? response.Data.Series : null);
	});
}

Client.prototype.getSeriesById = function(id, callback) {
	var url = this._token + "/series/" + id + "/" + this._language + ".xml";
	this.sendRequest(url, function(error, response) {
		callback(error, response ? response.Data.Series : null);
	});
}

Client.prototype.getSeriesAllById = function(id, callback) {
	var url = this._token + "/series/" + id + "/all/" + this._language + ".xml";
	this.sendRequest(url, function(error, response) {
		if (response) {
			response.Data.Series.Episodes = response.Data.Episode;
		}
		callback(error, response ? response.Data.Series : null);
	});
}

Client.prototype.getActors = function(id, callback) {
	var url = this._token + "/series/" + id + "/actors.xml";
	this.sendRequest(url, function(error, response) {
		callback(error, response ? response.Actors.Actor : null);
	});
}

Client.prototype.getBanners = function(id, callback) {
	var url = this._token + "/series/" + id + "/banners.xml";
	this.sendRequest(url, function(error, response) {
		callback(error, response ? response.Banners.Banner : null);
	});
}

/**
 * Updates
 */

Client.prototype.getUpdates = function(time, callback) {
	var url = "Updates.php?type=all&time=" + time;
	this.sendRequest(url, function(error, response) {
		callback(error, response ? response.Items : null);
	});
}

/**
 * Utilities
 */

Client.prototype.sendRequest = function(endpoint, done) {
	var url = this._baseURL + endpoint;
	
	request(url, function (error, response, body) {
		if (response.statusCode === 200) {
			
			parseString(response.text, {
				trim: true,
				normalize: true,
				ignoreAttrs: true,
				explicitArray: false
			}, function(error, results) {
				
				if (results.Error) {
					error = results.Error;
					results = null;
				}
				
				done(error, results)
				
			});
		} else {
	        done(error ? error : new Error("Could not complete the request"), null);
		}
	});
}

module.exports = Client;
