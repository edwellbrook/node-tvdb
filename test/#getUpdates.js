'use strict';

let TVDB = require('..');
let API_KEY = process.env.TVDB_KEY;

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe("#getUpdates", function() {

    it('must be called with a from Time', () => {
        const tvdb = new TVDB(API_KEY);
        const fromTime = 1471386405;

        return tvdb.getUpdates(fromTime) .then(response => {
            expect(response).to.have.length.of.at.least(100);
            expect(response[0]).to.have.deep.property('id');
            expect(response[0]).to.have.deep.property('lastUpdated');
        });
    });

    it('can be called with a toTime', () => {
        const tvdb = new TVDB(API_KEY);
        const fromTime = 1471386405;
        const toTime = fromTime + 10000;

        return tvdb.getUpdates(fromTime, toTime).then(response => {
            expect(response).to.have.length.above(1);
            expect(response[0]).to.have.deep.property('id');
            expect(response[0]).to.have.deep.property('lastUpdated');
        });
    });

    it('cannot be called with an invalid fromTime', () => {
        const tvdb = new TVDB(API_KEY);

        return expect(tvdb.getUpdates()).to.be.rejected;
    });

    it('cannot be called without a fromTime', () => {
        const tvdb = new TVDB(API_KEY);

        return expect(tvdb.getUpdates('')).to.be.rejected;
    });
});
