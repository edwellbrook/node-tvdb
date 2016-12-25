'use strict';

let TVDB = require('..');
let API_KEY = process.env.TVDB_KEY;

let chai = require('chai');
let expect = chai.expect;

describe("Language", () => {

    it("should return the default language as \"en\"", () => {
        const tvdb = new TVDB(API_KEY);

        return expect(tvdb.language).to.eql('en');
    });

    it("should return the language as \"pt\" if initialised with the language \"pt\"", () => {
        const tvdb = new TVDB(API_KEY, 'pt');

        return expect(tvdb.language).to.eql('pt');
    });

    it("should return the lanaguage as \"pt\" if changed to \"pt\"", () => {
        const tvdb = new TVDB(API_KEY);
        expect(tvdb.language).to.equal('en');

        tvdb.language = 'pt';
        return expect(tvdb.language).to.equal('pt');
    });

});
