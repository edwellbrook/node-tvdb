'use strict';

let TVDB = require('..');
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe("#getSeriesBanner", () => {

    it("should return an array of the banners for the series with id \"246151\"", () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getSeriesBanner(71663).then(response => {
            expect(response).to.contain('graphical/71663');
        });
    });

});
