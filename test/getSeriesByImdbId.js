'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getSeriesByImdbId', function () {

    it('should return a series with IMDB id "tt0096697"', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeriesByImdbId('tt0096697')
            .then(function (response) {
                expect(response).to.have.length(1);
                expect(response[0]).to.have.property('id', 71663);
                expect(response[0]).to.have.property('seriesName', 'The Simpsons');
            });
    });

    describe('returns the correct record for other languages', () => {

        it('if given in constructor', () => {
            const tvdb = new TVDB(API_KEY, 'de');

            return tvdb.getSeriesByImdbId('tt0096697')
                .then(response => {
                    expect(response).to.have.length(1);
                    expect(response[0]).to.have.property('id', 71663);
                    expect(response[0]).to.have.property('seriesName', 'Die Simpsons');
                });
        });

        it('if given in function call', () => {
            const tvdb = new TVDB(API_KEY, 'en');

            return tvdb.getSeriesByImdbId('tt0096697', { lang: 'de' }).then(response => {
                expect(response).to.have.length(1);
                expect(response[0]).to.have.property('id', 71663);
                expect(response[0]).to.have.property('seriesName', 'Die Simpsons');
            });
        });

    });

    it('should return an error for a series search with an invalid id', () => {
        const tvdb = new TVDB(API_KEY);

        return expect(tvdb.getSeriesByImdbId('')).to.be.rejected;
    });
});
