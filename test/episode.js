var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;
var TVDBClient = require("..");

describe("Episode endpoints", function() {
    
    it("should return an object of the episode with id \"4768125\"", function(done) {
        var client = new TVDBClient(API_KEY);
        client.getEpisodeById("4768125", function(error, response) {
            assert.ifError(error);
            assert.equal("object", typeof response);
            assert.equal("4768125", response.id);
            done();
        });
    });
    
    it("should return an error for a episode search with an invalid id", function(done) {
        var client = new TVDBClient(API_KEY);
        client.getEpisodeById("0", function(error, response) {
            assert.notEqual(null, error);
            assert.equal(null, response);
            done();
        });
    });
});
