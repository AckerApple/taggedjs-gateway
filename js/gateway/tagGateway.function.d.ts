import { TagComponent, TagComponentBase } from "../index.js";
export type TagGatewayComponent = TagComponent | TagComponentBase<[props: unknown]>;
export declare const tagGateway: (component: TagGatewayComponent) => {
    id: string;
};
