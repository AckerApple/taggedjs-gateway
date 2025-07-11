import { TagGateway, TagGatewayComponent } from "./tagGateway.function.js"
import { Gateway } from "./tagGateway.utils"

export const tagGateways: Record<string, TagGateway> = {}
export const tagGatewayMemory = {
  tagGateways,
  _stamp: Date.now(),
}

/** @deprecated use tagGateways */
export const gateways: {
  [id: string]: {
    gates: Gateway[],
    tagComponent: TagGatewayComponent,
  }
} = {}
