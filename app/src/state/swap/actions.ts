import { createAction } from "@reduxjs/toolkit";
import { TokenType } from "../../contracts";
import { ITokenState, TSwapDirection } from "./reducers";
import { usePartialRecord } from "../../hooks";

export const setSwapDirection = createAction<TSwapDirection>(
  "swap/setSwapDirection"
);
export const setTokenType = createAction<TokenType | undefined>(
  "swap/setTokenType"
);
export const setValue = createAction<number>("swap/setValue");
export const setAmount = createAction<number>("swap/setAmount");
export const updateTokenState = createAction<
  usePartialRecord<TokenType, ITokenState>
>("swap/updateTokenState");
