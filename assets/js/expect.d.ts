export declare function it(label: string, run: () => any): void;
export declare namespace it {
    var only: (label: string, run: () => any) => void;
}
export declare function execute(): void;
export declare function expect(expected: unknown): {
    toBeDefined: () => void;
    toBe: (received: unknown, customMessage?: string) => void;
};
