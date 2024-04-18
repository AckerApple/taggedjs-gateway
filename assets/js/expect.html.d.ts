export declare function expectMatchedHtml(query0: string, query1: string): void;
export declare function expectHTML(query: string, innerHTML: string): void;
export declare function expectElementCount(query: string, count: number, message?: string): NodeListOf<Element>;
export declare function testDuelCounterElements([button0, display0]: [string, string], // button, display
[button1, display1]: [string, string]): void;
/** increases counter by two */
export declare function testCounterElements(counterButtonId: string, counterDisplayId: string, { elementCountExpected }?: {
    elementCountExpected: number;
}): void;
