import { execute, it } from "./expect";
import { expectElementCount, expectHTML, expectMatchedHtml, testCounterElements } from "./expect.html";
export async function runTests() {
    it('elements exists', () => {
        expectElementCount('#simple-prop-test-wrap #gateway-test-prop-display', 1);
        expectHTML('#simple-prop-test-wrap #gateway-test-prop-display', '22');
        expectMatchedHtml('#simple-prop-test-wrap #gateway-test-prop-display', '#display-gateway-count');
    });
    it('counters increase', async () => {
        testCounterElements('#increase-gateway-count', '#display-gateway-count');
        expectHTML('#display-gateway-count', '24');
        console.log('1111');
        expectMatchedHtml('#display-gateway-count', '#display-gateway-count-2');
        console.log('2222');
        await wait(0); // gateway props changes run on element attribute watching which has a short delay
        console.log('3333');
        expectMatchedHtml('#display-gateway-count', '#simple-prop-test-wrap #gateway-test-prop-display');
        console.log('44444');
    });
    try {
        await execute();
        console.info('✅ all tests passed');
        return true;
    }
    catch (error) {
        console.error('❌ tests failed: ' + error.message, error);
        return false;
    }
}
function wait(time) {
    return new Promise((res) => {
        setTimeout(res, time);
    });
}
//# sourceMappingURL=tests.js.map