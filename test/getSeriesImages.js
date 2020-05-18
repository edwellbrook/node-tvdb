'use strict';

const { TheTVDB } = require('../dist');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getSeriesImages', () => {
    it('should return an array of the fanart images for the series with id "73255"', () => {
        const tvdb = new TheTVDB(API_KEY);

        return tvdb.getSeriesImages(71663, 'fanart').then(response => {
            expect(response).to.be.an('array');
            expect(response).to.not.be.empty;

            response.forEach(poster => {
                expect(poster).to.contain.all.keys('id', 'keyType', 'subKey', 'fileName', 'resolution', 'ratingsInfo', 'thumbnail');
                expect(poster.keyType).to.equal('fanart');
            });
        });
    });
});
