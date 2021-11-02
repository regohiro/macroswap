import { Provider, Program } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { IDL } from "./idl/macroswap";

export const getProvider = (anchorWallet: AnchorWallet, connection: Connection): Provider => {
  const opts: ConfirmOptions = {
    preflightCommitment: "processed",
  };
  const provider = new Provider(connection, anchorWallet, opts);
  return provider;
}

export const getProgram = (
  provider: Provider
) => {
  const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || "");
  const program = new Program(IDL, programId, provider);
  return program;
}