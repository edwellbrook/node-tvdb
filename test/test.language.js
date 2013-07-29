var assert  = require("assert"),
    tvDB    = require("./../lib/main"),
    key     = require("./config").key;

suite("Language:", function() {
  test("getLanguage should return the default (en)", function() {
    assert.equal("en", tvDB(key).getLanguage());
  });

  test("if we change language, getLanguage should return the new value", function() {
    tvDB(key).setLanguage("pt");
    assert.equal("pt", tvDB(key).getLanguage());
  });

  test("getLanguages should return a JSON object with all the Languages", function(done) {
    tvDB(key).getLanguages(function(err,res) {
      assert.notEqual("undefined", typeof res.Languages.Language);
      assert.equal(null,err);
      done();
    });
  });

  test("getLanguages with an invalid key should return an error", function(done) {
    tvDB("123").getLanguages(function(err,res) {
      assert.notEqual(null,err);
      assert.equal(null,res);
      done();
    });
  });
});
