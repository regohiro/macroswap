import { JsonRpcSigner } from "@ethersproject/providers";
import { ContractTransaction } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import {
  getDexInstance,
  TokenType,
  getTokenAddr,
} from "../contracts";
import { TSwapDirection } from "../state/swap/reducers";
import { fromWei, tenPow18, toWei } from "../utils";

export const getPrice = async (tokenType: TokenType): Promise<BigNumber> => {
  const provider = getDefaultProvider();
  const dex = await getDexInstance(provider);
  const tokenAddr = getTokenAddr(tokenType);
  const priceBN = await dex.getPrice(tokenAddr);
  return priceBN;
};

export const getAmount = async (
  tokenType: TokenType,
  swapDirection: TSwapDirection,
  value: number,
  price?: BigNumber
): Promise<number> => {
  if (!price) {
    price = await getPrice(tokenType);
  }
  switch (swapDirection) {
    case "BuyToken":
      return fromWei(toWei(value).mul(tenPow18).div(price));
    case "SellToken":
      return fromWei(toWei(value).mul(price).div(tenPow18));
  }
};

export const hasEnoughBalance = async (
  userAddr: string,
  tokenType: TokenType | "Eth",
  amount: number,
  userBalance?: BigNumber
): Promise<boolean> => {
  const amountWei = toWei(amount);
  if (!userBalance) {
    userBalance = (await getBalanceAllownace(userAddr, tokenType)).balance;
  }
  return userBalance.gte(amountWei) || false;
};

export const swapToken = async (
  signer: JsonRpcSigner,
  tokenType: TokenType,
  swapDirection: TSwapDirection,
  value: number
): Promise<string> => {
  const valueWei = toWei(value);
  const dex = await getDexInstance(signer);
  const tokenAddr = getTokenAddr(tokenType);
  const userAddr = await signer.getAddress();

  let check: boolean;
  switch (swapDirection) {
    case "BuyToken":
      check = await hasEnoughBalance(userAddr, "Eth", value);
      break;
    case "SellToken":
      check = await hasEnoughBalance(userAddr, tokenType, value);
      break;
  }
  if (check === false) {
    throw new Error("Insufficient fund or has not approved token!");
  }

  try {
    let swapTx: ContractTransaction;
    switch (swapDirection) {
      case "BuyToken":
        swapTx = await dex.buyToken(tokenAddr, { value: valueWei });
        break;
      case "SellToken":
        swapTx = await dex.sellToken(tokenAddr, valueWei);
        break;
    }
    const { transactionHash: txHash } = await swapTx.wait();

    return txHash;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
