var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;
var TVDBClient = require("..");

describe("Update endpoints", function() {
    
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
    
    it("should return an error when getting updates with an invalid time", function(done) {
        var client = new TVDBClient(API_KEY);
        client.getUpdates("z", function(error, response) {
            assert.notEqual(null, error);
            assert.equal(null, response);
            done();
        });
    });
});
