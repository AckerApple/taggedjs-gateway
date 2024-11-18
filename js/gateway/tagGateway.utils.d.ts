import { Wrapper, AnySupport } from "taggedjs";
import { TagGateway, TagGatewayComponent } from "./tagGateway.function.js";
export declare const gateways: {
    [id: string]: {
        gates: Gateway[];
        tagComponent: TagGatewayComponent;
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
    tag: AnySupport;
    observer: MutationObserver;
    element: HTMLElement;
    component: TagGatewayComponent;
    updateTag: () => unknown;
    tagGateway: TagGateway;
};
export declare function checkByElement(element: HTMLElement | Element): Gateway;
export declare function checkElementGateway(id: string, element: Element, component: TagGatewayComponent): Gateway;
