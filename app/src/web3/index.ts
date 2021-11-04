import { Provider, Program, Idl } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
// import { IDL } from "./idl/macroswap";
import idl from "./idl/macroswap.json";

export const getProvider = (anchorWallet: AnchorWallet, connection: Connection): Provider => {
  const opts: ConfirmOptions = {
    preflightCommitment: "processed",
  };
  const provider = new Provider(connection, anchorWallet, opts);
  return provider;
}

export const getReadOnlyProvider = (connection: Connection): Provider => {
  const wallet = <AnchorWallet>{}; 
  const provider = getProvider(wallet ,connection);
  return provider;
}

export const getProgram = (
  provider: Provider
) => {
  const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || "");
  // const program = new Program(IDL, programId, provider); NOT WORKING 
  const program = new Program(idl as Idl, programId, provider);
  return program;
}