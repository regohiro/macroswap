import { createReducer } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { TokenType } from "../../contracts";
import {
  setAmount,
  setSwapDirection,
  setTokenType,
  setValue,
  updateTokenState,
} from "./actions";

export type TSwapDirection = "BuyToken" | "SellToken";

export interface ITokenState {
  balance?: BigNumber;
  allowance?: BigNumber;
  price?: BigNumber;
}

interface IState {
  swapDirection: TSwapDirection;
  tokenType: TokenType | undefined;
  value: number;
  amount: number;
  tokensState: Record<TokenType, ITokenState>;
}

const initialTokenState: ITokenState = {
  balance: undefined,
  allowance: undefined,
  price: undefined,
};

const initialState: IState = {
  swapDirection: "BuyToken",
  tokenType: undefined,
  value: 0,
  amount: 0,
  tokensState: {
    Dai: initialTokenState,
    Link: initialTokenState,
    Uni: initialTokenState,
  },
};

export default createReducer<IState>(initialState, (builder) => {
  builder
    .addCase(setSwapDirection, (state, { payload: swapDirection }) => {
      return {
        ...state,
        swapDirection,
      };
    })
    .addCase(setTokenType, (state, { payload: tokenType }) => {
      return {
        ...state,
        tokenType,
      };
    })
    .addCase(setValue, (state, { payload: value }) => {
      return {
        ...state,
        value,
      };
    })
    .addCase(setAmount, (state, { payload: amount }) => {
      return {
        ...state,
        amount,
      };
    })
    .addCase(updateTokenState, (state, { payload }) => {
      let tokensState: Record<TokenType, ITokenState> = state.tokensState;

      Object.entries(payload).forEach(([key, value]) => {
        //@ts-ignore
        const tokenState: ITokenState = tokensState[key];
        const mergedState: ITokenState = {
          ...tokenState,
          ...value,
        };
        tokensState = {
          ...tokensState,
          ...{
            [key]: mergedState,
          },
        };
      });

      return {
        ...state,
        tokensState,
      };
    });
});
