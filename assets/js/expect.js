const onlyTests = [];
const tests = [];
export function it(label, run) {
    tests.push(() => {
        console.debug(label);
        run();
    });
}
it.only = (label, run) => {
    onlyTests.push(() => {
        console.debug(label);
        run();
    });
};
export function execute() {
    if (onlyTests.length) {
        return runTests(onlyTests);
    }
    return runTests(tests);
}
function runTests(tests) {
    tests.forEach(test => test());
}
export function expect(expected) {
    return {
        toBeDefined: () => {
            if (expected !== undefined && expected !== null) {
                return;
            }
            const message = `Expected ${JSON.stringify(expected)} to be defined`;
            console.error(message, { expected });
            throw new Error(message);
        },
        toBe: (received, customMessage) => {
            if (expected === received) {
                return;
            }
            const message = customMessage || `Expected ${typeof (expected)} ${JSON.stringify(expected)} to be ${typeof (received)} ${JSON.stringify(received)}`;
            console.error(message, { received, expected });
            throw new Error(message);
        }
    };
}
//# sourceMappingURL=expect.js.map