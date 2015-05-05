var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;

module.exports = function(TVDBClient) {

    describe("Utility Functions", function() {

        it("should parse a pipe list to a javascript array", function() {
            var input = "abc|def|ghi|jkl|";
            var output = TVDBClient.utils.parsePipeList(input);

            assert.deepEqual(["abc", "def", "ghi", "jkl"], output);
        });
    });
};
