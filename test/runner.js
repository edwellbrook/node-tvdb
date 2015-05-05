var NativeClient = require("..");
var CompatClient = require("../compat");

describe("Native client", function() {
    require("./tests/module")(NativeClient);
    require("./tests/language")(NativeClient);
    require("./tests/time")(NativeClient);
    require("./tests/update")(NativeClient);
    require("./tests/utils")(NativeClient);
    require("./tests/episode")(NativeClient);

    describe("Series endpoints", function() {
        require("./tests/find-actors")(NativeClient);
        require("./tests/find-banners")(NativeClient);
        require("./tests/search-by-id")(NativeClient);
        require("./tests/search-by-name")(NativeClient);
        require("./tests/search-by-remote")(NativeClient);
    });
});

describe("Compatibility client", function() {
    require("./tests/module")(CompatClient);
    require("./tests/language")(CompatClient);
    require("./tests/time")(CompatClient);
    require("./tests/update")(CompatClient);
    require("./tests/utils")(CompatClient);
    require("./tests/episode")(CompatClient);

    describe("Series endpoints", function() {
        require("./tests/find-actors")(CompatClient);
        require("./tests/find-banners")(CompatClient);
        require("./tests/search-by-id")(CompatClient);
        require("./tests/search-by-name")(CompatClient);
        require("./tests/search-by-remote")(CompatClient);
    });
});
