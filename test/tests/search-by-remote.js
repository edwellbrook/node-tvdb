var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("Search by remote ID", function() {

        describe("Callback API", function() {

            it("should return an object of the series with IMDB id \"tt0903747\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByRemoteId("tt0903747", function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    assert.equal("81189", response.id);
                    assert.equal("Breaking Bad", response.SeriesName);
                    done();
                });
            });

            it("should return an object of the series with zap2it id \"EP01009396\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByRemoteId("EP01009396", function(error, response) {
                    assert.ifError(error);
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

        describe("Promise API", function() {

            it("should return an object of the series with IMDB id \"tt0903747\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByRemoteId("tt0903747")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                        assert.equal("81189", response.id);
                        assert.equal("Breaking Bad", response.SeriesName);
                    })
                    .then(done, done);
            });

            it("should return an object of the series with zap2it id \"EP01009396\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByRemoteId("EP01009396")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                        assert.equal("81189", response.id);
                        assert.equal("Breaking Bad", response.SeriesName);
                    })
                    .then(done, done);
            });


            it("should return an error for a series search with an invalid id", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesAllById("0")
                    .then(function(response) {
                        assert(false);
                    }, function(error) {
                        assert.notEqual(null, error);
                    })
                    .then(done, done);
            });
        });
    });
};
