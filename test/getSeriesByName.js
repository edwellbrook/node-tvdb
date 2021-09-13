'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getSeriesByName', () => {

    it('should return an array of available matches', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeriesByName('The Walking Dead').then(response => {
            expect(response).to.have.length.of.at.least(2);

            let theWalkingDeadShow = response.find(show => show.id === 153021);
            expect(theWalkingDeadShow).to.exist;
            expect(theWalkingDeadShow.id).to.equal(153021);
            expect(theWalkingDeadShow.seriesName).to.equal('The Walking Dead');

            let fearTheWalkingDeadShow = response.find(show => show.id === 290853);
            expect(fearTheWalkingDeadShow).to.exist;
            expect(fearTheWalkingDeadShow.id).to.equal(290853);
            expect(fearTheWalkingDeadShow.seriesName).to.equal('Fear the Walking Dead');
        });
    });

    it('should return result for unescaped series name', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeriesByName('Eastbound & Down').then(response => {
            expect(response).to.have.length.of.at.least(1);

            let show = response.find(s => s.id === 82467);
            expect(show).to.exist;
        });
    });

    describe('returns the correct data for other languages', () => {

        it('if given in constructor', () => {
            const tvdb = new TVDB(API_KEY, 'de');

            return tvdb.getSeriesByName('Simpsons').then(response => {
                expect(response).to.have.length.of.at.least(1);

                let show = response.find(s => s.id === 71663);
                expect(show).to.exist;
                expect(show.id).to.equal(71663);
                expect(show.seriesName).to.equal('Die Simpsons');
            });
        });

        it('if given in function call', () => {
            const tvdb = new TVDB(API_KEY);

            return tvdb.getSeriesByName('Simpsons', { lang: 'de' }).then(response => {
                expect(response).to.have.length.of.at.least(1);

                const show = response.find(s => s.id === 71663);
                expect(show).to.exist;
                expect(show.id).to.equal(71663);
                expect(show.seriesName).to.equal('Die Simpsons');
            });
        });

    });

    describe('returns 404 error when no matches are found', () => {

        it(`when search term is 'asdasqwerty'`, () => {
            const tvdb = new TVDB(API_KEY);

            return expect(tvdb.getSeriesByName('asdasqwerty')).to.be.rejected;
        });

        it(`when search term is blank`, () => {
            const tvdb = new TVDB(API_KEY);

            return expect(tvdb.getSeriesByName('')).to.be.rejected;
        });

    });

});
