import { TagGateway, TagGatewayComponent } from "./tagGateway.function.js";
import { Gateway } from "./tagGateway.utils";
export declare const tagGateways: Record<string, TagGateway>;
/** @deprecated use tagGateways */
export declare const gateways: {
    [id: string]: {
        gates: Gateway[];
        tagComponent: TagGatewayComponent;
    };
};
