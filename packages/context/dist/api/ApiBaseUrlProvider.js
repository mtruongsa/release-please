var _a;
import { jsx as _jsx } from "react/jsx-runtime";
// Copyright (c) 2023 System Automation Corporation.
// This file is licensed under the MIT License.
import { createContext, useContext } from 'react';
const ApiBaseUrlContext = createContext(`${(_a = globalThis.location) === null || _a === void 0 ? void 0 : _a.origin}/api`);
ApiBaseUrlContext.displayName = 'ApiBaseUrlContext';
function ApiBaseUrlProvider(props) {
    const { url, children } = props;
    return _jsx(ApiBaseUrlContext.Provider, { value: url, children: children });
}
export function useApiBaseUrl() {
    return useContext(ApiBaseUrlContext);
}
export default ApiBaseUrlProvider;
