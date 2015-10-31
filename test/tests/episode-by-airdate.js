var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("Episode for show by air date", function() {

        describe("Callback API", function() {

            it("should return the episode aired on \"2011-10-03\" from the show with id \"153021\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getEpisodeByAirDate("153021", "2011-10-03", function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    assert.equal("4185563", response.id);
                    done();
                });
            });

            it("should return null for an episode that did not air on the requested date", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getEpisodeByAirDate("153021", "2000-01-01", function(error, response) {
                    assert.ifError(error);
                    assert.equal(null, response);
                    done();
                });
            });
        });


        describe("Promise API", function() {

            it("should return the episode aired on \"2011-10-03\" from the show with id \"153021\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getEpisodeByAirDate("153021", "2011-10-03")
                    .then(function(response) {
                        assert.equal("object", typeof response);
                        assert.equal("4185563", response.id);
                    })
                    .then(done, done);
            });

            it("should return null for an episode that did not air on the requested date", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getEpisodeByAirDate("153021", "2000-01-01")
                    .then(function(response) {
                        assert.equal(null, response);
                    })
                    .then(done, done);
            });
        });

    });
};
