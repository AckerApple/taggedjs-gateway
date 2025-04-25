import { TagComponent, AnySupport, TaggedFunction, ToTag } from "taggedjs";
import { Gateway } from "./tagGateway.utils.js";
export type TagGatewayComponent = TagComponent | TaggedFunction<ToTag>;
/** key must be unique across entire app */
type SetProps = <T extends string>(key: T, // must be unique across entire app
props: any) => T;
export type TagGateway = {
    component: TagGatewayComponent;
    id: string;
    /** TODO: do we really need this */
    gates: Gateway[];
    props: SetProps;
    updateTag: (tag: AnySupport, element: Element) => any;
    propMemory: {
        [key: string]: PropMemory;
    };
};
export type PropMemory = {
    callCount: number;
    props: GatewayProps;
    element?: Element;
    tag?: AnySupport;
};
export declare const tagGateway: (component: TagGatewayComponent) => TagGateway;
export declare function updateTagProps<T extends string>(gateway: TagGateway, key: T, props: GatewayProps): T;
export type GatewayProps = [Record<string, unknown>];
export {};
