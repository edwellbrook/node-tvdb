var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("Search by ID", function() {

        describe("Callback API", function() {

            it("should return an object of the series with id \"246151\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesById("246151", function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    assert.equal("246151", response.id);
                    done();
                });
            });

            it("should return an object of the series and its episodes with id \"246151\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesAllById("246151", function(error, response) {
                    assert.ifError(error);
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

        describe("Promise API", function() {

            it("should return an object of the series with id \"246151\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesById("246151")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                        assert.equal("246151", response.id);
                    })
                    .then(done, done);
            });

            it("should return an object of the series and its episodes with id \"246151\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesAllById("246151")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                        assert.equal("246151", response.id);
                        assert.equal("object", typeof response.Episodes);
                    })
                    .then(done, done);
            });

            it("should return an error for a series search with an invalid language", function(done) {
                var client = new TVDBClient(API_KEY, "00");
                client.getSeriesAllById("246121")
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
