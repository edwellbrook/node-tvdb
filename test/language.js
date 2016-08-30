'use strict';

let TVDB    = require("..");
let API_KEY = process.env.TVDB_KEY;

let chai = require('chai');
let expect = chai.expect;

describe("Language", () => {
    it("should return the default language as \"en\"", () => {
        return expect(new TVDB(API_KEY).language).to.eql('en');
    });

    it("should return the language as \"pt\" if initialised with the language \"pt\"", () => {
        return expect(new TVDB(API_KEY, "pt").language).to.eql('pt');
    });

    it("should return the lanaguage as \"pt\" if changed to \"pt\"", () => {
        let client      = new TVDB(API_KEY);
        client.language = "pt";
        return expect(client.language).to.eql('pt');
    });
});
