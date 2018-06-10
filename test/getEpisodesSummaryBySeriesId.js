'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getEpisodesSummaryBySeriesId', () => {

    it('should return an object for the series with id "176941"', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getEpisodesSummaryBySeriesId(176941).then(response => {
            expect(response).to.be.an('object');

            expect(response).to.contain.all.keys('airedEpisodes', 'airedSeasons', 'dvdEpisodes', 'dvdSeasons');
            expect(response.airedEpisodes).to.be.a('String');
            expect(response.airedSeasons).to.be.a('Array');
            expect(response.dvdEpisodes).to.be.a('String');
            expect(response.dvdSeasons).to.be.a('Array');
        });
    });

});
