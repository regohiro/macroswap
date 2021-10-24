import { BigNumber, ethers } from "ethers";

export const toBN = (value: number): BigNumber => {
  const valueString = value.toString();
  const valueBN = BigNumber.from(valueString);
  return valueBN;
};

export const toWei = (value: number, decimals: number = 18): BigNumber => {
  const valueString = value.toString();
  const valueWeiBN = ethers.utils.parseUnits(valueString, decimals);
  return valueWeiBN;
};

export const fromBN = (valueBN: BigNumber): number => {
  const valueString = valueBN.toString();
  const valueNumber = Number(valueString);
  return valueNumber;
};

export const fromWei = (
  valueWeiBN: BigNumber,
  decimals: number = 18
): number => {
  const valueString = ethers.utils.formatUnits(valueWeiBN, decimals);
  const valueNumber = Number(valueString);
  return valueNumber;
};

export const tenPow18 = toBN(10).pow(18);
