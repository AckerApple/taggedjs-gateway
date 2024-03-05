import { TagComponent, Tag } from "taggedjs";
import { TagGatewayComponent } from "./tagGateway.function.js";
export declare const gatewayTagIds: {
    [id: string]: TagComponent;
};
export declare function checkAllGateways(): void;
export declare function checkGateways(gateways: Gateway[]): void;
export declare function destroyGateway(gateway: Gateway): void;
export declare function getTagId(component: TagGatewayComponent): string;
export type EventData = {
    detail: Record<string, any>;
};
export type Gateway = {
    tag: Tag;
    id: string;
    observer: MutationObserver;
    element: HTMLElement;
    component: TagGatewayComponent;
    updateTag: () => unknown;
};
export declare function checkByElement(element: HTMLElement | Element): Gateway;
export declare function checkElement(id: string, element: Element, component: TagGatewayComponent): Gateway;
