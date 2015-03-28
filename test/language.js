var assert = require("assert");
var API_KEY = process.env.TVDB_KEY;
var TVDBClient = require("..");

describe("Language endpoints", function() {

    it("should return the default language as \"en\"", function() {
        var client = new TVDBClient(API_KEY);
        assert.equal("en", client.getLanguage());
    });

    it("should return the language as \"pt\" if initilaised with the language \"pt\"", function() {
        var client = new TVDBClient(API_KEY, "pt");
        assert.equal("pt", client.getLanguage());
    });

    it("should return the lanaguage as \"pt\" if changed to \"pt\"", function() {
        var client = new TVDBClient(API_KEY);
        client.setLanguage("pt");
        assert.equal("pt", client.getLanguage());
    });

    describe("Callback API", function() {

        it("should return an array of available langauages", function(done) {
            var client = new TVDBClient(API_KEY);
            client.getLanguages(function(error, response) {
                assert.ifError(error);
                assert.equal("object", typeof response);
                done();
            });
        });

        it("should return an error if getLanguages is called without a valid API key", function(done) {
            var client = new TVDBClient("test123");
            client.getLanguages(function(error, response) {
                assert.notEqual(null, error);
                assert.equal(null, response);
                done();
            });
        });
    });

    describe("Promise API", function() {

        it("should return an array of available langauages", function(done) {
            var client = new TVDBClient(API_KEY);
            client.getLanguages()
                .then(function(response) {
                    assert.equal("object", typeof response);
                })
                .catch(function(error) {
                    assert.ifError(error);
                })
                .done(done);
        });

        it("should return an error if getLanguages is called without a valid API key", function(done) {
            var client = new TVDBClient("test123");
            client.getLanguages()
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
