var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("Search by name", function() {

        describe("Callback API", function() {

            it("should return an array of available matches for the series search \"The Simpsons\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("The Simpsons", function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    done();
                });
            });

            it("should return null for the series search \"asdas\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("asdas", function(error, response) {
                    assert.ifError(error);
                    assert.equal(null, response);
                    done();
                });
            });

            it("should return an error for a blank series search", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("", function(error, response) {
                    assert.notEqual(null, error);
                    assert.equal(null, response);
                    done();
                });
            });

            it("should return null for the series search \"Planeta Terra\" with the language set to \"en\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("Planeta Terra", function(error, response) {
                    assert.ifError(error);
                    assert.equal(null, response);
                    done();
                });
            });

            it("should return an array of available matches for the series search \"Planeta Terra\" with the language set to \"pt\"", function(done) {
                var client = new TVDBClient(API_KEY, "pt");
                client.getSeriesByName("Planeta Terra", function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    done();
                });
            });

            it("should return an array even when there's only one result returned", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("Bob's Burgers", function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    assert.equal(1, response.length);
                    done();
                });
            });

            it("should return an array of available matches for the series search \"&The Simpsons\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("&The Simpsons", function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    done();
                });
            });
        });

        describe("Promise API", function() {

            it("should return an array of available matches for the series search \"The Simpsons\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("The Simpsons")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                    })
                    .then(done, done);
            });

            it("should return null for the series search \"asdas\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("asdas")
                    .then(function(response) {
                        assert.equal(null, response);
                    })
                    .then(done, done);
            });

            it("should return an error for a blank series search", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("")
                    .then(function(response) {
                        assert(false);
                    }, function(error) {
                        assert.notEqual(null, error);
                    })
                    .then(done, done);
            });

            it("should return null for the series search \"Planeta Terra\" with the language set to \"en\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("Planeta Terra")
                    .then(function(response) {
                        assert.equal(null, response);
                    })
                    .then(done, done);
            });

            it("should return an array of available matches for the series search \"Planeta Terra\" with the language set to \"pt\"", function(done) {
                var client = new TVDBClient(API_KEY, "pt");
                client.getSeriesByName("Planeta Terra")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                    })
                    .then(done, done);
            });

            it("should return an array even when there's only one result returned", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("Bob's Burgers")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                        assert.equal(1, response.length);
                    })
                    .then(done, done);
            });

            it("should return an array of available matches for the series search \"&The Simpsons\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getSeriesByName("&The Simpsons")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                    })
                    .then(done, done);
            });
        });
    });
};
