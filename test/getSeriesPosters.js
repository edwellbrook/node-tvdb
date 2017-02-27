'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getSeriesPosters', () => {

    it('should return an array of the posters for the series with id "176941"', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeriesPosters(176941).then(response => {
            expect(response).to.be.an('array');
            expect(response).to.not.be.empty;

            const poster = response[0];
            expect(poster).to.contain.all.keys('id', 'keyType', 'subKey', 'fileName', 'resolution', 'ratingsInfo', 'thumbnail');
            expect(poster.keyType).to.equal('poster');
            expect(poster.fileName).to.contain('posters/176941');
        });
    });

});
