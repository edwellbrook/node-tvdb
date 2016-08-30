'use strict';

let TVDB    = require("..");
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe('#episodeByAirDate', () => {
    it('should return all episodes aired on "2011-10-03" from the show with id "153021"', () => {
        return new TVDB(API_KEY).getEpisodesByAirDate(153021, '2011-10-03')
            .then(response => {
                expect(response.length).to.eql(6);
                [4185563, 4185564, 4185565, 4185566, 4185567, 4185568].forEach(episodeId => {
                    return expect(response.find(episode => episode.id === episodeId)).to.exist;
                });
            });
    });

    it('should return an empty array if no episodes did air on the requested date', () => {
        return expect(new TVDB(API_KEY).getEpisodesByAirDate(153021, '2000-01-01')).to.be.rejected;
    });
});
