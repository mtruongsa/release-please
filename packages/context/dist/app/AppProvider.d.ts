import { ReactNode } from 'react';
export type AppType = 'public' | 'portal' | 'private';
export type App = {
    id: string;
    name: string;
    type: AppType;
    description?: string;
    initials?: string;
    icon?: string;
    iconColor?: string;
    pages?: Page[];
    navigation?: NavigationMenu;
    defaultPages?: Record<string, string>;
};
export type Page = {
    id: string;
    name: string;
    slug?: string;
    children?: PageElement[];
};
export type PageElement = Container | Widget;
export type Container = {
    id: string;
    type: 'container';
    children?: PageElement[];
};
export type Widget = {
    id: string;
    pluginId: string;
    widgetKey: string;
    colSpan: number;
    properties: Record<string, unknown>;
};
export type NavigationMenu = {
    items?: NavigationItem[];
};
export type NavigationItem = {
    pageId: string;
    pageName: string;
};
export type AppExtended = App & {
    /**
     * Looks up the default page slug for a given object or its nearest type ancestor.
     *
     * @param {string} objectId - The ID of the object to start the search from.
     * @returns {Promise<string | undefined>} The default page slug, or `undefined` if no default page is found.
     */
    findDefaultPageSlugFor: (objectId: string) => Promise<string | undefined>;
};
export type AppProviderProps = {
    app: App;
    children?: ReactNode;
};
declare function AppProvider(props: AppProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useApp(): AppExtended;
export default AppProvider;
