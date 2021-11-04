import * as anchor from "@project-serum/anchor";
import { getTokenAccount } from "@project-serum/common";
import { u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { accountExists, getATA } from "./common";

export const getMacroBalance = async (
  provider: anchor.Provider,
  user: PublicKey
): Promise<u64> => {
  const macroMint = new PublicKey(process.env.NEXT_PUBLIC_MACRO_MINT || "");
  const userMacroAddr = await getATA(user, macroMint);
  let balance: u64;

  if(await accountExists(provider, userMacroAddr)){
    const tokenAccount = await getTokenAccount(provider, userMacroAddr);
    balance = tokenAccount.amount;
  }else{
    balance = new u64(0);
  }

  console.log("Macro balance: " + balance.toNumber());

  return balance;
};
