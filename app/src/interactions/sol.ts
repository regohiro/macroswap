import * as anchor from "@project-serum/anchor";
import {
  NATIVE_MINT,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { accountExists, createATA, getATA } from "./common";

export const getSolBalance = async (
  provider: anchor.Provider,
  user: PublicKey
): Promise<number> => {
  const balance = await provider.connection.getBalance(user);
  console.log("SOL balance: " + balance);
  return balance;
};

export const wrapTx = async (
  provider: anchor.Provider,
  user: PublicKey,
  amount: number
): Promise<anchor.web3.Transaction> => {
  const tx = new anchor.web3.Transaction();
  const wsolAccount = await getATA(user, NATIVE_MINT);

  if (!(await accountExists(provider, wsolAccount))) {
    tx.add(await createATA(user, NATIVE_MINT));
  }

  tx.add(
    SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: wsolAccount,
      lamports: amount,
    })
  );

  //@ts-ignore (@solana/spl-token bug...)
  tx.add(Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, wsolAccount));

  return tx;
};

export const unwrapTx = async (
  user: PublicKey
): Promise<anchor.web3.Transaction> => {
  const tx = new anchor.web3.Transaction();
  const wsolAccount = await getATA(user, NATIVE_MINT);

  tx.add(
    Token.createCloseAccountInstruction(
      TOKEN_PROGRAM_ID,
      wsolAccount,
      user,
      user,
      []
    )
  );

  return tx;
};
