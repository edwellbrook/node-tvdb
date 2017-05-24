'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KE;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getSeasonPosters', () => {

    it('should return an array of season posters for the series with id "80379", season 10', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeasonPosters(80379, 10).then(response => {
            expect(response).to.be.an('array');
            expect(response).to.not.be.empty;

            response.forEach(poster => {
                expect(poster).to.contain.all.keys('id', 'keyType', 'subKey', 'fileName', 'resolution', 'ratingsInfo', 'thumbnail');
                expect(poster.keyType).to.equal('season');
                expect(poster.fileName).to.contain('seasons/80379');
            });
        });
    });

});
