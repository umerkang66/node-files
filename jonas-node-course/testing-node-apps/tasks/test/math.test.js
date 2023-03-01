const { calculateTip, add } = require('../src/math');

let bill, tipPercent, estimatedTotal;
beforeEach(() => {
  bill = 10;
  tipPercent = 30;
  estimatedTotal = bill + (bill * 30) / 100;
});

test('Should calculate total with tip', () => {
  const total = calculateTip(bill, tipPercent);
  expect(total).toBe(estimatedTotal);
});

test('Should calculate total with tip, with the default value tip of 0.2', () => {
  const total = calculateTip(bill);
  expect(total).toBe(estimatedTotal);
});

test('Async test demo', done => {
  setTimeout(() => {
    expect(1).toBe(1);
    done();
  }, 3000);
});

test('Should add two numbers with then', done => {
  add(4, 5).then(addition => {
    expect(addition).toBe(4 + 5);
    done();
  });
});

test('Should add two numbers', async () => {
  const addition = await add(4, 5);
  expect(addition).toBe(4 + 5);
});

test('Add function rejects because of non-positive numbers', async () => {
  try {
    await add(-1, 4);
  } catch (err) {
    const errMsg = 'Numbers must be non-negative';
    expect(err.message).toBe(errMsg);
  }
});
