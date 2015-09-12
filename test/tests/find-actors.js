var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("Find actors", function() {

        describe("Callback API", function() {

            it("should return an array of the actors for the series with id \"246151\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getActors(246151, function(error, response) {
                    assert.ifError(error);
                    assert.equal("object", typeof response);
                    done();
                });
            });
        });

        describe("Promise API", function() {

            it("should return an array of the actors for the series with id \"246151\"", function(done) {
                var client = new TVDBClient(API_KEY);
                client.getActors(246151)
                    .then(function(response) {
                        assert.equal("object", typeof response);
                    })
                    .then(done, done);
            });
        });
    });
};
