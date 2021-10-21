import * as anchor from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export const createMint = async (
  provider: anchor.Provider,
  payer: anchor.web3.Signer,
  authority: PublicKey
): Promise<Token> => {
  const mint = await Token.createMint(
    provider.connection,
    payer,
    authority,
    null,
    9,
    TOKEN_PROGRAM_ID
  );
  return mint;
};
