'use strict';

/* eslint mocha/no-synchronous-tests: "off" */

const TVDB = require('..');
const API_KEY = 'fake-api-key';
const JWT_TOKEN = 'fake-jwt-token';
const BASE_URL = 'https://api.thetvdb.com';
const LIB_VERSION = require('../package.json').version;
const API_VERSION = 'v2.1.1';
const AV_HEADER = `application/vnd.thetvdb.${API_VERSION}`;
const AGENT_STRING = `node-tvdb/${LIB_VERSION} (+https://github.com/edwellbrook/node-tvdb)`;

const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');
const sinon = require('sinon');
const Body = require('node-fetch/lib/body');

chai
.use(require('chai-as-promised'))
.use(require('sinon-chai'));

describe('Client', () => {

    before(() => {
        nock.disableNetConnect();
    });

    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });

    describe('#constructor', () => {

        describe('when called with no arguments', () => {

            it('should throw', () => {
                expect(() => {
                    return new TVDB();
                }).to.throw(Error, 'API key is required');
            });

        });

        describe('when called with api key', () => {

            let client;

            before(() => {
                client = new TVDB(API_KEY);
            });

            it('should store the api key', () => {
                expect(client.apiKey).to.equal(API_KEY);
            });

            it('should set the default language (en)', () => {
                expect(client.language).to.equal('en');
            });

        });

        describe('when called with api key and language', () => {

            let client;

            before(() => {
                client = new TVDB(API_KEY, 'ja');
            });

            it('should store the api key', () => {
                expect(client.apiKey).to.equal(API_KEY);
            });

            it('should set the given language', () => {
                expect(client.language).to.equal('ja');
            });

        });

    });

    describe('#getToken', () => {

        describe('when api key is valid', () => {

            let api, client;

            before(() => {
                api = nock(BASE_URL, {
                    reqheaders: {
                        'accept': AV_HEADER,
                        'content-type': 'application/json'
                    }
                })
                .post('/login', {
                    apikey: API_KEY
                })
                .reply(200, {
                    token: JWT_TOKEN
                }, {
                    'content-type': 'application/json; charset=utf-8'
                });
                client = new TVDB(API_KEY);
            });

            it('should call the /login endpoint', () => {
                return expect(client.getToken()).to.be.fulfilled.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should return a promise', () => {
                expect(client.getToken()).to.be.instanceOf(Promise);
            });

            it('should yield the token from the api response', () => {
                return expect(client.getToken()).to.eventually.equal(JWT_TOKEN);
            });

        });

        describe('when api key is not valid', () => {

            let api, client;

            before(() => {
                api = nock(BASE_URL, {
                    reqheaders: {
                        'accept': AV_HEADER,
                        'content-type': 'application/json'
                    }
                })
                .post('/login', {
                    apikey: API_KEY
                })
                .reply(401, {
                    Error: 'API Key Required'
                }, {
                    'content-type': 'application/json; charset=utf-8'
                });
                client = new TVDB(API_KEY);
            });

            it('should call the /login endpoint', () => {
                return expect(client.getToken()).to.be.rejected.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should throw the error from the api response', () => {
                return expect(client.getToken()).to.be.rejectedWith(Error, 'Unauthorized - API Key Required');
            });

            it('should put the response on the error', () => {
                return client.getToken().catch((e) => {
                    expect(e.response).to.be.instanceOf(Body);
                    expect(e.response.status).to.equal(401);
                });
            });

        });

        describe('when the api is down', () => {

            let api, client;

            before(() => {
                api = nock(BASE_URL, {
                    reqheaders: {
                        'accept': AV_HEADER,
                        'content-type': 'application/json'
                    }
                })
                .post('/login', {
                    apikey: API_KEY
                })
                .reply(522, '<HTML>', {
                    'content-type': 'text/html; charset=utf-8'
                });
                client = new TVDB(API_KEY);
            });

            it('should call the /login endpoint', () => {
                return expect(client.getToken()).to.be.rejected.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should throw', () => {
                return expect(client.getToken()).to.be.rejectedWith(Error);
            });

            it('should put the response on the error', () => {
                return client.getToken().catch((e) => {
                    expect(e.response).to.be.instanceOf(Body);
                    expect(e.response.status).to.equal(522);
                });
            });

        });

    });

    describe('#sendRequest', () => {

        let client, getTokenSpy;

        before(() => {
            client = new TVDB(API_KEY);
            getTokenSpy = sinon.stub(client, 'getToken', () => Promise.resolve(JWT_TOKEN));
        });

        describe('single page result', () => {

            let api, p;
            let data = [
                {id: 0},
                {id: 1},
                {id: 2}
            ];

            before(() => {
                getTokenSpy.reset();
                api = nock(BASE_URL, {
                    reqheaders: {
                        'accept': AV_HEADER,
                        'accept-language': 'en',
                        'authorization': `Bearer ${JWT_TOKEN}`,
                        'user-agent': AGENT_STRING
                    }
                })
                .get('/some/path')
                .reply(200, {
                    data: data
                }, {
                    'content-type': 'application/json; charset=utf-8'
                });
                p = client.sendRequest('some/path');
            });

            it('should return a promise', () => {
                expect(p).to.be.instanceOf(Promise);
            });

            it('should call getToken', () => {
                return expect(p).to.be.fulfilled.then(() => {
                    expect(getTokenSpy).to.have.been.calledOnce;
                });
            });

            it('should call the specified endpoint', () => {
                return expect(p).to.be.fulfilled.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should resolve to the data returned by the api', () => {
                return expect(p).to.eventually.deep.equal(data);
            });

        });

        describe('multi page result', () => {

            let api, p;
            let data = [
                {id: 0},
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4},
                {id: 5}
            ];

            before(() => {
                getTokenSpy.reset();
                api = nock(BASE_URL, {
                    reqheaders: {
                        'accept': AV_HEADER,
                        'accept-language': 'en',
                        'authorization': `Bearer ${JWT_TOKEN}`,
                        'user-agent': AGENT_STRING
                    }
                })
                .get('/some/path')
                .reply(200, {
                    data: data.slice(0, 3),
                    links: {
                        next: 2
                    }
                }, {
                    'content-type': 'application/json; charset=utf-8'
                })
                .get('/some/path?page=2')
                .reply(200, {
                    data: data.slice(3, 6)
                }, {
                    'content-type': 'application/json; charset=utf-8'
                });
                p = client.sendRequest('some/path');
            });

            it('should return a promise', () => {
                expect(p).to.be.instanceOf(Promise);
            });

            it('should call getToken twice', () => {
                return expect(p).to.be.fulfilled.then(() => {
                    expect(getTokenSpy).to.have.been.calledTwice;
                });
            });

            it('should call the specified endpoint twice', () => {
                return expect(p).to.be.fulfilled.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should resolve to the combined data returned by the api', () => {
                return expect(p).to.eventually.deep.equal(data);
            });

        });

        describe('when the api returns an error', () => {

            let api, p;

            before(() => {
                getTokenSpy.reset();
                api = nock(BASE_URL, {
                    reqheaders: {
                        'accept': AV_HEADER,
                        'accept-language': 'en',
                        'authorization': `Bearer ${JWT_TOKEN}`,
                        'user-agent': AGENT_STRING
                    }
                })
                .get('/some/path')
                .reply(404, {
                    Error: 'ID Not Found'
                }, {
                    'content-type': 'application/json; charset=utf-8'
                });
                p = client.sendRequest('some/path');
            });

            it('should return a promise', () => {
                expect(p).to.be.instanceOf(Promise);
            });

            it('should call getToken', () => {
                return expect(p).to.be.rejected.then(() => {
                    expect(getTokenSpy).to.have.been.calledOnce;
                });
            });

            it('should call the specified endpoint', () => {
                return expect(p).to.be.rejected.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should throw the error returned by the api', () => {
                return expect(p).to.be.rejectedWith(Error, 'Not Found - ID Not Found');
            });

            it('should put the response on the error', () => {
                return p.catch((e) => {
                    expect(e.response).to.be.instanceOf(Body);
                    expect(e.response.status).to.equal(404);
                });
            });

        });

        describe('when the api is down', () => {

            let api, p;

            before(() => {
                getTokenSpy.reset();
                api = nock(BASE_URL, {
                    reqheaders: {
                        'accept': AV_HEADER,
                        'accept-language': 'en',
                        'authorization': `Bearer ${JWT_TOKEN}`,
                        'user-agent': AGENT_STRING
                    }
                })
                .get('/some/path')
                .reply(522, '<html>', {
                    'content-type': 'text/html; charset=utf-8'
                });
                p = client.sendRequest('some/path');
            });

            it('should return a promise', () => {
                expect(p).to.be.instanceOf(Promise);
            });

            it('should call getToken', () => {
                return expect(p).to.be.rejected.then(() => {
                    expect(getTokenSpy).to.have.been.calledOnce;
                });
            });

            it('should call the specified endpoint', () => {
                return expect(p).to.be.rejected.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should throw', () => {
                return expect(p).to.be.rejectedWith(Error);
            });

            it('should put the response on the error', () => {
                return p.catch((e) => {
                    expect(e.response).to.be.instanceOf(Body);
                    expect(e.response.status).to.equal(522);
                });
            });

        });

    });

});

