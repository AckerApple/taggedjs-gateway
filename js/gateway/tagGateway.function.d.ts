import { TagComponent, TagComponentBase, TagSupport } from "taggedjs";
export declare const tagGateways: Record<string, TagGateway>;
export type TagGatewayComponent = TagComponent | TagComponentBase<[props: unknown]>;
type SetProps = <T extends string>(key: T, // must be unique across entire app
props: any) => T;
export type TagGateway = {
    id: string;
    props: SetProps;
    updateTag: (tag: TagSupport, element: Element) => any;
    propMemory: {
        [key: string]: PropMemory;
    };
};
export type PropMemory = {
    callCount: number;
    props: any;
    element?: Element;
    tag?: TagSupport;
};
export declare const tagGateway: (component: TagGatewayComponent) => TagGateway;
export {};
