import { Provider } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, Connection } from "@solana/web3.js";

export const getProvider = (anchorWallet: AnchorWallet, connection: Connection): Provider => {
  const opts: ConfirmOptions = {
    preflightCommitment: "processed",
  };
  const provider = new Provider(connection, anchorWallet, opts);
  return provider;
}