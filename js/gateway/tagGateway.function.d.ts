import { TagComponent, TagComponentBase } from "taggedjs";
export type TagGatewayComponent = TagComponent | TagComponentBase<[props: unknown]>;
export declare const tagGateway: (component: TagGatewayComponent) => {
    id: string;
};
