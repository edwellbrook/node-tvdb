var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("All episodes for show", function() {

        describe("Callback API", function() {

            it("should return an object of all episodes from the show with id \"153021\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getEpisodesById("153021", function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    done();
                });
            });

            it("should return an error for a series search with an invalid language", function(done) {
                var client = new TVDBClient(API_KEY, "00");
                client.getEpisodesById("153021", function(error, response) {
                    assert.notEqual(null, error);
                    assert.equal(null, response);
                    done();
                });
            });

            it("should return an error for a series search with an invalid id", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getEpisodesById("0", function(error, response) {
                    assert.notEqual(null, error);
                    assert.equal(null, response);
                    done();
                });
            });
        });

        describe("Promise API", function() {

            it("should return an object of all episodes from the show with id \"153021\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getEpisodesById("153021")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                    })
                    .then(done, done);
            });

            it("should return an error for a series search with an invalid language", function(done) {
                var client = new TVDBClient(API_KEY, "00");
                client.getEpisodesById("153021")
                    .then(function(response) {
                        assert(false);
                    }, function(error) {
                        assert.notEqual(null, error);
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
