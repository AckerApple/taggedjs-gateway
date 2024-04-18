export declare function describe(label: string, run: () => any): void;
export declare namespace describe {
    var only: (label: string, run: () => any) => void;
}
export declare function it(label: string, run: () => any): void;
export declare namespace it {
    var only: (label: string, run: () => any) => void;
    var skip: (label: string, run: () => any) => void;
}
export declare function execute(): Promise<unknown[]>;
export declare function expect(expected: unknown): {
    toBeDefined: () => void;
    toBe: (received: unknown, customMessage?: string) => void;
    toBeGreaterThan: (amount: number, customMessage?: string) => void;
};
