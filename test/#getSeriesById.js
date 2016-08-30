'use strict';

let TVDB    = require("..");
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe('#getSeriesById', () => {
    it("should return an object of the series with id \"246151\"", () => {
        return new TVDB(API_KEY).getSeriesById("71663")
            .then(response => {
                expect(response.id).to.eql(71663);
                expect(response.seriesName).to.eql('The Simpsons');
            });
    });

    describe('returns the correct data for other languages', () => {
        it("if given in constructor", ()=> {
            return new TVDB(API_KEY, 'de').getSeriesById("71663")
                .then(response => {
                    expect(response.id).to.eql(71663);
                    expect(response.seriesName).to.eql('Die Simpsons');
                });
        });
        it("if given in function call", ()=> {
            return new TVDB(API_KEY, 'en').getSeriesById("71663", 'de')
                .then(response => {
                    expect(response.id).to.eql(71663);
                    expect(response.seriesName).to.eql('Die Simpsons');
                });
        });
    });
});
