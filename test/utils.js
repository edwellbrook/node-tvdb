var assert = require("assert");
var TVDB = require("..");
var API_KEY = process.env.TVDB_KEY;

describe("Utility Functions", function() {

    it("should parse a pipe list to a javascript array", function() {
        var input = "abc|def|ghi|jkl|";
        var output = TVDB.utils.parsePipeList(input);

        assert.deepEqual(["abc", "def", "ghi", "jkl"], output);
    });
});
