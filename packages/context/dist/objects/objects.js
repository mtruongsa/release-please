// Copyright (c) 2023 System Automation Corporation.
// This file is licensed under the MIT License.
import { useMemo } from 'react';
import { useApiServices } from '../api/index.js';
export class ObjectStore {
    constructor(services, objectId) {
        this.services = services;
        this.objectId = objectId;
    }
    get(optionsOrCallback, cb) {
        let options;
        if (cb) {
            options = optionsOrCallback;
        }
        else if (typeof optionsOrCallback === 'function') {
            cb = optionsOrCallback;
        }
        else {
            options = optionsOrCallback;
        }
        const config = {
            params: {
                sanitizedVersion: options === null || options === void 0 ? void 0 : options.sanitized,
            },
        };
        if (!cb) {
            return this.services.get(`data/objects/${this.objectId}/effective`, config);
        }
        this.services.get(`data/objects/${this.objectId}/effective`, config, cb);
    }
    findInstances(filterOrCallback, cb) {
        let filter;
        if (cb) {
            filter = filterOrCallback;
        }
        else if (typeof filterOrCallback === 'function') {
            cb = filterOrCallback;
        }
        else {
            filter = filterOrCallback;
        }
        const config = {
            params: {
                filter,
            },
        };
        if (!cb) {
            return this.services.get(`data/objects/${this.objectId}/instances`, config);
        }
        this.services.get(`data/objects/${this.objectId}/instances`, config, cb);
    }
    getInstance(id, cb) {
        if (!cb) {
            return this.services.get(`data/objects/${this.objectId}/instances/${id}`);
        }
        this.services.get(`data/objects/${this.objectId}/instances/${id}`, cb);
    }
    getInstanceHistory(id, cb) {
        if (!cb) {
            return this.services.get(`data/objects/${this.objectId}/instances/${id}/history`);
        }
        this.services.get(`data/objects/${this.objectId}/instances/${id}/history`, cb);
    }
    newInstance(input, cb) {
        if (!cb) {
            return this.services.post(`data/objects/${this.objectId}/instances/actions`, input);
        }
        this.services.post(`data/objects/${this.objectId}/instances/actions`, input, cb);
    }
    instanceAction(id, input, cb) {
        if (!cb) {
            return this.services.post(`data/objects/${this.objectId}/instances/${id}/actions`, input);
        }
        this.services.post(`data/objects/${this.objectId}/instances/${id}/actions`, input, cb);
    }
}
export function useObject(objectId) {
    const services = useApiServices();
    return useMemo(() => new ObjectStore(services, objectId), [services, objectId]);
}
