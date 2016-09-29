'use strict';

let TVDB    = require("..");
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe("#getSeriesByName", () => {
    it("should return an array of available matches", ()=>
        new TVDB(API_KEY).getSeriesByName("The Walking Dead")
            .then(response => {
                expect(response).to.have.length.of.at.least(2);

                let theWalkingDeadShow = response.find(show => show.id === 153021);
                expect(theWalkingDeadShow).to.exist;
                expect(theWalkingDeadShow.id).to.eql(153021);
                expect(theWalkingDeadShow.seriesName).to.eql('The Walking Dead');

                let fearTheWalkingDeadShow = response.find(show => show.id === 290853);
                expect(fearTheWalkingDeadShow).to.exist;
                expect(fearTheWalkingDeadShow.id).to.eql(290853);
                expect(fearTheWalkingDeadShow.seriesName).to.eql('Fear the Walking Dead');
            }));

    describe('returns the correct data for other languages', () => {
        it('if given in constructor', () => {
            return (new TVDB(API_KEY, 'de')).getSeriesByName('Simpsons')
                .then(response => {
                    expect(response).to.have.length.of.at.least(1);

                    let show = response.find(s => s.id === 71663);
                    expect(show).to.exist;
                    expect(show.id).to.eql(71663);
                    expect(show.seriesName).to.eql('Die Simpsons');
                });

        });
        it('if given in function call', () => {
            return (new TVDB(API_KEY)).getSeriesByName('Simpsons', 'de')
                .then(response => {
                    expect(response).to.have.length.of.at.least(1);

                    let show = response.find(s => s.id === 71663);
                    expect(show).to.exist;
                    expect(show.id).to.eql(71663);
                    expect(show.seriesName).to.eql('Die Simpsons');
                });
        });
    });

    describe('returns 404 error when no matches are found', () => {
        it(`when search term is 'asdas'`, () => {
            return expect((new TVDB(API_KEY)).getSeriesByName('asdas')).to.be.rejected;
        });

        it(`when search term is blank`, () => {
            return expect((new TVDB(API_KEY)).getSeriesByName('')).to.be.rejected;
        });
    });

    describe('returns result only for language where show exists', () => {
        it(`show does not exist for language 'de'`, () => {
            return expect((new TVDB(API_KEY, 'de')).getSeriesByName('Jessica Simpsons The Price of Beauty')).to.be.rejected;
        });

        it(`show does exist for language 'de'`, () =>
            (new TVDB(API_KEY)).getSeriesByName('Jessica Simpsons The Price of Beauty')
                .then(response => {
                    expect(response).to.have.length.of.at.least(1);

                    let show = response.find(s => s.id === 153221);
                    expect(show).to.exist;
                    expect(show.id).to.eql(153221);
                })
        );
    });
});
