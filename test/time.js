var assert		= require("assert"),
    API_KEY		= process.env.TVDB_KEY,
    TVDBClient	= require("..");

describe("Time endpoints", function() {
	
	it("should return the current time from the server", function(done) {
		var client = new TVDBClient(API_KEY);
		client.getTime(function(error, response) {
			assert.equal(null, error);
			assert.equal("string", typeof response);
			done();
		});
	})
})
