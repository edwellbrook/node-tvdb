var assert  = require("assert"),
    tvDB    = require("./../lib/main"),
    key     = require("./config").key;

suite("Time:", function() {
  test("getTime should return a JSON object with the current time", function(done) {
    tvDB(key).getTime(function(err,res) {
      assert.notEqual("undefined", typeof res.Items.Time);
      assert.equal(null,err);
      done();
    });
  });
});
