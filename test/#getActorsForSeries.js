'use strict';

let TVDB = require('..');
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe("#getActorsForSeries", () => {

    it(`should return an array of the actors for the series with id '153021'`, () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getActors(246151).then(response => {
            expect(response).to.have.length.of.at.least(5)
        });
    });

});
