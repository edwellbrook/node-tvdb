'use strict';

const { TheTVDB } = require('../dist');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe("#getUpdates", function() {
    // Currently the API returns nothing for any timeframes
    // it('must be called with a from Time', () => {
    //     const tvdb = new TheTVDB(API_KEY);
    //     const fromTime = 1471386405;

    //     return tvdb.getUpdates(fromTime).then(response => {
    //         expect(response).to.have.length.of.at.least(100);
    //         expect(response[0]).to.have.deep.property('id');
    //         expect(response[0]).to.have.deep.property('lastUpdated');
    //     });
    // });

    // it('can be called with a toTime', () => {
    //     const tvdb = new TheTVDB(API_KEY);
    //     const fromTime = 1471386405;
    //     const toTime = fromTime + 10000;

    //     return tvdb.getUpdates(fromTime, toTime).then(response => {
    //         expect(response).to.have.length.above(1);
    //         expect(response[0]).to.have.deep.property('id');
    //         expect(response[0]).to.have.deep.property('lastUpdated');
    //     });
    // });

    it('cannot be called with an invalid fromTime', () => {
        const tvdb = new TheTVDB(API_KEY);

        // @ts-expect-error
        return expect(tvdb.getUpdates()).to.be.rejected;
    });

    it('cannot be called without a fromTime', () => {
        const tvdb = new TheTVDB(API_KEY);

        // @ts-expect-error
        return expect(tvdb.getUpdates('')).to.be.rejected;
    });
});
