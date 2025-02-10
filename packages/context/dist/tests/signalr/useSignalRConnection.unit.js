import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Copyright (c) 2024 System Automation Corporation.
// This file is licensed under the MIT License.
import { cleanup, render } from '@testing-library/react';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import 'global-jsdom/register';
import { useEffect } from 'react';
import sinon from 'sinon';
import { NotificationContext, } from '../../notification/NotificationProvider.js';
import { SignalRConnectionProvider, useSignalRConnection } from '../../signalr/index.js';
chai.use(dirtyChai);
describe('useSignalRConnection', () => {
    // Callbacks to receive change notifications.
    const callbacks = {
        instanceCallback() { },
        documentCallback() { },
    };
    const TestComponent = ({ instanceTopic, documentTopic, unsubscribeAll }) => {
        const { instanceChanges, documentChanges } = useSignalRConnection();
        useEffect(() => {
            if (instanceTopic) {
                instanceChanges === null || instanceChanges === void 0 ? void 0 : instanceChanges.subscribe(instanceTopic, callbacks.instanceCallback);
            }
            if (documentTopic) {
                documentChanges === null || documentChanges === void 0 ? void 0 : documentChanges.subscribe(documentTopic, callbacks.documentCallback);
            }
            // Unsubscribe on unmount.
            return () => {
                if (instanceTopic) {
                    instanceChanges === null || instanceChanges === void 0 ? void 0 : instanceChanges.unsubscribe(instanceTopic, unsubscribeAll ? undefined : callbacks.instanceCallback);
                }
                if (documentTopic) {
                    documentChanges === null || documentChanges === void 0 ? void 0 : documentChanges.unsubscribe(documentTopic, unsubscribeAll ? undefined : callbacks.documentCallback);
                }
            };
        }, [instanceChanges, documentChanges, instanceTopic, documentTopic, unsubscribeAll]);
        return null;
    };
    const instanceSubscription = {
        subscribe() { },
        unsubscribe() { },
    };
    const documentSubscription = {
        subscribe() { },
        unsubscribe() { },
    };
    const notifications = {
        instanceChanges: instanceSubscription,
        documentChanges: documentSubscription,
    };
    afterEach(() => {
        sinon.restore();
    });
    it('subscribes to instance change notifications', () => {
        sinon.mock(instanceSubscription).expects('subscribe').withArgs('testObject');
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsx(SignalRConnectionProvider, { children: _jsx(TestComponent, { instanceTopic: "testObject" }) }) }));
        sinon.verify();
    });
    it('notifies callback of instance changes', () => {
        let callback;
        sinon.stub(instanceSubscription, 'subscribe').callsFake((_, cb) => {
            callback = cb;
        });
        sinon.mock(callbacks).expects('instanceCallback').withExactArgs('instance1', 'instance2');
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsx(SignalRConnectionProvider, { children: _jsx(TestComponent, { instanceTopic: "testObject" }) }) }));
        expect(callback).to.not.be.undefined();
        // Simulate a notification.
        callback === null || callback === void 0 ? void 0 : callback({ objectId: 'testObject', instanceId: 'instance1' }, { objectId: 'testObject', instanceId: 'instance2' });
        sinon.verify();
    });
    it('unsubscribes all instance listeners', () => {
        sinon.mock(instanceSubscription).expects('unsubscribe').withExactArgs('testObject', undefined);
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsx(SignalRConnectionProvider, { children: _jsx(TestComponent, { instanceTopic: "testObject", unsubscribeAll: true }) }) }));
        // Force unmounting to trigger unsubscribe.
        cleanup();
        sinon.verify();
    });
    it('unsubscribes previously subscribed instance listener', () => {
        let callback;
        sinon.stub(instanceSubscription, 'subscribe').callsFake((_, cb) => {
            callback = cb;
        });
        sinon
            .mock(instanceSubscription)
            .expects('unsubscribe')
            .withExactArgs('testObject', 
        // Use sinon.match to compare to "callback" at time of execution
        // since at time of mocking, "callback" is always undefined.
        sinon.match((cb) => cb === callback));
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsx(SignalRConnectionProvider, { children: _jsx(TestComponent, { instanceTopic: "testObject" }) }) }));
        // Force unmounting to trigger unsubscribe.
        cleanup();
        sinon.verify();
    });
    it('handles unsubscribing instance listeners subscribed to multiple objects', () => {
        const callbacks = {};
        sinon.stub(instanceSubscription, 'subscribe').callsFake((obj, cb) => {
            callbacks[obj] = { subscribe: cb };
        });
        sinon.stub(instanceSubscription, 'unsubscribe').callsFake((obj, cb) => {
            callbacks[obj] = Object.assign({}, callbacks[obj], { unsubscribe: cb });
        });
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsxs(SignalRConnectionProvider, { children: [_jsx(TestComponent, { instanceTopic: "object1" }), _jsx(TestComponent, { instanceTopic: "object2" })] }) }));
        // Force unmounting to trigger unsubscribe.
        cleanup();
        // Check callbacks sent to subscribe and unsubscribe are exactly the same.
        expect(callbacks).to.have.property('object1').and.not.be.undefined();
        expect(callbacks).to.have.property('object2').and.not.be.undefined();
        expect(callbacks.object1.subscribe).to.not.be.undefined();
        expect(callbacks.object2.subscribe).to.not.be.undefined();
        expect(callbacks.object1.subscribe === callbacks.object1.unsubscribe).to.be.true();
        expect(callbacks.object2.subscribe === callbacks.object2.unsubscribe).to.be.true();
    });
    it('subscribes to document change notifications', () => {
        sinon.mock(documentSubscription).expects('subscribe').withArgs('docObject', 'testInstance');
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsx(SignalRConnectionProvider, { children: _jsx(TestComponent, { documentTopic: "docObject/testInstance" }) }) }));
        sinon.verify();
    });
    it('notifies callback of document changes', () => {
        let callback;
        sinon.stub(documentSubscription, 'subscribe').callsFake((_, _1, cb) => {
            callback = cb;
        });
        sinon.mock(callbacks).expects('documentCallback').withExactArgs({
            objectId: 'docObject',
            instanceId: 'testInstance',
            documentId: 'doc1',
            type: 'type1',
        }, {
            objectId: 'docObject',
            instanceId: 'testInstance',
            documentId: 'doc2',
            type: 'type2',
        });
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsx(SignalRConnectionProvider, { children: _jsx(TestComponent, { documentTopic: "docObject/testInstance" }) }) }));
        expect(callback).to.not.be.undefined();
        // Simulate a notification.
        callback === null || callback === void 0 ? void 0 : callback({ objectId: 'docObject', instanceId: 'testInstance', documentId: 'doc1', type: 'type1' }, { objectId: 'docObject', instanceId: 'testInstance', documentId: 'doc2', type: 'type2' });
        sinon.verify();
    });
    it('unsubscribes all document listeners', () => {
        sinon.mock(documentSubscription).expects('unsubscribe').withExactArgs('docObject', 'testInstance', undefined);
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsx(SignalRConnectionProvider, { children: _jsx(TestComponent, { documentTopic: "docObject/testInstance", unsubscribeAll: true }) }) }));
        // Force unmounting to trigger unsubscribe.
        cleanup();
        sinon.verify();
    });
    it('unsubscribes previously subscribed document listener', () => {
        let callback;
        sinon.stub(documentSubscription, 'subscribe').callsFake((_, _1, cb) => {
            callback = cb;
        });
        sinon
            .mock(documentSubscription)
            .expects('unsubscribe')
            .withExactArgs('docObject', 'testInstance', 
        // Use sinon.match to compare to "callback" at time of execution
        // since at time of mocking, "callback" is always undefined.
        sinon.match((cb) => cb === callback));
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsx(SignalRConnectionProvider, { children: _jsx(TestComponent, { documentTopic: "docObject/testInstance" }) }) }));
        // Force unmounting to trigger unsubscribe.
        cleanup();
        sinon.verify();
    });
    it('handles unsubscribing document listeners subscribed to multiple instances', () => {
        const callbacks = {};
        sinon.stub(documentSubscription, 'subscribe').callsFake((obj, inst, cb) => {
            callbacks[obj + '_' + inst] = { subscribe: cb };
        });
        sinon.stub(documentSubscription, 'unsubscribe').callsFake((obj, inst, cb) => {
            callbacks[obj + '_' + inst] = Object.assign({}, callbacks[obj + '_' + inst], { unsubscribe: cb });
        });
        render(_jsx(NotificationContext.Provider, { value: notifications, children: _jsxs(SignalRConnectionProvider, { children: [_jsx(TestComponent, { documentTopic: "object1/instance1" }), _jsx(TestComponent, { documentTopic: "object2/instance2" })] }) }));
        // Force unmounting to trigger unsubscribe.
        cleanup();
        // Check callbacks sent to subscribe and unsubscribe are exactly the same.
        expect(callbacks).to.have.property('object1_instance1').and.not.be.undefined();
        expect(callbacks).to.have.property('object2_instance2').and.not.be.undefined();
        expect(callbacks.object1_instance1.subscribe).to.not.be.undefined();
        expect(callbacks.object2_instance2.subscribe).to.not.be.undefined();
        expect(callbacks.object1_instance1.subscribe === callbacks.object1_instance1.unsubscribe).to.be.true();
        expect(callbacks.object2_instance2.subscribe === callbacks.object2_instance2.unsubscribe).to.be.true();
    });
});
