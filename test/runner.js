var NativeClient = require("..");
var CompatClient = require("../compat");

function test(client) {
    [
        "./tests/module",
        "./tests/language",
        "./tests/time",
        "./tests/update",
        "./tests/utils",
        "./tests/episode"
    ].forEach(function(i) {
        require(i)(client);
    });

    describe("Series endpoints", function() {
        [
            "./tests/episodes-by-id",
            "./tests/episode-by-airdate",
            "./tests/find-actors",
            "./tests/find-banners",
            "./tests/search-by-id",
            "./tests/search-by-name",
            "./tests/search-by-remote"
        ].forEach(function(i) {
            require(i)(client);
        });
    });
}

describe("Native client", function() {
    test(NativeClient);
});
describe("Compatibility client", function() {
    test(CompatClient);
});
