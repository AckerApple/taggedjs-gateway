import { TagComponent, AnySupport, TaggedFunction, ToTag } from "taggedjs";
export declare const tagGateways: Record<string, TagGateway>;
export type TagGatewayComponent = TagComponent | TaggedFunction<ToTag>;
type SetProps = <T extends string>(key: T, // must be unique across entire app
props: any) => T;
export type TagGateway = {
    id: string;
    props: SetProps;
    updateTag: (tag: AnySupport, element: Element) => any;
    propMemory: {
        [key: string]: PropMemory;
    };
};
export type PropMemory = {
    callCount: number;
    props: [Record<string, any>];
    element?: Element;
    tag?: AnySupport;
};
export declare const tagGateway: (component: TagGatewayComponent) => TagGateway;
export {};
