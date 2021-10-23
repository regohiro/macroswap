import * as anchor from "@project-serum/anchor";
import { getTokenAccount } from "@project-serum/common";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

export const airdrop = async (
  { connection }: anchor.Provider,
  payer: PublicKey,
  amount: number
): Promise<void> => {
  const tx = await connection.requestAirdrop(payer, amount);
  await connection.confirmTransaction(tx, "confirmed");
};

export const wrap = async (
  { connection } : anchor.Provider,
  owner: PublicKey,
  amount: number,
  payer: anchor.web3.Keypair,
): Promise<PublicKey> => {
  const wsolTokenAccount = await Token.createWrappedNativeAccount(
    connection,
    TOKEN_PROGRAM_ID,
    owner,
    payer,
    amount
  );
  return wsolTokenAccount;
}

export const transfer = async (
  { connection } : anchor.Provider,
  tokenAccount: PublicKey,
  dest: PublicKey,
  amount: number,
  owner: anchor.web3.Keypair
): Promise<void> => {
  const itx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    tokenAccount,
    dest,
    owner.publicKey,
    [],
    amount
  );
  const tx = new Transaction().add(itx);
  await sendAndConfirmTransaction(connection, tx, [owner]);
}

export const mintWrapTransfer = async (
  provider : anchor.Provider,
  dest: PublicKey,
  amount: number,
  payer: anchor.web3.Keypair
): Promise<void> => {
  //Aidrop
  await airdrop(provider, payer.publicKey, amount);

  //Wrap
  const wsolTokenAccount = await wrap(provider, payer.publicKey, amount, payer);

  //Transfer
  await transfer(provider, wsolTokenAccount, dest, amount, payer);
};

export const getBalance = async (
  provider: anchor.Provider,
  address: PublicKey
): Promise<number> => {
  const tokenAccount = await getTokenAccount(provider, address);
  const balance = tokenAccount.amount.toNumber();
  return balance;
};
