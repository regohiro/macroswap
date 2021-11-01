import idl from "./idl/macroswap.json";
import { Program, Provider, Idl } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js";

export const getProgram = (
  provider: Provider
) => {
  const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || "");
  const program = new Program(idl as Idl, programId, provider);
  return program;
}