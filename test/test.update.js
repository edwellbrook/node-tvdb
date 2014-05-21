var assert  = require("assert"),
    tvDB    = require(".."),
    key     = require("./config").key;

suite("Update:", function() {
	test("getUpdates should return a JSON object with the updated series", function(done) {
		tvDB(key).getUpdates(1374852168,function(err, res) {
			assert.notEqual("undefined", typeof res.Items.Time);
			assert.equal(null, err);
			done();
		});
	});

	test("getUpdates with a string should return an error", function(done) {
		tvDB(key).getUpdates("error", function(err, res) {
			assert.equal(null, res);
			assert.notEqual(null, err);
			done();
		});
	});
});
