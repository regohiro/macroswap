import { BN } from "@project-serum/anchor";

export const toBN = (value: number, decimals = 0): BN => {
  const valueNumber = value * 10 ** decimals;
  const valueBN = new BN(valueNumber);
  return valueBN;
};

export const fromBN = (valueBN: BN, decimals = 0): number => {
  const valueNumber = valueBN.toNumber() / 10 ** decimals;
  return valueNumber;
};

export const tenPow9 = toBN(10).pow(toBN(9));
