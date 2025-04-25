import { TagGateway, TagGatewayComponent } from "./tagGateway.function.js";
/** Create the ability to put taggedjs content on document
 * - You will need to use <tag-element> or tagGateway()
 */
export declare function loadTagGateway(component: TagGatewayComponent, // TagComponent | ((props?: any, children?: TagChildrenInput) => Tag)
id: string): TagGateway;
