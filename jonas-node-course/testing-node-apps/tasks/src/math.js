const calculateTip = (total, tipPercent = 30) => {
  const tip = (total * tipPercent) / 100;
  return total + tip;
};

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return reject(new Error('Numbers must be non-negative'));
      }

      resolve(a + b);
    }, 2000);
  });
};

module.exports = { calculateTip, add };
