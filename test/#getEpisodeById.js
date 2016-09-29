'use strict';

let TVDB    = require("..");
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe("#getEpisodeById", () => {
    it("should return the correct data of the episode with id \"5540934\"", () => {
        return new TVDB(API_KEY).getEpisodeById(5540934)
            .then(response => {
                expect(response.id).to.eql(5540934);
                expect(response.firstAired).to.eql("2016-04-03");
                expect(response.episodeName).to.eql('Last Day on Earth');
            });
    });

    describe('returns the correct record for other languages', () => {
        it('if given in constructor', () => {
            return new TVDB(API_KEY, 'de').getEpisodeById(5540934)
                .then(response => {
                    expect(response.id).to.eql(5540934);
                    expect(response.firstAired).to.eql("2016-04-03");
                    expect(response.episodeName).to.eql('Der letzte Tag auf Erden');
                });
        });

        it('if given in function call', () => {
            return new TVDB(API_KEY, 'en').getEpisodeById(5540934, 'de')
                .then(response => {
                    expect(response.id).to.eql(5540934);
                    expect(response.firstAired).to.eql("2016-04-03");
                    expect(response.episodeName).to.eql('Der letzte Tag auf Erden');
                });
        });
    });

    it("should return an error for a episode search with an invalid id", () => {
        return expect(new TVDB(API_KEY).getEpisodeById("0")).to.be.rejected;
    });
})
;
