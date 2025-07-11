import { TagGateway, TagGatewayComponent } from "./tagGateway.function.js";
import { Gateway } from "./tagGateway.utils";
export declare const tagGateways: Record<string, TagGateway>;
export declare const tagGatewayMemory: {
    tagGateways: Record<string, TagGateway>;
    _stamp: number;
};
/** @deprecated use tagGateways */
export declare const gateways: {
    [id: string]: {
        gates: Gateway[];
        tagComponent: TagGatewayComponent;
    };
};
