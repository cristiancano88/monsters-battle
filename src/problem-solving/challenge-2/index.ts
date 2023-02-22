export const diceFacesCalculator = (
  dice1: number,
  dice2: number,
  dice3: number
): number => {
  const range: number[] = [1, 2, 3, 4, 5, 6];
  if (!range.includes(dice1) || !range.includes(dice2) || !range.includes(dice3)) {
    throw new Error('Dice out of number range');
  }

  if (dice1 === dice2 && dice1 === dice3) {
    return dice1 * 3;
  }

  if (dice1 === dice2 || dice1 === dice3) {
    return dice1 * 2;
  } else if (dice2 === dice3) {
    return dice2 * 2;
  }

  let biggest = dice1;
  biggest = dice2 > biggest ? dice2 : biggest;
  biggest = dice3 > biggest ? dice3 : biggest;

  return biggest;
};
