import { Wrapper, AnySupport } from "taggedjs";
import { TagGateway, TagGatewayComponent } from "./tagGateway.function.js";
export declare function checkAllGateways(): void;
export declare function checkGateways(gateways: Gateway[]): void;
export declare function destroyGateway(gateway: Gateway): void;
export declare function getTagId(component: Wrapper | TagGatewayComponent): string;
/** adds to gateways[id].push */
export declare function watchElement(id: string, // tag id
targetNode: HTMLElement, tag: AnySupport, component: TagGatewayComponent): Gateway;
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
