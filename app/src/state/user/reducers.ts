import {
  updateProvider,
  updateUserInfo,
  updateBalance,
  setTxHash,
} from "./actions";
import { JsonRpcSigner } from "@ethersproject/providers";
import { createReducer } from "@reduxjs/toolkit";
import { getDefaultProvider, TProvider } from "../../connectors";
import { defaultRPCURL } from "../../connectors/network-config";
import { BigNumber } from "ethers";

const defaultProvider = getDefaultProvider();
const defaultSigner = defaultProvider.getSigner();

export interface IState {
  host: any;
  provider: TProvider;
  signer: JsonRpcSigner;
  address: string;
  balance: BigNumber | undefined;
  txHash: string;
}

export const initialState: IState = {
  host: defaultRPCURL,
  provider: defaultProvider,
  signer: defaultSigner,
  address: "",
  balance: undefined,
  txHash: "",
};

export default createReducer<IState>(initialState, (builder) => {
  builder
    .addCase(updateProvider, (state, { payload: { host, provider } }) => {
      return {
        ...state,
        host,
        provider,
      };
    })
    .addCase(updateUserInfo, (state, { payload: { signer, address } }) => {
      return {
        ...state,
        signer,
        address,
      };
    })
    .addCase(updateBalance, (state, { payload: balance }) => {
      return {
        ...state,
        balance,
      };
    })
    .addCase(setTxHash, (state, { payload: txHash }) => {
      return {
        ...state,
        txHash,
      };
    });
});
