'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#episodeByAirDate', () => {

    it('should return all episodes aired on "2011-10-03" from the show with id "153021"', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getEpisodesByAirDate(153021, '2011-10-03').then(response => {
            expect(response.length).to.equal(6);

            [4185563, 4185564, 4185565, 4185566, 4185567, 4185568].forEach(episodeId => {
                return expect(response.find(episode => episode.id === episodeId)).to.exist;
            });
        });
    });

    it('should return an empty array if no episodes did air on the requested date', () => {
        const tvdb = new TVDB(API_KEY);

        return expect(tvdb.getEpisodesByAirDate(153021, '2000-01-01')).to.be.rejected;
    });

});
