'use strict';

let TVDB    = require("..");
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe('#getEpisodesBySeriesId', () => {
    it('should return the episodes of the series with id "71470"', () => {
        return new TVDB(API_KEY).getEpisodesBySeriesId(71470)
            .then(response => {
                expect(response.length).to.eql(178);

                let someEpisode = response.find(ep => ep.airedSeason === 3 && ep.airedEpisodeNumber === 22);

                expect(someEpisode.episodeName).to.eql('The Most Toys');
            });
    });

    describe('returns correct record for other languages', () => {
        it('if given in constructor', () => {
            return new TVDB(API_KEY, 'de').getEpisodesBySeriesId(71470)
                .then(response => {
                    expect(response.length).to.eql(178);

                    let someEpisode = response.find(ep => ep.airedSeason === 3 && ep.airedEpisodeNumber === 22);

                    expect(someEpisode.episodeName).to.eql('Der Sammler');
                });
        });
        it('if given in function call', () => {
            return new TVDB(API_KEY).getEpisodesBySeriesId(71470, 'de')
                .then(response => {
                    expect(response.length).to.eql(178);

                    let someEpisode = response.find(ep => ep.airedSeason === 3 && ep.airedEpisodeNumber === 22);

                    expect(someEpisode.episodeName).to.eql('Der Sammler');
                });
        });
    });
});