'use strict';

let TVDB = require('..');
let API_KEY = process.env.TVDB_KEY;

let chai           = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe('#getLanguages', () => {

    it('result should contain english and german language objects', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getLanguages().then(langs => {
            const enLang = langs.find(entry => entry.abbreviation === 'en')
            const deLang = langs.find(entry => entry.abbreviation === 'de')

            expect(enLang.abbreviation).to.eql('en');
            expect(enLang.id).to.eql(7);
            expect(enLang.name).to.eql('English');

            expect(deLang.abbreviation).to.eql('de');
            expect(deLang.id).to.eql(14);
            expect(deLang.name).to.eql('Deutsch');
        });
    });

});
