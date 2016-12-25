'use strict';

let TVDB = require('..');
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe('#getSeriesAllById', () => {

    it("should return an object of the series and its episodes with id \"246151\"", () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeriesAllById("71470").then(response => {
            expect(response.id).to.eql(71470);
            expect(response.seriesName).to.eql('Star Trek: The Next Generation');
            expect(response.episodes).to.have.length.above(0);

            const firstEpisode = response.episodes.find(ep => ep.airedSeason === 1 && ep.airedEpisodeNumber === 1);
            expect(firstEpisode.episodeName).to.eql('Encounter at Farpoint (1)');
        });
    });

    describe('returns the correct data for other languages', () => {

        it("if given in constructor", () => {
            const tvdb = new TVDB(API_KEY, 'de');

            return tvdb.getSeriesAllById(71470).then(response => {
                expect(response.id).to.eql(71470);
                expect(response.seriesName).to.eql('Raumschiff Enterprise - Das nächste Jahrhundert');
                expect(response.episodes).to.have.length.above(0);

                const firstEpisode = response.episodes.find(ep => ep.airedSeason === 1 && ep.airedEpisodeNumber === 1);
                expect(firstEpisode.episodeName).to.eql('Der Mächtige');
            });
        });

        it("if given in function call", () => {
            const tvdb = new TVDB(API_KEY, 'en');

            return tvdb.getSeriesAllById(71470, { lang: 'de' }).then(response => {
                expect(response.id).to.eql(71470);
                expect(response.seriesName).to.eql('Raumschiff Enterprise - Das nächste Jahrhundert');
                expect(response.episodes).to.have.length.above(0);

                const firstEpisode = response.episodes.find(ep => ep.airedSeason === 1 && ep.airedEpisodeNumber === 1);
                expect(firstEpisode.episodeName).to.eql('Der Mächtige');
            });
        });

    });

    it("should return an error for a series search with an invalid id", () => {
        const tvdb = new TVDB(API_KEY);

        return expect(tvdb.getSeriesAllById('')).to.be.rejected;
    });

});
