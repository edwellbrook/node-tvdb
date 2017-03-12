'use strict';

const TVDB = require('..');
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');
const sinon = require('sinon');
const Body = require('node-fetch/lib/body');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const API_KEY = 'fake-api-key';
const JWT_TOKEN = 'fake-jwt-token';
const BASE_URL = 'https://api.thetvdb.com';
const LIB_VERSION = require('../package.json').version;
const API_VERSION = 'v2.1.1';
const AV_HEADER = `application/vnd.thetvdb.${API_VERSION}`;
const AGENT_STRING = `node-tvdb/${LIB_VERSION} (+https://github.com/edwellbrook/node-tvdb)`;

const HTML_RESPONSE_HEADERS = { 'content-type': 'text/html; charset=utf-8' };
const JSON_RESPONSE_HEADERS = { 'content-type': 'application/json; charset=utf-8' };

describe('Client', () => {

    before((done) => {
        nock.disableNetConnect();
        done();
    });

    after((done) => {
        nock.cleanAll();
        nock.enableNetConnect();
        done();
    });

    describe('#constructor', () => {

        describe('when called with no arguments', () => {

            it('should throw', () => {
                return expect(() => new TVDB()).to.throw(Error, 'API key is required');
            });

        });

        describe('when called with api key', () => {

            let client;

            before((done) => {
                client = new TVDB(API_KEY);

                done();
            });

            it('should store the api key', () => {
                return expect(client.apiKey).to.equal(API_KEY);
            });

            it('should set the default language (en)', () => {
                return expect(client.language).to.equal('en');
            });

        });

        describe('when called with api key and language', () => {

            let client;

            before((done) => {
                client = new TVDB(API_KEY, 'ja');

                done();
            });

            it('should store the api key', () => {
                return expect(client.apiKey).to.equal(API_KEY);
            });

            it('should set the given language', () => {
                return expect(client.language).to.equal('ja');
            });

        });

    });

    describe('#getToken', () => {

        describe('when api key is valid', () => {

            let api;
            let client;

            before((done) => {
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
                }, JSON_RESPONSE_HEADERS);

                client = new TVDB(API_KEY);

                done();
            });

            it('should call the /login endpoint', () => {
                return expect(client.getToken()).to.be.fulfilled.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should yield the token from the api response', () => {
                return expect(client.getToken()).to.eventually.equal(JWT_TOKEN);
            });

        });

        describe('when api key is not valid', () => {

            let api;
            let client;

            before((done) => {
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
                }, JSON_RESPONSE_HEADERS);

                client = new TVDB(API_KEY);

                done();
            });

            it('should call the /login endpoint', () => {
                return expect(client.getToken()).to.be.rejected.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should throw the error from the api response', () => {
                return expect(client.getToken()).to.be.rejectedWith(Error, 'API Key Required');
            });

            it('should put the response on the error', () => {
                return client.getToken().catch((e) => {
                    expect(e.response).to.be.instanceOf(Body);
                    expect(e.response.status).to.equal(401);
                });
            });

        });

        describe('when the api is down', () => {

            let api;
            let client;

            before((done) => {
                api = nock(BASE_URL, {
                    reqheaders: {
                        'accept': AV_HEADER,
                        'content-type': 'application/json'
                    }
                })
                .post('/login', {
                    apikey: API_KEY
                })
                .reply(522, '<HTML>', HTML_RESPONSE_HEADERS);

                client = new TVDB(API_KEY);

                done();
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

        let client;
        let getTokenSpy;

        before((done) => {
            client = new TVDB(API_KEY);
            getTokenSpy = sinon.stub(client, 'getToken', () => Promise.resolve(JWT_TOKEN));

            done();
        });

        describe('single page result', () => {

            let data = [
                {id: 0},
                {id: 1},
                {id: 2}
            ];

            let api;

            beforeEach((done) => {
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
                }, JSON_RESPONSE_HEADERS);

                done();
            });

            it('should call getToken', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.fulfilled.then(() => {
                    expect(getTokenSpy).to.have.been.calledOnce;
                });
            });

            it('should call the specified endpoint', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.fulfilled.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should resolve to the data returned by the api', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.eventually.deep.equal(data);
            });

        });

        describe('multi page result', () => {

            let api;
            let data = [
                {id: 0},
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4},
                {id: 5}
            ];

            beforeEach((done) => {
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
                }, JSON_RESPONSE_HEADERS)
                .get('/some/path?page=2')
                .reply(200, {
                    data: data.slice(3, 6)
                }, JSON_RESPONSE_HEADERS);

                done();
            });

            it('should call getToken twice', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.fulfilled.then(() => {
                    expect(getTokenSpy).to.have.been.calledTwice;
                });
            });

            it('should call the specified endpoint twice', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.fulfilled.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should resolve to the combined data returned by the api', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.eventually.deep.equal(data);
            });

        });

        describe('when the api returns an error', () => {

            let api;

            beforeEach((done) => {
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
                }, JSON_RESPONSE_HEADERS);

                done();
            });

            it('should call getToken', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.rejected.then(() => {
                    expect(getTokenSpy).to.have.been.calledOnce;
                });
            });

            it('should call the specified endpoint', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.rejected.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should throw the error returned by the api', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.rejectedWith(Error, 'ID Not Found');
            });

            it('should put the response on the error', () => {
                const promise = client.sendRequest('some/path');
                return promise.catch((e) => {
                    expect(e.response).to.be.instanceOf(Body);
                    expect(e.response.status).to.equal(404);
                });
            });

        });

        describe('when the api is down', () => {

            let api;

            beforeEach((done) => {
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
                .reply(522, '<html>', HTML_RESPONSE_HEADERS);

                done();
            });

            it('should call getToken', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.rejected.then(() => {
                    expect(getTokenSpy).to.have.been.calledOnce;
                });
            });

            it('should call the specified endpoint', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.rejected.then(() => {
                    expect(api.isDone()).to.be.true;
                });
            });

            it('should throw', () => {
                const promise = client.sendRequest('some/path');
                return expect(promise).to.be.rejectedWith(Error);
            });

            it('should put the response on the error', () => {
                const promise = client.sendRequest('some/path');
                return promise.catch((e) => {
                    expect(e.response).to.be.instanceOf(Body);
                    expect(e.response.status).to.equal(522);
                });
            });

        });

    });

});

