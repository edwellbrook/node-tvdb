var assert		= require("assert"),
    API_KEY		= process.env.TVDB_KEY,
    TVDBClient	= require("..");

describe("Series endpoints", function() {
	
	describe("Search by name", function() {
		
		it("should return an array of available matches for the series search \"The Simpsons\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeries("The Simpsons", function(error, response) {
				assert.equal(null, error);
				assert.equal("object", typeof response);
				done();
			});
		});
	
		it("should return null for the series search \"asdas\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeries("asdas", function(error, response) {
				assert.equal(null, error);
				assert.equal(null, response);
				done();
			});
		});
	
		it("should return an error for a blank series search", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeries("", function(error, response) {
				assert.notEqual(null, error);
				assert.equal(null, response);
				done();
			});
		});
	
		it("should return an error for a blank series search", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeries("", function(error, response) {
				assert.notEqual(null, error);
				assert.equal(null, response);
				done();
			});
		});
	
		it("should return null for the series search \"Planeta Terra\" with the language set to \"en\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeries("Planeta Terra", function(error, response) {
				assert.equal(null, error);
				assert.equal(null, response);
				done();
			});
		});
	
		it("should return an array of available matches for the series search \"Planeta Terra\" with the language set to \"pt\"", function(done) {
			var client = new TVDBClient(API_KEY, "pt");
			client.getSeries("Planeta Terra", function(error, response) {
				assert.equal(null, error);
				assert.equal("object", typeof response);
				done();
			});
		});
	});
	
	describe("Search by ID", function() {
		
		it("should return an object of the series with id \"246151\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeriesById("246151", function(error, response) {
				assert.equal(null, error);
				assert.equal("object", typeof response);
				assert.equal("246151", response.id);
				done();
			});
		});

		it("should return an object of the series and its episodes with id \"246151\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeriesAllById("246151", function(error, response) {
				assert.equal(null, error);
				assert.equal("object", typeof response);
				assert.equal("246151", response.id);
				assert.equal("object", typeof response.Episodes);
				done();
			});
		});
		
		it("should return an error for a series search with an invalid language", function(done) {
			var client = new TVDBClient(API_KEY, "00");
			client.getSeriesAllById("246121", function(error, response) {
				assert.notEqual(null, error);
				assert.equal(null, response);
				done();
			});
		});
		
		it("should return an error for a series search with an invalid id", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeriesAllById("0", function(error, response) {
				assert.notEqual(null, error);
				assert.equal(null, response);
				done();
			});
		});
	});
	
	describe("Search by remote id", function() {

		it("should return an object of the series with IMDB id \"tt0903747\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeriesByRemoteId("tt0903747", function(error, response) {
				assert.equal(null, error);
				assert.equal("object", typeof response);
				assert.equal("81189", response.id);
				assert.equal("Breaking Bad", response.SeriesName);
				done();
			});
		});
		
		it("should return an object of the series with zap2it id \"EP01009396\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeriesByRemoteId("EP01009396", function(error, response) {
				assert.equal(null, error);
				assert.equal("object", typeof response);
				assert.equal("81189", response.id);
				assert.equal("Breaking Bad", response.SeriesName);
				done();
			});
		});

		
		it("should return an error for a series search with an invalid id", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getSeriesAllById("0", function(error, response) {
				assert.notEqual(null, error);
				assert.equal(null, response);
				done();
			});
		});

	});

	describe("Find actors", function() {
	
		it("should return an array of the actors for the series with id \"246151\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getActors(246151, function(error, response) {
				assert.equal(null, error);
				assert.equal("object", typeof response);
				done();
			});
		});
	});
	
	describe("Find banners", function() {
	
		it("should return an array of the banners for the series with id \"246151\"", function(done) {
			var client = new TVDBClient(API_KEY);
			client.getBanners(246151, function(error, response) {
				assert.equal(null, error);
				assert.equal("object", typeof response);
				done();
			});
		});
	});
});
