'use strict';

const { TheTVDB } = require('../dist');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getSeriesBanner', () => {
    it('should return an array of the banners for the series with id "246151"', () => {
        const tvdb = new TheTVDB(API_KEY);

        return tvdb.getSeriesBanner(71663).then(response => {
            expect(response).to.contain('graphical/71663');
        });
    });

});
