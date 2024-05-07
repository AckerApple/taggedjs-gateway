import { TagComponent, TagSupport } from "taggedjs";
import { TagGateway, TagGatewayComponent } from "./tagGateway.function.js";
import { Wrapper } from "taggedjs/js/TemplaterResult.class.js";
export declare const gateways: {
    [id: string]: {
        gates: Gateway[];
        tagComponent: TagComponent;
    };
};
export declare function checkAllGateways(): void;
export declare function checkGateways(gateways: Gateway[]): void;
export declare function destroyGateway(gateway: Gateway): void;
export declare function getTagId(component: Wrapper): string;
export type EventData = {
    detail: Record<string, any>;
};
export type Gateway = {
    id: string;
    tag: TagSupport;
    observer: MutationObserver;
    element: HTMLElement;
    component: TagGatewayComponent;
    updateTag: () => unknown;
    tagGateway: TagGateway;
};
export declare function checkByElement(element: HTMLElement | Element): Gateway;
export declare function checkElementGateway(id: string, element: Element, component: TagGatewayComponent): Gateway;
