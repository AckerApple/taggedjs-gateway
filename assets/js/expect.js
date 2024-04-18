const onlyTests = [];
let tests = [];
let tab = 0;
export function describe(label, run) {
    tests.push(() => {
        const oldTests = tests;
        tests = [];
        try {
            console.debug('  '.repeat(tab) + '↘ ' + label);
            ++tab;
            run();
            runTests(tests);
            --tab;
        }
        catch (error) {
            --tab;
            // console.debug(' '.repeat(tab) + '❌ ' + label)
            throw error;
        }
        finally {
            tests = oldTests;
        }
    });
}
describe.only = (label, run) => {
    onlyTests.push(() => {
        const oldTests = tests;
        tests = [];
        try {
            console.debug('  '.repeat(tab) + '↘ ' + label);
            ++tab;
            run();
            runTests(tests);
            --tab;
        }
        catch (error) {
            --tab;
            // console.debug(' '.repeat(tab) + '❌ ' + label)
            throw error;
        }
        finally {
            tests = oldTests;
        }
    });
};
export function it(label, run) {
    tests.push(async () => {
        try {
            await run();
            console.debug(' '.repeat(tab) + '✅ ' + label);
        }
        catch (error) {
            console.debug(' '.repeat(tab) + '❌ ' + label);
            throw error;
        }
    });
}
it.only = (label, run) => {
    onlyTests.push(async () => {
        try {
            await run();
            console.debug('✅ ' + label);
        }
        catch (error) {
            console.debug('❌ ' + label);
            throw error;
        }
    });
};
it.skip = (label, run) => {
    console.debug('⏭️ Skipped ' + label);
};
export function execute() {
    if (onlyTests.length) {
        return runTests(onlyTests);
    }
    return runTests(tests);
}
function runTests(tests) {
    return Promise.all(tests.map(test => {
        try {
            return test();
        }
        catch (err) {
            console.error(`Error testing ${test.name}`);
            throw err;
        }
    }));
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
        },
        toBeGreaterThan: (amount, customMessage) => {
            const expectNum = expected;
            if (!isNaN(expectNum) && expectNum > amount) {
                return;
            }
            const message = customMessage || `Expected ${typeof (expected)} ${JSON.stringify(expected)} to be greater than amount`;
            console.error(message, { amount, expected });
            throw new Error(message);
        }
    };
}
//# sourceMappingURL=expect.js.map