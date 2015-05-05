var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("Module", function() {

        it("should set up a client with the correct API key", function() {
            assert.doesNotThrow(function() {
                new TVDBClient(API_KEY);
            });
        });

        it("should throw an error if no API key is provided", function() {
            assert.throws(function() {
                new TVDBClient();
            });
        });
    });
};
