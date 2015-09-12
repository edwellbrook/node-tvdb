var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("Update endpoints", function() {

        describe("Callback API", function() {

            it("should return an object with arrays of updates from the past 2 days", function(done) {
                var client = new TVDBClient(API_KEY);
                var time = Math.floor((new Date() / 1000) - 60 * 60 * 24 * 2);

                client.getUpdates(time, function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    assert.equal("string", typeof response.Time);
                    assert.equal("object", typeof response.Episode);
                    assert.equal("object", typeof response.Series);
                    done();
                });
            });

            it("should return a node callback error when getting updates with an invalid time", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getUpdates("z", function(error, response) {
                    assert.notEqual(null, error);
                    assert.equal(null, response);
                    done();
                });
            });
        });

        describe("Promise API", function() {

            it("should return a promise object with arrays of updates from the past 2 days", function(done) {
                var client = new TVDBClient(API_KEY);
                var time = Math.floor((new Date() / 1000) - 60 * 60 * 24 * 2);

                client.getUpdates(time)
                    .then(function(response) {
                        assert.equal("object", typeof response);
                        assert.equal("string", typeof response.Time);
                        assert.equal("object", typeof response.Episode);
                        assert.equal("object", typeof response.Series);
                    })
                    .then(done, done);
            });

            it("should return a promise error when getting updates with an invalid time", function(done) {
                var client = new TVDBClient(API_KEY);

                client.getUpdates("z")
                    .then(
                        function(response) {
                            assert(false);
                        }, function(error) {
                            assert.notEqual(null, error);
                        }
                    )
                    .then(done, done);
            });
        });
    });

    describe("Update Record endpoints", function() {

        describe("Callback API", function() {
            it("should return an error if getUpdateRecords is called without a valid API key", function(done) {
                var client = new TVDBClient("test123");
                client.getUpdateRecords("day", function(error, response) {
                    assert.notEqual(null, error);
                    assert.equal(null, response);
                    done();
                });
            });

            it("should return an error if getUpdateRecords is called with an invalid interval", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getUpdateRecords("year", function(error, response) {
                    assert.notEqual(null, error);
                    assert.equal(null, response);
                    done();
                });
            });

            ["day", "week", "month"].forEach(function(interval) {
                it("should return an object with arrays of updates if called with " + interval, function(done) {
                    var client = new TVDBClient(API_KEY);
                    client.getUpdateRecords(interval, function(error, response) {
                        assert.equal(null, error);
                        assert.equal("object", typeof response);
                        assert.equal("object", typeof response.Series);
                        assert.equal("object", typeof response.Episode);
                        assert.equal("object", typeof response.Banner);
                        done();
                    })
                });
            });

            // skipped "all" due to file size of ~50 MB
        });

        describe("Promise API", function() {

            it("should return an error if getUpdateRecords is called without a valid API key", function(done) {
                var client = new TVDBClient("test123");
                client.getUpdateRecords("day")
                    .then(function(response) {
                        assert(false);
                    }, function(error) {
                        assert.notEqual(null, error);
                    })
                    .then(done, done);
            });

            it("should return an error if getUpdateRecords is called with an invalid interval", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getUpdateRecords("year")
                    .then(function(response) {
                            assert(false);
                    }, function(error) {
                        assert.notEqual(null, error);
                    })
                    .then(done, done);
            });

            ["day", "week", "month"].forEach(function(interval) {
                it("should return an object with arrays of updates if called with " + interval, function(done) {
                    var client = new TVDBClient(API_KEY);
                    client.getUpdateRecords(interval)
                        .then(function(response) {
                            assert.equal("object", typeof response);
                            assert.equal("object", typeof response.Series);
                            assert.equal("object", typeof response.Episode);
                            assert.equal("object", typeof response.Banner);
                        })
                        .then(done, done);
                })
            });

            // skipped "all" due to file size of ~50 MB
        });
    });
};
