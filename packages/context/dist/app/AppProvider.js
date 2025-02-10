var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext } from 'react';
import { useApiServices } from '../api/index.js';
const defaultApp = {
    id: '_evoke',
    name: 'Evoke Platform',
    type: 'public',
};
const defaultAppExtended = Object.assign(Object.assign({}, defaultApp), { findDefaultPageSlugFor: (objectId) => Promise.resolve(undefined) });
const AppContext = createContext(defaultAppExtended);
AppContext.displayName = 'AppContext';
function AppProvider(props) {
    const { app, children } = props;
    const apiServices = useApiServices();
    const appExtended = Object.assign(Object.assign({}, app), { findDefaultPageSlugFor: useCallback((objectId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let defaultPageId;
            let currentObjectId = objectId;
            while (currentObjectId !== undefined) {
                if ((_a = app.defaultPages) === null || _a === void 0 ? void 0 : _a[currentObjectId]) {
                    defaultPageId = app.defaultPages[currentObjectId];
                    break;
                }
                const effectiveObject = yield apiServices.get(`data/objects/${currentObjectId}/effective`, {
                    params: { filter: { fields: ['baseObject'] } },
                });
                currentObjectId = (_c = (_b = effectiveObject === null || effectiveObject === void 0 ? void 0 : effectiveObject.baseObject) === null || _b === void 0 ? void 0 : _b.objectId) !== null && _c !== void 0 ? _c : undefined;
            }
            let defaultPage;
            if (defaultPageId) {
                const pageId = defaultPageId.includes('/')
                    ? defaultPageId.split('/').slice(2).join('/')
                    : defaultPageId;
                try {
                    defaultPage = yield apiServices.get(`/webContent/apps/${app.id}/pages/${encodeURIComponent(encodeURIComponent(pageId))}`);
                }
                catch (error) {
                    const err = error;
                    if (((_d = err.response) === null || _d === void 0 ? void 0 : _d.status) === 404) {
                        defaultPage = undefined;
                    }
                }
            }
            if (defaultPage === null || defaultPage === void 0 ? void 0 : defaultPage.slug) {
                return `/${app.id}/${defaultPage.slug}`;
            }
        }), [app]) });
    return _jsx(AppContext.Provider, { value: appExtended, children: children });
}
export function useApp() {
    return useContext(AppContext);
}
export default AppProvider;
