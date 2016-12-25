'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getSeriesById', () => {

    it("should return an object of the series with id \"246151\"", () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeriesById("71663").then(response => {
            expect(response.id).to.equal(71663);
            expect(response.seriesName).to.equal('The Simpsons');
        });
    });

    describe('returns the correct data for other languages', () => {

        it("if given in constructor", () => {
            const tvdb = new TVDB(API_KEY, 'de');

            return tvdb.getSeriesById("71663")
                .then(response => {
                    expect(response.id).to.equal(71663);
                    expect(response.seriesName).to.equal('Die Simpsons');
                });
        });

        it("if given in function call", () => {
            const tvdb = new TVDB(API_KEY, 'en');

            return tvdb.getSeriesById("71663", { lang: 'de' }).then(response => {
                expect(response.id).to.equal(71663);
                expect(response.seriesName).to.equal('Die Simpsons');
            });
        });

    });

});
