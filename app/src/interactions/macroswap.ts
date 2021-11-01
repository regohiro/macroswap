import { Provider, BN, web3 } from "@project-serum/anchor"
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { getProgram } from "../contracts"
import { toBN } from "../utils";
import { accountExists, createATA, getATA, getBasicAccounts } from "./common";
import { unwrapTx, wrapTx } from "./sol";

export const buyTokenTx = async (
  provider: Provider,
  value: number,
  amount: number,
): Promise<Transaction> => {
  const { wallet } = provider;
  const { macroMint, poolMacro, poolWsol, poolOwner, macroswapAccount } = getBasicAccounts();
 
  const program = getProgram(provider);
  const userWsol = await getATA(wallet.publicKey, NATIVE_MINT);
  const userMacro = await getATA(wallet.publicKey, macroMint);

  const tx = new web3.Transaction();

  if(!await accountExists(provider, userMacro)){
    tx.add(await createATA(wallet.publicKey, macroMint));
  }

  tx.add(await wrapTx(provider, wallet.publicKey, value * 10**9));

  tx.add(program.instruction.buyToken(toBN(amount, 9), {
    accounts: {
      user: wallet.publicKey,
      userWsol,
      userMacro,
      poolWsol,
      poolMacro,
      poolOwner,
      macroswapAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  }));

  tx.add(await unwrapTx(wallet.publicKey));

  return tx;
}

export const sellTokenTx = async (
  provider: Provider,
  amount: number,
): Promise<Transaction>  => {
  const { wallet } = provider;
  const { macroMint, poolMacro, poolWsol, poolOwner, macroswapAccount } = getBasicAccounts();
 
  const program = getProgram(provider);
  const userWsol = await getATA(wallet.publicKey, NATIVE_MINT);
  const userMacro = await getATA(wallet.publicKey, macroMint);

  const tx = new web3.Transaction();

  if(!await accountExists(provider, userWsol)){
    tx.add(await createATA(wallet.publicKey, NATIVE_MINT));
  }

  tx.add(program.instruction.sellToken(toBN(amount, 9), {
    accounts: {
      user: wallet.publicKey,
      userWsol,
      userMacro,
      poolWsol,
      poolMacro,
      poolOwner,
      macroswapAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  }));

  tx.add(await unwrapTx(wallet.publicKey));

  return tx;
}