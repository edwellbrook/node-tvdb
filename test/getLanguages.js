'use strict';

const TVDB = require('..');
const API_KEY = process.env.TVDB_KEY;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('#getLanguages', () => {

    it('result should contain english and german language objects', () => {
        const tvdb = new TVDB(API_KEY);

        return tvdb.getLanguages().then(langs => {
            const enLang = langs.find(entry => entry.abbreviation === 'en');
            const deLang = langs.find(entry => entry.abbreviation === 'de');

            expect(enLang.abbreviation).to.equal('en');
            expect(enLang.id).to.equal(7);
            expect(enLang.name).to.equal('English');

            expect(deLang.abbreviation).to.equal('de');
            expect(deLang.id).to.equal(14);
            expect(deLang.name).to.equal('Deutsch');
        });
    });

});
