'use strict';

let TVDB    = require("..");
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe('#getLanguages', () => {
    describe('with valid API key', () => {
        let promise;
        before(() => promise = (new TVDB(API_KEY)).getLanguages()); //eslint-disable-line mocha/no-synchronous-tests

        it('result should contain an english language object', () =>
            promise
                .then(response => response.find(entry => entry.abbreviation === 'en'))
                .then(lang => {
                    expect(lang.abbreviation).to.eql('en');
                    expect(lang.id).to.eql(7);
                    expect(lang.name).to.eql('English');
                })
        );
        it('result should contain an german language object', () =>
            promise
                .then(response => response.find(entry => entry.abbreviation === 'de'))
                .then(lang => {
                    expect(lang.abbreviation).to.eql('de');
                    expect(lang.id).to.eql(14);
                    expect(lang.name).to.eql('Deutsch');
                })
        );

    });
    describe('without a valid API key', () => {
        it("should return an error", () => {
            return expect(new TVDB("test123").getLanguages()).to.be.rejected;
        });
    });
});
