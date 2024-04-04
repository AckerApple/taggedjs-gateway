import { Tag } from "taggedjs";
type SelectedTag = null | string | undefined;
export declare const tagSwitchDebug: (props?: unknown, children?: import("taggedjs").TagChildrenInput | undefined) => Tag;
export declare const ternaryPropTest: (props?: {
    selectedTag: string | undefined | null;
} | undefined, children?: import("taggedjs").TagChildrenInput | undefined) => Tag;
export declare const tag1: (props?: {
    title: string;
} | undefined, children?: import("taggedjs").TagChildrenInput | undefined) => Tag;
export declare const tag2: (props?: {
    title: string;
} | undefined, children?: import("taggedjs").TagChildrenInput | undefined) => Tag;
export declare const tag3: (props?: {
    title: string;
} | undefined, children?: import("taggedjs").TagChildrenInput | undefined) => Tag;
export declare const arraySwitching: (props?: {
    selectedTag: SelectedTag;
} | undefined, children?: import("taggedjs").TagChildrenInput | undefined) => Tag;
export {};
