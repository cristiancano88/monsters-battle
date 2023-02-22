export const numbersFractionCalculator = (numbers: number[]) => {
  const positives: number[] = [];
  const negative: number[] = [];
  const zeros: number[] = [];

  for (const number of numbers) {
    if (number < 0) {
      negative.push(number);
    } else if (number === 0) {
      zeros.push(number);
    } else {
      positives.push(number);
    }
  }

  return {
    positives: ((positives.length * 1) / numbers.length).toFixed(6),
    negative: ((negative.length * 1) / numbers.length).toFixed(6),
    zeros: ((zeros.length * 1) / numbers.length).toFixed(6),
  };
};
