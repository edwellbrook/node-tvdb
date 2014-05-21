/**
 * thetvdb-api
 *
 * Node.js library for accessing thetvdb API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2013-2014 João Campinhos <joao@campinhos.pt> and Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

var request		= require("request"),
    parseString	= require("xml2js").parseString;
	
var Client = function(accessToken, language, mirror) {
	this._token = accessToken;
	this._language = language;
	this._baseURL = "http://" + mirror;
}


/**
 * Languages
 */

Client.prototype.getLanguages = function(callback) {
	var url = this._token + "/languages.xml";
	this.sendRequest(url, callback);
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

Client.prototype.getTime = function(cb) {
	var url = "Updates.php?type=none";
	this.sendRequest(url, cb);
}

/**
 * Series
 */

Client.prototype.getSeries = function(name, cb) {
	var url = "GetSeries.php?seriesname=" + name + "&language=" + this._language;
	this.sendRequest(url, cb);
}

Client.prototype.getSeriesById = function(id, cb) {
	var url = this._token + "/series/" + id + "/" + this._language + ".xml";
	this.sendRequest(url, cb);
}

Client.prototype.getSeriesAllById = function(id, cb) {
	var url = this._token + "/series/" + id + "/all/" + this._language + ".xml";
	this.sendRequest(url, cb);
}

Client.prototype.getActors = function(id, cb) {
	var url = this._token + "/series/" + id + "/actors.xml";
	this.sendRequest(url, cb);
}

Client.prototype.getBanners = function(id, cb) {
	var url = this._token + "/series/" + id + "/banners.xml";
	this.sendRequest(url, cb);
}

/**
 * Updates
 */

Client.prototype.getUpdates = function(time, cb) {
	this.sendRequest("Updates.php?type=all&time=" + time, cb);
}

Client.prototype.sendRequest = function(endpoint, done) {
	var url = this._baseURL + endpoint;
	
	request(url, function (error, response, body) {
		if (response.statusCode === 200) {
			
			parseString(body, {
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

module.exports = function(accessToken, options) {
	
	options = options || {};
	return new Client(accessToken, options.language || "en", options.mirror || "thetvdb.com/api/");

}
