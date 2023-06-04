import { flatten, sum } from "lodash";
import { ExplodingRollOutput, OtherRollOutput, SKillRollOutput } from "./types";

export interface RollParams {
  target: number;
  flipToFail?: boolean;
  flipToSucceed?: boolean;
  assisted?: boolean;
}

export const d6 = () => Math.floor(Math.random() * (6 - 1 + 1) + 1);
export const d10 = () => Math.floor(Math.random() * (10 - 1 + 1) + 1);

export const rollPerc = ({
  target,
  flipToFail = false,
  flipToSucceed = false,
  assisted = false,
}: RollParams): SKillRollOutput => {
  let tens = d10();
  let ones: number | string = d10();
  let maybeAssist = d10();

  if (tens === 10) {
    tens = 0;
  }

  if (maybeAssist === 10) {
    maybeAssist = 0;
  }

  if (tens === 1 && ones === 10) {
    ones = "00";
  } else if (ones === 10) {
    ones = 1;
  }

  let roll: number[] = [];

  // If assisted, always assume the best result for the tens place
  if (assisted) {
    tens = Math.min(tens, maybeAssist);
  }

  const intOnes = Number(ones);

  if (flipToFail && !flipToSucceed) {
    roll = [Math.max(tens, intOnes), Math.min(tens, intOnes)];
    // if flipToSucceed, assume the best result
  } else if (flipToSucceed && !flipToFail) {
    roll = [Math.min(tens, intOnes), Math.max(tens, intOnes)];
    // straight roll
  } else {
    roll = [tens, intOnes];
  }

  const isCritical = roll[0] === roll[1];
  const parsedRoll = Number(roll.join(""));
  const isSublime = parsedRoll === 1 || parsedRoll === 100;
  const isSuccess = parsedRoll <= target;

  return {
    tens,
    ones,
    assist: maybeAssist,
    roll,
    parsedRoll,
    target,
    flipToFail,
    flipToSucceed,
    isSuccess,
    isCritical,
    isSublime,
  };
};

export const roll10 = (numDice = 1, modifier = 0): OtherRollOutput => {
  const rolls: number[] = [];

  for (let i = 0; i < numDice; i++) {
    rolls.push(d10());
  }

  const rollTotal = sum(rolls);
  const parsedMod = Number(modifier);
  const total = isNaN(parsedMod) ? rollTotal : rollTotal + parsedMod;

  return {
    rolls,
    modifier,
    total,
  };
};

const rollExploded = (): number[] => {
  const roll = d6();

  if (roll < 6) {
    return [roll];
  }

  return [roll, ...rollExploded()];
};

export const roll6 = (numDice = 1, modifier = 0): ExplodingRollOutput => {
  const initialRolls: number[] = [];

  for (let i = 0; i < numDice; i++) {
    initialRolls.push(d6());
  }

  const exploded = initialRolls.filter((d) => d === 6);
  const explodedRolls = flatten(exploded.map(rollExploded));

  const rollTotal = sum(initialRolls) + sum(explodedRolls);

  const parsedMod = Number(modifier);
  const total = isNaN(parsedMod) ? rollTotal : rollTotal + parsedMod;

  return {
    initialRolls,
    modifier,
    total,
    rolls: initialRolls.concat(explodedRolls),
  };
};
