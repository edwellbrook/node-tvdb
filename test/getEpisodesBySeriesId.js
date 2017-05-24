'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getEpisodesBySeriesId', () => {

    it('should return the episodes of the series with id "71470"', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getEpisodesBySeriesId(71470).then(response => {
            expect(response).to.have.length.above(0);

            let someEpisode = response.find(ep => ep.airedSeason === 3 && ep.airedEpisodeNumber === 22);

            expect(someEpisode.episodeName).to.equal('The Most Toys');
        });
    });

    it('should allow filtering request to season and episode', () => {
        const tvdb = new TVDB(API_KEY);
        const opts = {
            query: {
                airedSeason: 3,
                airedEpisode: 22
            }
        };

        return tvdb.getEpisodesBySeriesId(71470, opts).then(response => {
            expect(response).to.have.length(1);
            expect(response[0].episodeName).to.equal('The Most Toys');
        });
    });

    describe('returns correct record for other languages', () => {

        it('if given in constructor', () => {
            const tvdb = new TVDB(API_KEY, 'de');

            return tvdb.getEpisodesBySeriesId(71470).then(response => {
                expect(response).to.have.length.above(0);

                let someEpisode = response.find(ep => ep.airedSeason === 3 && ep.airedEpisodeNumber === 22);

                expect(someEpisode.episodeName).to.equal('Der Sammler');
            });
        });

        it('if given in function call', () => {
            const tvdb = new TVDB(API_KEY, 'en');

            return tvdb.getEpisodesBySeriesId(71470, { lang: 'de' }).then(response => {
                expect(response).to.have.length.above(0);

                let someEpisode = response.find(ep => ep.airedSeason === 3 && ep.airedEpisodeNumber === 22);

                expect(someEpisode.episodeName).to.equal('Der Sammler');
            });
        });

    });

    it('returns data from several pages', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getEpisodesBySeriesId(71663).then(response => {
            expect(response).to.have.length.above(600);
        });
    });

});
