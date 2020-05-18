'use strict';

const { TheTVDB } = require('../dist');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe("#getActorsForSeries", () => {
    it('should return an array of the actors for the series with id "153021"', () => {
        const tvdb = new TheTVDB(API_KEY);

        return tvdb.getActors(246151).then(response => {
            expect(response).to.have.length.of.at.least(5);
        });
    });

});
