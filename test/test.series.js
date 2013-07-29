var assert  = require("assert"),
    tvDB    = require("./../lib/main"),
    key     = require("./config").key;

suite("Search series:", function() {
  test("getSeries should return a JSON object with the results", function(done) {
    tvDB(key).getSeries("simpsons", function(err,res) {
      assert.notEqual("undefined", typeof res.Data.Series);
      assert.equal(null,err);
      done();
    });
  });

  test("given a nonexisting series getSeries should return a JSON object without Series", function(done) {
    tvDB(key).getSeries("asdas", function(err,res) {
      assert.equal("undefined", typeof res.Data.Series);
      assert.equal(null,err);
      done();
    });
  });

  test("getSeries without writing a name should return an error", function(done) {
    tvDB(key).getSeries("", function(err,res) {
      assert.equal(null,res);
      assert.notEqual(null,err);
      done();
    });
  });

  test("given a foreign series without changing the language getSeries should return a JSON object without Series", function(done) {
    tvDB(key).setLanguage("en");
    tvDB(key).getSeries("planeta terra", function(err,res) {
      assert.equal("undefined", typeof res.Data.Series);
      assert.equal(null,err);
      done();
    });
  });

  test("given a different language getSeries should return a JSON object with the results", function(done) {
    tvDB(key).setLanguage("pt");
    tvDB(key).getSeries("como foi", function(err,res) {
      assert.notEqual("undefined", typeof res.Data.Series);
      assert.equal(null,err);
      done();
    });
  });
});

suite("Search by ID:", function() {
  test("getSeriesById should return a JSON object with the series", function(done) {
    tvDB(key).getSeriesById(246151, function(err,res) {
      assert.notEqual("undefined", typeof res.Data.Series);
      assert.equal(null,err);
      done();
    });
  });

  test("getSeriesAllById should return a JSON object with the series (and episodes)", function(done) {
    tvDB(key).getSeriesAllById(246151, function(err,res) {
      assert.notEqual("undefined", typeof res.Data.Episode);
      assert.equal(null,err);
      done();
    });
  });

  test("getSeriesAllById with a nonexistent language should return an error", function(done) {
    tvDB(key).setLanguage("error");
    tvDB(key).getSeriesAllById(246151, function(err,res) {
      assert.equal(null,res);
      assert.notEqual(null,err);
      done();
    });
  });

  test("getSeriesAllById with a nonexistent ID should return an error", function(done) {
    tvDB(key).getSeriesAllById(89476213789462, function(err,res) {
      assert.equal(null,res);
      assert.notEqual(null,err);
      done();
    });
  });
});

suite("Actors and Banners:", function() {
  test("getActors should return a JSON object with the Actors", function(done) {
    tvDB(key).getActors(246151, function(err,res) {
      assert.notEqual("undefined", typeof res.Actors.Actor);
      assert.equal(null,err);
      done();
    });
  });

  test("getBanners should return a JSON object with the Banners", function(done) {
    tvDB(key).getBanners(246151, function(err,res) {
      assert.notEqual("undefined", typeof res.Banners.Banner);
      assert.equal(null,err);
      done();
    });
  });
});
