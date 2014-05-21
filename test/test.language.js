var assert		= require("assert"),
    key			= require("./config").key,
    TVDBClient	= require("..");

suite("Language:", function() {
	test("getLanguage should return the default (en)", function() {
		var client = TVDBClient(key);
		assert.equal("en", client.getLanguage());
	});

	test("if we change language, getLanguage should return the new value", function() {
		var client = TVDBClient(key);
		client.setLanguage("pt");
		assert.equal("pt", client.getLanguage());
	});

	test("getLanguages should return a JSON object with all the Languages", function(done) {
		var client = TVDBClient(key);
		client.getLanguages(function(err, res) {
			assert.notEqual("undefined", typeof res.Languages.Language);
			assert.equal(null, err);
			done();
		});
	});

	test("getLanguages with an invalid key should return an error", function(done) {
		var client = TVDBClient("aaa");
		client.getLanguages(function(err, res) {
			assert.notEqual(null, err);
			assert.equal(null, res);
			done();
		});
	});
});
