import { TProvider } from "./../../connectors";
import { JsonRpcSigner } from "@ethersproject/providers";
import { createAction } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";

export const updateProvider = createAction<{
  host: any;
  provider: TProvider;
}>("user/updateProvider");

export const updateUserInfo = createAction<{
  signer: JsonRpcSigner;
  address: string;
}>("user/updateUserInfo");

export const updateBalance = createAction<BigNumber | undefined>(
  "user/updateBalance"
);
export const setTxHash = createAction<string>("user/setTxHash");
