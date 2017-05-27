'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getSeriesImages', () => {

    it('should return an array of the images for the series with id "73255"', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeriesImages(71663).then(response => {
            expect(response).to.be.an('object');
            expect(response).to.contain.all.keys('fanart', 'poster', 'season', 'series');

            expect(response.poster).to.be.an('array');
            expect(response.poster).to.not.be.empty;
        });
    });

});
