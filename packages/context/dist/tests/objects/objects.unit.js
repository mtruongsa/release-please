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
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import { ObjectStore } from '../../objects/index.js';
import { assertionCallback } from '../helpers.js';
chai.use(dirtyChai);
describe('ObjectStore', () => {
    const apiServices = {
        get() { },
    };
    const objectStore = new ObjectStore(apiServices, 'testObject');
    afterEach(() => {
        sinon.restore();
    });
    context('#get', () => {
        it('returns object', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon.stub(apiServices, 'get');
            stub.withArgs('data/objects/testObject/effective').resolves({
                id: 'testObject',
                name: 'Test Object',
                rootObjectId: 'testObject',
            });
            const result = yield objectStore.get();
            expect(result).to.eql({ id: 'testObject', name: 'Test Object', rootObjectId: 'testObject' });
        }));
        it('returns object in callback', (done) => {
            sinon
                .stub(apiServices, 'get')
                .withArgs('data/objects/testObject/effective', sinon.match.any, sinon.match.func)
                .yields(null, { id: 'testObject', name: 'Test Object', rootObjectId: 'testObject' });
            objectStore.get(assertionCallback(done, (result) => {
                expect(result).to.eql({ id: 'testObject', name: 'Test Object', rootObjectId: 'testObject' });
            }));
        });
    });
});
