'use strict';

let TVDB    = require("..");
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe("#getSeriesBanner", () => {
    it("should return an array of the banners for the series with id \"246151\"", () => {
        return new TVDB(API_KEY).getSeriesBanner(71663)
            .then(response => {
                expect(response).to.contain('graphical/71663');
            });
    });
});
