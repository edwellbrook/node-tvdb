var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;
var TVDBClient = require("..");

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
                .catch(function (error) {
                    assert.ifError(error);
                })
                .done(done);
        });

        it("should return a promise error when getting updates with an invalid time", function(done) {
            var client = new TVDBClient(API_KEY);

            client.getUpdates("z")
                .then(function(response) {
                    assert.equal(null, response);
                })
                .catch(function(error) {
                    assert.notEqual(null, error);
                })
                .done(done);
        });
    });
});
