import { Gateway } from "./tagGateway.utils.js";
/** <tag-element id="" props="json-string" />
 * For Angular @NgModule({schemas: [CUSTOM_ELEMENTS_SCHEMA]}) is required
 */
export declare class TagElement extends HTMLElement {
    gateway: Gateway;
    constructor();
    disconnectedCallback(): void;
}
export declare const tagName = "tag-element";
/** Call me one time */
export declare function initWebComponents(): void;
