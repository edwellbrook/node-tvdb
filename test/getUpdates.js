'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe("#getUpdates", function() {

    it('must be called with a from Time', () => {
        const tvdb = new TVDB(API_KEY);

        const now = Math.floor((new Date()).getTime() / 1000);
        const fromTime = now - (60 * 60 * 24 * 6);

        return tvdb.getUpdates(fromTime).then(response => {
            expect(response).to.have.length.above(1);
            expect(response[0]).to.have.deep.property('id');
            expect(response[0]).to.have.deep.property('lastUpdated');
        });
    });

    it('can be called with a toTime', () => {
        const tvdb = new TVDB(API_KEY);

        const now = Math.floor((new Date()).getTime() / 1000);
        const fromTime = now - (60 * 60 * 24 * 6);

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
