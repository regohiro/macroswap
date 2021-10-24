export const fromHex = (hexValue: number): number => {
  const valueString = hexValue.toString();
  const valueNumber = parseInt(valueString, 16);
  return valueNumber;
};
