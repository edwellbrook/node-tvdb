var assert = require("assert");
var TVDB = require("..");
var API_KEY = process.env.TVDB_KEY;

describe("Module", function() {

    it("should set up a client with the correct API key", function() {
        assert.doesNotThrow(function() {
            new TVDB(API_KEY);
        });
    });

    it("should throw an error if no API key is provided", function() {
        assert.throws(function() {
            new TVDB();
        });
    });
});
