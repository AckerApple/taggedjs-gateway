import { expect } from "./expect";
export function expectMatchedHtml(query0, query1) {
    //  const found = elementCount(query)
    const elements0 = document.querySelectorAll(query0);
    const elements1 = document.querySelectorAll(query1);
    expect(elements0.length).toBeGreaterThan(0);
    expect(elements1.length).toBeGreaterThan(0);
    expect(elements0.length).toBe(elements1.length);
    elements0.forEach((element0, index) => expect(element0.innerHTML).toBe(elements1[index].innerHTML));
}
export function expectHTML(query, innerHTML) {
    const elements = document.querySelectorAll(query);
    elements.forEach(element => expect(element.innerHTML).toBe(innerHTML, `Expected element ${query} innerHTML to be -->${innerHTML}<-- but it was -->${element.innerHTML}<--`));
}
export function expectElementCount(query, count, message) {
    //  const found = elementCount(query)
    const elements = document.querySelectorAll(query);
    const found = elements.length;
    message = message || `Expected ${count} elements to match query ${query} but found ${found}`;
    expect(found).toBe(count, message);
    return elements;
}
export function testDuelCounterElements([button0, display0], // button, display
[button1, display1]) {
    let query = expectElementCount(display0, 1);
    const display0Element = query[0];
    const ip0 = display0Element.innerText;
    testCounterElements(button0, display0);
    query = expectElementCount(display1, 1);
    let display1Element = query[0];
    let ip1Check = display1Element.innerText;
    const value = (Number(ip0) + 2).toString();
    expect(ip1Check).toBe(value, `Expected second increase provider to be increased to ${ip0} but got ${ip1Check}`);
    testCounterElements(button1, display1);
    query = expectElementCount(display1, 1);
    display1Element = query[0];
    ip1Check = display1Element.innerText;
    expect(ip1Check).toBe((Number(ip0) + 4).toString(), `Expected ${display1} innerText to be ${Number(ip0) + 4} but instead it is ${ip1Check}`);
}
/** increases counter by two */
export function testCounterElements(counterButtonId, counterDisplayId, { elementCountExpected } = {
    elementCountExpected: 1
}) {
    // const getByIndex = (selector: string, index: number) => document.querySelectorAll(selector)[index] as unknown as HTMLElement[]
    const increaseCounters = document.querySelectorAll(counterButtonId);
    const counterDisplays = document.querySelectorAll(counterDisplayId);
    expect(increaseCounters.length).toBe(elementCountExpected, `Expected ${counterButtonId} to be ${elementCountExpected} elements but is instead ${increaseCounters.length}`);
    expect(counterDisplays.length).toBe(elementCountExpected, `Expected ${counterDisplayId} to be ${elementCountExpected} elements but is instead ${counterDisplays.length}`);
    increaseCounters.forEach((increaseCounter, index) => {
        const counterDisplay = counterDisplays[index];
        let counterValue = Number(counterDisplay?.innerText);
        increaseCounter?.click();
        let oldCounterValue = counterValue + 1;
        counterValue = Number(counterDisplay?.innerText);
        expect(oldCounterValue).toBe(counterValue, `Expected element(s) ${counterDisplayId} to be value ${oldCounterValue} but is instead ${counterValue}`);
        increaseCounter?.click();
        counterValue = Number(counterDisplay?.innerText);
        ++oldCounterValue;
        expect(oldCounterValue).toBe(counterValue, `Expected element(s) ${counterDisplayId} to increase value to ${oldCounterValue} but is instead ${counterValue}`);
    });
}
//# sourceMappingURL=expect.html.js.map