// Copyright (c) 2023 System Automation Corporation.
// This file is licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ApiServices } from '../../api/index.js';
import { paramsSerializer } from '../../api/paramsSerializer.js';
import { assertionCallback } from '../helpers.js';
chai.use(dirtyChai);
const testItem = { id: 'item1', name: 'Item 1' };
const server = setupServer(
// Return testItem
rest.get('http://localhost/item', (req, res, ctx) => {
    return res(ctx.json(testItem));
}), rest.post('http://localhost/item', (req, res, ctx) => {
    return res(ctx.json(testItem));
}), rest.put('http://localhost/item', (req, res, ctx) => {
    return res(ctx.json(testItem));
}), rest.patch('http://localhost/item', (req, res, ctx) => {
    return res(ctx.json(testItem));
}), rest.delete('http://localhost/item', (req, res, ctx) => {
    return res(ctx.json(testItem));
}), 
// Return request body in response
rest.post('http://localhost/echo', (req, res, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return res(ctx.json(yield req.json()));
})), rest.put('http://localhost/echo', (req, res, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return res(ctx.json(yield req.json()));
})), rest.patch('http://localhost/echo', (req, res, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return res(ctx.json(yield req.json()));
})), 
// Return contents of Echo-Header in response
rest.get('http://localhost/echoHeader', (req, res, ctx) => {
    var _a;
    return res(ctx.text((_a = req.headers.get('Echo-Header')) !== null && _a !== void 0 ? _a : ''));
}), rest.post('http://localhost/echoHeader', (req, res, ctx) => {
    var _a;
    return res(ctx.text((_a = req.headers.get('Echo-Header')) !== null && _a !== void 0 ? _a : ''));
}), rest.put('http://localhost/echoHeader', (req, res, ctx) => {
    var _a;
    return res(ctx.text((_a = req.headers.get('Echo-Header')) !== null && _a !== void 0 ? _a : ''));
}), rest.patch('http://localhost/echoHeader', (req, res, ctx) => {
    var _a;
    return res(ctx.text((_a = req.headers.get('Echo-Header')) !== null && _a !== void 0 ? _a : ''));
}), rest.delete('http://localhost/echoHeader', (req, res, ctx) => {
    var _a;
    return res(ctx.text((_a = req.headers.get('Echo-Header')) !== null && _a !== void 0 ? _a : ''));
}), 
// Return contents of params in response
rest.get('http://localhost/params', (req, res, ctx) => {
    var _a;
    return res(ctx.text((_a = req.url.search) !== null && _a !== void 0 ? _a : ''));
}));
describe('ApiServices', () => {
    before(() => {
        server.listen();
    });
    afterEach(() => {
        server.resetHandlers();
    });
    after(() => {
        server.close();
    });
    context('without authentication context', () => {
        it('does not add Authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
            const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }));
            let authHeader = null;
            server.use(rest.get('http://localhost/', (req, res) => {
                authHeader = req.headers.get('Authorization');
                return res();
            }));
            yield services.get('/');
            expect(authHeader).to.be.null();
        }));
    });
    context('with authentication context', () => {
        it('adds Authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
            const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }), {
                account: {
                    id: 'testuser',
                    name: 'Test User',
                },
                logout: () => { },
                getAccessToken: () => Promise.resolve('accesstoken'),
            });
            let authHeader = null;
            server.use(rest.get('http://localhost/', (req, res) => {
                authHeader = req.headers.get('Authorization');
                return res();
            }));
            yield services.get('/');
            expect(authHeader).to.eql('Bearer accesstoken');
        }));
    });
    describe('#get', () => {
        const services = new ApiServices(axios.create({ baseURL: 'http://localhost/', paramsSerializer }));
        describe('(url) => Promise', () => {
            it('returns response data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/item');
                expect(data).to.eql(testItem);
            }));
        });
        describe('(url, config) => Promise', () => {
            it('sends headers', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/echoHeader', { headers: { 'Echo-Header': 'get header' } });
                expect(data).to.eql('get header');
            }));
            it('sends undefined params', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/params', { params: undefined });
                expect(data).to.eql('');
            }));
            it('filters out undefined params value', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/params', { params: { param1: undefined } });
                expect(data).to.eql('');
            }));
            it('filters out empty params key', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/params', { params: { '': 'value' } });
                expect(data).to.eql('');
            }));
            it('sends string params', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/params', { params: { param1: 'param1 value', param2: '' } });
                expect(data).to.eql('?param1=param1+value&param2=');
            }));
            it('sends number params', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/params', { params: { 0: 0 } });
                expect(data).to.eql('?0=0');
            }));
            it('sends object params', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/params', {
                    params: {
                        filter: {
                            where: {
                                or: [
                                    { and: [{ a: { regexp: 'valueA' }, b: { eq: 'valueB' } }] },
                                    { and: [{ a: { regexp: 'another ValueA' }, b: { eq: 'another ValueB' } }] },
                                ],
                            },
                        },
                    },
                });
                expect(data).to.eql('?filter=%7B%22where%22%3A%7B%22or%22%3A%5B%7B%22and%22%3A%5B%7B%22a%22%3A%7B%22regexp%22%3A%22valueA%22%7D%2C%22b%22%3A%7B%22eq%22%3A%22valueB%22%7D%7D%5D%7D%2C%7B%22and%22%3A%5B%7B%22a%22%3A%7B%22regexp%22%3A%22another+ValueA%22%7D%2C%22b%22%3A%7B%22eq%22%3A%22another+ValueB%22%7D%7D%5D%7D%5D%7D%7D');
            }));
            it('overrides paramsSerializer', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.get('/params', {
                    params: {
                        param1: 'param1 value',
                    },
                    paramsSerializer: (params, options) => {
                        return 'param1=custom+paramsSerializer';
                    },
                });
                expect(data).to.eql('?param1=custom+paramsSerializer');
            }));
        });
        describe('(url, cb)', () => {
            it('returns response data', (done) => {
                services.get('/item', assertionCallback(done, (data) => {
                    expect(data).to.eql(testItem);
                }));
            });
        });
        describe('(url, config, cb)', () => {
            it('sends headers', (done) => {
                services.get('/echoHeader', { headers: { 'Echo-Header': 'get header' } }, assertionCallback(done, (data) => {
                    expect(data).to.eql('get header');
                }));
            });
        });
    });
    describe('#post', () => {
        const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }));
        const testPayload = { test: 'post data', context: '#post' };
        const testConfig = { headers: { 'Echo-Header': 'post header' } };
        describe('(url) => Promise', () => {
            it('returns response data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.post('/item');
                expect(data).to.eql(testItem);
            }));
        });
        describe('(url, data) => Promise', () => {
            it('posts data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.post('/echo', testPayload);
                expect(data).to.eql(testPayload);
            }));
        });
        describe('(url, data, config) => Promise', () => {
            const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }));
            it('posts data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.post('/echo', testPayload, testConfig);
                expect(data).to.eql(testPayload);
            }));
            it('sends headers', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.post('/echoHeader', testPayload, testConfig);
                expect(data).to.eql('post header');
            }));
        });
        describe('(url, cb)', () => {
            it('returns response data', (done) => {
                services.post('/item', assertionCallback(done, (data) => {
                    expect(data).to.eql(testItem);
                }));
            });
        });
        describe('(url, data, cb)', () => {
            it('posts data', (done) => {
                services.post('/echo', testPayload, assertionCallback(done, (data) => {
                    expect(data).to.eql(testPayload);
                }));
            });
        });
        describe('(url, data, config, cb)', () => {
            it('posts data', (done) => {
                services.post('/echo', testPayload, testConfig, assertionCallback(done, (data) => {
                    expect(data).to.eql(testPayload);
                }));
            });
            it('sends headers', (done) => {
                services.post('/echoHeader', testPayload, testConfig, assertionCallback(done, (data) => {
                    expect(data).to.eql('post header');
                }));
            });
        });
    });
    describe('#put', () => {
        const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }));
        const testPayload = { test: 'put data', context: '#put' };
        const testConfig = { headers: { 'Echo-Header': 'put header' } };
        describe('(url) => Promise', () => {
            it('returns response data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.put('/item');
                expect(data).to.eql(testItem);
            }));
        });
        describe('(url, data) => Promise', () => {
            it('puts data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.put('/echo', testPayload);
                expect(data).to.eql(testPayload);
            }));
        });
        describe('(url, data, config) => Promise', () => {
            const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }));
            it('puts data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.put('/echo', testPayload, testConfig);
                expect(data).to.eql(testPayload);
            }));
            it('sends headers', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.put('/echoHeader', testPayload, testConfig);
                expect(data).to.eql('put header');
            }));
        });
        describe('(url, cb)', () => {
            it('returns response data', (done) => {
                services.put('/item', assertionCallback(done, (data) => {
                    expect(data).to.eql(testItem);
                }));
            });
        });
        describe('(url, data, cb)', () => {
            it('puts data', (done) => {
                services.put('/echo', testPayload, assertionCallback(done, (data) => {
                    expect(data).to.eql(testPayload);
                }));
            });
        });
        describe('(url, data, config, cb)', () => {
            it('puts data', (done) => {
                services.put('/echo', testPayload, testConfig, assertionCallback(done, (data) => {
                    expect(data).to.eql(testPayload);
                }));
            });
            it('sends headers', (done) => {
                services.put('/echoHeader', testPayload, testConfig, assertionCallback(done, (data) => {
                    expect(data).to.eql('put header');
                }));
            });
        });
    });
    describe('#patch', () => {
        const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }));
        const testPayload = { test: 'patch data', context: '#patch' };
        const testConfig = { headers: { 'Echo-Header': 'patch header' } };
        describe('(url) => Promise', () => {
            it('returns response data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.patch('/item');
                expect(data).to.eql(testItem);
            }));
        });
        describe('(url, data) => Promise', () => {
            it('patches data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.patch('/echo', testPayload);
                expect(data).to.eql(testPayload);
            }));
        });
        describe('(url, data, config) => Promise', () => {
            const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }));
            it('patches data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.patch('/echo', testPayload, testConfig);
                expect(data).to.eql(testPayload);
            }));
            it('sends headers', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.patch('/echoHeader', testPayload, testConfig);
                expect(data).to.eql('patch header');
            }));
        });
        describe('(url, cb)', () => {
            it('returns response data', (done) => {
                services.patch('/item', assertionCallback(done, (data) => {
                    expect(data).to.eql(testItem);
                }));
            });
        });
        describe('(url, data, cb)', () => {
            it('patches data', (done) => {
                services.patch('/echo', testPayload, assertionCallback(done, (data) => {
                    expect(data).to.eql(testPayload);
                }));
            });
        });
        describe('(url, data, config, cb)', () => {
            it('patches data', (done) => {
                services.patch('/echo', testPayload, testConfig, assertionCallback(done, (data) => {
                    expect(data).to.eql(testPayload);
                }));
            });
            it('sends headers', (done) => {
                services.patch('/echoHeader', testPayload, testConfig, assertionCallback(done, (data) => {
                    expect(data).to.eql('patch header');
                }));
            });
        });
    });
    describe('#delete', () => {
        const services = new ApiServices(axios.create({ baseURL: 'http://localhost/' }));
        const testConfig = { headers: { 'Echo-Header': 'delete header' } };
        describe('(url) => Promise', () => {
            it('returns response data', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.delete('/item');
                expect(data).to.eql(testItem);
            }));
        });
        describe('(url, config) => Promise', () => {
            it('sends headers', () => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield services.delete('/echoHeader', testConfig);
                expect(data).to.eql('delete header');
            }));
        });
        describe('(url, cb)', () => {
            it('returns response data', (done) => {
                services.delete('/item', assertionCallback(done, (data) => {
                    expect(data).to.eql(testItem);
                }));
            });
        });
        describe('(url, config, cb)', () => {
            it('sends headers', (done) => {
                services.delete('/echoHeader', testConfig, assertionCallback(done, (data) => {
                    expect(data).to.eql('delete header');
                }));
            });
        });
    });
});
